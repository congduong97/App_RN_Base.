import {View, TouchableOpacity, SafeAreaView} from 'react-native';
import React, {PureComponent} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {SYSTEAM_VERSION, isIOS} from '../../../const/System';
import {APP_COLOR, COLOR_GRAY_LIGHT} from '../../../const/Color';
import {Loading} from '../../../commons';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';

export class TopWebView extends PureComponent {
  componentDidMount() {}
  onGoback = () => {
    const {navigation} = this.props;
    navigation.goBack(null);
  };
  goForward = () => {
    if (this.props.stateWebview && this.props.stateWebview.canGoForward) {
      this.props.webView.goForward();
    }
  };
  goBack = () => {
    if (
      this.props.stateWebview &&
      this.props.urlList.length > 0 &&
      this.props.stateWebview.url !==
        'https://prepay.cacs.jp/prc/ykod/pin/PinInput;svid=01'
    ) {
      this.props.urlList.pop();
      this.props.onBackWebView(this.props.urlList);
      this.props.webView.goBack();
    } else {
      this.props.navigation.goBack(null);
    }
  };
  render() {
    const {isConnected, loading} = this.props;
    console.log('abcd', this.props.urlList);
    return (
      <SafeAreaView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: parseInt(SYSTEAM_VERSION) < 11 && isIOS ? 20 : 0,
          }}>
          <View
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
            }}>
            {isConnected && loading ? <Loading style={{height: 40}} /> : null}
          </View>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                padding: 15,
                paddingVertical: 5,
              }}
              onPress={this.goBack}>
              <Icon
                name="ios-arrow-back"
                size={30}
                color={APP_COLOR.COLOR_TEXT}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                padding: 15,
                paddingVertical: 5,
              }}
              onPress={this.goForward}>
              <Icon
                name="ios-arrow-forward"
                size={30}
                color={
                  this.props.stateWebview &&
                  this.props.stateWebview.canGoForward
                    ? APP_COLOR.COLOR_TEXT
                    : COLOR_GRAY_LIGHT
                }
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={this.onGoback}
            style={{
              width: 50,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 5,
            }}>
            <Icon size={25} name={'md-close'} color={APP_COLOR.COLOR_TEXT} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}
