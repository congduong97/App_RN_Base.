import React, { Component } from 'react';
import {
    View, Text, Linking, BackHandler, Image, ActivityIndicator,
} from 'react-native';
import { UpdateApp } from './UpdateApp';
import { COLOR_WHITE, COLOR_BLACK, APP_COLOR } from '../../const/Color';
import { isIOS, DEVICE_WIDTH, DEVICE_HEIGHT } from '../../const/System';
import { CheckDataApp } from './service';
import { setColor, } from './setColor';
import { setTabScreen } from './setTabScreen';
import { setSetting } from './setSetting';
import Spinkit from 'react-native-spinkit';

import NavigationService from '../../service/NavigationService';


export default class UpdateScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            updateAPP: false,
            updateDATA: false,
            messageUpdateApp: 'Please UpdateApp',
        };
    }
    componentDidMount() {
        CheckDataApp.onChange('UpdateScreen', status => {
            // alert('update')
            if (status && status.type === 'UPDATE_APP') {
                this.setState({ updateAPP: true, messageUpdateApp: status.messageUpdateApp })
                return
            }
            if (status && status.type === 'UPDATE_DATA_APP') {
                this.setState({ updateDATA: true })
                setTimeout(() => {
                    this.setDataToApp()
                }, 1500)
                return
            }

        })
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }
    setDataToApp = async () => {
        try {
            await setColor();
            await setTabScreen();
            await setSetting();
            NavigationService.navigate('HOME')
            CheckDataApp.reloadDataApp()

        } catch (error) {

        } finally {
            this.setState({ updateAPP: false, updateDATA: false })

        }
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        const { updateAPP, updateDATA } = this.state
        if (updateAPP || updateDATA) {
            return true
        }
        return false
    }

    goToAppStore = () => {
        Linking.openURL(isIOS ? 'https://itunes.apple.com/jp/app/id1321343906?mt=8' : 'https://play.google.com/store/apps/details?id=jp.co.yakuodo.android.public&hl=ja');
    }
    getTitle = () => {

        const { messageUpdateApp } = this.state
        return messageUpdateApp;
    }

    render() {
        const { updateAPP, updateDATA } = this.state
        // return null
        if (updateAPP) {
            return (
                <View style={{ backgroundColor: COLOR_WHITE, width: DEVICE_WIDTH, height: DEVICE_HEIGHT, justifyContent: 'center', alignItems: 'center' }}>
                    <UpdateApp title={this.getTitle()} onPress={this.goToAppStore} />
                </View>
            );
        }
        if (updateDATA) {
            return <View style={{ width: DEVICE_WIDTH, height: DEVICE_HEIGHT, backgroundColor: `${COLOR_BLACK}90`, justifyContent: 'center', alignItems: 'center', position: 'absolute' }} >
                <View style={{  borderRadius: 16, padding: 20, backgroundColor: '#FEEACA', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

                    <ActivityIndicator size="large" color={APP_COLOR.COLOR_TEXT} />
                    <Text style={{ color: APP_COLOR.COLOR_TEXT,marginTop:20}}>{'ロード中'}</Text>
                </View>
            </View>
        }



        return null
    }
}
