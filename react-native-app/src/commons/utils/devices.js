import {Dimensions, Platform, NativeModules, StatusBar} from 'react-native';
import {isIphoneX} from 'react-native-iphone-x-helper';

const windowSize = Dimensions.get('window');
const navBarHeight = Platform.OS === 'ios' ? 72 : 50;
const ratioW = windowSize.width / 375;
const ratioH = windowSize.height / 667;

const ratio = Math.min(ratioW, ratioH);

const ratioWTemplate = windowSize.width / 640;
const scaleTemplate = 640 / 1014;

const guidelineBaseWidth = 360;
const guidelineBaseHeight = 592;
const {height, width} = Dimensions.get('window');
const setHeight = (height) => {
  return height * (height / 667);
};
const setWidth = (width) => {
  return width * (width / 375);
};
export const SCREEN_HEIGHT = height;
export const SCREEN_WIDTH = width;
const standardLength = width > height ? width : height;
const offset =
  width > height ? 0 : Platform.OS === 'ios' ? 78 : StatusBar.currentHeight; // iPhone X style SafeAreaView size in portrait

const scale = (size) => (width / guidelineBaseWidth) * size;
const verticalScale = (size) => (height / guidelineBaseHeight) * size;
export const widthPercent = (percent) => (width * percent) / 100;

const deviceLanguage =
  Platform.OS === 'ios'
    ? NativeModules.SettingsManager.settings.AppleLocale ||
      NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
    : NativeModules.I18nManager.localeIdentifier;

const deviceHeight =
  isIphoneX() || Platform.OS === 'android'
    ? standardLength - offset
    : standardLength;
export function fontsValue(value, standardScreenHeight = 680) {
  const heightPercent = (value * deviceHeight) / standardScreenHeight;
  return Math.round(heightPercent);
}

export {
  windowSize,
  navBarHeight,
  ratioW,
  scaleTemplate,
  ratioWTemplate,
  ratioH,
  ratio,
  deviceLanguage,
  setHeight,
  setWidth,
  verticalScale,
};
