import React, { PureComponent } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Vibration, BackHandler } from 'react-native';
import { InputPass } from '../item/InputPass'
import { COLOR_BLUE, COLOR_WHITE, COLOR_RED, COLOR_BLACK, COLOR_BLUE_LIGHT, COLOR_GRAY_LIGHT } from '../../../const/Color';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { pushResetScreen } from '../../../util';
import { managerAcount, keyAsyncStorage } from '../../../const/System';
import AsyncStorage from '@react-native-community/async-storage';
import { AppImage } from '../../../component/AppImage'
import { DEVICE_WIDTH, APP } from '../../../const/System'
import { ModalResetPass } from '../item/ModalResetPass';
import { HandleInput } from '../util/service';
import NotificationCount from '../../../service/NotificationCount';
import { linkDeeplink, useDeepLink } from '../../HomeScreen/SetUpDeepLink';
function countTime(time) {
    const minutes = 1000 * 60;
    const d = new Date();
    const t = d.getTime() - new Date(time).getTime();
    let y;


    y = Math.round(t / minutes);

    return y;
}

export default class EnterPasswordMyPageAndOppenApp extends PureComponent {
    constructor(props) {

        super(props);
        const timeError = managerAcount.timeErrorPass ? countTime(managerAcount.timeErrorPass) : 0

        this.state = {
            listTextInput: ['', '', '', ''],
            numberError: managerAcount.numberErrorPass,
            timeAwait: 5 - timeError
        };
        this.state.disableEnterPass = this.getDisable()
    }
    getDisable = () => {
        const timeError = managerAcount.timeErrorPass ? countTime(managerAcount.timeErrorPass) : 0

        if (managerAcount.numberErrorPass >= 10) {
            if (managerAcount.timeErrorPass && timeError < 5) {

                return true
            } else {
                this.state.numberError = 0
                this.state.textError = ''
                this.state.timeAwait = 0
                this.state.listTextInput = ['', '', '', '']
                managerAcount.numberErrorPass = 0
                managerAcount.timeErrorPass = ''
                AsyncStorage.setItem(keyAsyncStorage.managerAccount, JSON.stringify(managerAcount))
            }
        }
        return false
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        this.backHandler.remove()
    }

    handleBackPress = () => {
        return true;
    }
    updateTimeError = () => {
        const timeError = managerAcount.timeErrorPass ? countTime(managerAcount.timeErrorPass) : 0



        this.setState({ timeAwait: 5 - timeError, disableEnterPass: this.getDisable(), })
    }
    changeDataParent = (index, value) => {
        this.state.listTextInput[index] = value;

        const { listTextInput, numberError } = this.state
        const { nameScreen, enterPasswordSuccess } = this.props.navigation.state.params

        let check = true;
        let pass = ''

        listTextInput.map(value => {

            if (value && value.length === 1 && !isNaN(value)) {
                pass = `${pass}${value}`;
            } else {
                check = false;
            }
        });
        if (check) {

            if (pass == managerAcount.passwordApp) {
                setTimeout(() => {
                    NotificationCount.checkNotification()
                }, 1000)
                managerAcount.numberErrorPass = 0
                managerAcount.timeErrorPass = ''
                if (enterPasswordSuccess) {
                    enterPasswordSuccess()
                    this.props.navigation.goBack(null)
                } else {
                    if (nameScreen == 'MY_PAGE' || nameScreen == 'LOCK_BACKGROUND_MY_PAGE') {
                        if(nameScreen =='LOCK_BACKGROUND_MY_PAGE'){
                            if (linkDeeplink.linkSave) {
                                this.timeOutModalDidMount = setTimeout(() => {
        
                                    useDeepLink(linkDeeplink.linkSave);
                                    linkDeeplink.linkSave = null;
                                }, 250);
                            }
                        }
                        this.props.navigation.navigate('MY_PAGE')
                    } else {
                        if (nameScreen == 'LOCK_BACKGROUND') {
                            if (linkDeeplink.linkSave) {
                                this.timeOutModalDidMount = setTimeout(() => {
        
                                    useDeepLink(linkDeeplink.linkSave);
                                    linkDeeplink.linkSave = null;
                                }, 250);
                            }
                            this.props.navigation.goBack(null)
                        } else {
                            pushResetScreen(this.props.navigation, 'HomeNavigator')
                        }


                    }

                 
                }
            } else {
                if (numberError < 9) {

                    this.setState({ textError: `パスコード入力エラー（${numberError + 1}回)`, numberError: numberError + 1, listTextInput: ['', '', '', ''] })
                    managerAcount.numberErrorPass = numberError + 1
                    HandleInput.set({
                        index: 0,
                        nameScreen: 'EnterPasswordApp'
                    });
                    Vibration.vibrate()


                    setTimeout(() => {
                        this.setState({ textError: '', })

                    }, 1000)
                } else {
                    this.setState({ disableEnterPass: true, timeAwait: 5 })
                    managerAcount.numberErrorPass = numberError + 1
                    managerAcount.timeErrorPass = new Date().getTime()

                }
            }
            AsyncStorage.setItem(keyAsyncStorage.managerAccount, JSON.stringify(managerAcount))


        }


    }
    goBack = () => {

        const { nameScreen, enterPasswordSuccess } = this.props.navigation.state.params
        const { goBack, navigate } = this.props.navigation

        if (nameScreen == 'LOCK_BACKGROUND') {
            return
        }
        if (nameScreen == 'LOCK_BACKGROUND_MY_PAGE') {
            navigate('HOME')
            return
        }
        goBack(null)


    }
    forgotPassWord = () => {
        this.modalResetPass.visibleModal()
    }

    renderInput = () => {
        const { listTextInput, textError } = this.state;
        const listInput = listTextInput.map((value, index) => <InputPass
            nameScreen={'EnterPasswordApp'}
            widthInput={30}
            secureTextEntry
            marginCenter
            error={textError}
            changeDataParent={this.changeDataParent}
            autoFocus={index === 0}
            key={`${index}`}
            index={index}
            value={value}
            end={index === listTextInput.length - 1}
        />);
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '70%' }}>
                {listInput}
            </View>
        );
    }
    renderContent = () => {
        const { textError, disableEnterPass, timeAwait } = this.state
        if (disableEnterPass) {
            return (
                <View style={{ width: '100%', padding: 16, alignItems: 'center' }}>
                    <Text style={{ color: COLOR_BLACK, lineHeight: 30, textAlign: 'center' }}>
                        {`認証機能が一時無効となっています\n${timeAwait}分後にやり直してください`}
                    </Text>
                    <TouchableOpacity onPress={this.updateTimeError} style={{ width: 200, height: 50, backgroundColor: COLOR_BLUE_LIGHT, marginTop: 200, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: COLOR_WHITE, fontSize: 18 }}>{'更新'}</Text>
                    </TouchableOpacity>

                </View>
            )
        }

        return (
            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ marginVertical: 16, fontSize: 16 }}> {'パスコードを入力'} </Text>
                {this.renderInput()}
                {
                    textError ?
                        <View style={{ width: '100%', padding: 16, alignItems: 'center' }}>
                            <Text style={{ color: COLOR_RED }}>
                                {textError}
                            </Text>
                        </View> : null
                }
                <ModalResetPass screenName={'EnterPassMyPageAndOppenApp'} navigation={this.props.navigation} onRef={ref => this.modalResetPass = ref}></ModalResetPass>

                <View style={styles.forgotPassword}>
                    <Text onPress={this.forgotPassWord} style={styles.titleForgotPassword}>{'パスコードをお忘れの場合はこちら'}</Text>
                </View>


            </View>



        )

    }


    render() {
        const { nameScreen } = this.props.navigation.state.params

        return (
            <View style={{ flex: 1, alignItems: 'center', backgroundColor: COLOR_WHITE }}>
                <SafeAreaView></SafeAreaView>


                {nameScreen == 'MY_PAGE' || nameScreen == 'LOCK_BACKGROUND_MY_PAGE' ?
                    <View style={{ width: '100%', justifyContent: 'flex-end', flexDirection: 'row' }}>
                        <Text onPress={this.goBack} style={{ color: COLOR_BLUE, margin: 16 }}>{'キャンセル'}</Text>
                    </View> : null
                }
                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps={'always'}
                    extraHeight={100}
                    extraScrollHeight={100}
                    enableOnAndroid
                    contentContainerStyle={{ alignItems: 'center', backgroundColor: COLOR_WHITE }}

                    style={{ flex: 1 }}
                >

                    <AppImage
                        style={{ width: DEVICE_WIDTH / 2, height: DEVICE_WIDTH / 4, margin: 8, marginTop: 0 }}
                        url={APP.IMAGE_LOGO}
                        resizeMode={'contain'}
                    />
                    {this.renderContent()}
                </KeyboardAwareScrollView>





            </View>
        );
    }
}
const styles = StyleSheet.create({
    forgotPassword: {
        padding: 16, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', width: '100%'

    },
    titleForgotPassword: {
        color: COLOR_BLUE, textDecorationLine: 'underline', fontSize: 13
    },

})