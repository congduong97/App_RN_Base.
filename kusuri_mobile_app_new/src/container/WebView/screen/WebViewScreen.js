import {
  StyleSheet,
  View,
  DeviceEventEmitter,
  SafeAreaView
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import React, { PureComponent } from "react";
import { COLOR_WHITE } from "../../../const/Color";
import { WebView } from "react-native-webview";
import { NetworkError } from "../../../commons";
import { isIOS, screen } from "../../../const/System";
import { TopWebView } from "../item/TopWebView";
const AppWebView = WebView;

export default class ViewPagerPage extends PureComponent {
  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    this.state = {
      loading: true,
      isConnected: true,
      urlFirt: params.url,
      urlFirtIsPdf: params.url.includes(".pdf"),
      stateWebview: null,
      loadingfirt: true,
      loadingTop: true
    };
  }
  componentDidMount() {
    screen.name = "WEB_VIEW";
    NetInfo.isConnected.fetch().then(isConnected => {
      if (!isConnected) {
        this.setState({ isConnected });
      }
    });
    DeviceEventEmitter.addListener("onSessionConnect", this.onSessionConnect);
  }
  componentWillUnmount() {
    screen.name = false;
  }
  onSessionConnect = data => {
    if (data && data.url) {
      this.props.navigation.navigate("PDF", { linkPDF: `${data.url}` });
      if (this.webView) {
        this.webView.stopLoading();
      }
    }
  };

  reLoad = () => {
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) {
        this.setState({ isConnected, loading: true });
        this.webView.reload();
      }
    });
  };

  setLoading = state => {
    if (state.loading) {
      this.state.loading = true;
    }
    this.setState({ stateWebview: state });
  };
  _onNavigationStateChange = webViewState => {
    if (
      webViewState &&
      webViewState.url &&
      webViewState.url.includes(".pdf") &&
      !this.state.urlFirtIsPdf &&
      !isIOS
    ) {
      // console.log('addddd2',`https://docs.google.com/gview?embedded=true&url=${webViewState.url}`)
      this.props.navigation.navigate("PDF", { linkPDF: `${webViewState.url}` });
      if (this.webView) {
        this.webView.stopLoading();
      }
    } else {
      this.setLoading(webViewState);
    }
  };

  renderTop = () => {
    const { loading, isConnected, stateWebview } = this.state;
    return (
      <TopWebView
        stateWebview={stateWebview}
        webView={this.webView}
        loading={loading}
        navigation={this.props.navigation}
        isConnected={isConnected}
      />
    );
  };

  render() {
    const { params } = this.props.navigation.state;
    let linkUrl = params.url;
    if (isIOS) {
      linkUrl = params.url;
    } else {
      if (/\.pdf$/.test(linkUrl)) {
        linkUrl = `https://drive.google.com/viewerng/viewer?embedded=true&url=${linkUrl}`;
      }
    }
    return (
      <View style={styles.wrapperContainer}>
        {this.renderTop()}

        {this.state.isConnected ? (
          <View style={{ flex: 1, overflow: "hidden" }}>
            <AppWebView
              // useWebKit={false}
              javaScriptEnabled={true}
              startInLoadingState={true}
              onError={onError => {
                if (onError.nativeEvent.code !== -1) {
                  this.setState({ isConnected: false });
                }
              }}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              onNavigationStateChange={this._onNavigationStateChange}
              style={{ flex: 1 }}
              ref={ref => (this.webView = ref)}
              source={{ uri: linkUrl }}
              onLoadEnd={() => {
                this.setState({
                  loading: false,
                  loadingfirt: false
                });
              }}
            />
          </View>
        ) : (
          <NetworkError
            onPress={() => {
              this.reLoad();
            }}
          />
        )}
        {/* </ScrollView> */}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  wrapperContainer: {
    backgroundColor: COLOR_WHITE,
    flex: 1
  }
});
