import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, FlatList } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ScreensView, ButtonView, InputView, IconView } from "../../../components";
import { useApp, useMergeState } from "../../../AppProvider";
import Autocomplete from 'react-native-autocomplete-input';
import styles from "./styles";
import {
    convertDateFormatVN,
    isCompareTime,
    FORMAT_DD_MM_YYYY
} from "../../../commons/utils/DateTime";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Toast from "react-native-simple-toast";
import API from "../../../networking";
import models from "../../../models";
import { Colors } from "../../../commons";

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

export default function ExaminationResultsScreen(props) {
    const navigation = useNavigation();
    const { refDialog } = useApp();
    const dispatch = useDispatch();
    const route = useRoute();
    const dataItem = route?.params?.data;
    const onPressFiltter = route?.params?.onPressFiltter
    const listSearchModel = models.getCodePatientShortServicesData()

    // For Main Data
    //   const [dataCodePatient, setDataCodePatient] = useState([]);
    // For Filtered Data
    const [filteredCodePatient, setFilteredCodePatient] = useState([]);

    const [stateScreen, setStateScreen] = useMergeState({
        indexPickerDate: keyFromDate,
        isShowPickerDate: false,
        textSearch: '',
        textFromDate: '',
        textToDate: '',
        dataCodePatient: '',
        listSearchShort: listSearchModel.sort(function (a, b) {
            return a.id - b.id;
        }),
    });
    const { isShowPickerDate, textSearch, textFromDate, textToDate, indexPickerDate, dataCodePatient, listSearchShort } = stateScreen;

    useEffect(() => {
        responseDataPatientRecord()
    }, []);

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

    const showPickerDate = (id, isShow = true) => {
        setStateScreen({
            isShowPickerDate: isShow,
            indexPickerDate: id
        })
    }

    const handleSelectedPickerDate = (date) => {
        let dateFormat = convertDateFormatVN(date)
        if (indexPickerDate === keyFromDate) {
            if (textToDate && isCompareTime(dateFormat, textToDate)) {
                Toast.showWithGravity(
                    "T??? ng??y kh??ng ???????c l???n h??n ?????n ng??y",
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
            if (textToDate && isCompareTime(textToDate, dateFormat)) {
                Toast.showWithGravity(
                    "?????n ng??y kh??ng ???????c nh??? h??n t??? ng??y",
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

        let params = {
            "his_makham": textSearch,
            "startDate": textFromDate,
            "endDate": textToDate
        }
        navigation.goBack()
        onPressFiltter(params)
    }

    const findDataCodePatient = (query) => {
        // setStateScreen({ textRecordCode: query })
        setStateScreen({
            textSearch: query
        })
        if (query) {
            const regex = new RegExp(`${query.trim()}`, 'i');
            setFilteredCodePatient(
                dataCodePatient.filter((film) => film.search(regex) >= 0)
            );
        } else {
            setFilteredCodePatient([]);
        }
    };

    const onSelectPatientRecord = (item) => {
        setFilteredCodePatient([]);
        setStateScreen({
            textSearch: item
        })
    }

    const onPressSearchShort = (item) => {
        let params = {
            "his_makham": item.codePatient,
            "startDate": "",
            "endDate": ""
        }
        navigation.goBack()
        onPressFiltter(params)
    }

    const renderItemSelectCodePatient = ({ item, index }) => (
        <TouchableOpacity style={[styles.viewSelectItemCodePatient, { borderTopWidth: index === 0 ? 0 : 0.5 }]}
            onPress={() => onSelectPatientRecord(item)}>
            <Text style={[styles.itemText]}>
                {"M??: " + item}
            </Text>
        </TouchableOpacity>
    )

    const renderItemSearchShort = ({ item, index }) => (
        <TouchableOpacity onPress={() => onPressSearchShort(item)} style={{
            padding: 12,
            shadowColor: Colors.colorBorder,
            elevation: 3,
            flex: 1,
            maxWidth: '48%',
            marginVertical: 4,
            borderRadius: 12,
            // borderWidth: 0.5,
            borderColor: Colors.colorBorder,
            marginRight: index % 2 === 0 ? 8 : 0,
            marginLeft: index % 2 !== 0 ? 8 : 0,
            alignItems: 'center'
        }}>
            <Text>{"M??: " + item.codePatient}</Text>
        </TouchableOpacity>
    )

    const renderViewSearch = () => {
        return (
            <View style={{
                zIndex: 1
            }}>
                {/* <TextInput
                    style={{ flex: 1, paddingVertical: 8 }}
                    onChangeText={(text) => setStateScreen({
                        textSearch: text
                    })}
                    value={textSearch}
                    placeholder={"T??m ki???m m?? kh??m"}
                /> */}

                <Autocomplete
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.styleViewSearch}
                    containerStyle={styles.autocompleteContainer}
                    inputContainerStyle={styles.inputContainerStyle}
                    listContainerStyle={{
                        backgroundColor: '#fff',
                        paddingTop: 12,
                        borderRadius: 12
                    }}
                    listStyle={{
                        borderWidth: 0.5,
                        borderRadius: 6,
                        backgroundColor: '#fff',
                        maxHeight: 100
                    }}
                    data={filteredCodePatient}
                    defaultValue={
                        textSearch
                    }
                    onChangeText={(text) => findDataCodePatient(text)}
                    placeholder="Nh???p m?? kh??m"
                    renderItem={renderItemSelectCodePatient}
                />

                {/* <IconView name={"ic-search"} /> */}
            </View>
        )
    }

    return (
        <ScreensView
            titleScreen={"Tra c???u k???t qu??? kh??m"}
            styleContent={[styles.styleContent]}
            renderFooter={
                <ButtonView
                    // disabled={!dataSelected?.id}
                    title={"T??m ki???m"}
                    onPress={handleAgree}
                    style={{ marginBottom: 20, marginHorizontal: 15 }}
                />
            }
        >
            {renderViewSearch()}

            <View>
                <Text style={[styles.styleTextView, { fontWeight: 'bold', fontSize: 16, paddingVertical: 12 }]}>{'G???n ????y nh???t'}</Text>

                <FlatList
                    style={{ flex: 0 }}
                    data={listSearchShort}
                    renderItem={renderItemSearchShort}
                    keyExtractor={item => item.id}
                    numColumns={2}
                    horizontal={false}
                />
            </View>

            <View style={{ flex: 1 }}>
                <Text style={[styles.styleTextView, { fontWeight: 'bold', fontSize: 16, paddingVertical: 12 }]}>{'Th???i gian'}</Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12, }}>
                    <InputView
                        id={keyFromDate}
                        onPress={onPressValueInput}
                        isCleared
                        multiline
                        editable={false}
                        style={[{ flex: 1, marginRight: 8 }]}
                        styleInput={[styles.styleTextInputElement, {
                        }]}
                        placeholder={"T??? ng??y..."}
                        value={textFromDate}
                        // iconLeft={'ic-calendar'}
                        label={"T??? ng??y: "}
                    />

                    <IconView
                        name={'ic-arrow-right'}

                    />


                    <InputView
                        id={keyToDate}
                        onPress={onPressValueInput}
                        isCleared
                        multiline
                        editable={false}
                        style={[{ flex: 1, marginRight: 8 }]}
                        styleInput={[styles.styleTextInputElement, {
                        }]}
                        placeholder={"?????n ng??y..."}
                        value={textToDate}
                        // iconLeft={'ic-calendar'}
                        label={"?????n ng??y: "}
                    />
                </View>
            </View>

            <DateTimePickerModal
                isVisible={isShowPickerDate}
                mode={'date'}
                locale={'vi'}
                date={new Date()}
                confirmTextIOS='Thay ?????i'
                cancelTextIOS='H???y'
                titleIOS={"Ch???n ng??y"}
                onConfirm={handleSelectedPickerDate}
                onCancel={() => setStateScreen({
                    isShowPickerDate: false
                })}
            />
        </ScreensView>
    );
}
