import React, {useState, useRef} from 'react';
import {View, TouchableOpacity} from 'react-native';
import AppDateInput from '../../../elements/AppDateInput';
import {TouchableCo, AppText} from '../../../elements';
import {SIZE, COLOR} from '../../../utils';

function InputBirthday(props) {
  const birthDayAccount = useRef('');
  const datepicker = useRef(null);
  const {defaultBirthday, getBirthday} = props;
  const [chooseBirthday, setStateChooseBirthday] = useState(false);

  //Hiển thị modal chọn ngày tháng năm:
  const showDatePicker = () => {
    if (defaultBirthday) {
      return;
    } else {
      datepicker.current.showDatePicker();
    }
  };

  //Chọn ngày tháng năm sinh:
  const onSelectBirth = (date) => {
    birthDayAccount.current = date.replace(/\//g, '');
    setStateChooseBirthday(true);
    getBirthday(date);
  };

  //Chọn ngày tháng năm sinh:
  const birthDayUser = () => {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: SIZE.width(3),
          }}>
          {/* Chọn ngày tháng năm sinh */}
          <TouchableOpacity
            disabled={defaultBirthday ? true : false}
            onPress={showDatePicker}>
            <AppDateInput
              isDisableChooseDay={defaultBirthday ? true : false}
              value={defaultBirthday}
              ref={datepicker}
              stylesIcon={{
                top: SIZE.width(3),
                right: SIZE.width(0.2),
              }}
              iconDown
              noIcon
              placeholderTextColor={COLOR.grey_500}
              style={{
                height: SIZE.width(12),
                width: SIZE.width(94),
                borderWidth: 0,
                borderRadius: 0,
                marginLeft: SIZE.width(3),
                borderWidth: SIZE.width(0.2),
                borderColor: COLOR.COFFEE_BROWN,
                justifyContent: 'space-between',
                flexDirection: 'row',
                borderRadius: SIZE.width(1),
                backgroundColor: defaultBirthday ? COLOR.COFFEE_LIGHT : null,
              }}
              inputStyle={{
                height: SIZE.width(10),
                paddingTop: SIZE.width(3.3),
                paddingLeft: 2,
                marginLeft: SIZE.width(2),
                color: chooseBirthday ? COLOR.grey_900 : COLOR.grey_500,
                fontSize: SIZE.H5 * 1.2,
              }}
              onChangeData={onSelectBirth}
            />
          </TouchableOpacity>
        </View>
        <AppText
          style={{
            marginLeft: SIZE.width(4),
            marginTop: SIZE.width(2),
            color: COLOR.COFFEE_RED,
            fontFamily: 'irohamaru-Medium',
          }}>
          生年月日は登録後のご変更はできません。
        </AppText>
      </View>
    );
  };

  return <>{birthDayUser()}</>;
}

export default InputBirthday;
