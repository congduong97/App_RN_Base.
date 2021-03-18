import {NavigationActions, StackActions} from 'react-navigation';
// console.log('NavigationActions',NavigationActions)
let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    }),
  );
}
function push(routeName, params) {
  const pushAction = StackActions.push({
    routeName: routeName,
    params: params,
  });

  _navigator.dispatch(pushAction);
}

// add other navigation functions that you need and export them

export default {
  navigate,
  setTopLevelNavigator,
  push,
};
