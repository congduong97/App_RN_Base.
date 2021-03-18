import React, {useEffect} from 'react';
import {Provider, useSelector} from 'react-redux';
import OneSignal from 'react-native-onesignal';
import AppProvider from './AppProvider';
import RootNavigation from './navigations';
import myStore from './redux/store';

export default function App() {
  const isSignOutSuccess = useSelector(
    (state) => state.AccountReducer.isSignOutSuccess,
  );

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
    OneSignal.removeEventListener('received', onReceived);
    OneSignal.removeEventListener('opened', onOpened);
    OneSignal.removeEventListener('ids', onIds);
  };

  useEffect(() => {
    initOneSignal();
  }, []);

  useEffect(() => {
    isSignOutSuccess && removeOneSignal;
  }, [isSignOutSuccess]);

  useEffect(() => {
    return () => {
      removeOneSignal;
    };
  }, []);

  const onReceived = (notification) => {
    console.log('Notification received: ', notification);
  };

  const onOpened = (openResult) => {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  };

  const onIds = (device) => {
    console.log('Device info: ', device);
  };

  return (
    <Provider store={myStore}>
      {/* <LoadingView /> */}
      <AppProvider>
        <RootNavigation />
      </AppProvider>
    </Provider>
  );
}

function myiOSPromptCallback(permission) {
  // do something with permission value
}
