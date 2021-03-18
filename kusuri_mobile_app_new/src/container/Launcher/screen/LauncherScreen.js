import React, { PureComponent } from "react";
import { View, StyleSheet, Alert, Linking } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
// import SplashScreen from 'react-native-smart-splash-screen';

import Orientation from "react-native-orientation";
// console.log('aaaaa', DEVICE_ID);

import { setColor } from "../util/setColor";
import {
  APP,
  isIOS,
  keyAsyncStorage,
  versionApp,
  managerAccount,
  SYSTEAM_VERSION,
} from "../../../const/System";
import { COLOR_WHITE } from "../../../const/Color";
import { Api } from "../util/api";
import { NetworkError, Loading } from "../../../commons";
import { pushResetScreen } from "../../../util";
import { setTabScreen } from "../util/setTabScreen";
import { setSetting } from "../util/setSetting";
import { STRING } from "../util/string";
import { UpdateApp } from "../item/UpdateApp";

import SplashScreen from "react-native-splash-screen";
import { getNewInfoAccount } from "../../Account/util/service";
import { ShopSdk } from "../../../service/ShopSdk";
import MaintainView from "../../../commons/MaintainView";

const loadAppDetailSuccess = false;
let loadRegisterDevive = false;
export default class Launcher extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      networkError: false,
      isTime: false,
      progressValue: 0.1,
      loading: true,
      firstLauching: true,
      maintain: false,
      needUpdate: false,
      messageUpdate: "",
    };

    //init sdk
    ShopSdk.init();

    this.renderContent = this.renderContent.bind(this);
  }
  componentDidMount() {
    Orientation.lockToPortrait();
    SplashScreen.hide();

    // SplashScreen.close({
    //     animationType: SplashScreen.animationType.scale,
    //     duration: 850,
    //     delay: 1000,
    // });
    this.callApiFirtOppenApp();

    // AsyncStorage.getItem('deviceToken')
  }
  componentWillUnmount() {
    this.state.firstLauching = false;
  }

  callApiFirtOppenApp = async () => {
    try {
      this.setState({
        loading: true,
        needUpdate: false,
        maintain: false,
        networkError: false,
      });
      const error = await this.checkMaintain();
      if (error === false) {
        // alert('ok')
        const checkPushDeviceToken = await this.pushDeviceTokenFake();
        if (checkPushDeviceToken) {
          // alert('ok')

          await this.checkVersionApp();
        } else {
          this.state.networkError = true;
        }
      } else {
        if (error === "maintain") {
          this.state.maintain = true;
        } else {
          this.state.networkError = true;
        }
      }
    } catch (e) {
      // alert(JSON.stringify(e))
      // console.log('err', e);
      this.state.networkError = true;
    } finally {
      this.setState({ loading: false });
    }
  };

  onMounted = async () => {
    this.setState({ networkError: false });
    this.getApi();
  };

  getApi = async () => {
    const firstDownload = await AsyncStorage.getItem(
      keyAsyncStorage.firstDownload
    );
    let loadError = false;

    // alert('getApi')

    try {
      const resUpdateData = await Api.checkUpdateApp(0);
      console.log("Call mấy lần", resUpdateData);
      if (
        resUpdateData.code === 200 &&
        resUpdateData.res.status.code === 1000
      ) {
        this.state.firstLauching = false;
        if (resUpdateData.res.data.change) {
          const {
            appInfoDto,
            colorInfoDto,
            imageInfoDto,
            menuInfoDto,
            slideInfoDto,
            termInfoDto,
            bannerDto,
            usingSms,
            usingSMSIos,
            usingSMSAndroid,
          } = resUpdateData.res.data.checkAppData;
          await AsyncStorage.setItem(
            keyAsyncStorage.usingSms,
            `${isIOS ? usingSMSIos : usingSMSAndroid}`
          );

          if (appInfoDto.change) {
            await AsyncStorage.setItem(
              keyAsyncStorage.mobileApp,
              JSON.stringify(appInfoDto.appDataDto)
            );

            APP.IMAGE_LOGO = appInfoDto.appDataDto.logo;
          }
          if (colorInfoDto.change) {
            await AsyncStorage.setItem(
              keyAsyncStorage.appColor,
              JSON.stringify(colorInfoDto.colorDataDto.colorEntities)
            );
          }
          if (imageInfoDto.change) {
            await AsyncStorage.setItem(
              keyAsyncStorage.introducing,
              JSON.stringify(imageInfoDto.imageDataDto.introducingImages)
            );
          }
          if (menuInfoDto.change) {
            await AsyncStorage.setItem(
              keyAsyncStorage.menuInApp,
              JSON.stringify(menuInfoDto.menuDataDto)
            );
          }
          if (slideInfoDto.change) {
            await AsyncStorage.setItem(
              keyAsyncStorage.slider,
              JSON.stringify(slideInfoDto.slideDataDto.sliderImageEntities)
            );
          }
          if (termInfoDto.change) {
            await AsyncStorage.setItem(
              keyAsyncStorage.termInfo,
              termInfoDto.termOfUseEntity.content
            );
          }
          if (bannerDto.change) {
            await AsyncStorage.setItem(
              keyAsyncStorage.banner,
              JSON.stringify(bannerDto.bannerImageEntities)
            );
          }
          await AsyncStorage.setItem(keyAsyncStorage.firstDownload, "success");
        }
      } else {
        loadError = true;
      }
    } catch (err) {
      loadError = true;
      console.log("Lỗi", err);
    } finally {
      if (firstDownload || !loadError) {
        this.checkSlider();
      } else {
        this.setState({ networkError: true });
      }
    }
  };

  checkMaintain = async () => {
    try {
      const maintain = await Api.getMaintain();
      // console.log('maintain', maintain);
      if (maintain.code == 200) {
        return false;
      }
      if (maintain.code == 500) {
        return "maintain";
      }
      // ko call dc den server
    } catch (e) {
      return false;
    }
  };

  checkVersionLocal = async () => {
    try {
      const resversion = await AsyncStorage.getItem(keyAsyncStorage.versionApp);
      if (resversion) {
        const {
          linkIos,
          linkAndroid,
          versionAndroid,
          versionIos,
          statusIos,
          statusAndroid,
          messageIos,
          messageAndroid,
          osIos,
          osAndroid,
        } = JSON.parse(resversion);
        const version = isIOS ? versionIos : versionAndroid;
        if (
          version !== versionApp &&
          (isIOS ? statusIos : statusAndroid) &&
          parseFloat(SYSTEAM_VERSION) >= parseFloat(isIOS ? osIos : osAndroid)
        ) {
          const messageUpdate = isIOS ? messageIos : messageAndroid;
          this.setState({
            needUpdate: true,
            messageUpdate,
            linkUpdate: isIOS ? linkIos : linkAndroid,
          });
        } else {
          this.onMounted();
        }
      } else {
        this.onMounted();
      }
    } catch (e) {
      this.onMounted();
    }
  };

  checkVersionApp = async () => {
    try {
      const response = await Api.checkVersion();
      // console.log('response', response);
      if (response.code == 200) {
        const {
          versionAndroid,
          versionIos,
          statusIos,
          statusAndroid,
          messageAndroid,
          messageIos,
          linkIos,
          linkAndroid,
          osIos,
          osAndroid,
        } = response.res;
        const version = isIOS ? versionIos : versionAndroid;
        AsyncStorage.setItem(
          keyAsyncStorage.versionApp,
          JSON.stringify(response.res)
        );
        if (
          version !== versionApp &&
          (isIOS ? statusIos : statusAndroid) &&
          parseFloat(SYSTEAM_VERSION) >= parseFloat(isIOS ? osIos : osAndroid)
        ) {
          const messageUpdate = isIOS ? messageIos : messageAndroid;
          this.setState({
            needUpdate: true,
            messageUpdate,
            linkUpdate: isIOS ? linkIos : linkAndroid,
          });
        } else {
          // alert('ok')

          this.onMounted();
        }
      } else {
        this.onMounted();
      }
    } catch (e) {
      this.checkVersionLocal();
      return false;
    }
  };

  pushDeviceTokenFake = async () => {
    if (loadRegisterDevive) {
      return false;
    }
    loadRegisterDevive = true;
    try {
      const checkPushDevice = await AsyncStorage.getItem(
        keyAsyncStorage.deviceTokenFake
      );
      if (!checkPushDevice) {
        const response = await Api.pushRegisterDevice();

        if (response.code === 200 && response.res.status.code === 1000) {
          AsyncStorage.setItem(keyAsyncStorage.deviceTokenFake, "success");
          return true;
        }
        return false;
      }
      // alert('ok');

      return true;
    } catch (e) {
      // alert('e');
      return false;
    } finally {
      loadRegisterDevive = false;
    }
  };

  checkSlider = async () => {
    const { navigation } = this.props;

    // set AppColor
    // await setI18n();
    await setColor();
    await setTabScreen();
    await setSetting();
    const checkUserInfor = await getNewInfoAccount();
    if (!checkUserInfor) {
      this.setState({ networkError: true });
      return;
    }
    const isAgree = await AsyncStorage.getItem(keyAsyncStorage.isAgree);
    //firstLauching is used to make sure that app can only call getApi one time

    if (isAgree) {
      const mobileApp = await AsyncStorage.getItem(keyAsyncStorage.mobileApp);
      // console.log('mobileApp', mobileApp);
      if (JSON.parse(mobileApp).alwaysDisplayIntroducingImage === true) {
        pushResetScreen(navigation, "Over");
        return;
      }
      if (!managerAccount.userId) {
        pushResetScreen(navigation, "EnterMemberCodeScreen");
        return;
      }
      if (managerAccount.userId) {
        if (managerAccount.enablePasswordOppenApp && managerAccount.usingSms) {
          pushResetScreen(this.props.navigation, "EnterPasswordApp", {
            nameFunction: "HomeNavigator",
          });
          return;
        }
        pushResetScreen(this.props.navigation, "HomeNavigator");
        return;
      }
    } else {
      pushResetScreen(navigation, "Over");
    }
  };

  renderContent() {
    const {
      networkError,
      maintain,
      needUpdate,
      messageUpdate,
      linkUpdate,
    } = this.state;
    if (networkError) {
      return <NetworkError onPress={this.callApiFirtOppenApp} />;
    }
    if (maintain) {
      return <MaintainView onPress={this.callApiFirtOppenApp} />;
    }
    if (needUpdate) {
      return (
        <UpdateApp
          onPress={() => {
            Linking.openURL(linkUpdate);
          }}
          title={messageUpdate}
        />
      );
    }
    return <Loading size={40} />;
  }
  render() {
    return <View style={styles.container}>{this.renderContent()}</View>;
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLOR_WHITE,
  },
});
