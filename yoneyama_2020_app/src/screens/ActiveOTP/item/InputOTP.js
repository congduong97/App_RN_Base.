//Library:
import React, {useState, useEffect, useRef} from 'react';

//Setup:
import {SIZE} from '../../../utils';

//Component:
import {TextInput} from 'react-native';

//Services:
import ServicesUpdateComponent from '../../../utils/services/ServicesUpdateComponent';

function InputOTP(props) {
  const [OTP, setStateOTP] = useState('');
  const {getOTP} = props;
  const refTextInput = useRef(null);

  useEffect(() => {
    ServicesUpdateComponent.onChange('ResetFormOTP', (event) => {
      if (event === 'RESET_FORM_INPUT_OTP') {
        setStateOTP('');
        getOTP('');
      }
      if (event === 'ON_FOCUS_TEXT_INPUT_OTP') {
        refTextInput.current.focus();
      }
    });
    return () => {
      ServicesUpdateComponent.remove('ResetFormOTP');
    };
  }, []);

  //Nhập mã OTP:
  const setInputOTP = (OTP) => {
    setStateOTP(OTP);
    getOTP(OTP);
  };

  return (
    <TextInput
      ref={refTextInput}
      onChangeText={(text) => setInputOTP(text)}
      placeholder="SMS認証コードを入力"
      keyboardType="numeric"
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
