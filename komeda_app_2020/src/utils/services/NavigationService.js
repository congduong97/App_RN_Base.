import * as React from 'react';
import {StackActions} from '@react-navigation/native';

const navigationRef = React.createRef();

function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

function push(name, params) {
  navigationRef.current?.dispatch(StackActions.push(name, params));
}

const NavigationService = {navigate, push, navigationRef};
export {NavigationService};
