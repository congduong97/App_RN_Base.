import React, { Component } from 'react';
import { View, Text, Alert } from 'react-native';
import { Button } from './Button';
import { COLOR_BLACK, COLOR_GRAY_LIGHT, COLOR_BLUE_LIGHT, COLOR_RED } from '../../../const/Color';
import InputPassword from './InputPassword';
import { managerAcount, keyAsyncStorage, stateSercurity } from '../../../const/System';
import { Api } from '../util/api';
import { STRING } from '../../../const/String';
import Spinner from 'react-native-spinkit';
import { asyncScheduler } from 'rxjs';
import AsyncStorage from '@react-native-community/async-storage';
import { AddEmail } from './AddEmail';
import { AddOtpByEmail } from './AddOtpByEmail';
import TextNotePhone from './TextNotePhone';


export class ValidateOtp extends Component {
    constructor(props) {
        super(props);
        let phoneNumber = ''
        const { phone } = this.props
        if (phone && phone.newPhoneNumber) {
            const { newPhoneNumber } = phone
            phoneNumber = newPhoneNumber
        }
        this.state = {
            loading: false,
            phoneNumber,
            otp: '',
            textError: '',
            screenVisible: '',
            numberSendOtp: 0

        };
    }
    componentDidMount() {
        this.sendOtp(true)

    }
    onChangeTextPhone = (value) => {
        this.state.otp = value
    }

    sendOtp = (notAlert) => {
        const { numberSendOtp } = this.state
        const { type, phone } = this.props
        this.state.numberSendOtp = numberSendOtp + 1
        const checknumberSendOtp = (this.state.numberSendOtp > parseInt(stateSercurity.maxNumberOfConsecutiveSmsByPhone))
        const typeNotRessetPass = type !== 'resetPass'

        if (stateSercurity.onSendOTPByEmail && checknumberSendOtp && typeNotRessetPass && (!managerAcount.phoneNumber || (phone && phone.type == 'CHANGE_PHONE'))) {
            this.setState({ screenVisible: 'AddEmail' })
        } else {
            if (phone && phone.type == 'ADD_PHONE' || phone.type == 'VALIDATE') {
                const { newPhoneNumber } = phone

                this.callAddPhone(newPhoneNumber, notAlert)

            }
            if (phone && phone.type == 'CHANGE_PHONE') {
                this.sendchangePhoneNumer(notAlert)

            }
        }


    }

    sendchangePhoneNumer = async (notAlert) => {
        try {
            const { currentPhone, newPhoneNumber } = this.props.phone
            this.setState({ loading: true, textError: '' })

            const response = await Api.updatePhoneNumber(currentPhone, newPhoneNumber)

            if (response.code == 200 && response.res.status.code == 1000) {
                if (!notAlert) {
                    Alert.alert('認証コードを再送信しました')

                }
                return
            }
            if (response.code == 200 && response.res.status.code == 1038) {
                Alert.alert(STRING.notification, '接続に失敗しました。しばらくたってから再度お試しください。');
                return
            }
            if (response.code === 200 && response.res.status.code === 4) {
                this.setState({ textError: '現在の携帯電話番号がご登録の番号と異なっています。再度ご入力をお願いします。' })
                return
            }
            if (response.code === 200 && response.res.status.code === 1301) {
                Alert.alert(STRING.notification, 'SMS送信上限を越えました。SMS送信は1日8通までが上限となります。翌日以降に再実施をお願いします。')
                return
            }
            Alert.alert(STRING.an_error_occurred, STRING.please_try_again_later);
        } catch (error) {
            Alert.alert(STRING.an_error_occurred, STRING.please_try_again_later);
        } finally {
            this.setState({ loading: false })
        }

    }
    validateOtp = () => {
        const { otp } = this.state
        if (otp && otp.length === 6) {
            this.callValidateOtp();
        } else {
            this.setState({ textError: '認証コ-ドが正しくありません' })
        }

    }
    callValidateOtp = async () => {
        try {
            this.setState({ loading: true, textError: '' })
            const { otp, phoneNumber } = this.state
            const { setScreenVisible, phone } = this.props

            const response = await Api.validateOTPCode(phoneNumber, otp)
            if (response.code == 200 && response.res.status.code == 1000) {
                managerAcount.phoneNumber = phoneNumber
                managerAcount.validateOtp = true
                await AsyncStorage.setItem(keyAsyncStorage.managerAccount, JSON.stringify(managerAcount))
                setScreenVisible('sussess')
                return
            }

            if (response.code == 200 && response.res.status.code == 4) {
                this.setState({ textError: '認証コ-ドが正しくありません' })
                return
            }
            Alert.alert(STRING.an_error_occurred, STRING.please_try_again_later);

        } catch (error) {
            Alert.alert(STRING.an_error_occurred, STRING.please_try_again_later);
        } finally {
            this.setState({ loading: false })

        }

    }
    callAddPhone = async (newPhoneNumber, notAlert) => {
        try {
            this.setState({ loading: true, textError: '' })

            const response = await Api.validatePhoneNumber(newPhoneNumber)
            if (response.code == 200 && response.res.status.code == 1000) {
                if (!notAlert) {
                    Alert.alert('認証コードを再送信しました')
                }
                return
            }
            if (response.code === 200 && response.res.status.code === 1301) {
                Alert.alert(STRING.notification, 'SMS送信上限を越えました。SMS送信は1日8通までが上限となります。翌日以降に再実施をお願いします。')
                return
            }
            if (response.code == 200 && response.res.status.code == 1038) {
                Alert.alert(STRING.notification, '接続に失敗しました。しばらくたってから再度お試しください。');
                return
            }
            Alert.alert(STRING.an_error_occurred, STRING.please_try_again_later);

        } catch (error) {

            Alert.alert(STRING.an_error_occurred, STRING.please_try_again_later);


        } finally {
            this.setState({ loading: false })

        }

    }
    goBack = () => {
        const { setScreenVisible } = this.props
        if (managerAcount.phoneNumber) {
            setScreenVisible('slider')
        } else {
            setScreenVisible('addPhone')

        }



    }
    setScreenVisible = (screen, email) => {
        const { setScreenVisible } = this.props

        if (screen == 'AddOtpByEmail') {
            this.setState({ screenVisible: screen, email });
            return
        }
        if (screen == 'sussess') {
            setScreenVisible('sussess')
            return
        }
        this.setState({ screenVisible: screen, });

    }
    render() {
        const { loading, phoneNumber, textError, screenVisible, email } = this.state

        const { phone, title, type, } = this.props
        if (screenVisible === 'AddEmail') {
            return <AddEmail setScreenVisible={this.setScreenVisible} ></AddEmail>
        }
        if (screenVisible === 'AddOtpByEmail') {
            return <AddOtpByEmail email={email} phone={phone} setScreenVisible={this.setScreenVisible} ></AddOtpByEmail>
        }
        return (
            <View style={{ alignItems: 'center', width: '100%' }}>
                {phone && phone.type == 'CHANGE_PHONE' ? null :
                    <Text style={styles.textTitle}>{title || 'SMS認証'}</Text>
                }
                <Text style={styles.textDescription}>{`末尾が「${phoneNumber.substring(phoneNumber.length - 3)}」の携帯電話番号に通知された認証コードをご入力ください。`}</Text>
                <View style={{ width: '90%' }}>
                    <InputPassword onChangeText={this.onChangeTextPhone} maxLength={6} keyboardType={'number-pad'}  ></InputPassword>
                </View>
                {textError ?
                    <Text style={styles.textError}>
                        {textError}
                    </Text>
                    : null
                }
                <Button title={'認証'} onPress={this.validateOtp} loading={loading} style={{ width: '90%', marginTop: 10, }}></Button>
                <Button title={'戻る'} onPress={this.goBack} loading={loading} style={{ width: '90%' }} type={'canel'}></Button>
                <View style={{ width: '90%', justifyContent: 'flex-end', flexDirection: 'row', }}>
                    {!loading ?
                        <Text onPress={() => this.sendOtp()} style={{ color: 'blue', textDecorationLine: 'underline', marginTop: 10, fontSize: 13 }}>
                            {'SMS認証コードを再送'}
                        </Text>
                        :
                        <Spinner color={COLOR_BLUE_LIGHT} type={'ThreeBounce'} />
                    }

                </View>
                {type == 'resetPass' ?
                    <View style={{ borderWidth: 1, borderColor: '#cecece', borderRadius: 2, width: '90%', padding: 8, marginTop: 16, fontSize: 12 }} >
                        <Text style={{ fontSize: 12 }}>
                            <Text style={styles.textError}>{'【ご注意】 \nSMS（ショートメッセージサービス）が受信できない場合、キャリアまたは端末のSMS受信拒否設定を解除した上で再送'}</Text>をお試しください。
また、<Text style={styles.textError}>{'SMS送信は1日8通までが上限と'}</Text>なります。上限を越える再送を行った場合は翌日以降にお試しください。
                        </Text>
                    </View>
                    :
                    <TextNotePhone></TextNotePhone>
                }
            </View>
        );
    }
}

const styles = {
    textTitle: {
        color: COLOR_BLACK,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10



    },
    textDescription: {
        color: COLOR_BLACK,
        fontSize: 13,
        lineHeight: 20,
        marginBottom: 10


    },
    textError: {
        color: COLOR_RED,
        marginTop: 10,
        marginHorizontal: 16,
    }
}