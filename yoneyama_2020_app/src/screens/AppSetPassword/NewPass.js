//Library:
import React from 'react';

//Setup:
import {SIZE} from '../../utils';
import {keyNavigation} from '../../navigators/utils/KeyNavigation';

//Component:
import OtpInput from '../../elements/OtpInput';
import {AppContainer} from '../../elements';
import {AppText} from '../../elements/AppText';

const NewPass = ({navigation, route}) => {
  const onChangeValue = (value) => {
    const {index, mode} = route.params;
    if (value.length === 4) {
      navigation.navigate(keyNavigation.RE_PASS, {
        index,
        mode,
        data: value,
      });
    }
  };
  return (
    <AppContainer noHeader>
      <AppText
        style={{alignSelf: 'center', fontSize: SIZE.H5, marginVertical: 20}}>
        新しいパスワードを入力してください
      </AppText>
      <OtpInput
        style={{width: SIZE.width(70), alignSelf: 'center'}}
        maxLength={1}
        numberInput={4}
        onChangeValue={onChangeValue}
      />
    </AppContainer>
  );
};

export default NewPass;
