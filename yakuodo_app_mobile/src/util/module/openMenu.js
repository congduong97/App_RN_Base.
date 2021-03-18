import {URL_PDF} from '../../const/Url';
import {
  managerAcount,
  isIOS,
  dataSave,
  stateSercurity,
} from '../../const/System';
import {Alert, Linking} from 'react-native';
import {STRING} from '../../const/String';
import NotificationCount from '../../service/NotificationCount';
import ReloadScreen from '../../service/ReloadScreen';
import {ServiveModal} from '../../container/HomeScreen/util/service';
export const openMenu = (
  item,
  navigation,
  keyword,
  notReloadScreen,
) => {
  // console.log('ma', managerAcount.memberCode);
  if (!item.active && item.function != 'ADVERTISING_PAGE') {
    Alert.alert(STRING.notification, STRING.menu_is_un_active);
    return;
  }
  console.log('item.function', item.function);
  switch (item.function) {
    case 'WEB_VIEW':
      if (item.url) {
        // console.log(item.url);
        const url = item.typeUrl == 1 ? item.url : `${URL_PDF}${item.url}`;
        // console.log('urlurlurlurl', url);
        if (item.typeOpen == 1) {
          if (item.typeUrl == 1) {
            // console.log('oke');
            const urlColumn = `${url}?member=${managerAcount.memberCode}`;
            // console.log('urlColumn', urlColumn);
            navigation.navigate('WEB_VIEW', {
              url: urlColumn,
            });
          } else {
            // console.log('aasfasffsaf pdf', url);
            navigation.navigate('PDF', {linkPDF: url});
          }
        } else {
          // console.log('okssse');
          Linking.openURL(url);
        }
      }

      break;
    case 'COLUMN':
      const url = `${item.url}?member=${managerAcount.memberCode}`;
      // console.log('urlfsfdsfdff', url);
      if (item.typeOpen == 1) {
        navigation.navigate('WEB_VIEW', {url});
      } else {
        Linking.openURL(url);
      }

      break;
    case 'LINK_APP':
      // alert('ok');
      if (managerAcount.userId) {
        const urlLink = isIOS ? item.urlIOS : item.urlAndroid;
        const urlLinkAppStore = isIOS ? item.urlAppstore : item.urlCHPlay;
        if (urlLink) {
          Linking.canOpenURL(urlLink).then(supported => {
            if (!supported && urlLinkAppStore) {
              Linking.openURL(urlLinkAppStore).catch(error => {
                // alert(error.message || error);
              });
            } else {
              Linking.openURL(urlLink).catch(error => {
                // alert(error.message || error);
              });
            }
          });
        }
      } else {
        Alert.alert(
          STRING.notification,
          STRING.please_login_to_use,
          [
            {
              text: STRING.cancel,
              onPress: () => {},
              style: 'cancel',
            },
            {text: STRING.ok, onPress: () => ServiveModal.set()},
          ],
          {cancelable: false},
        );
      }
      break;

    default:
      if (
        item.function == 'COUPON' ||
        item.function == 'QR' ||
        item.function == 'MY_PAGE' ||
        item.function == 'LIST_BANNER' ||
        item.function == 'DETAIL_BANNER'
      ) {
        // console.log('managerAcount.userId', managerAcount.userId);
        if (managerAcount.userId) {
          if (item.function == 'DETAIL_BANNER' && item.linkApplyBanner) {
            if (item.typeOpen === 1) {
              navigation.navigate('WEB_VIEW', {
                url: `${item.linkApplyBanner}${managerAcount.memberCode}`,
              });
            } else {
              Linking.openURL(
                `${item.linkApplyBanner}${managerAcount.memberCode}`,
              );
            }
          }
          if (item.function == 'COUPON' && keyword) {
            if (!notReloadScreen) {
              ReloadScreen.set(item.function);
              dataSave.loadCouponSuccess = false;
            }

            navigation.navigate(item.function, {keyWord: keyword});
            return;
          }
          if (item.function == 'COUPON') {
            if (!notReloadScreen) {
              ReloadScreen.set(item.function);
              dataSave.loadCouponSuccess = false;
            }
            navigation.navigate(item.function);
            return;
          }
          if (!notReloadScreen) {
            ReloadScreen.set(item.function);
          }

          if (
            item.function == 'MY_PAGE' &&
            managerAcount.enablePasswordMyPage &&
            stateSercurity.onSecurity
          ) {
            navigation.navigate('EnterPassMyPageAndOppenApp', {
              nameScreen: 'MY_PAGE',
            });
          } else {
            navigation.navigate(item.function);
          }
        } else {
          Alert.alert(
            STRING.notification,
            STRING.please_login_to_use,
            [
              {
                text: STRING.cancel,
                onPress: () => {},
                style: 'cancel',
              },
              {text: STRING.ok, onPress: () => ServiveModal.set()},
            ],
            {cancelable: false},
          );
        }
      } else if (item.function == 'PUSH_NOTIFICATION') {
        NotificationCount.set(0);
        if (!notReloadScreen) {
          ReloadScreen.set(item.function);
        }
        navigation.navigate(item.function);
      } else if (item.function == 'ADVERTISING_PAGE') {
        navigation.navigate(item.function, );
      } else if (item.function) {
        if (!notReloadScreen) {
          ReloadScreen.set(item.function);
        }
        navigation.navigate(item.function);
      }
  }
};
