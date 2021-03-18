import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
    ScreensView,
    ButtonView,
} from "../../../components";
import OTPInputView from '@twotalltotems/react-native-otp-input'
import ItemClock from './component/ItemClock'
import { IconView } from '../../../components/index'
import { Colors } from '../../../commons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles'
import ViewSendOTP from './component/ViewSendOTP'

const colorMain = '#00C6AD'

const MyComponent = () => {
    const [isReSend, setIsReSend] = React.useState(false);
    const [resetTimeSend, setResetTimeSend] = React.useState(false);


    const handleAgree = () => {

    }

    const renderViewOTP = () => (
        // <View style={styles.viewContent}>
        //     <Text style={[styles.styleText, { color: '#707070', fontSize: 16, textAlign: 'center', paddingHorizontal: 12 }]}>{'Nhập mã số OTP được gửi tới điện thoại của bạn '}
        //         <Text style={{ color: 'red' }}>{'0988757598'}</Text></Text>
        //     <OTPInputView
        //         style={{ width: '80%', color: 'red', height: 50 }}
        //         pinCount={4}
        //         // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
        //         // onCodeChanged = {code => { this.setState({code})}}
        //         autoFocusOnLoad
        //         codeInputFieldStyle={styles.underlineStyleBase}
        //         codeInputHighlightStyle={styles.underlineStyleHighLighted}
        //         selectionColor={"red"}
        //         onCodeFilled={(code => {
        //             console.log(`Code is ${code}, you are good to go!`)
        //         })}
        //     />

        //     <TouchableOpacity style={styles.stylesButton}>
        //         <Text style={{ fontSize: 16, color: 'white' }}>{'Xác nhận'}</Text>
        //     </TouchableOpacity>
        // </View>
        <Text>{'a'}</Text>
    )

    return (
        <ScreensView
            styleBackground={{ backgroundColor: "white" }}
            titleScreen={"Đăng ký lịch khám"}
            bgColorStatusBar="transparent"
            styleContent={styles.styleContent}
            styleTitle={{ color: "white" }}
            styleToolbar={{ paddingHorizontal: 16 }}
            end={{ x: 0.5, y: -1 }}
            start={{ x: 0, y: 1 }}
            colorsLinearGradient={[
                Colors.colorMain,
                Colors.colorMain,
                Colors.colorMain,
            ]}
            styleHeader={styles.styleHeader}
            headerBottomView={
                <ViewSendOTP />
            }
        >

            <View style={{ flex: 1, flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => {
                    alert('đã reset thời gian')
                    setResetTimeSend(!resetTimeSend)
                }} disabled={!isReSend} style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
                    <Text style={{ color: colorMain, textDecorationLine: isReSend ? 'underline' : 'none' }}>{"Gửi lại"}</Text>
                    <ItemClock
                        styleTimeText={{ color: colorMain }}
                        resetTime={resetTimeSend}
                        requestReSend={() => {
                            setIsReSend(true)
                        }}
                    />
                </TouchableOpacity>
            </View>
        </ScreensView>
    );
}

export default MyComponent
