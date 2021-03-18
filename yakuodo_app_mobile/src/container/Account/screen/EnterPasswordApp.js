import React, { PureComponent } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { InputPass } from '../item/InputPass'
import { COLOR_BLUE, COLOR_WHITE, COLOR_RED, COLOR_BLACK, COLOR_BLUE_LIGHT } from '../../../const/Color';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { pushResetScreen } from '../../../util';
import { managerAcount, keyAsyncStorage } from '../../../const/System';
import AsyncStorage from '@react-native-community/async-storage';
function countTime(time) {
    const minutes = 1000 * 60;
    const d = new Date();
    const t = d.getTime() - new Date(time).getTime();
    let y;


    y = Math.round(t / minutes);

    return y;
}

export default class EnterPasswordApp extends PureComponent {
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
                this.state.timeAwait = 0,
                this.state.listTextInput = ['', '', '', ''],
                managerAcount.numberErrorPass = 0,
                managerAcount.timeErrorPass = ''
                AsyncStorage.setItem(keyAsyncStorage.managerAccount, JSON.stringify(managerAcount))
            }
        }
        return false
    }
    componentDidMount() {

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
                managerAcount.numberErrorPass = 0
                managerAcount.timeErrorPass = ''
                if (enterPasswordSuccess) {
                    enterPasswordSuccess()
                    this.props.navigation.goBack(null)
                } else {
                    this.props.navigation.replace(nameScreen)
                }
            } else {
                if (numberError < 9) {
                    this.setState({ textError: `パスコード入力エラー（${numberError + 1}回)`, numberError: numberError + 1 })
                    managerAcount.numberErrorPass = numberError + 1
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
        const { goBack } = this.props.navigation
        goBack(null)
    }

    renderInput = () => {
        const { listTextInput } = this.state;
        const listInput = listTextInput.map((value, index) => <InputPass
            nameScreen={'EnterPasswordApp'}
            widthInput={30}
            secureTextEntry
            marginCenter
            changeDataParent={this.changeDataParent}
            autoFocus={index === 0}
            key={`${index}`}
            index={index}
            value={value}
            end={index === listTextInput.length - 1}
        />);
        return (
            <View style={{ flexDirection:'row',justifyContent:'space-between',width:'70%' }}>
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
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps={'always'}
                extraHeight={100}
                extraScrollHeight={100}
                enableOnAndroid
                contentContainerStyle={{ alignItems: 'center', backgroundColor: COLOR_WHITE }}

                style={{ flex: 1 }}
            >

                <Text style={{ marginVertical: 25, fontSize: 16 }}> {'現在のパスコードを入力してください'} </Text>
                {this.renderInput()}

                <View style={{ width: '100%', padding: 16, alignItems: 'center' }}>
                    <Text style={{ color: COLOR_RED }}>
                        {textError}
                    </Text>
                </View>

            </KeyboardAwareScrollView>
        )

    }


    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', backgroundColor: COLOR_WHITE }}>
                <SafeAreaView></SafeAreaView>



                <View style={{ width: '100%', justifyContent: 'flex-end', flexDirection: 'row' }}>

                    <Text onPress={this.goBack} style={{ color: COLOR_BLUE, margin: 16 }}>{'キャンセル'}</Text>
                </View>
                {this.renderContent()}



            </View>
        );
    }
}
