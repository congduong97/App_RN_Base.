import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button } from './Button';
import { COLOR_BLACK, COLOR_RED } from '../../../const/Color';

import TextNoteEmail from './TextNoteEmail';
import InputPassword from './InputPassword';
const emailFormatter = (email) => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(email) === false) {
        return false;
    }

    return true;
};


export class AddEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            textError: '',
            email: '',
            emailConfirm: ''

        };
    }




    sendEmail = async () => {
        const { setScreenVisible } = this.props
        setScreenVisible('AddOtpByEmail',this.state.email)
    }
    validateEmail = () => {
        const { email, emailConfirm } = this.state
        if (!email) {
            this.setState({ textError: 'メールアドレスを入力してください。' })
            return
        }
        if (!emailFormatter(email)) {
            this.setState({ textError: 'メールアドレスのフォマートは正しくないです。' })
            return
        }
        if (!emailConfirm) {
            this.setState({ textError: '確認用メールアドレスを入力してください。' })
            return
        }
        if (email !== emailConfirm) {
            this.setState({ textError: 'メールアドレスが異なっています。再度メールアドレスを入力してください。' })
            return
        }
        if (email == emailConfirm) {
            this.sendEmail()



        }


    }


    goBack = () => {
        const { setScreenVisible } = this.props
        setScreenVisible('addOtp')
    }
    onChangeTextEmail = (value) => {
        this.state.email = value


    }
    onChangeTextEmailConfirm = (value) => {
        this.state.emailConfirm = value
    }

    render() {
        const { loading, textError, } = this.state
        const { phone } = this.props
        return (
            <View style={{ alignItems: 'center', width: '100%' }}>
                {/* {phone && phone.type == 'CHANGE_PHONE' ? null : */}
                <Text style={styles.textTitle}>{'SMS認証'}</Text>
                {/* } */}
                <Text style={styles.textDescription}>{`SMSが受信できない場合はメールアドレスへの認証コード送信をお試しください。携帯電話番号のご登録は必須となります。`}</Text>
                <View style={{ width: '90%' }}>
                    <InputPassword disableSercurity onChangeText={this.onChangeTextEmail} placeholder={'メールアドレスを入力'}  ></InputPassword>
                    <InputPassword disableSercurity onChangeText={this.onChangeTextEmailConfirm} placeholder={'メールアドレスを再入力'}  ></InputPassword>
                </View>
                {textError ?
                    <Text style={styles.textError}>
                        {textError}
                    </Text>
                    : null
                }
                <Button title={'次へ'} onPress={this.validateEmail} loading={loading} style={{ width: '90%', marginTop: 20, }}></Button>
                <Button title={'SMS認証へ戻る'} onPress={this.goBack} loading={loading} style={{ width: '90%' }} type={'canel'}></Button>
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