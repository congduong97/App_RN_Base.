import { fontsValue } from "../utils";

export default {
  NAV_BAR_HEIGHT: fontsValue(50),
  

  NUMBER_ITEM_PAGE_DEFAULT: 30,
  NAME_APP: "Đặt lịch khám",

  ///////////
  margin5: fontsValue(5),
  margin: fontsValue(8),
  margin2x: fontsValue(16),
  margin3x: fontsValue(24),
  margin4x: fontsValue(32),
  padding5: fontsValue(5),
  padding: fontsValue(8),
  padding2x: fontsValue(16),
  padding4x: fontsValue(32),
  minHeight22: fontsValue(22),
  heightButton: fontsValue(44),
  heightButtonHome: fontsValue(60),
  heightDefault: fontsValue(40),
  heightInputView: fontsValue(44),
  
  lineHeightPopup: fontsValue(29),
  avatar: fontsValue(120),
  imageSlide: fontsValue(280),

  //icon
  sizeIconText: fontsValue(16),
  sizeIcon20: fontsValue(20),
  sizeIcon: fontsValue(24),
  sizeIconMenu: fontsValue(26),
  sizeIconHeader: fontsValue(40),

  ///Font
  fontSize10: fontsValue(10),
  fontSize12: fontsValue(12),
  fontSize14: fontsValue(14),
  fontSize16: fontsValue(16),
  fontSize18: fontsValue(18),
  fontSize20: fontsValue(20),
  fontSize22: fontsValue(22),
  fontSize24: fontsValue(24),

  fontSizeHeaderPopup: fontsValue(18),

  fontSizeButton16: fontsValue(16),
  fontSizeButton: fontsValue(14),
  fontSizeHeader: fontsValue(20),
  fontSizeMenu: fontsValue(16),

  ///
  radiusButton: fontsValue(16),
  radius: fontsValue(8),
  getHeight: (height) => {
    return fontsValue(height);
  },
};
