import React, { Component } from 'react';
import { View, Text, Linking, BackHandler } from 'react-native';
import { UpdateApp } from './UpdateApp';
import { COLOR_WHITE } from '../../const/Color';
import { isIOS } from '../../const/System';

export default class UpdateScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }
  handleBackPress = () => true
  goToAppStore = () => {
    Linking.openURL(isIOS ? 'https://itunes.apple.com/jp/app/id1321343906?mt=8' : 'https://play.google.com/store/apps/details?id=jp.co.yakuodo.android.public&hl=ja');
  }
  getTitle = () => {
    const { navigation } = this.props;
    const { params } = navigation.state;
    if (params && params.messageUpdateApp) {
      return params.messageUpdateApp;
    }

    return 'Please UpdateApp';
  }

  render() {
    return (
      <View style={{ backgroundColor: COLOR_WHITE, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <UpdateApp title={this.getTitle()} onPress={this.goToAppStore} />
      </View>
    );
  }
}
