import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLOR_GRAY_LIGHT, COLOR_GRAY } from '../../../const/Color';
import { OpenMenu } from '../../../util/module/OpenMenu';
import { managerAccount, keyAsyncStorage } from '../../../const/System';
import AsyncStorage from '@react-native-community/async-storage';

export class ItemSwich extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            status: props.status

        }
    }
    enterPasswordSuccess = () => {
        const { status } = this.state
        const { data } = this.props
        this.setState({ status: !status })
        if (data.type == 'OPPEN_APP') {
            managerAccount.enablePasswordOppenApp = !status
        }
        if (data.type == 'MY_PAGE') {
            managerAccount.enablePasswordMyPage = !status
        }
        AsyncStorage.setItem(keyAsyncStorage.managerAccount,JSON.stringify(managerAccount))
    }
    onValueChange = () => {
        if(managerAccount.passwordApp){
            if(this.state.status){
                this.props.navigation.navigate('EnterPasswordApp', { enterPasswordSuccess: this.enterPasswordSuccess})
                return
            }
            this.enterPasswordSuccess()

    

        }else{
            
            this.props.navigation.navigate('ResetPasswordScreen',{alertPopup:true})

        }
    }
    render() {
        const { data, end, navigation } = this.props;
        const { status } = this.state



        return (
            <TouchableOpacity
                onPress={this.onValueChange}
            >
                <View style={[{ alignItems: 'center', justifyContent: 'space-between', height: 50, borderBottomWidth: end ? 0 : 1, flexDirection: 'row', borderColor: COLOR_GRAY_LIGHT, }, this.props.style]}>
                    <Text style={{ color: COLOR_GRAY }}>
                        {data.name}
                    </Text>
                    <Switch onValueChange={this.onValueChange} value={status}></Switch>
                </View>
            </TouchableOpacity>
        );
    }

}