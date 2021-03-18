import React, {useState} from 'react';
import {COLOR, APP_ID1} from '../utils';
import AsyncStorage from '@react-native-community/async-storage';
import {AsyncStoreKey} from '../utils';
import {AppIdService} from '../utils/services/AppIdService';
import ServicesUpdateComponent from '../utils/services/ServicesUpdateComponent';

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
    homeSubMenu: [],
    homeParentMenu: [],
    homeDrawerMenu: [],
    homeSlider: [],
    homeBanner: [],
    appIntroImage: [],
    alwaysDisplayIntroducingImage: null,
    footerNewMemeber: '',
  });

  //Cấu hình App 1:
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
    const appId = AppIdService.get();
    const versionAppSave = currentVersion ? currentVersion : 0;
    if (versionAppSave < data.version) {
      const redefinedData = redefinedDataForApp(data);
      const dataForApp = JSON.stringify(redefinedData);
      AsyncStorage.setItem(
        AsyncStoreKey.currentVersion1,
        JSON.stringify(data.version),
      );
      await AsyncStorage.setItem(appId, dataForApp);
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
      ServicesUpdateComponent.set('UPDATE_CONFIG_APP1');
    } else {
      const dataForApp = await AsyncStorage.getItem(appId);
      setData(JSON.parse(dataForApp));
    }
  };

  //Cấu hình App 2:
  const setAppData2 = async (dataApp2) => {
    const currentVersion = await AsyncStorage.getItem(
      AsyncStoreKey.currentVersion2,
    );
    const versionAppSave = currentVersion ? currentVersion : 0;
    const appId = AppIdService.get();

    if (versionAppSave < dataApp2.version) {
      const redefinedData = redefinedDataForApp(dataApp2);
      AsyncStorage.setItem(
        AsyncStoreKey.currentVersion2,
        JSON.stringify(dataApp2.version),
      );

      const dataForApp1 = await AsyncStorage.getItem(APP_ID1);
      const {
        policy,
        alwaysDisplayIntroducingImage,
        appIntroImage,
        footerNewMemeber,
      } = JSON.parse(dataForApp1);
      const logoApp = dataApp2.appInfoDto.logo;
      const changeData = {
        ...redefinedData,
        logoApp,
        policy,
        appIntroImage,
        alwaysDisplayIntroducingImage,
        footerNewMemeber,
      };
      ServicesUpdateComponent.set('UPDATE_CONFIG_APP2');
      AsyncStorage.setItem(appId, JSON.stringify(changeData));
      setData(changeData);
    } else {
      const dataForApp1 = await AsyncStorage.getItem(APP_ID1);
      const {
        policy,
        alwaysDisplayIntroducingImage,
        appIntroImage,
        footerNewMemeber,
      } = JSON.parse(dataForApp1);
      let dataForApp = await AsyncStorage.getItem(appId);

      const dataParse = JSON.parse(dataForApp);
      dataForApp = {
        ...dataParse,
        policy,
        alwaysDisplayIntroducingImage,
        appIntroImage,
        footerNewMemeber,
      };
      setData(dataForApp);
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
    <ContextContainer.Provider value={{...appData, setAppData2, setAppData}}>
      {props.children}
    </ContextContainer.Provider>
  );
};

export {AppContext, ContextContainer};
