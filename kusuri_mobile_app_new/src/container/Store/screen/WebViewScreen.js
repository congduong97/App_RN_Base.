import React, { PureComponent } from "react";
import { ActivityIndicator, View, DeviceEventEmitter } from "react-native";
import { WebView } from "react-native-webview";
import NetInfo from "@react-native-community/netinfo";
import { TopWebView } from "../../WebView/item/TopWebView";
import { COLOR_WHITE } from "../../../const/Color";
export default class WebViewScreen extends PureComponent {
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
      loadingTop: true,
    };
  }

  componentDidMount() {
    NetInfo.isConnected.fetch().then((isConnected) => {
      if (!isConnected) {
        this.setState({ isConnected });
      }
    });
    DeviceEventEmitter.addListener("onSessionConnect", this.onSessionConnect);
  }
  onSessionConnect = (data) => {
    if (data && data.url) {
      this.props.navigation.navigate("PDF", { linkPDF: `${data.url}` });
      if (this.webView) {
        this.webView.stopLoading();
      }
    }
  };

  renderLoadingView() {
    return (
      <ActivityIndicator
        animating={true}
        color='#0076BE'
        size='large'
        hidesWhenStopped={true}
        style={{ marginTop: 0 }}
      />
    );
  }
  renderTop = () => {
    const { loading, isConnected } = this.state;
    return (
      <TopWebView
        navigation={this.props.navigation}
        loading={loading}
        isConnected={isConnected}
      />
    );
  };

  reLoad = () => {
    NetInfo.isConnected.fetch().then((isConnected) => {
      if (isConnected) {
        this.setState({ isConnected, loading: true });
        this.webView.reload();
      }
    });
  };
  setLoading = (state) => {
    if (state.loading) {
      this.state.loading = true;
    }
    this.setState({ stateWebview: state });
  };
  _onNavigationStateChange = (webViewState) => {
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

  render() {
    // const { params } = this.props.navigation.state;
    // let uri = params.url;
    // if (/\.pdf$/.test(uri)) {
    //   uri = `https://drive.google.com/viewerng/viewer?embedded=true&url=${uri}`;
    // }

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
      <View style={{ flex: 1, backgroundColor: COLOR_WHITE }}>
        {this.renderTop()}
        <WebView
          shouldInterceptRequest={true}
          javaScriptEnabled={true}
          onError={(onError) => {
            if (onError.nativeEvent.code !== -1) {
              this.setState({ isConnected: false });
            }
          }}
          startInLoadingState={true}
          source={{ uri: linkUrl }}
          onNavigationStateChange={this._onNavigationStateChange}
          style={{ flex: 1 }}
          ref={(ref) => (this.webView = ref)}
          onLoadEnd={() => {
            this.setState({
              loading: false,
            });
          }}
          startInLoadingState={true}
        />
      </View>
    );
  }
}
