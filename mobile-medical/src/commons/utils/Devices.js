import { Dimensions, Platform, NativeModules } from "react-native";
import DeviceInfo from "react-native-device-info";
import Dimension from "../constants/Dimension";

const windowSize = Dimensions.get("window");
const navBarHeight = Platform.OS === "ios" ? 72 : 50;
const ratioW = windowSize.width / 375;
const ratioH = windowSize.height / 667;
const ratio = Math.min(ratioW, ratioH);

const ratioWTemplate = windowSize.width / 640;
const scaleTemplate = 640 / 1014;

const guidelineBaseWidth = 360;
const guidelineBaseHeight = 592;
const { height, width } = Dimensions.get("window");
const SCREEN_HEIGHT = height;
const SCREEN_WIDTH = width;

const scale = (size) => (width / guidelineBaseWidth) * size;
const verticalScale = (size) => (height / guidelineBaseHeight) * size;
const widthPercent = (percent) => (width * percent) / 100;

const heightSheet = (
  dataSheet,
  heightRow = Dimension.heightDefault,
  offset = 30
) => {
  if (dataSheet && dataSheet.length > 0) {
    let hSheet =
      (dataSheet.length + 3) * heightRow < SCREEN_HEIGHT
        ? (dataSheet.length + 3) * heightRow + Dimension.margin5
        : SCREEN_HEIGHT - offset;
    return hSheet;
  }
  return 0;
};

const deviceLanguage =
  Platform.OS === "ios"
    ? NativeModules.SettingsManager.settings.AppleLocale ||
      NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
    : NativeModules.I18nManager.localeIdentifier;

export {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  scale,
  windowSize,
  navBarHeight,
  ratioW,
  scaleTemplate,
  ratioWTemplate,
  ratioH,
  ratio,
  deviceLanguage,
  verticalScale,
  widthPercent,
  heightSheet,
};
