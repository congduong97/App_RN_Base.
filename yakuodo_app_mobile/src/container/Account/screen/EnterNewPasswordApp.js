import React, { PureComponent } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { InputPass } from '../item/InputPass'
import { COLOR_BLUE, COLOR_WHITE, COLOR_RED } from '../../../const/Color';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


export default class EnterNewPasswordApp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      listTextInput: ['', '', '', ''],
    };
  }
  changeDataParent = (index, value) => {
    this.state.listTextInput[index] = value;

    const { listTextInput } = this.state
    const { nameScreen } = this.props

    let check = true;
    let pass = ''

    listTextInput.map(value => {

      if (value && value.length === 1 && !isNaN(value)) {
        pass = `${pass}${value}`;
      } else {
        check = false;
      }
    });
    if (check) {
      const { params } = this.props.navigation.state
      if (params && params.screenName) {
      
       this.props.navigation.navigate('EnterConfirmNewPasswordApp', { password: pass, screenName: params.screenName })


      }else{
        this.props.navigation.navigate('EnterConfirmNewPasswordApp', { password: pass, screenName: 'SETTING' })
      }
    }

  }
  goBack = () => {
    const { goBack } = this.props.navigation
    goBack(null)
  }

  renderInput = () => {
    const { listTextInput } = this.state;
    const listInput = listTextInput.map((value, index) => <InputPass
      nameScreen={'EnterNewPasswordApp'}
      widthInput={30}
      marginCenter
      secureTextEntry
      changeDataParent={this.changeDataParent}
      autoFocus={index === 0}
      key={`${index}`}
      index={index}
      value={value}
      end={index === listTextInput.length - 1}
    />);
    return (
      <View style={{ flexDirection:'row',justifyContent:'space-between',width:'70%'}}>
        {listInput}
      </View>
    );
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
          <Text style={{ marginVertical: 25, fontSize: 16 }}> {'新しいパスコードを入力してください'} </Text>
          {this.renderInput()}
          <View style={{ width: '100%', padding: 16 }}>
            <Text style={{ color: COLOR_RED }}>
              {textError}
            </Text>
          </View>


        </KeyboardAwareScrollView>


      </View>
    );
  }
}
