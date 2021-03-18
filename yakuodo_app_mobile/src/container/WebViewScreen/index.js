import {StyleSheet, View, DeviceEventEmitter} from 'react-native';

import React, {PureComponent} from 'react';
import {COLOR_WHITE} from '../../const/Color';
import {WebView} from 'react-native-webview';
import {NetworkError} from '../../commons';
import {isIOS, screen, managerAcount} from '../../const/System';
import {TopWebView} from './item/TopWebView';
import HandleAppLyCoupon from '../../service/HandleAppLyCoupon';
import NetInfo from '@react-native-community/netinfo';

let INJECTED_JAVASCRIPT = '';

export default class ViewPagerPage extends PureComponent {
  constructor(props) {
    super(props);
    const {params} = this.props.navigation.state;

    this.state = {
      loading: true,
      isConnected: true,
      urlList: [],
      urlFirt: params.url,
      stateWebview: null,
      loadingfirst: true,
      loadingTop: true,
      addJavaScripp: false,
      addJavaScrippPinCode: false,
    };
    screen.name = false;
  }
  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
    }
  }
  onLoadEnd = () => {
    const {params} = this.props.navigation.state;
    if (
      !this.state.addJavaScripp &&
      params.url ==
        'https://prepay.cacs.jp/prc/ykod/card/CardIdInput;svid=01' &&
      managerAcount.memberCode &&
      managerAcount.memberCode.length === 16
    ) {
      INJECTED_JAVASCRIPT = `(function() {
        document.getElementById("cardId1").value = '${managerAcount.memberCode.substring(
          0,
          4,
        )}';
        document.getElementById("cardId2").value = '${managerAcount.memberCode.substring(
          4,
          8,
        )}';
        document.getElementById("cardId3").value = '${managerAcount.memberCode.substring(
          8,
          12,
        )}';
        document.getElementById("cardId4").value = '${managerAcount.memberCode.substring(
          12,
          16,
        )}';
              })();`;
      if (this.webView && this.webView.injectJavaScript) {
        this.state.addJavaScripp = true;
        this.webView.injectJavaScript(INJECTED_JAVASCRIPT);
        if (this.timeout) {
          clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => {
          INJECTED_JAVASCRIPT = `(function() {
            document.querySelector('#step1_form_btn .form_btn').click();
          })();`;
          this.webView.injectJavaScript(INJECTED_JAVASCRIPT);
        }, 500);
      }
    }
    if (
      this.state.stateWebview &&
      this.state.stateWebview.url ==
        'https://prepay.cacs.jp/prc/ykod/pin/PinInput;svid=01' &&
      !this.state.addJavaScrippPinCode &&
      managerAcount.memberCode &&
      managerAcount.pinCode &&
      managerAcount.pinCode.length == 6
    ) {
      INJECTED_JAVASCRIPT = `(function() {
        document.getElementById("pinNum").value = '${managerAcount.pinCode}';
              })();`;
      if (this.webView && this.webView.injectJavaScript) {
        this.state.addJavaScrippPinCode = true;

        this.webView.injectJavaScript(INJECTED_JAVASCRIPT);
        if (this.timeout) {
          clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => {
          INJECTED_JAVASCRIPT = `(function() {
            document.querySelector('#step2_form_btn .form_btn').click();
                            })();`;
          this.webView.injectJavaScript(INJECTED_JAVASCRIPT);
        }, 500);
      }
    }
  };
  onBackWebView = arr => {
    // console.log('arr', arr);
    this.state.urlList = [...arr];
    // this.setState({
    //   urlList: [...arr],
    // });
  };

  componentDidMount() {
    screen.name = 'WEB_VIEW';

    NetInfo.isConnected.fetch().then(isConnected => {
      if (!isConnected) {
        this.setState({isConnected});
      }
    });
    DeviceEventEmitter.addListener('onSessionConnect', this.onSessionConnect);
  }
  onSessionConnect = data => {
    if (data && data.url) {
      this.props.navigation.navigate('PDF', {linkPDF: data.url});
      // this.webView.stopLoading();
    }
  };
  changeStatusBanner = data => {
    try {
      const res = JSON.parse(data);
      if (res && res.bannerId && res.status === 'applied') {
        HandleAppLyCoupon.set({id: res.bannerId, type: 'APPLY'});
      }
    } catch (err) {}
  };

  reLoad = () => {
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) {
        this.setState({isConnected, loading: true});
        this.webView.reload();
      }
    });
  };

  setLoading = state => {
    if (state.loading) {
      this.state.loading = true;
    }
    this.setState({stateWebview: state});
  };
  /**
   * check for android
   */
  checkInjectedJavaScript = () => {
    if (isIOS) {
      return;
    }
    return INJECTED_JAVASCRIPT;
  };
  _onNavigationStateChange = webViewState => {
    console.log('webViewState', webViewState);
    // if(this.state.loadingfirst){
    //   this.state.urlList.push()
    // }
    if (
      webViewState &&
      webViewState.url &&
      webViewState.url.includes('.pdf') &&
      isIOS
    ) {
      this.props.navigation.navigate('PDF', {linkPDF: webViewState.url});
      this.webView.stopLoading();
    } else {
      this.setLoading(webViewState);
    }
  };
  reLoad = () => {
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) {
        this.setState({
          isConnected,
          isLoading: true,
          loadingTop: true,
          loadingfirst: true,
        });
        this.webView.reload();
      }
    });
  };
  renderTop = () => {
    const {loading, isConnected, stateWebview} = this.state;
    // if (!loadingTop || !isConnected || isIOS) {
    return (
      <TopWebView
        onBackWebView={this.onBackWebView}
        stateWebview={stateWebview}
        webView={this.webView}
        loading={loading}
        navigation={this.props.navigation}
        isConnected={isConnected}
        urlList={this.state.urlList}
      />
    );
  };
  render() {
    const {params} = this.props.navigation.state;
    const injectedJavaScript = this.checkInjectedJavaScript();
    const run = `
      document.onclick = function() {
      
    };
    true;
    `;
    if (this.webView) {
      this.webView.injectJavaScript(run);
    }

    return (
      <View style={[styles.wrapperContainer]}>
        {this.renderTop()}

        {this.state.isConnected ? (
          <View style={{flex: 1, overflow: 'hidden'}}>
            <WebView
              onError={onError => {
                if (onError.nativeEvent.code !== -1) {
                  this.setState({isConnected: false});
                }
              }}
              onMessage={event => {
                console.log('Event', event.nativeEvent.data);
                const {stateWebview, urlList} = this.state;

                if (urlList.indexOf(stateWebview.url < 0)) {
                  urlList.push(stateWebview.url);
                }
                if (event.nativeEvent.data) {
                  this.changeStatusBanner(event.nativeEvent.data);
                }
              }}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              onNavigationStateChange={this._onNavigationStateChange}
              style={{flex: 1}}
              ref={ref => (this.webView = ref)}
              source={{uri: params.url}}
              injectedJavaScript={injectedJavaScript}
              onLoadEnd={() => {
                const {stateWebview} = this.state;
                this.onLoadEnd();

                this.setState({
                  loading: false,
                  loadingfirst: false,
                });
              }}
            />
          </View>
        ) : (
          <NetworkError onPress={this.reLoad} />
        )}
        {/* </ScrollView> */}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  wrapperContainer: {
    backgroundColor: COLOR_WHITE,
    flex: 1,
  },
});
