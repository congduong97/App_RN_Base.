import React from "react";
import { useState } from "react";
import { useApp, useMergeState } from "../../../AppProvider";
import { StyleSheet, Text, View, Dimensions, Image, FlatList, TouchableOpacity } from "react-native";
import { Colors, Dimension, Fonts } from "../../../commons";
import { ScreensView, InputView, TextView, ButtonView, IconView } from "../../../components";
import { useNavigation, useRoute } from "@react-navigation/native";
import styles from "./styles";
import ActionKey from './ActionKey'
import ChoiceValueView from './component/ChoiceValueView'
import AppNavigate from "../../../navigations/AppNavigate";
import DetailPrescriptionScreen from './component/DetailPrescriptionScreen'
import DetailDiagnosticScreen from './component/DetailDiagnosticScreen'
import DetailResultScreen from './component/DetailResultScreen'
const { width, height } = Dimensions.get('window');

export default function DetailResultPatientScreen(props) {
    const navigation = useNavigation();

    const route = useRoute();
    const dataItem = route?.params?.dataItem;
    console.log("dataItem:    ", dataItem)

    const [textCodePatient, setTextCodePatient] = useState(' ')
    //1: tab1 ....
    const [idSelectTabbar, setIdSelectTabbar] = useState(1)

    const handleOnPress = () => {

    }

    const renderTabbar = (id, title) => (
        <TouchableOpacity onPress={() => { setIdSelectTabbar(id) }} style={{ alignItems: 'center' }}>
            <Text style={[idSelectTabbar === id ? styles.textToolbarSelect : styles.textToolbar]}>{title}</Text>
            {idSelectTabbar === id ? <View style={[styles.textDotToolbarSelect]} /> : null}
        </TouchableOpacity>
    )

    return (
        <ScreensView styleContent={{ paddingHorizontal: 12, }} titleScreen={"Chi tiết kết quả khám "}
        >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, alignItems: 'center', paddingHorizontal: 12 }}>
                {renderTabbar(1, "Đơn thuốc")}
                {renderTabbar(2, "Chẩn đoán")}
                {renderTabbar(3, "Kết quả XN")}
            </View>

            {/* <DetailPrescriptionScreen /> */}
            {idSelectTabbar === 1 ?
                <DetailPrescriptionScreen dataItem={dataItem} /> :
                (idSelectTabbar === 2 ? <DetailDiagnosticScreen dataItem={dataItem} />
                    : <DetailResultScreen dataItem={dataItem} />)}
        </ScreensView>
    );
}
