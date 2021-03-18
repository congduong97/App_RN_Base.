import React, { PureComponent } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { COLOR_BLUE, COLOR_WHITE, COLOR_BLACK, COLOR_RED } from '../../../const/Color';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ValidateOtp } from '../item/AddOtp';
import { AddOtpSuccess } from '../item/AddOtpSuccess';


export default class ChangePhoneNumber extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            screenVisible: '',


        };
    }

    goBack = () => {
        const { goBack } = this.props.navigation
        goBack(null)
    }


    setScreenVisible = (screen) => {
        if (screen == 'sussess') {
            this.setState({ screenVisible: screen })
        } else {
            this.props.navigation.goBack(null)
        }


    }

    renderContent() {
        const { textError, loading, screenVisible } = this.state
        const { currentPhone, newPhoneNumber } = this.props.navigation.state.params
        if (screenVisible == 'sussess') {
            return (

                <View style={{ padding: 16, paddingTop: 50, width: '100%' }}>
                    <AddOtpSuccess type={'changePhone'} navigation={this.props.navigation} ></AddOtpSuccess>

                </View>
            )

        }
        return (
            <View style={{ padding: 16, width: '100%' }}>
                <ValidateOtp titleClose={'閉じる'} titleButton={'証認'} setScreenVisible={this.setScreenVisible} phone={{ currentPhone, newPhoneNumber, type: 'CHANGE_PHONE' }} navigation={this.props.navigation} type={'changePhone'} ></ValidateOtp>

            </View>
        )

    }
    render() {
        const { textError, screenVisible } = this.state

        return (
            <View style={{ flex: 1, alignItems: 'center', backgroundColor: COLOR_WHITE }}>
                <SafeAreaView></SafeAreaView>
                {screenVisible == 'sussess' ? null :
                    <View style={{ width: '100%', justifyContent: 'flex-end', flexDirection: 'row' }}>
                        <Text onPress={this.goBack} style={{ color: COLOR_BLUE, margin: 16 }}>{'キャンセル'}</Text>
                    </View>
                }


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