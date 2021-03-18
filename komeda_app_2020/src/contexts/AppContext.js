import React, {useState} from 'react';
import {COLOR, APP_ID} from '../utils';
import AsyncStorage from '@react-native-community/async-storage';
import {AsyncStoreKey} from '../utils';
import {BottomService} from '../navigators/services/BottomService';

const ContextContainer = React.createContext();
const AppContext = (props) => {
  //Khởi tạo dữ liệu ban đầu cho toàn bộ cấu hình App 1:
  const [appData, setData] = useState({
    logoApp: '',
    policy: '',
    colorApp: {
      //Màu nền của toàn bộ các màn hình APP:
      backgroundColor: COLOR.main_background,
      //Màu chữ mặc định toàn bộ APP:
      textColor: COLOR.black,

      //Nút bấm active:
      textColorButton: COLOR.white,
      borderColorButton: COLOR.main,
      backgroundColorButton: COLOR.main_color,

      //Nút bấm disable:
      textColorOutlineButton: COLOR.main_color,
      borderColorOutlineButton: COLOR.main_color,
      backgroundColorOutlineButton: COLOR.white,

      //Tabbar Active:
      activedTextTab: COLOR.white,
      activedBorderTab: COLOR.red,
      activeTabBackground: COLOR.red,

      //TabBar Disable:
      inactivedTextTab: COLOR.red,
      inactivedBorderTab: COLOR.red,
      inactiveTabBackground: COLOR.white,
    },
    homeBottomMenu: [],
    isShowBottom: true,
    homeSubMenu: [],
    homeParentMenu: [],
    homeDrawerMenu: [],
    homeSlider: [],
    homeBanner: [],
    appIntroImage: [],
    alwaysDisplayIntroducingImage: null,
    footerNewMemeber: '',
  });

  //Cấu hình App:
  const setAppData = async (data) => {
    const ojbSetupSecurityAndCertificate = {
      usingFakePointCertificate: data.usingFakePoint,
      usingSecurityAndroid: data.usingSecurityAndroid,
      usingSecurityIos: data.usingSecurityIos,
    };

    await AsyncStorage.setItem(
      AsyncStoreKey.setup_secu_and_certy,
      JSON.stringify(ojbSetupSecurityAndCertificate),
    );
    const currentVersion = await AsyncStorage.getItem(
      AsyncStoreKey.currentVersion1,
    );
    const versionAppSave = currentVersion ? currentVersion : 0;
    if (versionAppSave < data.version) {
      const redefinedData = redefinedDataForApp(data);
      const dataForApp = JSON.stringify(redefinedData);
      AsyncStorage.setItem(
        AsyncStoreKey.currentVersion1,
        JSON.stringify(data.version),
      );
      await AsyncStorage.setItem(APP_ID, dataForApp);
      if (redefinedData.alwaysDisplayIntroducingImage) {
        AsyncStorage.setItem(
          AsyncStoreKey.alwaysDisplayIntroducingImage,
          'always',
        );
      } else {
        AsyncStorage.setItem(
          AsyncStoreKey.alwaysDisplayIntroducingImage,
          'one',
        );
      }
      setData(redefinedData);
    } else {
      const dataForApp = await AsyncStorage.getItem(APP_ID);
      setData(JSON.parse(dataForApp));
    }
  };

  //Hàm để xác định lại tất cả định dạng tất cả các thuộc tính sẽ dùng trong app:redefined
  const redefinedDataForApp = (dataSetup) => {
    const {
      sliderImages,
      bannerImages,
      introducingImages,
      colorDataDto,
      menuDataDto,
      appInfoDto,
      termOfUse,
      footerNewMember,
      usingFakePoint,
      usingSecurityAndroid,
      usingSecurityIos,
    } = dataSetup;

    const {colorEntities} = colorDataDto;
    const {parentMenuDto, subMenuDto, bottomMenuDto} = menuDataDto;

    return {
      logoApp: appInfoDto.logo,
      policy: termOfUse.content,
      colorApp: {
        backgroundColor:
          colorEntities.backgroundColor.backgroundColor ||
          COLOR.main_background,
        textColor: colorEntities.textColor.textColor || COLOR.black,

        textColorButton: colorEntities.buttonColor.textColor || COLOR.white,
        borderColorButton: colorEntities.buttonColor.borderColor || COLOR.red,
        backgroundColorButton:
          colorEntities.buttonColor.backgroundColor || COLOR.red,

        textColorOutlineButton:
          colorEntities.buttonOutlineColor.textColor || COLOR.red,
        borderColorOutlineButton:
          colorEntities.buttonOutlineColor.borderColor || COLOR.red,
        backgroundColorOutlineButton:
          colorEntities.buttonOutlineColor.backgroundColor || COLOR.white,

        activedTextTab: colorEntities.panelActiveColor.textColor || COLOR.white,
        activedBorderTab:
          colorEntities.panelActiveColor.borderColor || COLOR.red,
        activeTabBackground:
          colorEntities.panelActiveColor.backgroundColor || COLOR.red,

        inactivedTextTab: colorEntities.panelActiveColor.textColor || COLOR.red,
        inactivedBorderTab:
          colorEntities.panelActiveColor.borderColor || COLOR.red,
        inactiveTabBackground:
          colorEntities.panelDeactiveColor.backgroundColor || COLOR.white,
      },
      homeBottomMenu: bottomMenuDto.menuEntities || [],
      isShowBottom: bottomMenuDto.show,
      homeSubMenu: subMenuDto.menuEntities || [],
      homeMainMenu: Object.values(parentMenuDto.menuEntities) || [],
      homeSlider: sliderImages || [],
      homeBanner: bannerImages || [],
      appIntroImage: introducingImages || [],
      alwaysDisplayIntroducingImage: appInfoDto.alwaysDisplayIntroducingImage,
      footerNewMemeber: footerNewMember,
      usingFakePointCertificate: usingFakePoint,
      usingSecurityAndroid: usingSecurityAndroid,
      usingSecurityIos: usingSecurityIos,
    };
  };

  return (
    <ContextContainer.Provider value={{...appData, setAppData}}>
      {props.children}
    </ContextContainer.Provider>
  );
};

export {AppContext, ContextContainer};
