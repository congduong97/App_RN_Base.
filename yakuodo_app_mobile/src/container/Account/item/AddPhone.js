import React, { Component } from 'react';
import { View, Text, Alert } from 'react-native';
import { Button } from './Button';
import { COLOR_BLACK, COLOR_RED } from '../../../const/Color';

import TextNotePhone from './TextNotePhone';
import InputPassword from './InputPassword';

export class AddPhone extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            newPhoneNumber: '',
            comfirmNewPhoneNumber: ''

        };
    }
    onChangeTextPhone = (value) => {
        this.state.newPhoneNumber = value

    }
    onChangeTextPhoneConfirm = (value) => {
        this.state.comfirmNewPhoneNumber = value

    }
    checkPhone = () => {
        const { newPhoneNumber, comfirmNewPhoneNumber } = this.state
        const { type } = this.props

        if (!newPhoneNumber) {
            this.setState({ textError: '携帯電話番号を入力してください' })
            return
        }
        if (newPhoneNumber.length !== 11) {
            this.setState({ textError: '携帯電話番号を11桁で入力してください' })
            return
        }
        if (!comfirmNewPhoneNumber) {
            this.setState({ textError: '再入力の携帯電話番号を11桁で入力してください' })
            return
        }
        if (comfirmNewPhoneNumber.length !== 11) {
            this.setState({ textError: '新しい携帯電話番号（確認用）を11桁の半角数値で入力してください。' })
            return
        }
        if (newPhoneNumber !== comfirmNewPhoneNumber) {
            this.setState({ textError: 'ご入力の携帯電話番号が一致していません。再度ご入力をお願いします。' })
            return
        }
        if (newPhoneNumber === comfirmNewPhoneNumber) {
            if (type == 'changePhone') {
                this.sendchangePhoneNumer()
            } else {
                this.sendOtpPhoneNumber()
            }
            return
        }
        return
    }
    sendchangePhoneNumer = async () => {
            const { newPhoneNumber, comfirmNewPhoneNumber } = this.state
            const { currentPhone } = this.props
            this.props.navigation.navigate('ValidateOtpNewPhone', { currentPhone, newPhoneNumber })
    }


    sendOtpPhoneNumber = async () => {
        const { setScreenVisible } = this.props
        const { newPhoneNumber, comfirmNewPhoneNumber } = this.state

        setScreenVisible('validateOtp', { newPhoneNumber, comfirmNewPhoneNumber, type: 'ADD_PHONE' })
    }
    goBack = () => {
        const { setScreenVisible, type } = this.props
        if (type == 'changePhone') {
            this.props.navigation.goBack(null)
        } else {
            setScreenVisible && setScreenVisible('slider')

        }




    }

    render() {
        const { loading, textError } = this.state
        const { type } = this.props
        return (
            <View style={{ justifyContent: 'center', width: '100%', alignItems: 'center' }}>
                {type === 'changePhone' ? null :
                    <Text style={styles.textTitle}>{'携帯電話番号のご登録'}</Text>
                }
                <Text style={styles.textDescription}>{'携帯電話番号をご入力ください \n \n「次へ」クリック後、SMS認証コードを送信します。次画面にて認証コードをご入力ください。'}</Text>
                <View style={{ width: '90%' }}>
                    <InputPassword disableSercurity onChangeText={this.onChangeTextPhone} maxLength={11} placeholder={'ハイフンなしの携帯電話番号を入力'} keyboardType={'number-pad'}  ></InputPassword>
                    <InputPassword disableSercurity onChangeText={this.onChangeTextPhoneConfirm} maxLength={11} placeholder={'ハイフンなしの携帯電話番号を再入力'} keyboardType={'number-pad'}  ></InputPassword>
                </View>
            {textError ?
            <Text style={styles.textError}>
            {textError}
        </Text> :null
            }
                



                <Button title={'次へ'} onPress={this.checkPhone} loading={loading} style={{ width: '90%', marginTop: 20, }}></Button>
                <Button title={'戻る'} onPress={this.goBack} loading={loading} style={{ width: '90%' }} type={'canel'}></Button>
                <TextNotePhone></TextNotePhone>





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
        color: COLOR_RED
    }

}