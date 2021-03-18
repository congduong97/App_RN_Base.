import AsyncStorage from '@react-native-community/async-storage';
import { keyAsyncStorage, isIOS, versionApp, SYSTEAM_VERSION, APP_ID, APP, managerAcount, stateSercurity } from '../../const/System';
import { Api } from '../../service';
import { clickNotification } from '../../container/HomeScreen/SetUpNotifications';
import { CheckDataApp } from './service';
// import console = require('console');
// import console = require('console');
// import console = require('console');
let loadAppVersion = false;
let loadUpdateDataApp = false;
let neadUpdateApp = false;
export const checkVersionAllApp = async () => {

    if (loadAppVersion || neadUpdateApp) {
        return;
    }
    loadAppVersion = true;
    try {
        const response = await Api.checkVersion();
        if (response.code == 200) {
            const { appId, osAnroid, osIos, versionAndroid, versionIos, statusIos, statusAndroid, messengerAndroid, messengerIos } = response.res;
            const version = isIOS ? versionIos : versionAndroid;
            AsyncStorage.setItem(keyAsyncStorage.versionApp, JSON.stringify(response.res));

            if (parseFloat(version.replace(/\./g, '')) > parseFloat(versionApp.replace(/\./g, '')) && appId == APP_ID && (isIOS ? statusIos : statusAndroid) ) {
                neadUpdateApp = true;
                const messageUpdate = isIOS ? messengerIos : messengerAndroid;
                CheckDataApp.set({ type: 'UPDATE_APP', messageUpdateApp: messageUpdate })
            }

        } else {
        }
    } catch (e) {
        // console.log('e', e)

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
        // console.log('resUpdateData', resUpdateData)
        if (resUpdateData.code === 200 && resUpdateData.res.status.code === 1000) {
            if (resUpdateData.res.data.change) {
                const { appInfoDto, colorInfoDto, imageInfoDto, menuInfoDto, slideInfoDto, termInfoDto, policyInfoDto, groupBannerDto, onSecurityIOS, onSecurityAndroid, onSendOTPByEmailIOS, onSendOTPByEmailAndroid,maxNumberOfConsecutiveSmsByPhone, namespace } = resUpdateData.res.data.checkAppData;
                const responseAppInfroDto = await AsyncStorage.getItem('mobileApp')
                if ((stateSercurity.onSecurityIOS !== onSecurityIOS && onSecurityIOS!== undefined ) ||
                    (stateSercurity.onSecurityAndroid !== onSecurityAndroid && onSecurityAndroid!==undefined ) ||
                     (stateSercurity.onSendOTPByEmailIOS !== onSendOTPByEmailIOS  && onSendOTPByEmailIOS!== undefined)||
                      (stateSercurity.onSendOTPByEmailAndroid !== onSendOTPByEmailAndroid && onSendOTPByEmailAndroid!==undefined) ||
                       (stateSercurity.maxNumberOfConsecutiveSmsByPhone!== maxNumberOfConsecutiveSmsByPhone && maxNumberOfConsecutiveSmsByPhone !== undefined)
                         (stateSercurity.namespace !== namespace && namespace !== undefined)
                       ) {
                     
                    stateSercurity.onSecurityIOS = onSecurityIOS
                    stateSercurity.onSecurityAndroid = onSecurityAndroid
                    stateSercurity.onSecurity = isIOS ? onSecurityIOS : onSecurityAndroid
                    stateSercurity.onSendOTPByEmail = isIOS ? onSendOTPByEmailIOS : onSendOTPByEmailAndroid
                    stateSercurity.onSendOTPByEmailIOS = onSendOTPByEmailIOS
                    stateSercurity.onSendOTPByEmailAndroid = onSendOTPByEmailAndroid
                    stateSercurity.maxNumberOfConsecutiveSmsByPhone = maxNumberOfConsecutiveSmsByPhone
                    stateSercurity.namespace = namespace


                    updateData = true;
                    await AsyncStorage.setItem(keyAsyncStorage.stateSercurity, JSON.stringify(stateSercurity))



                }
                if (appInfoDto && appInfoDto.change && responseAppInfroDto !== JSON.stringify(appInfoDto.appDataDto)) {
                    // console.log('appInfoDto.change')
                    // console.log('responseAppInfroDto')
                    await AsyncStorage.setItem('mobileApp', JSON.stringify(appInfoDto.appDataDto));
                    APP.IMAGE_LOGO = appInfoDto.appDataDto.logo;
                    // APP
                    updateData = true;

                }
                const responsePolicy = await AsyncStorage.getItem('policy');
                if (policyInfoDto && policyInfoDto.change && responsePolicy !== policyInfoDto.policyEntity.content) {
                    // console.log('policy')
                    // console.log('responseAppInfroDto')


                    await AsyncStorage.setItem('policy', policyInfoDto.policyEntity.content);
                    updateData = true;

                }
                const responseAppColor = await AsyncStorage.getItem('appColor')
                if (colorInfoDto && colorInfoDto.change && responseAppColor !== JSON.stringify(colorInfoDto.colorDataDto.colorEntities)) {
                    await AsyncStorage.setItem('appColor', JSON.stringify(colorInfoDto.colorDataDto.colorEntities));
                    // console.log('appColor')
                    // console.log('appColor')


                    updateData = true;

                }
                const introducing = await AsyncStorage.getItem('introducing')
                if (imageInfoDto && imageInfoDto.change && introducing !== JSON.stringify(imageInfoDto.imageDataDto.introducingImages)) {
                    if (introducing) {
                        const introducingConvert = JSON.parse(introducing).map(item => {
                            return {
                                id: item.id,
                                url: item.url
                            }
                        })
                        const introducingImagesConvert = imageInfoDto.imageDataDto.introducingImages.map(item => {
                            return {
                                id: item.id,
                                url: item.url
                            }
                        })
                        if (introducingConvert.length !== introducingImagesConvert.length || JSON.stringify(introducingConvert) !== JSON.stringify(introducingImagesConvert)) {
                            await AsyncStorage.setItem('introducing', JSON.stringify(imageInfoDto.imageDataDto.introducingImages));
                            updateData = true;
                        }
                    }


                }
                if (menuInfoDto && menuInfoDto.change) {
                    const menu = await AsyncStorage.getItem('menu')
                    if (menu !== JSON.stringify(menuInfoDto.menuDataDto.parentMenuDto)) {
                        const rowSize = JSON.parse(menu).rowSize
                        const menuConvert = JSON.parse(menu).menuEntities.map(item => {
                            return {
                                active: item.active,
                                iconUrl: item.iconUrl,
                                id: item.id,
                                linkApplyBanner: item.linkApplyBanner,
                                name: item.name,
                                type: item.type,
                                typeFunctionMenu: item.typeFunctionMenu,
                                functionNAME: item.function,
                                typeOpen: item.typeOpen,
                                typeUrl: item.typeUrl,
                                url: item.url,
                                urlAndroid: item.urlAndroid,
                                urlAppstore: item.urlAppstore,
                                urlCHPlay: item.urlCHPlay,
                                urlIOS: item.urlIOS,
                            }
                        })
                        const menuEntitiesConvert = menuInfoDto.menuDataDto.parentMenuDto.menuEntities.map(item => {
                            return {
                                active: item.active,
                                iconUrl: item.iconUrl,
                                id: item.id,
                                linkApplyBanner: item.linkApplyBanner,
                                name: item.name,
                                type: item.type,
                                typeFunctionMenu: item.typeFunctionMenu,
                                functionNAME: item.function,
                                typeOpen: item.typeOpen,
                                typeUrl: item.typeUrl,
                                url: item.url,
                                urlAndroid: item.urlAndroid,
                                urlAppstore: item.urlAppstore,
                                urlCHPlay: item.urlCHPlay,
                                urlIOS: item.urlIOS,
                            }
                        })
                        const rowSizeMenu = menuInfoDto.menuDataDto.parentMenuDto.rowSize
                        if (rowSize !== rowSizeMenu || menuConvert.length !== menuEntitiesConvert.length || JSON.stringify(menuEntitiesConvert) !== JSON.stringify(menuConvert)) {
                            await AsyncStorage.setItem('menu', JSON.stringify(menuInfoDto.menuDataDto.parentMenuDto));
                            // console.log('menu')

                            updateData = true;
                        }



                    }
                    const bottomMenu = await AsyncStorage.getItem('bottomMenu')
                    if (bottomMenu !== JSON.stringify(menuInfoDto.menuDataDto.bottomMenuDto)) {
                        const bottomMenuConvert = JSON.parse(bottomMenu).menuEntities.map(item => {
                            return {
                                active: item.active,
                                iconUrl: item.iconUrl,
                                id: item.id,
                                linkApplyBanner: item.linkApplyBanner,
                                name: item.name,
                                type: item.type,
                                typeFunctionMenu: item.typeFunctionMenu,
                                functionNAME: item.function,
                                typeOpen: item.typeOpen,
                                typeUrl: item.typeUrl,
                                url: item.url,
                                urlAndroid: item.urlAndroid,
                                urlAppstore: item.urlAppstore,
                                urlCHPlay: item.urlCHPlay,
                                urlIOS: item.urlIOS,
                            }
                        })
                        const show = JSON.parse(bottomMenu).show
                        const bottomMenuDtoConvert = menuInfoDto.menuDataDto.bottomMenuDto.menuEntities.map(item => {
                            return {
                                active: item.active,
                                iconUrl: item.iconUrl,
                                id: item.id,
                                linkApplyBanner: item.linkApplyBanner,
                                name: item.name,
                                type: item.type,
                                typeFunctionMenu: item.typeFunctionMenu,
                                functionNAME: item.function,
                                typeOpen: item.typeOpen,
                                typeUrl: item.typeUrl,
                                url: item.url,
                                urlAndroid: item.urlAndroid,
                                urlAppstore: item.urlAppstore,
                                urlCHPlay: item.urlCHPlay,
                                urlIOS: item.urlIOS,
                            }
                        })
                        const showBottomMenuDto = menuInfoDto.menuDataDto.bottomMenuDto.show
                        // console.log('bottomMenuConvert',bottomMenuConvert)
                        // console.log('bottomMenuDtoConvert',bottomMenuDtoConvert)
                        if (show !== showBottomMenuDto || bottomMenuConvert.length !== bottomMenuDtoConvert.length || JSON.stringify(bottomMenuConvert) !== JSON.stringify(bottomMenuDtoConvert)) {

                            await AsyncStorage.setItem('bottomMenu', JSON.stringify(menuInfoDto.menuDataDto.bottomMenuDto));
                            // console.log('bottomMenu')
                            updateData = true;

                        }




                    }
                    const iconNotification = await AsyncStorage.getItem('iconNotification')
                    if (iconNotification !== menuInfoDto.menuDataDto.companyNotificationIcon) {
                        await AsyncStorage.setItem('iconNotification', menuInfoDto.menuDataDto.companyNotificationIcon);
                        // console.log('iconNotification')

                        updateData = true;


                    }
                    const nameNotification = await AsyncStorage.getItem('nameNotification')
                    if (nameNotification !== menuInfoDto.menuDataDto.nameNotification) {
                        await AsyncStorage.setItem('nameNotification', menuInfoDto.menuDataDto.nameNotification);
                        // console.log('nameNotification')

                        updateData = true;

                    }

                    const namePushNotification = await AsyncStorage.getItem('namePushNotification')
                    if (namePushNotification !== menuInfoDto.menuDataDto.namePushNotification) {
                        await AsyncStorage.setItem('namePushNotification', menuInfoDto.menuDataDto.namePushNotification);
                        // console.log('namePushNotification')

                        updateData = true;

                    }
                    const iconPushNotification = await AsyncStorage.getItem('iconPushNotification')
                    if (iconPushNotification !== menuInfoDto.menuDataDto.pushNotificationIcon) {
                        await AsyncStorage.setItem('iconPushNotification', menuInfoDto.menuDataDto.pushNotificationIcon);
                        // console.log('iconPushNotification')

                        updateData = true;
                    }
                    const subMenu = await AsyncStorage.getItem('subMenu')
                    if (subMenu !== JSON.stringify(menuInfoDto.menuDataDto.subMenuDto.menuEntities)) {
                        const subMenuConvert = JSON.parse(subMenu).map(item => {
                            return {
                                active: item.active,
                                iconUrl: item.iconUrl,
                                id: item.id,
                                linkApplyBanner: item.linkApplyBanner,
                                name: item.name,
                                type: item.type,
                                typeFunctionMenu: item.typeFunctionMenu,
                                functionNAME: item.function,
                                typeOpen: item.typeOpen,
                                typeUrl: item.typeUrl,
                                url: item.url,
                                urlAndroid: item.urlAndroid,
                                urlAppstore: item.urlAppstore,
                                urlCHPlay: item.urlCHPlay,
                                urlIOS: item.urlIOS,
                            }
                        })
                        const subMenuDtoConvert = menuInfoDto.menuDataDto.subMenuDto.menuEntities.map(item => {
                            return {
                                active: item.active,
                                iconUrl: item.iconUrl,
                                id: item.id,
                                linkApplyBanner: item.linkApplyBanner,
                                name: item.name,
                                type: item.type,
                                typeFunctionMenu: item.typeFunctionMenu,
                                functionNAME: item.function,
                                typeOpen: item.typeOpen,
                                typeUrl: item.typeUrl,
                                url: item.url,
                                urlAndroid: item.urlAndroid,
                                urlAppstore: item.urlAppstore,
                                urlCHPlay: item.urlCHPlay,
                                urlIOS: item.urlIOS,
                            }
                        })
                        if (subMenuConvert.length !== subMenuDtoConvert.length || JSON.stringify(subMenuConvert) !== JSON.stringify(subMenuDtoConvert)) {

                            await AsyncStorage.setItem('subMenu', JSON.stringify(menuInfoDto.menuDataDto.subMenuDto.menuEntities));
                            // console.log('subMenu')
                            updateData = true;
                        }


                    }
                }
                if (slideInfoDto && slideInfoDto.change) {
                    const slider = await AsyncStorage.getItem('slider')
                    if (slider !== JSON.stringify(slideInfoDto.slideDataDto.sliderImageEntities)) {
                        const sliderConvert = JSON.parse(slider).map(item => {
                            return {
                                iconUrl: item.iconUrl,
                                id: item.id,
                                linkApplyBanner: item.linkApplyBanner,
                                name: item.name,
                                typeOpen: item.typeOpen,
                                openWithWebview: item.openWithWebview,
                                typeOpenLink: item.typeOpenLink,
                                url: item.url,
                                menuEntity: item.menuEntity ? {
                                    active: item.menuEntity.active,
                                    iconUrl: item.menuEntity.iconUrl,
                                    id: item.menuEntity.id,
                                    linkApplyBanner: item.menuEntity.linkApplyBanner,
                                    name: item.menuEntity.name,
                                    type: item.menuEntity.type,
                                    typeFunctionMenu: item.menuEntity.typeFunctionMenu,
                                    functionNAME: item.menuEntity.function,
                                    typeOpen: item.menuEntity.typeOpen,
                                    typeUrl: item.menuEntity.typeUrl,
                                    url: item.menuEntity.url,
                                    urlAndroid: item.menuEntity.urlAndroid,
                                    urlAppstore: item.menuEntity.urlAppstore,
                                    urlCHPlay: item.menuEntity.urlCHPlay,
                                    urlIOS: item.menuEntity.urlIOS,
                                } : null

                            }
                        })
                        const slideDataDtoConvert = slideInfoDto.slideDataDto.sliderImageEntities.map(item => {
                            return {
                                iconUrl: item.iconUrl,
                                id: item.id,
                                linkApplyBanner: item.linkApplyBanner,
                                name: item.name,
                                typeOpen: item.typeOpen,
                                openWithWebview: item.openWithWebview,
                                typeOpenLink: item.typeOpenLink,
                                url: item.url,
                                menuEntity: item.menuEntity ? {
                                    active: item.menuEntity.active,
                                    iconUrl: item.menuEntity.iconUrl,
                                    id: item.menuEntity.id,
                                    linkApplyBanner: item.menuEntity.linkApplyBanner,
                                    name: item.menuEntity.name,
                                    type: item.menuEntity.type,
                                    typeFunctionMenu: item.menuEntity.typeFunctionMenu,
                                    functionNAME: item.menuEntity.function,
                                    typeOpen: item.menuEntity.typeOpen,
                                    typeUrl: item.menuEntity.typeUrl,
                                    url: item.menuEntity.url,
                                    urlAndroid: item.menuEntity.urlAndroid,
                                    urlAppstore: item.menuEntity.urlAppstore,
                                    urlCHPlay: item.menuEntity.urlCHPlay,
                                    urlIOS: item.menuEntity.urlIOS,
                                } : null

                            }
                        })
                        if (slideDataDtoConvert.length !== sliderConvert.length || JSON.stringify(slideDataDtoConvert) !== JSON.stringify(sliderConvert)) {
                            await AsyncStorage.setItem('slider', JSON.stringify(slideInfoDto.slideDataDto.sliderImageEntities));
                            // console.log('slider')

                            updateData = true;
                        }
                        // if(sliderConvert.length !== slie)


                    }
                }
                if (termInfoDto && termInfoDto.change) {
                    const termInfo = await AsyncStorage.getItem('termInfo')
                    // console.log('termInfo',termInfo)
                    // console.log('termInfoDto.termOfUseEntity.content',termInfoDto.termOfUseEntity.content)
                    if (termInfo !== termInfoDto.termOfUseEntity.content) {
                        await AsyncStorage.setItem('termInfo', termInfoDto.termOfUseEntity.content);
                        // console.log('termInfo')

                        updateData = true;
                    }
                }
                if (groupBannerDto && groupBannerDto.change) {
                    const groupBanner = await AsyncStorage.getItem('groupBanner')

                    if (!groupBanner || groupBanner === 'null' && groupBannerDto.groupBannerEntity) {
                        await AsyncStorage.setItem('groupBanner', JSON.stringify(groupBannerDto.groupBannerEntity));
                        updateData = true;
                        // console.log('groupBanner')


                    }
                    if (groupBanner && groupBanner !== 'null' && groupBannerDto.groupBannerEntity) {
                        const { active, url, id } = groupBannerDto.groupBannerEntity
                        const banner = JSON.parse(groupBanner)


                        if (banner && (banner.active !== active || banner.url !== url || banner.id !== id)) {

                            await AsyncStorage.setItem('groupBanner', JSON.stringify(groupBannerDto.groupBannerEntity));
                            updateData = true;
                            // console.log('groupBanner')

                        }

                    }
                    if (!groupBannerDto.groupBannerEntity && groupBanner && groupBanner !== 'null') {
                        await AsyncStorage.setItem('groupBanner', JSON.stringify(groupBannerDto.groupBannerEntity));
                        updateData = true;
                        // console.log('groupBanner')

                    }


                }
                if (updateData && !neadUpdateApp && !clickNotification.status) {
                    CheckDataApp.set({ type: 'UPDATE_DATA_APP' })
                }
            }
        }
    } catch (error) {
        // console.log('errr', error)

    } finally {
        loadUpdateDataApp = false;
    }
};
