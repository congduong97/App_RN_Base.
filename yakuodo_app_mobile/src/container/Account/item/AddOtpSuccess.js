import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button } from './Button';
import { COLOR_RED, COLOR_BLACK } from '../../../const/Color';
import NavigationService from '../../../service/NavigationService';
import { managerAcount } from '../../../const/System';
import { linkDeeplink, useDeepLink } from '../../HomeScreen/SetUpDeepLink';

export class AddOtpSuccess extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    goSetting = () => {
        const { type } = this.props
        if (type !== 'changePhone') {



            if (linkDeeplink.linkSave) {
                this.timeOutModalDidMount = setTimeout(() => {

                    useDeepLink(linkDeeplink.linkSave);
                    linkDeeplink.linkSave = null;
                }, 500);
            } else {
                if (!managerAcount.passwordApp) {
                    NavigationService.navigate('SETTING')
                }
            }
            const { visibleModal } = this.props
            visibleModal && visibleModal()

        } else {
            this.props.navigation.navigate('SETTING')
        }


    }

    render() {
        return (
            <View style={{ justifyContent: 'center', width: '100%', alignItems: 'center' }}>
                <Text style={styles.textTitle}>{'携帯電話番号のご登録が完了しました。'}</Text>
                <Text style={styles.textDescription}><Text style={styles.textRed}>{'PINコードをご設定いただいた場合、会員証バーコードでチャージ・決済が行えます。'}</Text>不正利用防止のため会員証表示時のパスコード設定を推奨しております。
                <Text style={styles.textRed}>{'\n \nアプリでチャージ・決済機能を利用する場合は会員証画面「カード番号変更」から正しいPINコードご入力の上、再登録が必要です。'}</Text></Text>
                <Button title={'セキュリティ設定を開く'} onPress={this.goSetting} style={{ width: '90%', marginTop: 20, }}></Button>


            </View>
        );
    }
}
const styles = {
    textTitle: {
        color: COLOR_BLACK,
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10
    },
    textDescription: {
        color: COLOR_BLACK,
        fontSize: 13,
        lineHeight: 20,
        marginBottom: 10
    },
    textRed: {
        color: COLOR_RED
    }
}