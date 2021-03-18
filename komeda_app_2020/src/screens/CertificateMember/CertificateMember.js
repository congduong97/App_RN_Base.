import React from 'react';
import {AccountService} from '../../utils/services/AccountService';
import IntroCertificateMember from './items/IntroCertificateMember';
import CardCertificateMember from './items/CardCertificateMember';
import {AppHeader} from '../../elements';

function CertificateMember({route}) {
  const checkLinkingCertificate = () => {
    const accountLogin = AccountService.getAccount();
    const {email, point, money} = accountLogin;
    if ((accountLogin && email && point) || point == 0 || money || money == 0) {
      return <CardCertificateMember></CardCertificateMember>;
    } else {
      return <IntroCertificateMember></IntroCertificateMember>;
    }
  };

  return (
    <>
      <AppHeader title={'KOMECA'} leftGoBack></AppHeader>
      {checkLinkingCertificate()}
    </>
  );
}
export default CertificateMember;
