import React, { PureComponent } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { COLOR_BLUE, COLOR_WHITE, COLOR_BLACK, COLOR_RED } from '../../../const/Color';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button } from '../item/Button';

import { Api } from '../util/api';
import { STRING } from '../../../const/String';
import InputPassword from '../item/InputPassword';


export default class ChangePhoneNumber extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            screenVisible: ''

        };
    }

    goBack = () => {
        const { goBack } = this.props.navigation
        goBack(null)
    }
    onChangeText = (value) => {
        this.state.phone = value
    }
    checkPhone = () => {
        const { phone } = this.state
        if (!phone) {
            this.setState({ textError: '携帯電話番号を入力してください' })
        }
        if (phone.length !== 11) {
            this.setState({ textError: '携帯電話番号を11桁で入力してください' })
        }
        if (phone.length == 11) {

            this.checkPhoneValidate()
        }

    }
    checkPhoneValidate = async () => {
        try {
            this.setState({ loading: true, textError: '' })
            const { phone } = this.state
            const response = await Api.checkPhoneNumberIsExist(phone)
            if (response.code === 200 && response.res.status.code === 1000) {
                this.props.navigation.navigate('AddNewPhone', { currentPhone: phone })
                return
            }
            if (response.code === 200 && response.res.status.code === 4) {
                this.setState({ textError: '現在の携帯電話番号がご登録の番号と異なっています。再度ご入力をお願いします。' })
                return

            }
            Alert.alert(STRING.an_error_occurred, STRING.please_try_again_later);

        } catch (error) {
            Alert.alert(STRING.an_error_occurred, STRING.please_try_again_later);

        } finally {
            this.setState({ loading: false })
        }

    }


    renderContent() {
        const { textError, loading } = this.state

        return (

            <View style={{ justifyContent: 'center', width: '100%', alignItems: 'center' }}>
                <Text style={styles.textTitle}>{'現在の携帯電話番号をご入力ください'}</Text>
                <View style={{ width: '90%' }}>
                    <InputPassword disableSercurity  onChangeText={this.onChangeText} maxLength={11} placeholder={'ハイフンなしの携帯電話番号を入力'} keyboardType={'number-pad'}  ></InputPassword>
                </View>
                <View style={{ width: '90%' }}>
                <Text style={styles.textError}>
                    {textError}
                </Text>      
                          </View>
             
                <Button title={'次へ'} onPress={this.checkPhone} loading={loading} style={{ width: '90%', marginTop: 20, }}></Button>
            </View>
        )
    }
    render() {
        const { textError } = this.state

        return (
            <View style={{ flex: 1, alignItems: 'center', backgroundColor: COLOR_WHITE }}>
                <SafeAreaView></SafeAreaView>
                <View style={{ width: '100%', justifyContent: 'flex-end', flexDirection: 'row' }}>

                    <Text onPress={this.goBack} style={{ color: COLOR_BLUE, margin: 16 }}>{'キャンセル'}</Text>
                </View>

                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps={'always'}
                    extraHeight={100}
                    extraScrollHeight={100}
                    enableOnAndroid
                    contentContainerStyle={{ alignItems: 'center', backgroundColor: COLOR_WHITE }}
                    style={{ flex: 1 }}
                >
                    {this.renderContent()}



                </KeyboardAwareScrollView>


            </View>
        );
    }
}
const styles = {
    textTitle: {
        color: COLOR_BLACK,
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 30



    },
    textDescription: {
        color: COLOR_BLACK,
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 10


    },
    textError: {
        color: COLOR_RED,
        fontSize:14,
        lineHeight:18
    }

}