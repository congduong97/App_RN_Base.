import React, { Component, useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    Alert,
} from 'react-native';
import {
    useNavigation,
    useRoute,
    useIsFocused,
} from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import {
    ScreensView,
    ButtonView,
} from "../../../components";
import OTPInputView from '@twotalltotems/react-native-otp-input'
import { useApp, useMergeState } from "../../../AppProvider";
import ItemClock from './component/ItemClock'
import { IconView } from '../../../components/index'
import { Colors, Fonts } from '../../../commons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles'
import ViewSendOTP from './component/ViewSendOTP'
import { AppNavigate } from '../../../navigations';
import API from "../../../networking";
import DropShadow from "react-native-drop-shadow";

const colorMain = '#00C6AD'

const MyComponent = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [isReSend, setIsReSend] = React.useState(false);
    const [resetTimeSend, setResetTimeSend] = React.useState(false);
    const [textCode, setTextCode] = useState("")

    const route = useRoute();
    const dataItem = route?.params?.data;
    const onRequestData = route?.params?.onRequestData || null;
    // console.log("dataItem", dataItem)
    const phoneRoute = route?.params?.phone;

    const [stateScreen, setStateScreen] = useMergeState({
        referenceId: null,
    });
    const {
        referenceId,
    } = stateScreen;

    useEffect(() => {
        setOTPGenerator()
    }, []);

    const setOTPGenerator = async () => {
        let dataOTP = await API.requestOTPGenerator(dispatch, {
            "phoneNumber": phoneRoute
        })
        console.log("dataOTP:    ", dataOTP)
        if (dataOTP.reference_id) {
            setStateScreen({
                referenceId: dataOTP.reference_id,
                phone: phoneRoute
            })
        } else {
            alert("không gửi đc mã otp")
        }
    }

    const handleAgree = () => {

    }

    const resetOTP = () => {
        // alert('đã reset thời gian')
        Alert.alert("Đặt lịch khám", "Đã gửi mã xác thực thành công", [{
            text: "Đồng ý"
        }])
        setResetTimeSend(!resetTimeSend)
        setIsReSend(false)
        setOTPGenerator()
    }

    const onConfirmOTP = async () => {
        console.log("otp:    ", textCode)
        if (textCode.length !== 4) {
            Toast.showWithGravity(
                "Bạn cần nhập mã OTP.",
                Toast.SHORT,
                Toast.CENTER
            );
        } else {
            let params = {
                "referenceId": referenceId,
                "phoneNumber": phoneRoute,
                "otpCode": textCode
            }
            console.log("params:   ", params)
            let isCheckOtp = await API.requestCheckOTPGenerator(dispatch, params)
            if (isCheckOtp) {
                navigation.pop()
                if (onRequestData) {
                    onRequestData(dataItem)
                } else {
                    // AppNavigate.navigateToResultPatient(navigation.dispatch, {data: dataItem})
                    AppNavigate.navigateToDetailResultPatient(navigation.dispatch, { dataItem: dataItem })
                }
            } else {
                Alert.alert("Đặt lịch khám", "Mã otp không đúng. Vui lòng thử lại.", [{
                    text: "Đồng ý"
                }])
            }
        }
    }

    return (
        <ScreensView
            styleBackground={{ backgroundColor: "white" }}
            titleScreen={"Xác thực mã OTP"}
            bgColorStatusBar="transparent"
            styleContent={styles.styleContent}
            styleTitle={{ color: "black" }}
            // styleToolbar={{ paddingHorizontal: 16 }}
            // end={{ x: 0.5, y: -1 }}
            // start={{ x: 0, y: 1 }}
            // colorsLinearGradient={[
            //     Colors.colorMain,
            //     Colors.colorMain,
            //     Colors.colorMain,
            // ]}
            // styleHeader={styles.styleHeader}
            headerBottomView={
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
                    <View
                        style={[{

                            alignSelf: "center",
                            marginTop: 30,

                            borderRadius: 16,
                            // elevation: 3,
                            // shadowColor: 'black',
                        }]}
                    // keyboardShouldPersistTaps="handled"
                    // // extraScrollHeight={extraScrollHeight}
                    // // enableOnAndroid={true}
                    // showsVerticalScrollIndicator={false}
                    >
                        <View style={[styles.viewContent,]}>
                            <Text style={[styles.styleText, { color: '#747F9E', fontSize: 14, textAlign: 'center', paddingHorizontal: 12, fontFamily: Fonts.SFProDisplayRegular }]}>{'Nhập mã xác thực đã gửi tới số điện thoại của bạn '}
                                <Text style={{ color: 'red' }}>{dataItem?.his_sodienthoai}</Text>
                                <Text style={{ color: '#FF6F5B' }}>{phoneRoute}</Text>

                            </Text>
                            <OTPInputView
                                style={{ width: '80%', color: 'red', height: 50 }}
                                pinCount={4}
                                // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                                // onCodeChanged = {code => { this.setState({code})}}
                                autoFocusOnLoad
                                codeInputFieldStyle={styles.underlineStyleBase}
                                codeInputHighlightStyle={styles.underlineStyleHighLighted}
                                selectionColor={"#00C6AD"}
                                onCodeChanged={code => { setTextCode(code) }}
                                onCodeFilled={(code => {
                                    console.log(`Code is ${code}, you are good to go!`)
                                    setTextCode(code)
                                })}
                            />


                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity onPress={resetOTP} disabled={!isReSend} style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
                                    <Text style={{ color: isReSend ? colorMain : Colors.colorBorder, textDecorationLine: isReSend ? 'underline' : 'none' }}>{"Gửi lại"}</Text>
                                    <ItemClock
                                        styleTimeText={{ color: isReSend ? colorMain : Colors.colorBorder }}
                                        isReSend={isReSend}
                                        resetTime={resetTimeSend}
                                        requestReSend={() => {
                                            setIsReSend(true)
                                        }}
                                    />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={onConfirmOTP} style={[styles.stylesButton, { backgroundColor: textCode.length === 4 ? Colors.colorMain : Colors.colorBorder }]}>
                                <Text style={{ fontSize: 16, color: 'white' }}>{'Xác nhận'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </DropShadow>
            }
        >
        </ScreensView>
    );
}

export default MyComponent
