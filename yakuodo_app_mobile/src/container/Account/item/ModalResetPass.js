import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { COLOR_WHITE, COLOR_BLUE_LIGHT, COLOR_GRAY_LIGHT, COLOR_RED, } from '../../../const/Color'
import { DEVICE_WIDTH, managerAcount } from '../../../const/System'
import Modal from "react-native-modal";


import { Button } from './Button';
import { ValidateOtp } from './AddOtp';
export class ModalResetPass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            enterOTP: false,
            limittedOtp: false,
            loading: false,
            opt: ''
        };
    }
    componentDidMount() {
        const { onRef } = this.props
        onRef && onRef(this)
    }
    visibleModal = () => {
        this.setState({ isVisible: !this.state.isVisible, enterOTP: false, otp: '' })
    }
    disableModal = () => {
        this.setState({ isVisible: false, enterOTP: false, otp: '' })
    }
    goToSetPass = () => {
        this.sendOtp()
    }




    sendOtp = async () => {
        this.setState({enterOTP:true})
      

    }
    getPhone = () => {
        return managerAcount.phoneNumber.slice(managerAcount.phoneNumber.length - 3, managerAcount.phoneNumber.length)
    }
    onChangeText = (value) => {
        this.state.otp = value

    }
    setScreenVisible = (screen) => {
        const { screenName } = this.props
        if (screen === 'sussess') {
            this.props.navigation.navigate('EnterNewPasswordApp', { screenName })
            this.disableModal()

        } else {
            this.disableModal()

        }
    }
    renderContent = () => {
        const { enterOTP, limittedOtp, loading, } = this.state

        if (enterOTP) {

            return (
                <ScrollView
                    keyboardShouldPersistTaps='always'
                    style={styles.container} contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}>
                    <ValidateOtp
                        title={'パスコードリセット'}
                        titleButton={'認証'}
                        titleClose={'閉じる'}
                        type={'resetPass'}

                        setScreenVisible={this.setScreenVisible}
                        phone={{
                            newPhoneNumber: managerAcount.phoneNumber,
                            comfirmNewPhoneNumber: '',
                            type: 'VALIDATE'
                        }} ></ValidateOtp>

                </ScrollView>


            )

        }
        return (
            <View style={{ width: '100%', backgroundColor: COLOR_WHITE, alignItems: 'center' }}>


                <Text style={{ fontSize: 16, marginBottom: 16, fontWeight: 'bold' }}>{'パスコードリセット'}</Text>

                <View>
                    <Text style={{ fontSize: 14, marginBottom: 16, }}>{'アプリに登録した携帯電話番号へのSMS認証を行うことでパスコードのリセットを行うことができます。'}</Text>
                    <View style={{ borderWidth: 1, borderColor: COLOR_GRAY_LIGHT, margin: 8, padding: 8 }}>
                        <Text style={{ fontSize: 14, }}>{'【手順のご説明】\n１．「認証コードを送信」クリックでご登録の携帯電話番号に認証コードを送信\n２．SMSに記載の認証コードを次画面にて入力\n３．新しいパスコードの登録'}</Text>
                    </View>

                </View>
                {limittedOtp ?
                    <Text style={{ color: COLOR_RED, marginBottom: 16 }}>
                        {'繰り返し認証コード再送を行うことはできません。10分後に再度お試しください。'}
                    </Text>
                    : null
                }
                <Button onPress={this.goToSetPass} title={'認証コードを送信 '} loading={loading}></Button>

                <Button onPress={this.disableModal} title={'閉じる '} type={'canel'} loading={loading}></Button>





            </View>

        )

    }
    render() {
        const { isVisible, } = this.state
        return (
            <View style={{ flex: 1 }}>
                <Modal isVisible={isVisible}>
                    <View style={{ width: DEVICE_WIDTH - 32, backgroundColor: COLOR_WHITE, padding: 16, borderRadius: 4, alignItems: 'center' }}>

                        {this.renderContent()}
                    </View>



                </Modal>
            </View>

        );
    }
}
const styles = StyleSheet.create({


    borderTextInput: {
        borderWidth: 1, borderColor: COLOR_BLUE_LIGHT, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '80%', marginBottom: 16, padding: 4
    },
    textError: {
        color: COLOR_RED,
        marginBottom: 10,
    },
    container: {
        width: DEVICE_WIDTH - 32, padding: 16,
    },

})
