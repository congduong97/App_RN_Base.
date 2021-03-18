import {Picker} from '@react-native-picker/picker';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import withPreventDoubleClick from '../PreventDoubleClick';
import styles from './styles';
const TouchableOpacityEx = withPreventDoubleClick(TouchableOpacity);
export default function PickerAndroidView(props) {
  const {
    id,
    label,
    data,
    initialValue,
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

  return (
    <View style={stContain}>
      <Picker
        selectedValue={selectedValue}
        mode="dropdown"
        style={stPicker}
        onValueChange={handleValueChange}>
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
