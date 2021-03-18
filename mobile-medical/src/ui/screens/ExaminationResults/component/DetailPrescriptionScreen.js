import React from "react";
import { useState } from "react";
import { useApp, useMergeState } from "../../../../AppProvider";
import { StyleSheet, Text, View, Dimensions, Image, FlatList, TouchableOpacity } from "react-native";
import { Colors, Dimension, Fonts, ImagesUrl } from "../../../../commons";
import { ScreensView, InputView, TextView, ButtonView, IconView } from "../../../../components";
import styles from "../styles";
import ActionKey from '../ActionKey'
import ChoiceValueView from '../component/ChoiceValueView'
import AppNavigate from "../../../../navigations/AppNavigate";
import DropShadow from "react-native-drop-shadow";

import {
    useNavigation,
} from "@react-navigation/native";
const { width, height } = Dimensions.get('window');

export default function DetailResultPatientScreen(props) {
    const navigation = useNavigation();
    const [textCodePatient, setTextCodePatient] = useState(' ')
    const { refDialog } = useApp();
    const dataItem = props.dataItem

    const [stateScreen, setStateScreen] = useMergeState({
        dataList: dataItem?.his_thuoc,
        dataTakeMedicines: {}
    })

    const { dataList, dataTakeMedicines } = stateScreen

    const handleOnPress = () => {

    }

    const createTakeMedicines = () => {
        showDialog(ActionKey.ShowChooseTakeMedicines, dataTakeMedicines)
    }

    const handleSelected = ({ id, data }) => {
        switch (id) {
            case ActionKey.ShowChooseTakeMedicines:
                setStateScreen({
                    dataTakeMedicines: data
                })
                break
        }
    };

    const showDialog = (typeDialog, itemSelect) => {
        refDialog?.current &&
            refDialog.current
                .configsDialog({
                    visibleClose: true,
                    isScroll: true,
                })
                .drawContents(
                    <ChoiceValueView
                        typeDialog={typeDialog}
                        refDialog={refDialog.current}
                        onPress={handleSelected}
                        itemSelect={itemSelect}
                    />
                )
                .visibleDialog();
    };

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
                <View style={styles.styleViewItemResultPatient}>
                    <View style={{ flex: 1, paddingVertical: 20 }}>
                        <TextView
                            id={ActionKey.ShowChooseAMedicalFacility}
                            onPress={handleOnPress}
                            style={[]}
                            styleContainerText={[{ flexDirection: 'row', alignItems: 'center', flex: 1 }]}
                            styleTitle={[styles.stTitleButton, { marginTop: 0, fontSize: Dimension.fontSize16, color: 'black', fontFamily: Fonts.SFProDisplayRegular }]}
                            title={item.his_tenthuoc}
                        />

                        {/* <TextView
                        id={ActionKey.ShowChooseAMedicalFacility}
                        nameIconLeft={'ic-pin'}
                        colorIconLeft={'red'}
                        style={[{ marginTop: 8 }]}
                        styleContainerText={[{ flexDirection: 'row', alignItems: 'center', flex: 1 }]}
                        styleTitle={[styles.stTitleButton, { marginLeft: 8, marginTop: 0 }]}
                        // styleValue={[styles.stValueButton, { color: Colors.registrationDateCalendar, marginLeft: 8 }]}
                        title={item?.his_hamluong + ' ' + item?.his_donvitinh}
                    />

                    <TextView
                        id={ActionKey.ShowChooseAMedicalFacility}
                        nameIconLeft={'ic-calendar'}
                        colorIconLeft={'#751aff'}
                        style={[{ marginTop: 8 }]}
                        styleContainerText={[{ flexDirection: 'row', alignItems: 'center', flex: 1 }]}
                        styleTitle={[styles.stTitleButton, { marginLeft: 8, marginTop: 0 }]}
                        // styleValue={[styles.stValueButton, { color: Colors.registrationDateCalendar, marginLeft: 8 }]}
                        title={item.his_lieudung}
                    /> */}

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                                source={ImagesUrl.iconPill}
                                style={{ width: 14, height: 14, resizeMode: 'contain', tintColor: Colors.textLabel }}
                            />
                            <Text style={[styles.stTitleButton, { marginLeft: 8, marginTop: 0 }]}>{item?.his_hamluong + ' ' + item?.his_donvitinh}</Text>
                        </View>

                        <View style={[{ marginTop: 8 }, { flexDirection: 'row' }]}>
                            <Image
                                source={ImagesUrl.iconNote}
                                style={{ width: 14, height: 14, resizeMode: 'contain', tintColor: Colors.textLabel }}
                            />
                            <Text style={[styles.stTitleButton, { marginLeft: 8, marginTop: 0 }]}>{item.his_lieudung}</Text>
                        </View>
                    </View>

                    {/* <IconView
                    onPress={createTakeMedicines}
                    name={'ic-calendar'}
                    style={{
                        marginRight: 8
                    }}
                /> */}

                    <TouchableOpacity onPress={createTakeMedicines}>
                        <Image
                            style={{
                                marginRight: 8
                            }}
                            source={ImagesUrl.iconClock}
                        />
                    </TouchableOpacity>
                </View>
            </DropShadow>
        )
    }

    return (
        <View>
            <FlatList
                style={{ marginTop: 12 }}
                data={dataList}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={1}
            />
        </View>
    );
}
