//Library:
import React, {useRef, useEffect, useState} from 'react';
import {View, SafeAreaView, StyleSheet, Linking, Alert} from 'react-native';
import WebView from 'react-native-webview';
import Pdf from 'react-native-pdf';

//Setup:
import {COLOR, SIZE, isIos} from '../../utils';

//Component:
import WebHeader from './items/WebHeader';
import {NetworkError} from '../../elements/NetworkError';
import {STRING} from '../../utils/constants/String';

const WebViewScreen = ({route}) => {
  const webViewRef = useRef(null);
  const headerRef = useRef(null);
  const [errorPDF, setStateErrorPDF] = useState(false);
  const {data} = route.params;

  useEffect(() => {
    return () => {};
  }, []);

  const INJECTED_JAVASCRIPT = `(function() {
    var cacheId = window.localStorage.getItem('user_id');
    var cachePw = window.localStorage.getItem('user_pw');
    document.getElementById("user_id").value = cacheId;
    document.getElementById("user_pw").value = cachePw;
    
   var userId =  document.getElementById("user_id");
   var userPw =  document.getElementById("user_pw");

   userId.addEventListener("blur", myBlurUserId, true);
   userPw.addEventListener("blur", myBlurUserPw, true);
   function myBlurUserId() {
    var idValue = document.getElementById("user_id").value;
    window.localStorage.setItem('user_id',idValue );
   
  }  
  function myBlurUserPw() {
    var pwValue = document.getElementById("user_pw").value;
    window.localStorage.setItem('user_pw',pwValue );
  }  
})();`;
  const onShouldStartLoadWithRequest = (request) => {
    // short circuit these
    if (
      !request.url ||
      // request.url.startsWith('http') ||
      request.url.startsWith('/') ||
      request.url.startsWith('#') ||
      request.url.startsWith('javascript') ||
      request.url.startsWith('about:blank')
    ) {
      return true;
    }

    // blocked blobs
    if (request.url.startsWith('blob')) {
      Alert.alert('Link cannot be opened.');
      return false;
    }

    // list of schemas we will allow the webview
    // to open natively
    if (
      request.url.startsWith('tel:') ||
      request.url.startsWith('mailto:') ||
      request.url.startsWith('maps:') ||
      request.url.startsWith('geo:') ||
      request.url.startsWith('sms:') ||
      request.url.startsWith('itms-appss:') ||
      request.url.includes('https://line.me/R/') ||
      request.url.startsWith('intent:')
    ) {
      Linking.openURL(request.url).catch((er) => {
        Alert.alert(STRINGS.something_wrong);
      });
      return false;
    }

    // let everything else to the webview
    return true;
  };

  const renderContent = () => {
    if (data.url.includes('.pdf')) {
      const source = {
        uri: encodeURI(data.url),
        cache: true,
      };
      if (errorPDF) {
        return <NetworkError title={STRING.network_error_try_again_later} />;
      }
      return (
        <View
          style={{
            height: SIZE.height(100),
            width: SIZE.width(100),
            justifyContent: 'flex-start',
            backgroundColor: COLOR.grey_300,
            alignItems: 'center',
          }}>
          <Pdf
            spacing={0}
            source={source}
            onError={(error) => {
              if (error) {
                setStateErrorPDF(true);
              }
            }}
            style={[
              styles.pdf,
              {
                height: isIos ? SIZE.height(80) : SIZE.height(83.8),
                width: SIZE.width(96),
                marginTop: SIZE.height(0.3),
              },
            ]}
          />
        </View>
      );
    }
    return (
      <WebView
        ref={webViewRef}
        source={{
          uri: encodeURI(data.url),
        }}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        containerStyle={{overflow: 'hidden'}} // Fix bug crash on some android devices
        style={{opacity: 0.99}} //Fix bug crash on some android devices
        allowFileAccessFromFileURLs={true}
        startInLoadingState={true}
        javaScriptEnabled={true}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        onMessage={(e) => {
          if (e.nativeEvent) {
          }
        }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        originWhitelist={['https://*', 'http://*', 'file://']}
        onNavigationStateChange={(navState) => {
          headerRef.current.onChangeNavigaton(navState);
        }}
        onError={(syntheticEvent) => {}}
      />
    );
  };

  return (
    <>
      <SafeAreaView style={{flex: 0, backgroundColor: COLOR.white}} />
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-start',
          backgroundColor: COLOR.white,
        }}>
        <WebHeader webView={webViewRef} ref={headerRef} />
        {renderContent()}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.white,
  },
  pdf: {
    width: '100%',
    height: '50%',
    paddingTop: 0,
    backgroundColor: COLOR.white,
  },
});
export default WebViewScreen;
