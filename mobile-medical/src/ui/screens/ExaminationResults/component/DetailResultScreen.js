import React from "react";
import { useState } from "react";
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

export default function DetailResultScreen(props) {
    const navigation = useNavigation();
    const { refDialog } = useApp();

    const dataItem = props.dataItem
    const data = dataItem?.his_cls ? dataItem?.his_cls : []

    const renderRow = (item) => (
        <View style={{
            alignSelf: 'stretch',
            flexDirection: 'row',
            borderTopWidth: 1,
            borderTopColor: Colors.colorBorder,
            paddingVertical: 8,
        }}>
            <Text style={[styles.stylesText1, styles.itemTableResult]}>{item.cls_tendichvu}</Text>
            <Text style={[styles.stylesText1, styles.itemTableResult]}>{item.cls_tenchiso}</Text>
            <Text style={[styles.stylesText1, styles.itemTableResult]}>{item.cls_ketluan}</Text>
        </View>
    )

    return (
        <View style={{
            marginHorizontal: 12, flex: 1,
        }}>
            <View style={{
                borderWidth: 1,
                borderColor: Colors.colorBorder,
              
            }}>
                <View style={{
                    alignSelf: 'stretch',
                    flexDirection: 'row',
                    paddingVertical: 10,
                    backgroundColor: '#F1F1F1',
              
                }}>
                    <Text style={[styles.stylesText1, styles.itemTableResultTitle]}>{'Loại xét nghiệm'}</Text>
                    <Text style={[styles.stylesText1, styles.itemTableResultTitle]}>{'Kết quả'}</Text>
                    <Text style={[styles.stylesText1, styles.itemTableResultTitle]}>{'Đánh giá'}</Text>
                </View>

                {
                    data && data.map((item) => {
                        return renderRow(item);
                    })
                }
            </View>

        </View>
    );
}
