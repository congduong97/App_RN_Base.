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
                <Text style={[styles.styleText, { marginLeft: 12 }]}>{id === ActionKey.idSendMail ? 'G???i email' : "Xem b???n ?????"}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <ScreensView styleContent={{ paddingHorizontal: 12, paddingTop: 12 }} titleScreen={"Chi ti???t c?? s??? y t???"}
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
                    title={"B???NH VI???N ??A KHOA Y??N B??I"} />

                <TextView
                    nameIconLeft={'ic-pin'}
                    colorIconLeft={'white'}
                    style={[{}]}
                    styleContainerText={[{ flexDirection: 'row', alignItems: 'center' }]}
                    styleTitle={[styles.stTitleButton, { marginLeft: 8, marginTop: 0, color: 'white' }]}
                    title={"Ph?????ng ?????ng T??m - TP Y??n B??i"} />

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

            <Text style={[styles.styleText, { fontWeight: 'bold', color: 'black', fontSize: 16, margin: 12 }]}>{'Gi???i thi???u'}</Text>

            <Text style={[styles.styleText, { lineHeight: 22, marginHorizontal: 12 }]}></Text>
            {/* <Text style={[styles.styleText, { lineHeight: 22, marginHorizontal: 12 }]}>
                B???nh vi???n ??a khoa t???nh Y??n B??i c?? t???ng di???n
                t??ch tr??n 5.000 m2 g???m kh???i nh?? ch??nh v???i
                thi???t k??? 8 t???ng n???i v?? m???t t???ng h???m v???i quy
                m?? 500 gi?????ng b???nh. Trong khu nh?? ch??nh
                c?? thi???t k??? ri??ng bi???t cho t???ng b??? ph???n chuy
                khoa ri??ng. Kh???i ??i???u tr??? n???i tr?? g???m: n???i t???ng
                h???p,n???i tim m???ch, lao th???n kinh,  nhi, s???n
                khoa... Kh???i k??? thu???t nghi???p v???, g???m: c???p
                c???u, g??y m?? h???i s???c, v???t l?? tr??? li???u, n???i soi,
                ch???ng nhi???m khu???n v?? kh???i h??nh ch??nh qu???n
                tr???.
            </Text> */}
        </ScreensView>
    );
}
