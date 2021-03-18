import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { DEVICE_WIDTH, managerAcount } from '../../../const/System';
import { ButtonTypeOne } from './ButtonTypeOne';
import { ButtonTypeThree } from './ButtonTypeThree';
import { COLOR_RED, COLOR_BLACK } from '../../../const/Color';
import { ScrollView } from 'react-native-gesture-handler';
import { AddPhone } from './AddPhone';
import { ValidateOtp } from './AddOtp';
import { AddOtpSuccess } from './AddOtpSuccess';
import { Api } from '../util/api';
import { STRING } from '../../../const/String';

export class ValidatePhone extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            screenVisible: '',
            phone: {
                newPhoneNumber: managerAcount.phoneNumber,
                comfirmNewPhoneNumber: '',
                type: 'VALIDATE'
            }
        };
    }

    sentOtp = () => {
        if (managerAcount.phoneNumber) {
            this.sendOtpPhoneNumber()

        } else {
            this.setScreenVisible('addPhone')
        }
    }
    sendOtpPhoneNumber = async () => {
            this.setScreenVisible('validateOtp')
    }

    setScreenVisible = (screenVisible, phone) => {

        if (screenVisible === 'addPhone') {
            this.setState({ screenVisible })
            return
        }
        if (screenVisible === 'sussess') {
            this.setState({ screenVisible })
            return
        }
        if (screenVisible === 'slider') {
            this.setState({ screenVisible })
            return

        }
        if (screenVisible === 'validateOtp') {
            this.setState({ screenVisible, phone: phone || this.state.phone })
        }
    }

    close = () => {

        const { setVisibleScreen } = this.props
        setVisibleScreen('addMemberCode')
    }
    renderContent = () => {
        const { screenVisible, loading, phone } = this.state
        const { visibleModal } = this.props
        if (screenVisible === 'sussess') {
            return <AddOtpSuccess visibleModal={visibleModal}></AddOtpSuccess>
        }
        if (screenVisible === 'addPhone') {
            return <AddPhone setScreenVisible={this.setScreenVisible}></AddPhone>
        }
        if (screenVisible === 'validateOtp') {
            return <ValidateOtp phone={phone} setScreenVisible={this.setScreenVisible}></ValidateOtp>
        }
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>

                <Text style={styles.textTitle} >{'重要なお知らせ'}</Text>

                <Text style={styles.textDescription} >
                    <Text style={styles.textRed}>{'アプリ会員証バーコードにチャージ・決済機能が追加'}</Text>され、アプリご利用には会員カード毎に「<Text style={styles.textRed} >{'SMS認証済み携帯電話番号のご登録'}</Text>」が必須となりました。 {'\n \n'}
                    下部メニュー「ガイド」内機能に<Text style={styles.textRed} >{'アプリ起動時、会員証表示時にパスコード認証機能'}</Text>がご利用可能となりましたのでご活用ください。
                </Text>

                <View style={{ padding: 32, width: '100%' }}>
                    <ButtonTypeOne activebutton={true} loading={loading} name={'携帯電話番号のご登録'} onPress={this.sentOtp}  ></ButtonTypeOne>
                    <ButtonTypeThree loading={loading} name={'会員カード番号変更'} onPress={this.close} style={{ marginTop: 16, }}   ></ButtonTypeThree>
                </View>

                <View style={{ width: '100%', padding: 8, borderWidth: 1, borderColor: '#cecece' }}>
                    <Text style={styles.textNote}>
                        <Text style={styles.textRed} >{'【ご注意】\n'}</Text>
                        アプリ会員証バーコードで<Text style={styles.textRed} >{'チャージ・決済機能をご利用いただくには「PINコード」認証が必須'}</Text>になります。チャージ・決済機能をご利用になられる方は<Text style={styles.textRed} >{'「会員カード番号変更」ボタンをクリックし再度、会員連携'}</Text>をお願いいたします。
                </Text>

                </View>
            </View>

        )

    }



    render() {
        return this.renderContent()
    }
}
const styles = StyleSheet.create({

    container: {
        width: DEVICE_WIDTH - 32, padding: 16,
    },
    textTitle: {
        color: COLOR_BLACK,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10



    },
    textDescription: {
        color: COLOR_BLACK,
        fontSize: 14,
        lineHeight: 20

    },
    textNote: {
        color: COLOR_BLACK,
        fontSize: 12,
        lineHeight: 16

    },
    textRed: {
        color: COLOR_RED,

    }


})
