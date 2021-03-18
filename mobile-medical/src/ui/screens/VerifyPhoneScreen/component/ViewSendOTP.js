import React, { useState } from "react";
import { StyleSheet, Text, View, Platform, TouchableOpacity, Dimensions } from "react-native";
import { TextView, IconView } from "../../../../components";
import { ImagesUrl, Dimension, Fonts, Colors } from "../../../../commons";
import OTPInputView from '@twotalltotems/react-native-otp-input'
import styles from '../styles'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from "react-native-simple-toast";
import DropShadow from "react-native-drop-shadow";

const { width, height } = Dimensions.get('window')

export default function ViewSendOTP(props) {
    const [textCode, setTextCode] = useState("")

    const onConfirmOTP = () => {
        if (textCode.length !== 4) {
            Toast.showWithGravity(
                "Bạn cần nhập mã OTP.",
                Toast.SHORT,
                Toast.CENTER
            );
        } else {
            props.onConfirmOTP(textCode)
        }
    }

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
                        <Text style={{ color: 'red' }}>{props.dataItem?.his_sodienthoai}</Text>
                        <Text style={{ color: '#FF6F5B' }}>{props.phone}</Text>

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


                    <View style={{ flex: 1, flexDirection: 'row' }}>
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
    );
}

