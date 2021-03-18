import React from "react";
import { useState } from "react";
import {
    useNavigation,
} from "@react-navigation/native";
import { useApp, useMergeState } from "../../../AppProvider";
import { StyleSheet, Text, View, Dimensions, Image, FlatList, TouchableOpacity } from "react-native";
import { Colors, Dimension, Fonts } from "../../../commons";
import { ScreensView, InputView, TextView, ButtonView, IconView } from "../../../components";
import styles from "./styles";
import ActionKey from './ActionKey'
import AppNavigate from "../../../navigations/AppNavigate";
import ChoiceValueView from './component/ChoiceValueView'
import DialogNotification from './component/DialogNotification'
const { width, height } = Dimensions.get('window');

export default function FeedbackScreen(props) {
    const navigation = useNavigation();
    const [textTitle, setTextTitle] = useState(' ')
    const [textContent, setTextContent] = useState(' ')
    const [dataMedicalFacility, setDataMedicalFacility] = useState({})
    const [dataNamePatient, setDataNamePatient] = useState({})
    const { refDialog } = useApp();

    const handleOnPress = ({ id }) => {
        switch (id) {
            case ActionKey.ShowChooseAMedicalFacility:
                showDialog(id, (dataMedicalFacility ? dataMedicalFacility : {}));
                break
            case ActionKey.ShowDialogNotification:
                showDialog(id);
                break
        }
    }

    const handleSelected = ({ id, data }) => {
        switch (id) {
            case ActionKey.ShowChooseAMedicalFacility:
                setDataMedicalFacility(data)
                break
        }
    };

    const handleChangeValue = () => {

    }

    const showDialog = (typeDialog, itemSelect) => {
        refDialog?.current &&
            refDialog.current
                .configsDialog({
                    visibleClose: false,
                    isScroll: true,
                })
                .drawContents(
                    typeDialog === ActionKey.ShowChooseAMedicalFacility ? <ChoiceValueView
                        typeDialog={typeDialog}
                        refDialog={refDialog.current}
                        onPress={handleSelected}
                        itemSelect={itemSelect}
                    /> : <DialogNotification
                            typeDialog={typeDialog}
                            refDialog={refDialog.current}
                            onPress={handleSelected}
                            itemSelect={itemSelect}
                        />
                )
                .visibleDialog();
    };

    const itemButtonCamera = (id) => {
        return (
            <TouchableOpacity style={{
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
                    name={'ic-camera'}
                    size={20}
                    color={id === ActionKey.idCamera ? Colors.colorMain : Colors.colorCancel}
                    style={{
                        backgroundColor: id === ActionKey.idCamera ? Colors.colorBtBack : Colors.colorBtEdit,
                        padding: 4,
                        borderRadius: 8
                    }}
                />
                <Text style={[styles.styleText, { marginLeft: 12 }]}>{id === ActionKey.idCamera ? 'Chụp ảnh' : "Thêm file"}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <ScreensView styleContent={{ paddingHorizontal: 12, }} titleScreen={"Tạo mới góp ý"}
            renderFooter={
                <ButtonView
                    title={"Gửi góp ý"}
                    onPress={() => handleOnPress({ id: ActionKey.ShowDialogNotification })}
                    style={{ marginBottom: 20, marginHorizontal: 15 }}
                />
            }
        >

            <Text style={[styles.stTextTitleEmpty, { color: Colors.colorMain }]}>{'Chọn cơ sở muốn phản ánh'}</Text>

            <TextView
                id={ActionKey.ShowChooseAMedicalFacility}
                onPress={handleOnPress}
                nameIconRight={"ic-arrow-down"}
                sizeIconRight={Dimension.sizeIcon20}
                styleIconRight={{ alignSelf: 'flex-end', marginBottom: 4 }}
                style={[styles.stButtonSelectbox]}
                styleContainerText={{ flex: 1, }}
                styleTitle={styles.stTitleButton}
                styleValue={styles.stValueButton}
                title={"Chọn cơ sở y tế khám:"}
                value={dataMedicalFacility.name ? dataMedicalFacility.name : ''}
            />

            <InputView
                id={ActionKey.idPatientCode}
                offsetLabel={-4}
                style={[styles.containsInputView, { marginTop: 24, marginHorizontal: 12 }]}
                styleInput={[styles.styleInput]}
                styleTextInput={[styles.styleTextInput]}
                styleViewLabel={[styles.styleViewLabel]}
                styleTextLabel={{
                    fontSize: Dimension.fontSize12,
                    color: Colors.colorTitleScreen,
                    fontStyle: "italic",
                    fontFamily: Fonts.SFProDisplayRegular,
                    marginLeft: -8
                }}
                isShowClean={false}
                label={'Tiêu đề'}
                placeholder={'Tiêu đề'}
                value={textTitle}
                onChangeText={handleChangeValue}
                returnKeyType="next"
            />
            <View style={[styles.stylesLine, { marginTop: -12 }]} />

            <InputView
                id={ActionKey.idPatientCode}
                offsetLabel={-4}
                style={[styles.containsInputView, { marginTop: 24, marginHorizontal: 12 }]}
                styleInput={[styles.styleInput]}
                styleTextInput={[styles.styleTextInput]}
                styleViewLabel={[styles.styleViewLabel]}
                styleTextLabel={{
                    fontSize: Dimension.fontSize12,
                    color: Colors.colorTitleScreen,
                    fontStyle: "italic",
                    fontFamily: Fonts.SFProDisplayRegular,
                    marginLeft: -8
                }}
                isShowClean={false}
                label={'Nhập nội dung phản ánh'}
                placeholder={'Nhập nội dung phản ánh'}
                value={textContent}
                onChangeText={handleChangeValue}
                returnKeyType="next"
            />
            <View style={[styles.stylesLine, { marginTop: -12 }]} />

            <Image
                source={require('../../../../assets/images/avatar.jpg')}
                style={{
                    height: 200,
                    width: '100%',
                    resizeMode: 'center',
                    padding: 12
                }}
            />

            <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                {itemButtonCamera(ActionKey.idCamera)}
                {itemButtonCamera(ActionKey.idFile)}
            </View>
        </ScreensView>
    );
}
