import { NavigationActions, StackActions } from "react-navigation";
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
    })
  );
}
function push(routeName, params) {
  const pushAction = StackActions.push({
    routeName: routeName,
    params: params,
  });

  _navigator.dispatch(pushAction);
}
function reset(index, arrayScreens) {
  const resetAction = StackActions.reset({
    index: index,
    actions: arrayScreens,
  });
  _navigator.dispatch(resetAction);
}
function goBack() {
  const popAction = StackActions.pop({
    n: 1,
  });
  _navigator.dispatch(popAction);
}
function pop(n) {
  const popAction = StackActions.pop({
    n,
  });
  _navigator.dispatch(popAction);
}
// add other navigation functions that you need and export them

export default {
  navigate,
  setTopLevelNavigator,
  push,
  reset,
  goBack,
  pop,
};
