import React from "react";
import { useState, useEffect } from "react";
import { useApp, useMergeState } from "../../../../AppProvider";
import { StyleSheet, Text, View, Dimensions, Image, FlatList, TouchableOpacity } from "react-native";
import { Colors, Dimension, Fonts } from "../../../../commons";
import { ScreensView, InputView, TextView, ButtonView, IconView } from "../../../../components";
import styles from "../styles";
import ActionKey from '../ActionKey'
import ChoiceValueView from '../component/ChoiceValueView'
import AppNavigate from "../../../../navigations/AppNavigate";
import {
    useNavigation,
} from "@react-navigation/native";
const { width, height } = Dimensions.get('window');

export default function DetailDiagnosticScreen(props) {
    const navigation = useNavigation();
    const { refDialog } = useApp();
    const [dataImage, setDataImage] = useState([])
    const dataItem = props.dataItem
    var data = []
    useEffect(() => {
        let imageName = dataItem.his_tenhinhanh ? dataItem.his_tenhinhanh.split(",") : []
        let imageData = dataItem.his_hinhanh ? dataItem.his_hinhanh.split(",") : []
        for (let i = 0; i < imageData.length; i++) {
            data.push({
                name: imageName[i] ? imageName[i] : '',
                image: imageData[i]
            })
        }
        setDataImage(data)
    }, []);

    const renderViewImage = ({ item }) => {
        console.log("item     ", item)
        return (
            <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={[styles.textToolbar, { color: '#262C3D' }]}>{item.name}</Text>
                <Image source={{ uri: item.image }}
                    style={{
                        height: 60, width: 60,
                        borderRadius: 6,
                        marginTop: 8
                    }} />
            </View>
        )
    }

    return (
        <View style={{ paddingHorizontal: 12 }}>
            <Text style={[styles.textToolbar, { color: '#747F9E' }]}>{'Chẩn đoán'}</Text>

            <Text style={[styles.textToolbar, { color: '#262C3D', marginVertical: 8 }]}>{
                `- ${dataItem?.his_tenbenh ? dataItem?.his_tenbenh : ''}\n- ${dataItem?.his_dienbien ? dataItem?.his_dienbien : ''}`
            }</Text>

            <Text style={[styles.textToolbar, { color: '#747F9E' }]}>{'Hình ảnh'}</Text>


            <FlatList
                columnWrapperStyle={{ flexWrap: 'wrap', flex: 1, marginTop: 5 }}
                data={dataImage}
                renderItem={renderViewImage}
                numColumns={2}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
}
