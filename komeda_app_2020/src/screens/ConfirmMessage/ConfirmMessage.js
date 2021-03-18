import React from 'react';
import ConfirmForgotPass from './items/ConfirmForgotPass';
import ConfirmRegister from './items/ConfirmRegister';
import ConfirmLogin from './items/ConfirmLogin';
import ConfirmChangeEmail from './items/ConfirmChangeEmail';
import ConfirmLinkingCard from './items/ConfirmLinkingCard';
import ConfirmChangePassMyPage from './items/ConfirmChangePassMyPage';
import ConfirmChangeInfoMyPage from './items/ConfirmChangeInfoMyPage';
import ConfirmUpdateCard from './items/ConfirmUpdateCard';
import ConfirmRemoveLinkingCard from './items/ConfirmRemoveLinkingcard';
import ConfirmDisableAccount from './items/ConfirmDisableAccount';

const ConfirmMessage = ({route}) => {
  const {key} = route.params;
  const renderContent = () => {
    switch (key) {
      case 'REGISTER':
        return <ConfirmRegister />;
      case 'FORGOT_PASSWORD':
        return <ConfirmForgotPass />;
      case 'LOGIN':
        return <ConfirmLogin />;
      case 'CHANGE_EMAIL':
        return <ConfirmChangeEmail />;
      case 'LINK_CARD':
        return <ConfirmLinkingCard />;
      case 'UPDATE_CARD':
        return <ConfirmUpdateCard />;
      case 'CHANGE_PASS_MY_PAGE':
        return <ConfirmChangePassMyPage />;
      case 'CHANGE_INFO_MY_PAGE':
        return <ConfirmChangeInfoMyPage />;
      case 'REMOVE_LINKINGCARD':
        return <ConfirmRemoveLinkingCard />;
      case 'DISABLE_ACCOUNT':
        return <ConfirmDisableAccount />;
      default:
        break;
    }
  };
  return renderContent();
};

export default ConfirmMessage;
