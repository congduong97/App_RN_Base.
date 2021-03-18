import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Platform, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {Picker, PickerIOS} from '@react-native-picker/picker';
import withPreventDoubleClick from './PreventDoubleClick';
const TouchableOpacityEx = withPreventDoubleClick(TouchableOpacity);

export default function SelectBox(props) {
  const {
    id,
    label,
    data,
    initialValue = 'Thổ',
    onValueChange,
    style,
    stylePicker,
    displayKey,
    valueKey,
  } = props;
  const [selectedValue, setSelectedValue] = useState();
  useEffect(() => {
    setSelectedValue(initialValue);
  }, [initialValue]);
  let stContain = [styles.styleContain, style];
  let stPicker = [styles.stylePicker, stylePicker];

  const handleValueChange = (itemValue, index) => {
    onValueChange && onValueChange({id, index, data: itemValue});
    setSelectedValue(itemValue);
  };

  if (Platform.OS === 'ios') {
    const onPick = () => {
      let pickerData = ['Tất cả'];
      data.forEach((element) => {
        pickerData = [...pickerData, element.name];
      });

      PickerIOS.init({
        pickerData: pickerData,
        selectedValue: [selectedValue],
        pickerTitleText: 'Chọn',
        pickerCancelBtnText: 'Huỷ',
        pickerConfirmBtnText: 'Xác nhận',
        onPickerConfirm: (val) => {
          const value = data.find((x) => x.name === val[0]);
          if (value) {
            onValueChange(value.id);
          }
        },
      });
      PickerIOS.show();
    };

    const value = '';
    return (
      <TouchableOpacityEx
        style={[style, styles.styContainIos]}
        onPress={onPick}>
        <Text>{selectedValue}</Text>
      </TouchableOpacityEx>
    );
  }

  return (
    <View style={stContain}>
      <Picker
        selectedValue={selectedValue}
        mode="dropdown"
        style={stPicker}
        itemStyle={{fontWeight: '700'}}
        onValueChange={handleValueChange}>
        {/* <Picker.Item label={label} value={selectedValue} /> */}
        {data?.map((item, index) => {
          return (
            <Picker.Item
              key={index}
              label={item[displayKey]}
              value={valueKey ? item[valueKey] : item}
            />
          );
        })}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  styleContain: {
    borderColor: '#5C6979',
    borderWidth: 0.5,
  },
  stylePicker: {
    height: 45,
    fontWeight: '700',
    // color: 'green',
  },
  styContainIos: {
    height: 40,
    borderBottomWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
});

SelectBox.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  data: PropTypes.array,
  displayKey: PropTypes.string,
  valueKey: PropTypes.any,
  initialValue: PropTypes.any,
  onValueChange: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  stylePicker: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};
