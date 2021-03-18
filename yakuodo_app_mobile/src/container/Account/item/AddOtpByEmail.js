import React, { Component } from 'react';
import { View, Text, Alert } from 'react-native';
import { Button } from './Button';
import { COLOR_BLACK, COLOR_RED, COLOR_BLUE_LIGHT } from '../../../const/Color';
import { Api } from '../util/api';
import { STRING } from '../../../const/String';
import TextNoteEmail from './TextNoteEmail';
import InputPassword from './InputPassword';
import Spinner from 'react-native-spinkit';
import { managerAcount ,keyAsyncStorage} from '../../../const/System';
import AsyncStorage from '@react-native-community/async-storage';



export class AddOtpByEmail extends Component {
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
            otp: '',
            textError: '',
            email: '',
            emailConfirm: '',
            phoneNumber

        };
    }
    onChangeTextPhone = (value) => {
        this.state.otp = value
    }
    componentDidMount=()=>{
        this.sendEmail(true)
    }
  

    sendEmail = async (notAlert) => {
        try {
            this.setState({ loading: true, textError: '' })
            const {email} = this.props

            const response = await Api.validateByEmail(email)
            if (response.code == 200 && response.res.status.code == 1000) {
                if (!notAlert) {
                    Alert.alert('認証コードを再送信しました')
                }
                return
            }
            if (response.code === 200 && response.res.status.code === 1301) {
                Alert.alert(STRING.notification, 'SMS認証コード再発行を繰り返して行うことはできません。1時間以上たってからもう一度ご登録をお願いいたします。')
                return
            }
            Alert.alert(STRING.an_error_occurred, STRING.please_try_again_later);

        } catch (error) {

            Alert.alert(STRING.an_error_occurred, STRING.please_try_again_later);


        } finally {
            this.setState({ loading: false })

        }

    }


    validateOtpCodeByEmail = async () => {

        try {
            this.setState({ loading: true, textError: '' })
            const { otp, phoneNumber } = this.state
            const { setScreenVisible, email } = this.props
            const response = await Api.validateOTPCode(phoneNumber, otp, email)
            
            if (response.code == 200 && response.res.status.code == 1000) {
                managerAcount.validateOtp = true
                managerAcount.phoneNumber = phoneNumber
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



    goBack = () => {
        const { setScreenVisible } = this.props
        setScreenVisible('AddEmail')
    }

    onChangeOtp = (value) => {
        this.state.otp = value
    }

    validateOtpEmail = () => {
        const { otp } = this.state
        if (otp && otp.length === 6) {
            this.validateOtpCodeByEmail();
        } else {
            this.setState({ textError: '認証コ-ドが正しくありません' })
        }

    }

    render() {
        const { loading, textError, } = this.state
        const { phone } = this.props
        return (
            <View style={{ alignItems: 'center', width: '100%' }}>
                {/* {phone && phone.type == 'CHANGE_PHONE' ? null : */}
                <Text style={styles.textTitle}>{'SMS認証'}</Text>
                {/* } */}
                <Text style={styles.textDescription}>{`ご入力のメールアドレスに通知された認証コードをご入力ください。`}</Text>
                <View style={{ width: '90%' }}>
                    <InputPassword disableSercurity onChangeText={this.onChangeOtp} maxLength={6} keyboardType={'number-pad'}  ></InputPassword>
                </View>
                {textError ?
                    <Text style={styles.textError}>
                        {textError}
                    </Text>
                    : null
                }
                <Button title={'認証'} onPress={this.validateOtpEmail} loading={loading} style={{ width: '90%', marginTop: 20, }}></Button>
                <Button title={'メールアドレス入力へ戻る'} onPress={this.goBack} loading={loading} style={{ width: '90%' }} type={'canel'}></Button>
                <View style={{ width: '90%', justifyContent: 'flex-end', flexDirection: 'row', marginTop:10}}>
                    {!loading ?
                        <Text onPress={()=>{
                            this.sendEmail()
                        }} style={{ color: 'blue', textDecorationLine: 'underline' }}>
                            {'メールアドレスに認証コードを再送'}
                        </Text>
                        :
                        <Spinner color={COLOR_BLUE_LIGHT} type={'ThreeBounce'} />
                    }
                </View>
                <TextNoteEmail></TextNoteEmail>
            </View>
        );
    }
}

const styles = {
    textEmail: {
        color: '#0396A7',
        fontSize: 10,


    },
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
        color: COLOR_RED
    }
}