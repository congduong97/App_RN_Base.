//Library:
import React, {useState, useEffect} from 'react';
import {TextInput} from 'react-native';

//Setup:
import {SIZE} from '../../../utils';

//Component:
import ServicesUpdateComponent from '../../../utils/services/ServicesUpdateComponent';

function InputOTP(props) {
  const [OTP, setStateOTP] = useState('');
  const {getOTP} = props;

  useEffect(() => {
    ServicesUpdateComponent.onChange('ResetInputOTP', (event) => {
      if (event && event == 'RESET_FORM_INPUT_OTP') {
        setStateOTP('');
      }
    });
    return () => {
      ServicesUpdateComponent.remove('ResetInputOTP');
    };
  }, []);

  //Nhập mã OTP:
  const setInputOTP = (OTP) => {
    setStateOTP(OTP);
    getOTP(OTP);
  };
  return (
    <TextInput
      keyboardType='numeric'
      onChangeText={(text) => setInputOTP(text)}
      maxLength={6}
      value={OTP}
      style={{
        height: SIZE.width(12),
        width: SIZE.width(80),
        paddingLeft: SIZE.width(4),
        fontSize: SIZE.H5,
      }}
    />
  );
}

export {InputOTP};
