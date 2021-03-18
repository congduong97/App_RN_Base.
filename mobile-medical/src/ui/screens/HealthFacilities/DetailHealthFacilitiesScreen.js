import React, { useState } from "react";
import { useApp, useMergeState } from "../../../AppProvider";
import { StyleSheet, Text, View, TextInput, FlatList, Image, Dimensions, ImageBackground, TouchableOpacity } from "react-native";
import { Colors } from "../../../commons";
import { ScreensView, IconView, TextView } from "../../../components";
import styles from "./styles";
import ChoiceValueView from './component/ChoiceValueView'
import ActionKey from './ActionKey'

const { width } = Dimensions.get('window')

export default function DoctorScreen(props) {
    const [textSearch, setTextSearch] = useState('')
    const [dataLocation, setDataLocation] = useState({})
    const { refDialog } = useApp();

    const onClickItemButton = (id) => {
        switch (id) {
            case ActionKey.idSendMail:
                console.log('1')
                break
            case ActionKey.idViewMap:
                console.log('2')
                break
        }
    }

    const itemButton = (id) => {
        return (
            <TouchableOpacity onPress={() => onClickItemButton(id)} style={{
                flexDirection: 'row',
                borderRadius: 8,
                flex: 1,
                elevation: 3,
                borderColor: Colors.colorBg2,
                borderWidth: 0.5,
                backgroundColor: 'white',
                marginHorizontal: 8,
                padding: 8,
                alignItems: 'center'
            }}>
                <IconView
                    name={id === ActionKey.idSendMail ? "ic-check" : 'ic-pin'}
                    size={20}
                    color={id === ActionKey.idSendMail ? Colors.colorMain : Colors.colorCancel}
                    style={{
                        backgroundColor: id === ActionKey.idSendMail ? Colors.colorBtBack : Colors.colorBtEdit,
                        padding: 4,
                        borderRadius: 8
                    }}
                />
                <Text style={[styles.styleText, { marginLeft: 12 }]}>{id === ActionKey.idSendMail ? 'Gửi email' : "Xem bản đồ"}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <ScreensView styleContent={{ paddingHorizontal: 12, paddingTop: 12 }} titleScreen={"Chi tiết cơ sở y tế"}
        >

            <ImageBackground
                source={{ uri: 'https://vn.byhien.com/wp-content/uploads/2020/04/tranh-phong-canh-3-scaled.jpg' }}
                style={{
                    width: width - 24,
                    height: (width - 24) * 5 / 8,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    paddingBottom: 12
                }}
                imageStyle={{ borderRadius: 16 }}
            >

                <TextView
                    // nameIconLeft={'ic-pin'}
                    // colorIconLeft={'white'}
                    style={[{}]}
                    styleContainerText={[{ flexDirection: 'row', alignItems: 'center' }]}
                    styleTitle={[styles.stTitleButton, { marginLeft: 8, marginTop: 0, color: 'white', fontWeight: 'bold', fontSize: 14 }]}
                    title={"BỆNH VIỆN ĐA KHOA YÊN BÁI"} />

                <TextView
                    nameIconLeft={'ic-pin'}
                    colorIconLeft={'white'}
                    style={[{}]}
                    styleContainerText={[{ flexDirection: 'row', alignItems: 'center' }]}
                    styleTitle={[styles.stTitleButton, { marginLeft: 8, marginTop: 0, color: 'white' }]}
                    title={"Phường Đồng Tâm - TP Yên Bái"} />

                <TextView
                    nameIconLeft={'ic-phone'}
                    colorIconLeft={'white'}
                    style={[{}]}
                    styleContainerText={[{ flexDirection: 'row', alignItems: 'center' }]}
                    styleTitle={[styles.stTitleButton, { marginLeft: 8, marginTop: 0, color: 'white' }]}
                    title={"024 365 36669"} />
            </ImageBackground>

            <View style={{ flexDirection: 'row', marginVertical: 12 }}>
                {itemButton(ActionKey.idSendMail)}
                {itemButton(ActionKey.idViewMap)}
            </View>

            <Text style={[styles.styleText, { fontWeight: 'bold', color: 'black', fontSize: 16, margin: 12 }]}>{'Giới thiệu'}</Text>

            <Text style={[styles.styleText, { lineHeight: 22, marginHorizontal: 12 }]}></Text>
            {/* <Text style={[styles.styleText, { lineHeight: 22, marginHorizontal: 12 }]}>
                Bệnh viện đa khoa tỉnh Yên Bái có tổng diện
                tích trên 5.000 m2 gồm khối nhà chính với
                thiết kế 8 tầng nổi và một tầng hầm với quy
                mô 500 giường bệnh. Trong khu nhà chính
                có thiết kế riêng biệt cho từng bộ phận chuy
                khoa riêng. Khối điều trị nội trú gồm: nội tổng
                hợp,nội tim mạch, lao thần kinh,  nhi, sản
                khoa... Khối kỹ thuật nghiệp vụ, gồm: cấp
                cứu, gây mê hồi sức, vật lý trị liệu, nội soi,
                chống nhiễm khuẩn và khối hành chính quản
                trị.
            </Text> */}
        </ScreensView>
    );
}
