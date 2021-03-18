import React, { PureComponent } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { COLOR_BLUE, COLOR_WHITE, COLOR_BLACK, COLOR_RED } from '../../../const/Color';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { AddPhone } from '../item/AddPhone';



export default class ChangePhoneNumber extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            phone:'',
            screenVisible:''
        
        };
    }

    goBack = () => {
        const { goBack } = this.props.navigation
        goBack(null)
    }
   
  
   

    renderContent() {
        const {textError,loading} = this.state
        const {currentPhone}  = this.props.navigation.state.params
        return (
            <View style={{padding:16,width:'100%'}}>
                <AddPhone currentPhone={currentPhone} navigation={this.props.navigation} type={'changePhone'} ></AddPhone>

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
        color: COLOR_RED
    }

}