import React from 'react';
import {Platform} from 'react-native';
import {WebView} from 'react-native-webview';
import {displayName as appName} from '../../../app.json';
import {ScreensView} from '../../components';

export default function IntroductionScreen(props) {
  const injectedJavaScript = `
  document.getElementsByTagName('h1')[0].style.fontSize = '30px';
  document.getElementsByClassName('h2')[0].style.fontSize = '2rem';
  document.getElementsByClassName('height-250')[0].style.height = '0px';
  document.getElementsByClassName('height-250')[1].style.height = '0px';
  document.getElementsByClassName("header")[0].style.display = "none";
  document.getElementsByClassName("category-section")[0].style.display = "none";
  `;
  return (
    <ScreensView titleScreen={appName}>
      <WebView
        source={{uri: 'http://simthanhdat.vn/gioi-thieu'}}
        injectedJavaScript={injectedJavaScript}
        javaScriptEnabled={true}
        scalesPageToFit={Platform.OS === 'ios' ? false : true}
      />
    </ScreensView>
  );
}
