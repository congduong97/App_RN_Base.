import React from "react";
import { useState, useEffect } from "react";
import { useApp, useMergeState } from "../../../AppProvider";
import { useDispatch, useSelector } from "react-redux";
import { StyleSheet, Text, View, Dimensions, Image, FlatList, TouchableOpacity } from "react-native";
import {
    Colors, Dimension, Fonts, fontsValue, ImagesUrl,
    SCREEN_WIDTH,
} from "../../../commons";
import { ScreensView, InputView, TextView, ButtonView, IconView } from "../../../components";
import styles from "./styles";
import ActionKey from './ActionKey'
import ChoiceValueView from './component/ChoiceValueView'
import AppNavigate from "../../../navigations/AppNavigate";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
    useNavigation,
    useRoute,
} from "@react-navigation/native";
import API from "../../../networking";
import actions from "../../../redux/actions";
import {
    convertTimeServerToDateVN,
    FORMAT_YYYYMMDDhhmm,
    FORMAT_YYYY_MM_DD,
    isCompareTime,
    convertDateFormatVN,
} from "../../../commons/utils/DateTime";
import Autocomplete from 'react-native-autocomplete-input';
import models from "../../../models";
import Toast from "react-native-simple-toast";
import DropShadow from "react-native-drop-shadow";

const { width, height } = Dimensions.get('window');
const keyFromDate = 'keyFromDate'
const keyToDate = 'keyToDate'
function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
};

function HeaderRightView(props) {
    const { onPressSearch, styleIcon, onPressfilter, isShowSearch } = props;

    return (
        <>
            <IconView
                onPress={onPressSearch}
                style={{ ...styles.styleIconMenu, marginRight: 30 }}
                name={!isShowSearch ? "ic-search" : 'ic-arrow-up'}
                // type={IconViewType.Fontisto}
                size={22}
                color={styleIcon}
            />
            <IconView
                onPress={onPressfilter}
                style={styles.styleIconMenu}
                name={"ic-calendar"}
                size={22}
                color={styleIcon}
            />
        </>
    );
}

export default function ResultPatientScreen(props) {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [textCodePatient, setTextCodePatient] = useState(' ')
    const route = useRoute();
    const [filteredCodePatient, setFilteredCodePatient] = useState([]);
    const [search, setSearch] = useState(false);
    const [tapAuto, changeTapAuto] = useState(true);
    const dataItem = route?.params?.data;
    console.log("dataItem:     ", dataItem)
    // const onPressFiltter = route?.params?.onPressFiltter


    const [stateScreen, setStateScreen] = useMergeState({
        dataList: dataItem?.his_danhsachketquakham || [],
        textSearch: '',
        dataCodePatient: '',
        textFromDate: '',
        textToDate: '',
        isShowPickerDate: false,
        indexPickerDate: keyFromDate,
        paramsDate: {}
    })

    const { indexPickerDate, isShowPickerDate, dataList, textSearch, dataCodePatient, textFromDate, textToDate, paramsDate } = stateScreen

    useEffect(() => {
        responseDataPatientRecord()
    }, []);

    const reponDataParams = (params) => {
        return {
            "patientRecordCode": params.patientRecordCode,
            "doctorAppointmentCode": params.doctorAppointmentCode,
            "startDate": params.startDate,
            "endDate": params.endDate
        }
    }
    const showPickerDate = (id, isShow = true) => {
        setStateScreen({
            isShowPickerDate: isShow,
            indexPickerDate: id
        })
    }
    const onPressValueInput = ({ id, value }) => {
        switch (id) {
            case keyFromDate:
                showPickerDate(id)
                break
            case keyToDate:
                showPickerDate(id)
                break
        }
    }
    const onClearText = ({ id, value }) => {
        switch (id) {
            case keyFromDate:
                setStateScreen({
                    textFromDate: "",
                })
                break
            case keyToDate:
                setStateScreen({
                    textToDate: "",
                })
                break
        }
    }
    const handleOnPress = () => {

    }
    const onSelectPatientRecord = (item) => {
        console.log(item)
        setFilteredCodePatient([]);
        setStateScreen({
            textSearch: item
        })
        console.log(textSearch)
        // handleAgree()
    }
    const responseDataPatientRecord = async () => {
        console.log("dataItem.his_mabenhnhan:    ", dataItem.his_mabenhnhan)
        var dataCodePatient = []
        let data = dataItem?.his_danhsachketquakham || []
        for (let i = 0; i < data.length; i++) {
            dataCodePatient.push(data[i].his_makham);
        }
        // let dataCodePatient = await API.responsePatientRecord(dispatch, dataItem.his_mabenhnhan);
        // console.log("dataCodePatient:    ",dataCodePatient)
        setStateScreen({
            dataCodePatient: dataCodePatient
        })
    }
    const handleSelectedPickerDate = (date) => {
        let dateFormat = convertDateFormatVN(date)
        if (indexPickerDate === keyFromDate) {
            if (textToDate && isCompareTime(dateFormat, textToDate)) {
                Toast.showWithGravity(
                    "Từ ngày không được lớn hơn đến ngày",
                    Toast.LONG,
                    Toast.CENTER
                );
            } else {
                setStateScreen({
                    textFromDate: convertDateFormatVN(date),
                    isShowPickerDate: false
                })
            }
        } else if (indexPickerDate === keyToDate) {
            if (textFromDate && isCompareTime(textFromDate, dateFormat)) {
                Toast.showWithGravity(
                    "Đến ngày không được nhỏ hơn từ ngày",
                    Toast.LONG,
                    Toast.CENTER
                );
            } else {
                setStateScreen({
                    textToDate: convertDateFormatVN(date),
                    isShowPickerDate: false
                })
            }
        }
    }

    const handleAgree = () => {
        if (textSearch !== '') {
            let data = models.getCodePatientShortServicesData()
            let dataItemPatient = data.filter(item => item.codePatient == textSearch);
            console.log("dataItemPatient:   ", dataItemPatient)
            if (data.indexOf(dataItemPatient[0]) !== -1) {
                data = array_move(data, data.indexOf(dataItemPatient[0]), 0)
            } else {
                data.splice(0, 0, {
                    id: textSearch,
                    codePatient: textSearch,
                })
            }
            data = data.slice(0, 4)
            console.log("data:   ", data)
            var dataModel = []
            for (let i = 0; i < data.length; i++) {
                dataModel.push({
                    id: i + 1,
                    codePatient: data[i].codePatient
                })
            }
            models.saveCodePatientShortServicesData(dataModel);
            setStateScreen({ listSearchShort: dataModel })
        }
        console.log(textSearch)
        let params = {
            "his_makham": textSearch.trim(),
            // "startDate": textFromDate,
            // "endDate": textToDate
        }
        params = { ...params, ...paramsDate }
        // navigation.goBack()
        onPressFiltter(params)
    }

    const onPressFiltter = (params) => {
        console.log("params      ", params)
        // params.patientRecordCode = dataItem.patientCode
        // getDataSpecificDoctor(reponDataParams(params))
        console.log('a' + textSearch + 'a')
        let dataListKetQuaKham = dataItem?.his_danhsachketquakham || []
        console.log(dataListKetQuaKham)
        // Tìm kiếm theo kí tự 
        let dataSearch = dataListKetQuaKham.filter(item => {
            return textSearch.trim() === '' || item.his_makham.includes(textSearch.trim())
        })
        console.log(dataSearch)
        //Tìm kiếm theo ngày
        let data = dataSearch.filter(item => {
            let date = convertTimeServerToDateVN(item.his_ngaykham, FORMAT_YYYY_MM_DD)
            console.log(date)
            let startDate = convertTimeServerToDateVN(params.startDate, FORMAT_YYYY_MM_DD)
            let endDate = convertTimeServerToDateVN(params.endDate, FORMAT_YYYY_MM_DD)
            // let a = date <= startDate
            // console.log(a)
            // date = new Date(date).getTime()
            // console.log("date:   ", new Date(date).getTime())
            // console.log("params.startDate:   ", new Date(params.startDate).getTime())

            // console.log("isCompareTime(params.startDate, date):   ", params.startDate.isAfter(date))
            if (params.startDate === '' && params.endDate === '') {
                return true
            }
            else if (params.startDate !== '' && params.endDate !== '') {
                if (startDate <= date && date <= endDate) {
                    return true
                }
            }
            else if (params.startDate !== '' && params.endDate === '') {
                if (startDate <= date) {
                    return true
                }
            }
            else if (params.startDate === '' && params.endDate !== '') {
                if (date <= endDate) {
                    return true
                }
            }
            // if (item.his_makham == params.his_makham) {
            //     return true
            // }

            // return false
        });
        setStateScreen({
            dataList: data,
            paramsDate: params
        })

    }

    const onPressRight = () => {
        // AppNavigate.navigateToSearchFitterCodePatientScreen(navigation.dispatch, { onPressFiltter: onPressFiltter, data: dataItem });
        if (search) {
            setSearch(false)
        }
        else {
            setSearch(true)
        }
    }

    const handleOnPressDate = () => {
        console.log("paramsDate:   ", paramsDate)
        AppNavigate.navigateToSearchFitterCodePatientScreen(navigation.dispatch, { onPressFiltter: onPressFiltter, data: paramsDate });
    }

    const onclickItemList = async (item) => {
        // AppNavigate.navigateToDetailResultPatient(navigation.dispatch, { dataItem: dataItem })
        let params = reponDataParams({
            "patientRecordCode": dataItem.his_mabenhnhan,
            "doctorAppointmentCode": item.his_makham,
            "startDate": new Date(),
            "endDate": new Date()
        })
        console.log("params:    ", params)
        let data = await API.getMedialSpecificDoctorAppintment(dispatch, params);
        console.log(data)
        AppNavigate.navigateToVerifyPhoneScreen(navigation.dispatch, { data: data, phone: dataItem?.his_sodienthoai });
    }

    const EmptyView = () => {
        return (
            <View style={[{}]}>
                <Image source={ImagesUrl.imHospitals} style={{
                    width: fontsValue(SCREEN_WIDTH - 220),
                    alignSelf: "center",
                    marginVertical: fontsValue(12),
                    resizeMode: 'contain'
                }} />

                <Text style={styles.stTextTitleEmpty}>
                    {"Không có dữ liệu kết quả khám bệnh !"}
                </Text>
            </View>
        );
    };
    const findDataCodePatient = (query) => {
        // setStateScreen({ textRecordCode: query })
        setStateScreen({
            textSearch: query
        })
        console.log(textSearch)
        if (query) {
            const regex = new RegExp(`${query.trim()}`, 'i');
            setFilteredCodePatient(
                dataCodePatient.filter((film) => film.search(regex) >= 0)
            );
        } else {
            setFilteredCodePatient([]);
            // onSelectPatientRecord()
            // setStateScreen({
            //     textSearch: query
            // })

        }
    };
    const renderItemSelectCodePatient = ({ item, index }) => (
        <TouchableOpacity style={[styles.viewSelectItemCodePatient, { borderTopWidth: index === 0 ? 0 : 0.5 }]}
            onPress={() => onSelectPatientRecord(item)}>
            <Text style={[styles.itemText]}>
                {"Mã: " + item}
            </Text>
        </TouchableOpacity>
    )
    const renderViewSearch = () => {
        return (

            <View style={{ flexDirection: 'row', paddingHorizontal: Dimension.padding2x, backgroundColor: '#F8F8F8', marginHorizontal: Dimension.margin2x, borderRadius: fontsValue(16), }}>

                {/* <TextInput
                    style={{ flex: 1, paddingVertical: 8 }}
                    onChangeText={(text) => setStateScreen({
                        textSearch: text
                    })}
                    value={textSearch}
                    placeholder={"Tìm kiếm mã khám"}
                /> */}

                <Autocomplete
                    hideResults={tapAuto}
                    onFocus={() => changeTapAuto(false)}
                    onEndEditing={() => changeTapAuto(true)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.styleViewSearch}
                    containe23rStyle={styles.autocompleteContainer}
                    inputContainerStyle={styles.inputContainerStyle}
                    // listContainerStyle={{
                    //     backgroundColor: '#fff',
                    //     paddingTop: 12,
                    //     borderRadius: 12
                    // }}
                    // listStyle={{
                    //     borderWidth: 0.5,
                    //     borderRadius: 6,
                    //     backgroundColor: '#fff',
                    //     maxHeight: 100

                    // }}
                    data={filteredCodePatient}
                    defaultValue={
                        textSearch
                    }
                    onChangeText={(text) => findDataCodePatient(text)}
                    placeholder="Nhập mã khám"
                    renderItem={renderItemSelectCodePatient}
                />


                <IconView onPress={handleAgree} style={{ padding: 12 }} name={"ic-search"} color={'black'}/>
            </View>
        )
    }

    const renderItem = ({ item }) => {
        return (
            <DropShadow
                style={{
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 0,
                    },
                    shadowOpacity: 0.08,
                    shadowRadius: 10,
                }}
            >
                <TouchableOpacity onPress={() => { onclickItemList(item) }} style={styles.styleViewItemResultPatient}>
                    <View style={{ flex: 1, paddingVertical: 20 }}>
                        <TextView
                            id={ActionKey.ShowChooseAMedicalFacility}
                            onPress={handleOnPress}
                            style={[]}
                            styleContainerText={[{ flexDirection: 'row', alignItems: 'center' }]}
                            styleTitle={[styles.stTitleButton, { marginTop: 0, fontSize: Dimension.fontSize16, color: Colors.colorText }]}
                            styleValue={[{ color: Colors.registrationDateCalendar, marginLeft: 8 }]}
                            title={"Mã lần khám :"}
                            value={item.his_makham}
                        />

                        <TextView
                            id={ActionKey.ShowChooseAMedicalFacility}
                            nameIconLeft={'ic-pin'}
                            colorIconLeft={Colors.textLabel}
                            style={[{ marginTop: 8 }]}
                            styleContainerText={[{ flexDirection: 'row', alignItems: 'center' }]}
                            styleTitle={[styles.stTitleButton, { marginLeft: 8, marginTop: 0 }]}
                            // styleValue={[styles.stValueButton, { color: Colors.registrationDateCalendar, marginLeft: 8 }]}
                            title={item.his_tenchuyenkhoa}
                        // value={'12000909933'}
                        />

                        <TextView
                            id={ActionKey.ShowChooseAMedicalFacility}
                            nameIconLeft={'ic-calendar'}
                            colorIconLeft={Colors.textLabel}
                            style={[{ marginTop: 8 }]}
                            styleContainerText={[{ flexDirection: 'row', alignItems: 'center' }]}
                            styleTitle={[styles.stTitleButton, { marginLeft: 8, marginTop: 0 }]}
                            // styleValue={[styles.stValueButton, { color: Colors.registrationDateCalendar, marginLeft: 8 }]}
                            title={item.his_ngaykham ? convertTimeServerToDateVN(item.his_ngaykham, FORMAT_YYYYMMDDhhmm) : ''}
                        // value={'12000909933'}
                        />
                    </View>

                    <IconView
                        name={'ic-arrow-right'}
                    />
                </TouchableOpacity>
            </DropShadow>
        )
    }

    return (
        <ScreensView
            titleScreen={"Kết quả khám bệnh"}
            // colorIconRight={'black'}
            // nameIconRight={search ? 'ic-arrow-up' : 'ic-search'}
            // onPressRight={onPressRight}
            rightView={
                <HeaderRightView
                    styleIcon={'black'}
                    onPressSearch={onPressRight}
                    onPressfilter={handleOnPressDate}
                    isShowSearch={search}
                />
            }
        >
            {search ? <View>
                {renderViewSearch()}
                {/* <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
                    <InputView
                        id={keyFromDate}
                        onPress={onPressValueInput}
                        onClearText={onClearText}
                        isCleared
                        multiline
                        editable={false}
                        style={[{ flex: 1, marginRight: 8 }]}
                        styleInput={[styles.styleTextInputElement, {
                        }]}
                        placeholder={"Từ ngày..."}
                        value={textFromDate}
                        // iconLeft={'ic-calendar'}
                        label={"Từ ngày: "}
                    />

                    <IconView
                        name={'ic-arrow-right'}

                    />

                    <InputView
                        id={keyToDate}
                        onPress={onPressValueInput}
                        onClearText={onClearText}
                        isCleared
                        multiline
                        editable={false}
                        style={[{ flex: 1, marginRight: 8 }]}
                        styleInput={[styles.styleTextInputElement, {
                        }]}
                        placeholder={"Đến ngày..."}
                        value={textToDate}
                        // iconLeft={'ic-calendar'}
                        label={"Đến ngày: "}
                    />
                    <IconView onPress={handleAgree} name={"ic-search"} />
                </View> */}
            </View> : null}
            <FlatList
                style={{ marginTop: 12 }}
                data={dataList}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={1}
                ListEmptyComponent={<EmptyView />}
            />
            <DateTimePickerModal
                isVisible={isShowPickerDate}
                mode={'date'}
                locale={'vi'}
                date={indexPickerDate === keyFromDate && textFromDate ? new Date(textFromDate) : (indexPickerDate === keyToDate && textToDate ? new Date(textToDate) : new Date())}
                confirmTextIOS='Thay Đổi'
                cancelTextIOS='Hủy'
                titleIOS={"Chọn ngày"}
                onConfirm={handleSelectedPickerDate}
                onCancel={() => setStateScreen({
                    isShowPickerDate: false
                })}
            />
        </ScreensView>
    );
}
