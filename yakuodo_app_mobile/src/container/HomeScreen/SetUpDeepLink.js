import React, {PureComponent} from 'react';

import {
  managerAcount,
  dataSave,
  APP_ID,
  stateSercurity,
} from '../../const/System';
import {getParams} from '../../util';
import {Linking, View} from 'react-native';
import {Api} from '../../service';
import ShowModalQrCoupon from '../../service/ShowModalQrCoupon';
import NavigationService from '../../service/NavigationService';
import {renderHome} from '../HomeScreen';
import {API_URL} from '../../const/Url';
import {clickNotification} from './SetUpNotifications';
import ReloadScreen from '../../service/ReloadScreen';
import {
  ServiveModal,
  serviceDeeplink,
  serviceDeeplinkReferralCoupon,
} from './util/service';
import CurrentScreen from '../../service/CurrentScreen';

export const linkDeeplink = {
  linkSave: null,
};
export const useDeepLink = link => {
  if (link === null) {
    return;
  }
  if (
    link &&
    link.includes(
      `${API_URL.URL_DOMAIN}/api/v1/app/${APP_ID}/referralCoupon/confirmReceivedCoupon?`,
    )
  ) {
    goToCouponReferralCoupon(link);
    return;
  }
  if (
    link &&
    link.includes(`${API_URL.URL_DOMAIN}/api/v1/app/${APP_ID}/checkNewQPON?`)
  ) {
    checkQRCoupon(link);
    clickNotification.status = true;
    return;
  }
  if (link && link.includes(`${API_URL.URL_DOMAIN}/deeplink`)) {
    openURLwithDeepLinkCoupon(link);
    clickNotification.status = true;
    return;
  }
  if (
    link.includes('jp.co.yakuodo.public://goListCoupon') &&
    managerAcount.userId
  ) {
    NavigationService.navigate('COUPON');
    clickNotification.status = true;
    return;
  }
  if (!managerAcount.userId) {
    ServiveModal.set();
    return;
  }
  NavigationService.navigate('HOME');
};
let timeOutDeepLink = null;
const handleOpenURL = (url, fromToGetInit) => {
  if (renderHome && !fromToGetInit) {
    if (timeOutDeepLink) {
      clearTimeout(timeOutDeepLink);
    }
    timeOutDeepLink = setTimeout(() => {
      useDeepLink(url);
    }, 500);
  } else {
    linkDeeplink.linkSave = url;
  }
};

export const goToCouponReferralCoupon = async url => {
  if (managerAcount.userId) {
    NavigationService.navigate('COUPON');
    const referralCode = getParams('referralCode', url);
    let dataDeepLinkIntro = {
      referralCode: referralCode,
    };
    serviceDeeplinkReferralCoupon.set(dataDeepLinkIntro);
    if (referralCode) {
      try {
        const respons = await Api.confirmReceivedCoupon(referralCode);
      } catch (e) {}
    }
  } else {
    return;
  }
};

export const checkQRCoupon = async link => {
  if (managerAcount.userId) {
    ShowModalQrCoupon.set({link, isModalVisible: true});
  } else {
    countScanerQRCoupon(link);
    linkDeeplink.linkSave = link;
    ServiveModal.set();
  }
};

export const countScanerQRCoupon = async link => {
  try {
    await Api.countDeepLink(link);
  } catch (e) {}
};

export const openURLwithDeepLinkCoupon = url => {
  countScanerQRCoupon(url);
  const nameFunction = getParams('nameFunction', url);
  if (nameFunction === 'COUPON' && managerAcount.userId) {
    const type = getParams('type', url);
    const detailId = getParams('detailId', url);
    const keyword = getParams('keyword', url);
    if (type !== 'detail' || !detailId) {
      if (keyword && type == 'search') {
        let dataDeepLink = {
          keySeach: decodeURIComponent(keyword),
        };
        dataDeepLink.search = true;
        serviceDeeplink.set(dataDeepLink);
        NavigationService.navigate(nameFunction, {
          keyWord: decodeURIComponent(keyword),
        });
      } else {
        let dataDeepLink = {
          nameFunction: 'COUPON',
        };
        serviceDeeplink.set(dataDeepLink);
        NavigationService.navigate(nameFunction);
      }
    } else {
      let dataDeepLink = {
        detailId: detailId,
      };
      serviceDeeplink.set(dataDeepLink);
      goDetailCoupon(detailId);
    }
  } else if (
    nameFunction === 'COUPON' ||
    nameFunction === 'VIDEO' ||
    nameFunction === 'QR' ||
    nameFunction === 'MY_PAGE'
  ) {
    if (managerAcount.userId) {
      if (
        CurrentScreen.get() !== 'MY_PAGE' &&
        nameFunction == 'MY_PAGE' &&
        managerAcount.enablePasswordMyPage &&
        stateSercurity.onSecurity
      ) {
        NavigationService.navigate('EnterPassMyPageAndOppenApp', {
          nameScreen: 'MY_PAGE',
        });
      } else {
        NavigationService.navigate(nameFunction);
      }
    } else {
      linkDeeplink.linkSave = url;
      ServiveModal.set();
    }
  } else {
    NavigationService.navigate(nameFunction);
  }
};

const goDetailCoupon = detailId => {
  dataSave.loadCouponSuccess = false;
  ReloadScreen.set('COUPON');
  NavigationService.navigate('COUPON', {detailId});
};

export class SetUpDeeplink extends PureComponent {
  componentDidMount() {
    Linking.addEventListener('url', this.changeURL);
    Linking.getInitialURL().then(url => {
      if (url) {
        handleOpenURL(url, true);
      }
    });
  }
  changeURL = event => {
    if (event && event.url) {
      if (
        (managerAcount.enablePasswordOppenApp ||
          (managerAcount.enablePasswordMyPage &&
            CurrentScreen.get() == 'MY_PAGE')) &&
        managerAcount.userId &&
        stateSercurity.onSecurity
      ) {
        linkDeeplink.linkSave = event.url;
        return;
      }
      handleOpenURL(event.url);
    }
  };

  render() {
    return <View />;
  }
}
