import React, { Component } from 'react';
import { View, Text, Linking, BackHandler, Image } from 'react-native';
import { UpdateApp } from '../item/UpdateApp';
import { COLOR_WHITE, COLOR_BLACK, APP_COLOR } from '../../../const/Color';
import { isIOS, DEVICE_WIDTH, DEVICE_HEIGHT } from '../../../const/System';
import { CheckDataApp } from '../util/service';
import { setColor, } from '../util/setColor';
import { setTabScreen } from '../util/setTabScreen';
import { setSetting } from '../util/setSetting';
import Spinkit from 'react-native-spinkit';

import NavigationService from '../../../service/NavigationService';
import AntDesign from 'react-native-vector-icons/AntDesign'


export default class UpdateScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            updateAPP: false,
            updateDATA: false,
            linkUpdateApp: isIOS ? 'https://apps.apple.com/us/app/%E3%82%AF%E3%82%B9%E3%83%AA%E3%81%AE%E3%82%A2%E3%82%AA%E3%82%AD%E5%85%AC%E5%BC%8F%E3%82%A2%E3%83%97%E3%83%AA/id1464657112?ls=1' : 'https://play.google.com/store/apps/details?id=jp.co.kusuriaoki.android.public',
            messageUpdateApp: 'Please UpdateApp',
            memberCodeInBacklist : false,

        };
    }
    componentDidMount() {
        CheckDataApp.onChange('UpdateScreen', status => {
            // alert('update')
            if (status && status.type === 'UPDATE_APP') {
                this.setState({ updateAPP: true, linkUpdateApp: status.linkUpdateApp, messageUpdateApp: status.messageUpdateApp })
                return
            }
            if (status && status.type === 'UPDATE_DATA_APP') {
                this.setState({ updateDATA: true })
                setTimeout(()=>{
                    this.setDataToApp()
                },1500)
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
        const {updateAPP,updateDATA} = this.state
        if(updateAPP || updateDATA) {
            return true
        }
        return false
    }

    goToAppStore = () => {
        const { linkUpdateApp } = this.state;

        if (linkUpdateApp) {
            Linking.openURL(linkUpdateApp);
            return;
        }
        Linking.openURL();
    }
    getTitle = () => {

        const { messageUpdateApp } = this.state
        return messageUpdateApp;
    }


    render() {
        const { updateAPP, updateDATA,memberCodeInBacklist } = this.state
    
        // return null
        if (updateAPP) {
            return (
                <View style={{ backgroundColor: COLOR_WHITE, width: DEVICE_WIDTH, height: DEVICE_HEIGHT, justifyContent: 'center', alignItems: 'center' }}>
                    <UpdateApp title={this.getTitle()} onPress={this.goToAppStore} />
                </View>
            );
        }
        if (updateDATA) {
            return (
            <View style={{ width: DEVICE_WIDTH, height: DEVICE_HEIGHT, backgroundColor: `${COLOR_BLACK}90`, justifyContent: 'center', alignItems: 'center', position: 'absolute' }} >
                <View style={{borderColor:APP_COLOR.COLOR_TEXT,borderRadius:4,borderWidth:1,padding:20,backgroundColor:COLOR_WHITE,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                    <Spinkit
                        type='FadingCircle'
                        color={APP_COLOR.COLOR_TEXT}
                    />
                    <Text style={{color:APP_COLOR.COLOR_TEXT,marginLeft:20}}>{'ロード中'}</Text>
                </View>
            </View>
            )
        }
     


        return null
    }
}
