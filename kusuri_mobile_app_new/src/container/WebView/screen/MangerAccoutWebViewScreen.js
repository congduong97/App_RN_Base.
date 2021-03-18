import React, { PureComponent } from 'react';
import {  StatusBar, StyleSheet, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { COLOR_GRAY_LIGHT, COLOR_WHITE, } from '../../../const/Color';
import { tab, keyAsyncStorage, managerAccount, DEVICE_WIDTH } from '../../../const/System';
import HeaderIconLeft from '../../../commons/HeaderIconLeft';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TextInput } from '../item/TextInput';
import { Validate } from '../../../util/module';
import { STRING } from '../util/string';
import { ModalSlider } from '../item/ModalSlider';
import { ButtonTypeOne } from '../../../commons';

export default class ManagerAccountWebView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      userName: managerAccount.userNameWebView,
      pass: managerAccount.passwordWebView,
      showModal: false

    };
  }


  saveAccount = () => {
    if (!this.state.userName || !this.state.pass) {
      Alert.alert(STRING.please_enter_an_user_name_and_password);
      return;
    }
    managerAccount.userNameWebView = this.state.userName;
    managerAccount.passwordWebView = this.state.pass;
    AsyncStorage.setItem(keyAsyncStorage.managerAccount, JSON.stringify(managerAccount)).then(res => {
      Alert.alert(STRING.save_account_succsess);
    }).catch(err => {

    });
  }


  render() {
    const { navigation, disableBackButton } = this.props;
    const { checkData } = this.state;
    const { iconUrlManagerAccountWebviewScreen, nameManagerAccountWebviewMemberScreen } = tab.screenTab;

    return (

      <View style={styles.wrapperContainer}>
        <StatusBar backgroundColor={COLOR_GRAY_LIGHT} barStyle="dark-content" />
        <HeaderIconLeft
          disableBackButton={disableBackButton}
          title={nameManagerAccountWebviewMemberScreen}
          goBack={navigation.goBack}
          imageUrl={iconUrlManagerAccountWebviewScreen}
        />
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps={'always'}
          extraHeight={150}
          enableOnAndroid
          style={styles.wrapperContainer}
        >

          <ModalSlider />


          <View style={styles.wrapperCenter}>


            <View style={{ backgroundColor: COLOR_WHITE, flex: 1, padding: 16, width: DEVICE_WIDTH }}>
              <View style={styles.wrapperBody}>

                {/*email*/}

                <TextInput
                  valueDefault={this.state.userName}
                  nameIcon={'account'} placeholder={STRING.email}
                  login
                  validate={() => Validate.defaults(this.state.userName, true)}
                  changeDataParent={(value) => { this.state.userName = value; }}
                  onStatusError={(value) => { this.state.errorEmail = value; }}
                  loading={checkData}
                />
                {/*pass*/}
                <TextInput
                  valueDefault={this.state.pass}

                  nameIcon={'key-variant'} placeholder={STRING.password}
                  pass
                  loading={checkData}
                  validate={() => Validate.defaults(this.state.pass, true)}
                  changeDataParent={(value) => { this.state.pass = value; }}
                  onStatusError={(value) => { this.state.errorPass = value; }}
                />

                <ButtonTypeOne
                  style={{ marginTop: 50 }}
                  name={STRING.save} onPress={this.saveAccount}
                />


              </View>

            </View>
          </View>
        </KeyboardAwareScrollView>

      </View>
    );
  }
}
const styles = StyleSheet.create({
  wrapperContainer: {
    backgroundColor: COLOR_WHITE,
    flex: 1
  },
  wrapperCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: '100%',
    height: '100%'
  }
});
