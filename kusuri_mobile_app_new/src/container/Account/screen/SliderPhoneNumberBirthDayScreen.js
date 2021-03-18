import React, { Component } from 'react';
import { View, Text,ScrollView,Alert } from 'react-native';
import { SliderImageUsingPhoneNumberAndBirhDay } from '../item/SliderImageUsingPhoneNumberAndBirhDay';
import { managerAccount } from '../../../const/System';
import {Api} from '../util/api'
import CookieManager from 'react-native-cookies';
import { COLOR_WHITE } from '../../../const/Color';
import { STRING } from '../util/string';


export default class SliderPhoneNumberBirthDayScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  getOtp=async()=>{
    try { 
    if(managerAccount.phoneNumber){
       const respone = await  Api.validatePhoneNumber(managerAccount.phoneNumber)
      //  console.log('respone',respone)
       if (respone.code === 200 && respone.res.status.code === 1028) {
        Alert.alert(STRING.notification,'SMS送信上限を越えました。SMSが受信できない方は、SMS受信拒否設定をご確認いただき、翌日以降に再度実施をお願いします。')
    } 
       
    }
        
    } catch (error) {
        
    }

}
  clickAgree=()=>{
      const {navigation} = this.props
      const {state,navigate} = navigation
      const {params} = state
      if(managerAccount.phoneNumber && !managerAccount.validatePhoneNumberSuccess){
        this.getOtp()
        navigate('EnterOtpScreen',{phoneNumber:managerAccount.phoneNumber})
        return
      }
      if(managerAccount.needAddBirthDay){
        navigate('EnterBirthDayScreen')
        return
      }
      if(managerAccount.needValidateBirthDay){
        navigate('EnterValidateBirthDayScreen')
        return

      }
      
      navigate('EnterPhoneScreen')
  }
  goBack=()=>{
    this.props.navigation.navigate('EnterMemberCodeScreen')

  }

  render() {
    return (
      <ScrollView style={{backgroundColor:COLOR_WHITE,borderRadius:4}}>
          <SliderImageUsingPhoneNumberAndBirhDay goBack={this.goBack} clickAgree={this.clickAgree}></SliderImageUsingPhoneNumberAndBirhDay>
      </ScrollView>
    );
  }
}
