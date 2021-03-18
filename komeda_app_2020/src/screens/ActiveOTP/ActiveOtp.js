import React from 'react';
import OtpForgotpassword from './item/OtpForgotpassword';
import OtpRegister from './item/OtpRegister';
import OtpChangeEmail from './item/OtpChangeEmail';
const ActiveOtp = ({route}) => {
  const {key} = route.params;
  const renderContent = () => {
    switch (key) {
      case 'FORGOT_PASSWORD':
        return <OtpForgotpassword />;
      case 'REGISTER':
        return <OtpRegister></OtpRegister>;
      case 'CHANGE_EMAIL':
        return <OtpChangeEmail></OtpChangeEmail>;
      default:
        break;
    }
  };
  return renderContent();
};

export default ActiveOtp;
