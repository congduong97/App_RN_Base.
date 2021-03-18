import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {COLOR_WHITE} from '../../../const/Color';
import {Button} from './Button';
import WebViewComponent from '../../../component/WebViewComponent';
import {from} from 'rxjs';
import {managerAcount, DEVICE_WIDTH} from '../../../const/System';

export default class BackList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  changeMemberCode = () => {
    const {setVisibleScreen} = this.props;

    setVisibleScreen && setVisibleScreen('addMemberCode');
  };
  goBack = () => {
    const {visibleModal} = this.props;
    visibleModal && visibleModal();
  };

  render() {
    return (
      <View
        style={{
          width: '100%',
          backgroundColor: COLOR_WHITE,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 16,
          paddingVertical: 32,
        }}>
        <View style={{width: '100%', height: DEVICE_WIDTH / 1.3}}>
          <WebViewComponent
            html={managerAcount.messengerBackList}></WebViewComponent>
        </View>
        <Button
          title={'カード番号変更'}
          onPress={this.changeMemberCode}
          style={{width: '90%', marginTop: 16}}></Button>
        <Button
          title={'閉じる'}
          onPress={this.goBack}
          style={{width: '90%'}}
          type={'canel'}></Button>
      </View>
    );
  }
}
