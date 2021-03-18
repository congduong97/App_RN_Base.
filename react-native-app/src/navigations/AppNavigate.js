import {
  StackActions,
  CommonActions,
  TabActions,
} from '@react-navigation/native';
import models from '../models';

async function navigateWhenAppStart(dispatch, params) {
  if (models.isLoggedIn()) {
    dispatch(StackActions.replace('CollaborerTabNavigator', params));
  } else {
    dispatch(StackActions.replace('LoginScreen', params));
  }
}

function navigateToUpdateUserScreen(dispatch, params) {
  dispatch(StackActions.push('UpdateUserScreen', params));
}
function navigateToSignUpScreen(dispatch, params) {
  dispatch(StackActions.push('SignUpScreen', params));
}

function navigateToPersonalScreen(dispatch, params) {
  dispatch(StackActions.push('PersonalScreen', params));
}
function navigateToSearchGuideScreen(dispatch, params) {
  dispatch(StackActions.push('SearchGuideScreen', params));
}
function navigateToSearchScreen(dispatch, params) {
  dispatch(StackActions.push('SearchScreen', params));
}

function navigateToNotificationScreen(dispatch, params) {
  dispatch(StackActions.push('NotificationScreen', params));
}

function navigateToNotificationDetailScreen(dispatch, params) {
  dispatch(StackActions.push('NotificationDetailScreen', params));
}

function navigateToSimCategoriesScreen(dispatch, params) {
  dispatch(StackActions.push('SimCategoriesScreen', params));
}

function navigateToIntroductionScreen(dispatch, params) {
  dispatch(StackActions.push('IntroductionScreen', params));
}
function navigateToSelectTemplateDesignScreen(dispatch, params) {
  dispatch(StackActions.push('SelectTemplateDesignScreen', params));
}
function navigateToSimsImageDesignScreen(dispatch, params) {
  dispatch(StackActions.push('SimsImageDesignScreen', params));
}
function navigateToSimImageDesignScreen(dispatch, params) {
  dispatch(StackActions.push('SimImageDesignScreen', params));
}
function navigateToColorPickerScreen(dispatch, params) {
  dispatch(StackActions.push('ColorPickerScreen', params));
}

function navigateToOrderScreen(dispatch, params) {
  dispatch(StackActions.push('OrderScreen', params));
}

function navigateToOrderDetailScreen(dispatch, params) {
  dispatch(StackActions.push('OrderDetailScreen', params));
}
function navigateToCartsScreen(dispatch, params) {
  dispatch(StackActions.push('CartsScreen', params));
}
function navigateToCartDetailScreen(dispatch, params) {
  dispatch(StackActions.push('CartDetailScreen', params));
}
function navigateToTabSetting(dispatch, params) {
  dispatch((state) => {
    return CommonActions.reset({...state, index: 3});
  });
  // dispatch(
  //   CommonActions.reset({
  //     index: 3,
  //     routes: [
  //       {name: 'HomeScreen'},
  //       {name: 'SearchGuideScreen'},
  //       {name: 'OrderStack'},
  //       {
  //         name: 'AccountStack',
  //         params,
  //       },
  //     ],
  //   }),
  // );
  // dispatch(TabActions.jumpTo('AccountStack', params));
}

export default {
  navigateWhenAppStart,
  navigateToTabSetting,
  navigateToSearchGuideScreen,
  navigateToSignUpScreen,
  navigateToUpdateUserScreen,
  navigateToSearchScreen,
  navigateToNotificationScreen,
  navigateToNotificationDetailScreen,
  navigateToSimCategoriesScreen,
  navigateToIntroductionScreen,
  navigateToSelectTemplateDesignScreen,
  navigateToSimsImageDesignScreen,
  navigateToSimImageDesignScreen,
  navigateToColorPickerScreen,
  navigateToPersonalScreen,
  navigateToOrderScreen,
  navigateToOrderDetailScreen,
  navigateToCartsScreen,
  navigateToCartDetailScreen,
};
