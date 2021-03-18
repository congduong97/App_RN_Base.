import React from 'react';
import ChangePasswordForgot from './items/ChangePasswordForgot';
import ChangePasswordMyPage from './items/ChangePasswordMyPage';

const ChangePassword = ({route}) => {
  const {key} = route.params;
  const renderContent = () => {
    switch (key) {
      case 'FORGOT_PASSWORD':
        return <ChangePasswordForgot />;
      case 'CHANGE_PASS_MY_PAGE':
        return <ChangePasswordMyPage />;
      default:
        break;
    }
  };
  return renderContent();
};

export default ChangePassword;
