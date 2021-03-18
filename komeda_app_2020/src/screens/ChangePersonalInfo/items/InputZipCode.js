import React, {useRef, useState, useEffect} from 'react';
import {View, TextInput} from 'react-native';
import {SIZE, COLOR, isIos, FetchApi} from '../../../utils';
import {STRING} from '../../../utils/constants/String';
function InputZipCode(props) {
  const zipCodeAccount = useRef('');
  //checkValidateZipcode API:
  const {
    checkStatusZipCodeAPI,
    getZipCode,
    zipCodeDefault,
    getMessError,
  } = props;
  const [zipcode, setStateZipcode] = useState(zipCodeDefault);

  useEffect(() => {
    showZipcode();
    return () => {};
  }, []);

  const showZipcode = () => {
    if (zipCodeDefault) {
      const zipConvert = numberZipCode(zipCodeDefault);
      setStateZipcode(zipConvert);
    }
  };
  const checkValidateZipcodeAPI = async (zipCode) => {
    const response = await FetchApi.validateZipcode(zipCode);
    if (
      response &&
      response.status_code == 200 &&
      response.code == 1000 &&
      response.data
    ) {
      getZipCode(zipCode);
      getMessError('');
      checkStatusZipCodeAPI('USABLE_ZIPCODE');
    } else {
      checkStatusZipCodeAPI('CAN_NOT_USE_ZIPCODE');
      getMessError(STRING.zipcode_input_wrong);
    }
  };

  //mask numbers xxx-xxxx
  const numberZipCode = (number) => {
    if (number) {
      return number
        .replace(/\D+/g, '')
        .replace(/([0-9]{1,3})([0-9]{4}$)/gi, '$1-$2');
    } else {
      return '';
    }
  };

  //Thay đổi mã zipcode:
  const changeZipcode = (zipcode) => {
    let numberZipCodeConvert = numberZipCode(zipcode);
    let zipCode = zipcode.replace(/-/g, '');
    zipCodeAccount.current = zipCode;
    if (!zipcode) {
      getZipCode(zipCode);
      checkStatusZipCodeAPI('USABLE_ZIPCODE');
      getMessError('');
    }
    if (zipCode && zipCode.length > 0 && zipCode.length < 7) {
      getMessError(STRING.zipcode_7_char);
      checkStatusZipCodeAPI('CAN_NOT_USE_ZIPCODE');
    }
    if (zipCodeAccount.current && zipCodeAccount.current.length == 7) {
      checkValidateZipcodeAPI(zipCode);
    }
    setStateZipcode(numberZipCodeConvert);
  };

  //Nhập mã zip-code:
  const zipCodeUser = () => {
    return (
      <View>
        <TextInput
          keyboardType='numeric'
          placeholderTextColor={COLOR.grey_500}
          placeholder={'郵便番号を入力'}
          maxLength={8}
          onChangeText={(text) => changeZipcode(text)}
          value={zipcode}
          style={{
            height: SIZE.width(12),
            color: COLOR.grey_900,
            justifyContent: 'center',
            paddingLeft: SIZE.width(3),
            fontSize: SIZE.H5 * 1.2,
            paddingTop: isIos ? 0 : SIZE.width(2),
            marginLeft: SIZE.width(3),
            marginTop: SIZE.width(3),
            width: SIZE.width(94),
            borderWidth: SIZE.width(0.2),
            borderColor: COLOR.COFFEE_BROWN,
            borderRadius: SIZE.width(1),
          }}
        />
      </View>
    );
  };

  return <>{zipCodeUser()}</>;
}

export default InputZipCode;
