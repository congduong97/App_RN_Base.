//Library:
import React from 'react';
import 'react-native-gesture-handler';
import {enableScreens} from 'react-native-screens';
import codePush from 'react-native-code-push';
//Setup:
import {AppContext} from './contexts/AppContext';

//Component:
import RootNavigator from './navigators/RootNavigator';

//Optimize memory usage and performance:
enableScreens();

const App = () => {
  return (
    <AppContext>
      <RootNavigator />
    </AppContext>
  );
};

// const codePushOptions = {
//   checheckFrequency: codePush.CheckFrequency.ON_APP_START,
//   installMode: codePush.InstallMode.IMMEDIATE,
// };

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_RESUME,
};

export default codePush(codePushOptions)(App);
