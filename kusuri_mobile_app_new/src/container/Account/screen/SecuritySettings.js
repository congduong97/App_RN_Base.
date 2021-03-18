import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { HeaderIconLeft } from '../../../commons';
import { COLOR_WHITE, COLOR_GRAY_LIGHT, COLOR_GRAY, COLOR_BLUE } from '../../../const/Color';
import { ItemSetting } from '../item/ItemSetting'
import { ItemSwich } from '../item/ItemSwich'
import { managerAccount } from '../../../const/System';
import Communications from 'react-native-communications';


export default class SecuritySettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    forgotPassWord=()=>{
        if(managerAccount.passwordApp){
            this.props.navigation.navigate('ForgotPassWord')

        }else{
            this.props.navigation.navigate('ResetPasswordScreen')


        }
    }

    renderContent = () => {
        const { navigation } = this.props
        return (
            <ScrollView

                style={{ flex: 1, backgroundColor: COLOR_WHITE, paddingVertical: 0 }}
            >
                <View style={styles.title}>
                    <Text>{'セキュリティ設定'}</Text>
                </View>



                <View style={{ padding: 16 }}>
                    <Text style={styles.titleContent}>{'パスワード'}</Text>
                    <Text style={styles.description} >{'パスワードをご設定いただくことで第三者による利用防止となりますのでご設定を推奨しています。'}</Text>

                    <ItemSetting navigation={navigation} data={{ name: 'パスワード登録・変更', namFunction: 'ResetPasswordScreen' }} style={{ borderTopWidth: 1, }}></ItemSetting>
                    <ItemSwich status={managerAccount.enablePasswordOppenApp} navigation={navigation} data={{ name: 'アプリ起動時にパスワード認証', type: 'OPPEN_APP' }}></ItemSwich>
                    <ItemSwich status={managerAccount.enablePasswordMyPage} navigation={navigation} data={{ name: '会員証表示時にパスワード認証', type: 'MY_PAGE' }}></ItemSwich>
                    <View style={styles.forgotPassword}>
                        <Text onPress={this.forgotPassWord} style={styles.titleForgotPassword}>{'パスワードをお忘れの場合はこちら'}</Text>
                    </View>


                    <Text style={[styles.titleContent, { marginTop: 10 }]}>{'ご登録の携帯電話番号'}</Text>
                    <Text style={styles.description} >{'Aocaカードに1つの携帯電話番号のご登録が必須となります。ご登録の携帯電話番号を変更される場合はこちらの設定からご変更ください。'}</Text>
                    <ItemSetting navigation={navigation} data={{ name: '携帯電話番号の変更', namFunction: 'ChangePhoneNumber' }} style={{ borderTopWidth: 1, marginBottom: 16, }}></ItemSetting>

                    
                    <Text style={[styles.titleContent, { marginBottom: 10 }]}>{'ご登録の生年月日について'}</Text>

                    <Text style={{ color: COLOR_GRAY }}>
                        {`アオキメンバーズカード作成時にご記載いただいた生年月日のご変更はアプリから行うことができません。\n`}
                        {` \n`}
                        {'お手数ですが、コールセンター'}
                        <Text onPress={() => Communications.phonecall('0120-212-132', true)} style={{ color: COLOR_BLUE, textDecorationLine: 'underline' }}>{'0120-212-132'}</Text>
                        {`（平日10時～17時半）へお問い合わせいただくか、クスリのアオキ各店店頭にて会員登録変更届のご提出をお願いいたします。その際、お手元にアオキメンバーズカードをご用意ください。\n`}
                        {` \n`}
                        {'※再登録後反映まで1週間～1か月かかります。  '}
                    </Text>
                </View>



            </ScrollView>
        )
    }
    render() {
        const { navigation } = this.props;
        const { goBack } = navigation;
        return (
            <View style={{ flex: 1, backgroundColor: COLOR_WHITE }}>
                <HeaderIconLeft goBack={goBack} navigation={navigation} />
                {this.renderContent()}

            </View>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        justifyContent: 'center', padding: 16, backgroundColor: COLOR_GRAY_LIGHT, width: '100%'
    },
    description: {
        color: COLOR_GRAY,
        marginVertical: 16,
        marginTop: 10
    },
    titleContent: {
        fontWeight: 'bold'
    },
    forgotPassword: {
        padding: 16, justifyContent: 'flex-end', borderBottomWidth: 1, borderColor: COLOR_GRAY_LIGHT, flexDirection: 'row', marginBottom: 16

    },
    titleForgotPassword: {
        color: COLOR_BLUE, textDecorationLine: 'underline'
    },
    textPhone: {
        color: COLOR_BLUE

    }

})