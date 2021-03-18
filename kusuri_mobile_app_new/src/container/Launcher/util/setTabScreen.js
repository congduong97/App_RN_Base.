
import AsyncStorage from '@react-native-community/async-storage';
import { tab, keyAsyncStorage, menuInApp } from '../../../const/System';

const screen = {};
export const setTabScreen = async () => {
    const responseMenuInApp = await AsyncStorage.getItem(keyAsyncStorage.menuInApp);
    if (responseMenuInApp) {
        const res = JSON.parse(responseMenuInApp);
        const obj = res.parentMenuDto.menuEntities;
        const mainMenu = Object.keys(obj).map((key) => obj[key]);

        let listMainMenu = [];
        mainMenu.map((item) => {
            listMainMenu = [...listMainMenu, ...item];
        });
        menuInApp.mainMenu = mainMenu;
        menuInApp.listMainMenu = listMainMenu;
        menuInApp.nameNotification = res.nameNotification;
        menuInApp.iconNotification = res.companyNotificationIcon;
        menuInApp.namePushNotification = res.namePushNotification;
        menuInApp.iconPushNotification = res.pushNotificationIcon;
        menuInApp.homeMenu = res.parentMenuDto.menuEntities;
        menuInApp.rowSizeHomeMenu = res.parentMenuDto.rowSize;
        menuInApp.bottomMenu = res.bottomMenuDto.menuEntities;
        menuInApp.subMenu = res.subMenuDto.menuEntities;
        menuInApp.showBottomMenu = res.bottomMenuDto.show;
        menuInApp.headerMenu = res.headerMenuDto.menuEntities;
    }

    const bottomMenu = menuInApp.bottomMenu.filter(item => item.function !== 'WEB_VIEW');
     //console.log('screenUse', bottomMenu);


    menuInApp.listMainMenu.map(menu => {
        addNamvsIconScreen(menu);
    });
    bottomMenu.map(item => {
        addNamvsIconScreen(item);
    });
    menuInApp.headerMenu.map(item => {
        addNamvsIconScreen(item);
    });
    tab.screenTab = screen;
    tab.show = menuInApp.showBottomMenu;
    tab.menuBottom = menuInApp.bottomMenu;
};
const addNamvsIconScreen = (item) => {
    switch (item.function) {
        case 'HISTORY_COUPON':
            screen.iconUrlHistoryCouponScreen = item.iconUrl;
            screen.nameHistoryCouponScreen = item.name;
            break;
        case 'COUPON':
            screen.iconUrlCouPonScreen = item.iconUrl;
            screen.nameCouPonScreen = item.name;
            break;
        case 'IMAGE_GALLERY':
            screen.iconUrlImageGelleryScreen = item.iconUrl;
            screen.nameImageGelleryScreen = item.name;
            break;
        case 'GACHA':
            screen.iconUrlGotChaScreen = item.iconUrl;
            screen.nameGotChaScreen = item.name;
            break;
        case 'VIDEO':
            screen.iconUrlVideoScreen = item.iconUrl;
            screen.nameVideoScreen = item.name;
            break;
        case 'CATALOG':
            screen.iconUrlCatalogScreen = item.iconUrl;
            screen.nameCatalogScreen = item.name;
            break;
        case 'STORE':
            screen.iconUrlSearchStoreScreen = item.iconUrl;
            screen.nameSearchStoreScreen = item.name;
            break;
        case 'COMPANY_NOTIFICATION':
            screen.iconUrlNotificationScreen = item.iconUrl;
            screen.nameNotificationScreen = item.name;
            break;
        case 'CERTIFICATE_MEMBER':
            screen.iconUrlCertificateMemberScreen = item.iconUrl;
            screen.nameCertificateMemberScreen = item.name;
            break;
        case 'PUSH_NOTIFICATION':
            screen.iconUrlPushNotificationsScreen = item.iconUrl;
            screen.namePushNotificationsScreen = item.name;
            break;
        case 'STAMP':
            screen.iconUrlStampScreen = item.iconUrl;
            screen.nameStampScreen = item.name;
            break;
        case 'SETTING':
            screen.iconUrlSettingScreen = item.iconUrl;
            screen.nameSettingScreen = item.name;
            break;
        case 'MANAGER_ACCOUNT_WEBVIEW':
            screen.iconUrlManagerAccountWebviewScreen = item.iconUrl;
            screen.nameManagerAccountWebviewMemberScreen = item.name;


    }
};
