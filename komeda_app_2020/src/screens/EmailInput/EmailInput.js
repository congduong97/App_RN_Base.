import React from 'react';
import EmailForgotPassword from './items/EmailForgotPassword';
import ChangeEmailMyPage from './items/ChangeEmailMyPage';

const EmailInput = ({route}) => {
  const {key} = route.params;
  const renderContent = () => {
    switch (key) {
      case 'FORGOT_PASSWORD':
        return <EmailForgotPassword />;
      case 'CHANGE_EMAIL_MY_PAGE':
        return <ChangeEmailMyPage />;
      default:
        break;
    }
  };
  return renderContent();
};

export default EmailInput;
