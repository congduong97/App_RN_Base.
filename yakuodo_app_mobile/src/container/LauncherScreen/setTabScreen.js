
import AsyncStorage from '@react-native-community/async-storage';
import { tab, subMenu } from '../../const/System';

export const setTabScreen = async () => {
    await AsyncStorage.getItem('bottomMenu').then(async (res) => {
        const menuBottom = JSON.parse(res).menuEntities;
        const show = JSON.parse(res).show;

        const screenOnTab = menuBottom.filter(item => item.function !== 'WEB_VIEW' && item.function !== 'QR' && item.function !== 'COUPON');

        const screen = {
            indexHomeScreen: 0,
            indexNotificationScreen: null,
            visibleNotificationScreen: false,
            indexPushNotificationsScreen: null,
            visiblePushNotificationsScreen: false,
            indexCatalogScreen: null,
            visibleCatalogScreen: false,
            indexSearchStoreScreen: null,
            visibleSearchStoreScreen: false,
            indexSettingScreen: null,
            visibleSettingScreen: false,
            indexCouPonScreen: null,
            visibleCouPonScreen: false,
            indexVideoScreen: null,
            visibleVideoScreen: false,
            indexCertificateMemberScreen: null,
            visibleCertificateMemberScreen: false,
        };
        const menu = await AsyncStorage.getItem('menu');
        screenOnTab.map((item, index) => {
            switch (item.function) {
              
                case 'VIDEO':
                    screen.visibleVideoScreen = true;
                    screen.indexVideoScreen = index;
                    // screen.iconUrlVideoScreen = item.iconUrl;
                    screen.nameVideoScreen = item.name;
                    break;
                case 'CATALOG':
                    screen.visibleCatalogScreen = true;
                    screen.indexCatalogScreen = index;
                    // screen.iconUrlCatalogScreen = item.iconUrl;
                    screen.nameCatalogScreen = item.name;
                    break;
                case 'STORE':
                    screen.visibleSearchStoreScreen = true;
                    screen.indexSearchStoreScreen = index;
                    // screen.iconUrlSearchStoreScreen = item.iconUrl;
                    screen.nameSearchStoreScreen = item.name;
                    break;
                case 'COMPANY_NOTIFICATION':
                    screen.visibleNotificationScreen = true;
                    screen.indexNotificationScreen = index;
                    // screen.iconUrlNotificationScreen = item.iconUrl;
                    screen.nameNotificationScreen = item.name;
                    break;
                case 'CERTIFICATE_MEMBER':
                    screen.visibleCertificateMemberScreen = true;
                    screen.indexCertificateMemberScreen = index;
                    // screen.iconUrlCertificateMemberScreen = item.iconUrl;
                    screen.nameCertificateMemberScreen = item.name;
                    break;
                case 'PUSH_NOTIFICATION':
                    screen.visiblePushNotificationsScreen = true;
                    screen.indexPushNotificationsScreen = index;
                    // screen.iconUrlPushNotificationsScreen = item.iconUrl;
                    screen.namePushNotificationsScreen = item.name;
                    break;
                case 'SETTING':
                    screen.visibleSettingScreen = true;
                    screen.indexSettingScreen = index;
                    // screen.iconUrlSettingScreen = item.iconUrl;
                    screen.nameSettingScreen = item.name;
                    break;
                case 'MY_PAGE':
            
                
                    screen.visibleMyPageScreen = true;
                    screen.indexMyPageScreen = index;
                    // screen.iconUrlMyPageScreen = item.iconUrl;
                    screen.nameMyPageScreen = item.name;
                    break;


            }
        });


        JSON.parse(menu).menuEntities.map(item => {
            switch (item.function) {
                case 'COUPON':
                    screen.iconUrlCouPonScreen = item.iconUrl;
                    screen.nameCouPonScreen = item.name;
                    break;
                case 'QR':
                    screen.iconUrlQrScreen = item.iconUrl;
                    screen.nameQrScreen = item.name;
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
                case 'SETTING':
                    screen.iconUrlSettingScreen = item.iconUrl;
                    screen.nameSettingScreen = item.name;
                    break;
                case 'MY_PAGE':

                    screen.iconUrlMyPageScreen = item.iconUrl;
                    screen.nameMyPageScreen = item.name;
                    break;
              

            }
        });

        tab.screenTab = screen;
        tab.show = show;
        tab.screenUse = screenOnTab;
        tab.menuBottom = menuBottom;
    });
     await AsyncStorage.getItem('subMenu').then(res => {
        const submenu = JSON.parse(res);
        // console.log('subMenu', submenu);
        if (Array.isArray(submenu)) {
            submenu.map(item => {
                switch (item.function) {
                    case 'USING':
                    subMenu.nameMenuUsing = item.name;
                    break; 
                    case 'QUESTION':
                    subMenu.nameMenuQuestion = item.name;
                    break; 
                    case 'INTRODUCE_IMAGE':
                    subMenu.nameMenuIntroducImage = item.name;
                    break; 
                    case 'TERM':
                    subMenu.nameMenuTerm = item.name;
                    break; 
                    case 'POLICY':
                    subMenu.nameMenuPolicy = item.name;
                    break; 


                }
            });
            subMenu.data = submenu;
        }
      });
};
