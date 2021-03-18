import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLOR_GRAY, COLOR_GRAY_LIGHT, COLOR_BLUE, COLOR_RED, COLOR_BLUE_APP } from '../../../const/Color';
import { ItemSwich } from './ItemSwich';
import { DEVICE_WIDTH, managerAcount } from '../../../const/System'
import { ModalResetPass } from '../../Account/item/ModalResetPass';


export class Security extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    changePass = () => {
        if (managerAcount.passwordApp) {
            this.props.navigation.navigate('EnterPasswordApp', { nameScreen: 'EnterNewPasswordApp' })
        } else {
            this.props.navigation.navigate('EnterNewPasswordApp')

        }
    }
    forgotPassWord=()=>{
        if(this.modalResetPass){
            this.modalResetPass.visibleModal()
        }
        
    }

    render() {
        const { navigation } = this.props
        return (
            <View>
                <View style={[styles.containerTitle]}>
                    <Text style={{ fontWeight: 'bold' }}>{'セキュリティ設定'}</Text>
                </View>

                <TouchableOpacity onPress={this.changePass} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 40, justifyContent: 'space-between' }}>
                    <Text>
                        {'アプリパスコード設定'}
                    </Text>
                    <Icon name="angle-right" size={20} color={COLOR_GRAY} />
                </TouchableOpacity>


                <ItemSwich navigation={navigation} data={{ name: 'アプリ起動時にパスコード要求', type: 'OPPEN_APP' }}></ItemSwich>
                <ItemSwich navigation={navigation} data={{ name: '会員証表示時にパスコード要求', type: 'MY_PAGE' }}></ItemSwich>

                <View style={styles.forgotPassword}>
                    <Text onPress={this.forgotPassWord} style={styles.titleForgotPassword}>{'パスコードをお忘れの場合はこちら'}</Text>
                </View>


                <TouchableOpacity onPress={()=>this.props.navigation.navigate('ChangePhoneNumber')}  style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 40, justifyContent: 'space-between' }}>
                    <Text >
                        {'携帯電話番号の変更'}
                    </Text>
                    <Icon name="angle-right" size={20} color={COLOR_GRAY} />
                </TouchableOpacity>

                <View style={{ borderColor: COLOR_RED, borderWidth: 1, margin: 16, padding: 16, marginTop: 0 }}>
                    <Text style={{ color: COLOR_RED,fontSize:12,lineHeight:16 }}>
                        {'アプリに会員カード連携する場合、会員カードごとに携帯電話番号のご登録が必須となります。携帯電話番号の登録・変更時にSMS認証コードによる端末認証を行いますのでSMS受信可能な携帯電話番号をご設定ください。'}
                    </Text>
                </View>
               
                <View style={[styles.containerTitle]}>
                    <Text style={{ fontWeight: 'bold' }}>{'メニュー'}</Text>
                </View>
                <ModalResetPass navigation={this.props.navigation} screenName={'SETTING'} onRef={ref=>this.modalResetPass = ref} ></ModalResetPass>

            </View>
        );
    }

}

const styles = StyleSheet.create({
    containerTitle: {
        height: 50, width: '100%', justifyContent: 'center', paddingHorizontal: 16, backgroundColor: COLOR_BLUE_APP
    },
    forgotPassword: {
        padding: 16, justifyContent: 'flex-end', borderBottomWidth: 1, borderColor: COLOR_GRAY_LIGHT, flexDirection: 'row', width: DEVICE_WIDTH - 32, marginLeft: 16

    },
    titleForgotPassword: {
        color: COLOR_BLUE, textDecorationLine: 'underline'
    },


  
})