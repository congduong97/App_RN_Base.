import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, FlatList } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ScreensView, ButtonView, InputView, IconView, TextView } from "../../../components";
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
import { Colors, Dimension } from "../../../commons";

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
        textFromDate: dataItem?.startDate || ' ',
        textToDate: dataItem?.endDate || ' ',
        dataCodePatient: '',
        listSearchShort: listSearchModel.sort(function (a, b) {
            return a.id - b.id;
        }),
    });
    const { isShowPickerDate, textSearch, textFromDate, textToDate, indexPickerDate, dataCodePatient, listSearchShort } = stateScreen;

    useEffect(() => {
    }, []);

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
    const onClearText = ({ id, data }) => {
        switch (id) {
            case keyFromDate:
                setStateScreen({ textFromDate: data })
                break
            case keyToDate:
                setStateScreen({ textToDate: data })
                break
        }
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
            if (textFromDate && isCompareTime(textFromDate, dateFormat)) {
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
        let params = {
            "startDate": textFromDate,
            "endDate": textToDate
        }
        navigation.goBack()
        onPressFiltter(params)
    }

    return (
        <ScreensView
            titleScreen={"Ch???n kho???ng th???i gian"}
            styleContent={[styles.styleContent]}
            renderFooter={
                <ButtonView
                    // disabled={!dataSelected?.id}
                    title={"Ch???n"}
                    onPress={handleAgree}
                    style={{ marginBottom: 20, marginHorizontal: 15 }}
                />
            }
        >

            <InputView
                onPress={onPressValueInput}
                id={keyFromDate}
                editable={false}
                isShowClean={false}
                // iconRightName={"ic-arrow-down"}
                // iconRighSize={Dimension.sizeIcon20}
                // iconRightColor={Colors.colorMain}
                label={"T??? ng??y"}
                placeholder={"Ch???n t??? ng??y..."}
                placeholderTextColor={"gray"}
                style={styles.stInputTime}
                multiline
                styleInput={styles.stInput}
                textDisable={styles.textDisable}
                onClearText={onClearText}
                value={textFromDate}
            />

            <View style={{ marginTop: 12 }}>
                <InputView
                    onPress={onPressValueInput}
                    id={keyToDate}
                    editable={false}
                    isShowClean={false}
                    // iconRightName={"ic-arrow-down"}
                    // iconRighSize={Dimension.sizeIcon20}
                    // iconRightColor={Colors.colorMain}
                    label={"?????n ng??y"}
                    placeholder={"Ch???n ?????n ng??y..."}
                    placeholderTextColor={"gray"}
                    style={styles.stInputTime}
                    multiline
                    styleInput={styles.stInput}
                    textDisable={styles.textDisable}
                    onClearText={onClearText}
                    value={textToDate}
                />
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
