import AsyncStorage from "@react-native-community/async-storage";
import {
  keyAsyncStorage,
  isIOS,
  versionApp,
  SYSTEAM_VERSION,
  managerAccount,
} from "../../../const/System";
import { Api } from "./api";
import { Api as ApiAcount } from "../../Account/util/api";
import { clickNotification } from "../../Home/util/SetUpNotifications";
import { CheckDataApp } from "./service";
import NavigationService from "../../../service/NavigationService";
let loadAppVersion = false;
let loadUpdateDataApp = false;
let neadUpdateApp = false;
export const checkMemberCodeInBlacklist = async (memberCode) => {
  try {
    const response = await ApiAcount.isInActiveMember(memberCode);
    // console.log('response',response)
    if (response.code == 200 && response.res.status.code == 1026) {
      managerAccount.memberCodeInBlackList = true;
      CheckDataApp.set({ type: "MEMBER_CODE_IN_BLACKLIST" });

      AsyncStorage.setItem(
        keyAsyncStorage.managerAccount,
        JSON.stringify(managerAccount)
      );

      return true;
    }
    if (response.code == 200 && response.res.status.code == 1025) {
      managerAccount.memberCodeInBlackList = false;
      AsyncStorage.setItem(
        keyAsyncStorage.managerAccount,
        JSON.stringify(managerAccount)
      );
      return;
    }
  } catch (error) {}
};
export const checkVersionAllApp = async () => {
  if (loadAppVersion) {
    return;
  }
  loadAppVersion = true;
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
        neadUpdateApp = true;
        const messageUpdate = isIOS ? messageIos : messageAndroid;
        CheckDataApp.set({
          type: "UPDATE_APP",
          linkUpdateApp: isIOS ? linkIos : linkAndroid,
          messageUpdateApp: messageUpdate,
        });
        return true;
      }
    } else {
    }
  } catch (e) {
  } finally {
    loadAppVersion = false;
  }
};
export const checkUpdateDataApp = async () => {
  await checkVersionAllApp();

  let updateData = false;
  if (loadUpdateDataApp || neadUpdateApp || clickNotification.status) {
    return;
  }

  loadUpdateDataApp = true;
  try {
    const resUpdateData = await Api.checkUpdateApp(0);
    console.log("[resUpdateData]", resUpdateData);
    if (resUpdateData.code === 200 && resUpdateData.res.status.code === 1000) {
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

        if (appInfoDto.change) {
          const responseMobileApp = await AsyncStorage.getItem(
            keyAsyncStorage.mobileApp
          );
          if (responseMobileApp !== JSON.stringify(appInfoDto.appDataDto)) {
            await AsyncStorage.setItem(
              keyAsyncStorage.mobileApp,
              JSON.stringify(appInfoDto.appDataDto)
            );
            updateData = true;
          }
        }
        if (colorInfoDto.change) {
          const responseAppColor = await AsyncStorage.getItem(
            keyAsyncStorage.appColor
          );
          if (
            responseAppColor !==
            JSON.stringify(colorInfoDto.colorDataDto.colorEntities)
          ) {
            await AsyncStorage.setItem(
              keyAsyncStorage.appColor,
              JSON.stringify(colorInfoDto.colorDataDto.colorEntities)
            );
            updateData = true;
          }
        }
        if (imageInfoDto.change) {
          const responseIntroducingImage = await AsyncStorage.getItem(
            keyAsyncStorage.introducing
          );
          const responseIntroducingImageConvert = JSON.parse(
            responseIntroducingImage
          ).map((item) => {
            return { ...item, updatedTime: "", urlUpdated: "" };
          });
          const introducingImagesConvert = imageInfoDto.imageDataDto.introducingImages.map(
            (item) => {
              return { ...item, updatedTime: "", urlUpdated: "" };
            }
          );
          if (
            JSON.stringify(responseIntroducingImageConvert) !==
            JSON.stringify(introducingImagesConvert)
          ) {
            await AsyncStorage.setItem(
              keyAsyncStorage.introducing,
              JSON.stringify(imageInfoDto.imageDataDto.introducingImages)
            );
            updateData = true;
          }
        }
        if (menuInfoDto.change) {
          const responseMenuInApp = await AsyncStorage.getItem(
            keyAsyncStorage.menuInApp
          );
          const responseMenuInAppObject = JSON.parse(responseMenuInApp);

          ///
          const obj = responseMenuInAppObject.parentMenuDto.menuEntities;
          const mainMenu = Object.keys(obj).map((key) => obj[key]);

          const responseMenuInAppConvert = {
            ...responseMenuInAppObject,
            bottomMenuDto: {
              ...responseMenuInAppObject.bottomMenuDto,
              menuEntities: responseMenuInAppObject.bottomMenuDto.menuEntities.map(
                (item) => {
                  return {
                    ...item,
                    iconUrlUpdated: "",
                    nameUpdated: "",
                    typeDisplayUpdated: "",
                    typeFunctionMenuUpdated: "",
                    typeOpenUpdated: "",
                    typeUrlUpdated: "",
                    updatedTime: "",
                    urlUpdated: "",
                  };
                }
              ),
            },
            headerMenuDto: {
              ...responseMenuInAppObject.headerMenuDto,
              menuEntities: responseMenuInAppObject.headerMenuDto.menuEntities.map(
                (item) => {
                  return {
                    ...item,
                    iconUrlUpdated: "",
                    nameUpdated: "",
                    typeDisplayUpdated: "",
                    typeFunctionMenuUpdated: "",
                    typeOpenUpdated: "",
                    typeUrlUpdated: "",
                    updatedTime: "",
                    urlUpdated: "",
                  };
                }
              ),
            },
            subMenuDto: {
              ...responseMenuInAppObject.subMenuDto,
              menuEntities: responseMenuInAppObject.subMenuDto.menuEntities.map(
                (item) => {
                  return {
                    ...item,
                    iconUrlUpdated: "",
                    nameUpdated: "",
                    typeDisplayUpdated: "",
                    typeFunctionMenuUpdated: "",
                    typeOpenUpdated: "",
                    typeUrlUpdated: "",
                    updatedTime: "",
                    urlUpdated: "",
                  };
                }
              ),
            },
            parentMenuDto: {
              ...responseMenuInAppObject.parentMenuDto,
              menuEntities: mainMenu.map((item) => {
                const array = item.map((itemMenu) => {
                  return {
                    ...itemMenu,
                    iconUrlUpdated: "",
                    nameUpdated: "",
                    typeDisplayUpdated: "",
                    typeFunctionMenuUpdated: "",
                    typeOpenUpdated: "",
                    typeUrlUpdated: "",
                    updatedTime: "",
                    urlUpdated: "",
                  };
                });
                return array;
              }),
            },
          };

          const menuDataDtoObject = menuInfoDto.menuDataDto;
          ////
          const obj2 = menuDataDtoObject.parentMenuDto.menuEntities;
          const mainMenu2 = Object.keys(obj2).map((key) => obj2[key]);

          const menuDataDtoConvert = {
            ...menuDataDtoObject,
            bottomMenuDto: {
              ...menuDataDtoObject.bottomMenuDto,
              menuEntities: menuDataDtoObject.bottomMenuDto.menuEntities.map(
                (item) => {
                  return {
                    ...item,
                    iconUrlUpdated: "",
                    nameUpdated: "",
                    typeDisplayUpdated: "",
                    typeFunctionMenuUpdated: "",
                    typeOpenUpdated: "",
                    typeUrlUpdated: "",
                    updatedTime: "",
                    urlUpdated: "",
                  };
                }
              ),
            },
            headerMenuDto: {
              ...menuDataDtoObject.headerMenuDto,
              menuEntities: menuDataDtoObject.headerMenuDto.menuEntities.map(
                (item) => {
                  return {
                    ...item,
                    iconUrlUpdated: "",
                    nameUpdated: "",
                    typeDisplayUpdated: "",
                    typeFunctionMenuUpdated: "",
                    typeOpenUpdated: "",
                    typeUrlUpdated: "",
                    updatedTime: "",
                    urlUpdated: "",
                  };
                }
              ),
            },
            subMenuDto: {
              ...menuDataDtoObject.subMenuDto,
              menuEntities: menuDataDtoObject.subMenuDto.menuEntities.map(
                (item) => {
                  return {
                    ...item,
                    iconUrlUpdated: "",
                    nameUpdated: "",
                    typeDisplayUpdated: "",
                    typeFunctionMenuUpdated: "",
                    typeOpenUpdated: "",
                    typeUrlUpdated: "",
                    updatedTime: "",
                    urlUpdated: "",
                  };
                }
              ),
            },
            parentMenuDto: {
              ...menuDataDtoObject.parentMenuDto,
              menuEntities: mainMenu2.map((item) => {
                const array = item.map((itemMenu) => {
                  return {
                    ...itemMenu,
                    iconUrlUpdated: "",
                    nameUpdated: "",
                    typeDisplayUpdated: "",
                    typeFunctionMenuUpdated: "",
                    typeOpenUpdated: "",
                    typeUrlUpdated: "",
                    updatedTime: "",
                    urlUpdated: "",
                  };
                });
                return array;
              }),
            },
          };

          if (
            JSON.stringify(responseMenuInAppConvert) !==
            JSON.stringify(menuDataDtoConvert)
          ) {
            await AsyncStorage.setItem(
              keyAsyncStorage.menuInApp,
              JSON.stringify(menuInfoDto.menuDataDto)
            );
            updateData = true;
          }
        }
        if (slideInfoDto.change) {
          const responseSlider = await AsyncStorage.getItem(
            keyAsyncStorage.slider
          );
          const responseSliderConvert = JSON.parse(responseSlider).map(
            (item) => {
              return {
                ...item,
                deletedUpdated: "",
                endTimeUpdated: "",
                startTimeUpdated: "",
                toNumberUser: "",
                updatedTime: "",
                urlUpdated: "",
                menuEntityUpdated: "",
                menuEntity: item.menuEntity
                  ? {
                      ...item.menuEntity,
                      iconUrlUpdated: "",
                      nameUpdated: "",
                      typeDisplayUpdated: "",
                      typeFunctionMenuUpdated: "",
                      typeOpenUpdated: "",
                      typeUrlUpdated: "",
                      updatedTime: "",
                      urlUpdated: "",
                    }
                  : "",
              };
            }
          );
          const sliderImageEntitiesConvert = slideInfoDto.slideDataDto.sliderImageEntities.map(
            (item) => {
              return {
                ...item,
                deletedUpdated: "",
                endTimeUpdated: "",
                startTimeUpdated: "",
                toNumberUser: "",
                updatedTime: "",
                urlUpdated: "",
                menuEntityUpdated: "",
                menuEntity: item.menuEntity
                  ? {
                      ...item.menuEntity,
                      iconUrlUpdated: "",
                      nameUpdated: "",
                      typeDisplayUpdated: "",
                      typeFunctionMenuUpdated: "",
                      typeOpenUpdated: "",
                      typeUrlUpdated: "",
                      updatedTime: "",
                      urlUpdated: "",
                    }
                  : "",
              };
            }
          );

          if (
            JSON.stringify(responseSliderConvert) !==
            JSON.stringify(sliderImageEntitiesConvert)
          ) {
            await AsyncStorage.setItem(
              keyAsyncStorage.slider,
              JSON.stringify(slideInfoDto.slideDataDto.sliderImageEntities)
            );
            updateData = true;
          }
        }
        if (termInfoDto.change) {
          const responseTermInfo = await AsyncStorage.getItem(
            keyAsyncStorage.termInfo
          );
          if (responseTermInfo !== termInfoDto.termOfUseEntity.content) {
            await AsyncStorage.setItem(
              keyAsyncStorage.termInfo,
              termInfoDto.termOfUseEntity.content
            );
            updateData = true;
          }
        }
        if (bannerDto.change) {
          const responseBanner = await AsyncStorage.getItem(
            keyAsyncStorage.banner
          );
          const responseBannerConvert = JSON.parse(responseBanner).map(
            (item) => {
              return {
                ...item,
                endTimeUpdated: "",
                endTime: "",
                descriptionUpdated: "",
                endTime: "",
                endTimeUpdated: "",
                imageApplyUrlUpdated: "",
                imageUrlUpdated: "",
                linkWebviewUpdated: "",
                memoUpdated: "",
                menuEntityUpdated: "",
                noteUpdated: "",
                openWithWebviewUpdated: "",
                scriptUpdated: "",
                startTimeUpdated: "",
                typeUpdated: "",
                updatedTime: "",
              };
            }
          );
          const bannerImageEntities = bannerDto.bannerImageEntities.map(
            (item) => {
              return {
                ...item,
                endTimeUpdated: "",
                endTime: "",
                descriptionUpdated: "",
                endTime: "",
                endTimeUpdated: "",
                imageApplyUrlUpdated: "",
                imageUrlUpdated: "",
                linkWebviewUpdated: "",
                memoUpdated: "",
                menuEntityUpdated: "",
                noteUpdated: "",
                openWithWebviewUpdated: "",
                scriptUpdated: "",
                startTimeUpdated: "",
                typeUpdated: "",
                updatedTime: "",
              };
            }
          );

          if (
            JSON.stringify(responseBannerConvert) !==
            JSON.stringify(bannerImageEntities)
          ) {
            await AsyncStorage.setItem(
              keyAsyncStorage.banner,
              JSON.stringify(bannerDto.bannerImageEntities)
            );
            updateData = true;
          }
        }
        const responseusingSms = await AsyncStorage.getItem(
          keyAsyncStorage.usingSms
        );

        if (responseusingSms !== `${isIOS ? usingSMSIos : usingSMSAndroid}`) {
          await AsyncStorage.setItem(
            keyAsyncStorage.usingSms,
            `${isIOS ? usingSMSIos : usingSMSAndroid}`
          );
          updateData = true;
        }

        if (updateData && !neadUpdateApp && !clickNotification.status) {
          CheckDataApp.set({ type: "UPDATE_DATA_APP" });
          // alert('update')

          // NavigationService.navigate('UpdateDataScreen');
        }
      }
    }
  } catch (error) {
  } finally {
    loadUpdateDataApp = false;
  }
};
