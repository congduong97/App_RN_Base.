import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { COLOR_GRAY_LIGHT, COLOR_GRAY, COLOR_WHITE, COLOR_BLUE_LIGHT } from '../../../const/Color';
import { managerAcount, keyAsyncStorage, DEVICE_WIDTH } from '../../../const/System';
import AsyncStorage from '@react-native-community/async-storage';
import Modal from "react-native-modal";

export class ItemSwich extends PureComponent {
    constructor(props) {
        super(props)
        const { data } = this.props
        this.state = {
            status: data.type == 'OPPEN_APP' ? managerAcount.enablePasswordOppenApp : managerAcount.enablePasswordMyPage
        }
    }
    enterPasswordSuccess = () => {
        const { status } = this.state
        const { data } = this.props

        this.setState({ status: !status })
        if (data.type == 'OPPEN_APP') {
            managerAcount.enablePasswordOppenApp = !status
        }
        if (data.type == 'MY_PAGE') {
            managerAcount.enablePasswordMyPage = !status
        }
        AsyncStorage.setItem(keyAsyncStorage.managerAccount, JSON.stringify(managerAcount))
    }
    onValueChange = () => {
        if (managerAcount.passwordApp) {
            if (this.state.status) {
                this.props.navigation.navigate('EnterPasswordApp', { enterPasswordSuccess: this.enterPasswordSuccess })
                return
            }
            this.enterPasswordSuccess()
        } else {
            this.setState({ isVisible: true })
        }
    }
    goToSetPass = () => {
        this.disableModal()

        setTimeout(() => {
            this.props.navigation.navigate('EnterNewPasswordApp')
        }, 300)

    }
    disableModal = () => {
        this.setState({ isVisible: false })
    }
    renderModal = () => {
        const { isVisible } = this.state
        return (
            <View>
                <Modal isVisible={isVisible}>
                    <View style={{ width: DEVICE_WIDTH - 32, backgroundColor: COLOR_WHITE, padding: 16, borderRadius: 4, }}>

                        <View >
                            <Text style={{ fontSize: 16, marginVertical: 16 }}>{'パスコード認証設定をONにするにはパスコードの設定が必須です。'}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <TouchableOpacity onPress={this.disableModal} style={styles.buttonCanel}>
                                <Text>
                                    {'閉じる'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.goToSetPass} style={styles.buttonOk} >
                                <Text style={{ color: COLOR_WHITE }}>
                                    {'パスコード設定'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>


                </Modal>
            </View>
        )


    }
    render() {
        const { data, end, navigation } = this.props;
        const { status } = this.state



        return (
            <TouchableOpacity
                onPress={this.onValueChange}

            >
                <View style={[{ alignItems: 'center', justifyContent: 'space-between', paddingLeft: 32, paddingRight: 16, height: 40, flexDirection: 'row' }, this.props.style]}>
                    <Text style={{ color: COLOR_GRAY }}>
                        {data.name}
                    </Text>
                    <Switch onValueChange={this.onValueChange} value={status}></Switch>
                </View>
                {this.renderModal()}

            </TouchableOpacity>
        );
    }

}
const styles = StyleSheet.create({
    buttonOk: {
        backgroundColor: COLOR_BLUE_LIGHT, paddingVertical: 8, width: '40%', justifyContent: 'center', alignItems: 'center', marginLeft: 16, borderRadius: 4

    },
    buttonCanel: {
        borderWidth: 1, paddingVertical: 8, width: '40%', justifyContent: 'center', alignItems: 'center', borderRadius: 4,

    }
})