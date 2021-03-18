import {Picker, PickerIOS} from '@react-native-picker/picker';
import PropTypes from 'prop-types';
import React, {useRef} from 'react';
import {Modal, Text, TouchableOpacity, View} from 'react-native';
import {useMergeState} from '../../AppProvider';
import withPreventDoubleClick from '../PreventDoubleClick';
import styles from './styles';
const TouchableOpacityEx = withPreventDoubleClick(TouchableOpacity);

export default function PickerIOSView(props) {
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
    stypeTextButton,
    ////
  } = props;
  const refValueTemp = useRef();
  const [stateScreen, setStateScreen] = useMergeState({
    isShowPicker: false,
    itemChoose: data.filter((item) => item.id === initialValue)[0],
    selectedValue: data.filter((item) => item.id === initialValue)[0],
  });
  const {isShowPicker, selectedValue, itemChoose} = stateScreen;
  const onOrientationChange = () => {};

  const handleOnSelect = (value, index) => {
    refValueTemp.current = data[index];
    setStateScreen({selectedValue: data[index]});
  };

  const togglePicker = (animate = false) => {
    setStateScreen({isShowPicker: !isShowPicker});
  };

  const cancelPicke = () => {
    setStateScreen({isShowPicker: false});
  };

  const selectedItem = () => {
    onValueChange && onValueChange({id, itemChoose});
    setStateScreen({
      isShowPicker: false,
      selectedValue: refValueTemp.current,
      itemChoose: refValueTemp.current,
    });
  };
  let stContain = [styles.viewContainer, style];
  let stPicker = [styles.viewContainerButton, stylePicker];
  let styleTextButton = itemChoose?.[displayKey]
    ? {fontWeight: '700'}
    : {fontWeight: '400'};

  return (
    <View style={stContain}>
      <TouchableOpacityEx style={stPicker} onPress={() => togglePicker()}>
        <Text
          style={[
            styles.stTextButtonSelected,
            stypeTextButton,
            styleTextButton,
          ]}>
          {itemChoose?.[displayKey] || label || 'Chọn giá trị...'}
        </Text>
      </TouchableOpacityEx>
      <Modal
        testID="ios_modal"
        visible={isShowPicker}
        transparent
        // animationType={animationType}
        supportedOrientations={['portrait', 'landscape']}
        onOrientationChange={onOrientationChange}>
        <View style={styles.stContainModal}>
          <View style={[styles.styContainPickerIOS]}>
            <View style={styles.stHeaderPicker}>
              <Text onPress={cancelPicke} style={styles.stTextActionHeader}>
                {'Huỷ'}
              </Text>
              <Text
                style={[
                  styles.stTextActionHeader,
                  {
                    flex: 1,
                    color: 'black',
                    fontWeight: '400',
                  },
                ]}>
                {'Chọn'}
              </Text>
              <Text onPress={selectedItem} style={styles.stTextActionHeader}>
                {'Đồng ý'}
              </Text>
            </View>
            <PickerIOS
              selectedValue={selectedValue?.[valueKey]}
              mode="dropdown"
              style={stPicker}
              itemStyle={{fontWeight: '700'}}
              onValueChange={handleOnSelect}>
              {data?.map((item, index) => {
                return (
                  <Picker.Item
                    key={index}
                    label={item[displayKey]}
                    value={valueKey ? item[valueKey] : item}
                  />
                );
              })}
            </PickerIOS>
          </View>
        </View>
      </Modal>
    </View>
  );
}

PickerIOSView.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  itemStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onValueChange: PropTypes.func,
};
