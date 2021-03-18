import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import OneSignal from 'react-native-onesignal';
import AppProvider from './AppProvider';
import RootNavigation from './navigations';
import myStore from './redux/store';
import actions from './redux/actions';
import LoadingView from './components/LoadingView';
import {Dimension} from './commons/constants';
import API from './networking';
import { getUniqueId } from './commons/utils/getDeviceId';
import models from './models';

export default function App() {
  const initOneSignal = () => {
    OneSignal.setLogLevel(6, 0);

    // Replace 'YOUR_ONESIGNAL_APP_ID' with your OneSignal App ID.
    OneSignal.init('31c6b7b7-e2ad-4039-953e-e8f73f0f7e1c', {
      kOSSettingsKeyAutoPrompt: false,
      kOSSettingsKeyInAppLaunchURL: false,
      kOSSettingsKeyInFocusDisplayOption: 2,
    });
    OneSignal.inFocusDisplaying(2); // Controls what should happen if a notification is received while the app is open. 2 means that the notification will go directly to the device's notification center.
    if (Platform.OS === 'android') {
      OneSignal.enableVibrate(true);
      OneSignal.enableSound(true);
    }
    // The promptForPushNotifications function code will show the iOS push notification prompt. We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step below)
    OneSignal.promptForPushNotificationsWithUserResponse(myiOSPromptCallback);

    OneSignal.addEventListener('received', onReceived);
    OneSignal.addEventListener('opened', onOpened);
    OneSignal.addEventListener('ids', onIds);
  };

  const removeOneSignal = () => {
    OneSignal.removeEventListener('received');
    OneSignal.removeEventListener('opened');
    OneSignal.removeEventListener('ids');
  };

  useEffect(() => {
    initOneSignal();
    if (models.getAccountId() == undefined) {
      console.log(models.getAccountId());
      console.log(getUniqueId().toString());
      //subcriber device info to receive notifications that dont need to login
      OneSignal.setSubscription(true);
      OneSignal.sendTag('deviceId', getUniqueId().toString());
    }

  }, []);

  useEffect(() => {
    return () => {
      removeOneSignal();
    };
  }, []);

  const onReceived = (notification) => {
    console.log('notification', notification);
    let additionalData = notification.payload.additionalData;
    if (
      additionalData &&
      (additionalData.cartId || additionalData.reservationId)
    ) {
      API.requestNotifications(myStore.dispatch, {
        isReloadData: true,
        page: 0,
        size: Dimension.NUMBER_ITEM_PAGE_DEFAULT,
      });
    }
  };

  const onOpened = (openResult) => {
    let additionalData = openResult.notification.payload.additionalData;
    if (
      additionalData &&
      (additionalData.reservationsId || additionalData.cartId)
    ) {
      myStore.dispatch(
        actions.saveDataNotification({
          dataItem: {
            id: additionalData?.reservationId,
            cartId: additionalData.cartId,
          },
          isRequestData: true,
          isTabarOrder: true,
        }),
      );
    } else {
      myStore.dispatch(
        actions.saveDataNotification({
          dataItem: null,
        }),
      );
    }
  };

  const onIds = (device) => {};

  return (
    <Provider store={myStore}>
      <LoadingView />
      <AppProvider>
        <RootNavigation />
      </AppProvider>
    </Provider>
  );
}

function myiOSPromptCallback(permission) {
  // do something with permission value
}
