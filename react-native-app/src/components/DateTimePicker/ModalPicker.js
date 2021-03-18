import React, {forwardRef, useEffect, useImperativeHandle, useRef} from 'react';
import {Modal, Text, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {useMergeState} from '../../AppProvider';
import styles from './styles';

function ModalPicker(props, ref) {
  //   const refPicker = useRef(ref);
  const {
    id,
    currentValue,
    mode,
    is24hourSource,
    onChange,
    animationType = 'fade',
  } = props;
  const refValueTemp = useRef();

  const [stateScreen, setStateScreen] = useMergeState({
    isShowPicker: false,
    dataSelected: currentValue || new Date(),
  });
  const {isShowPicker, dataSelected} = stateScreen;

  useEffect(() => {
    setStateScreen({
      dataSelected: currentValue || new Date(),
    });
  }, [currentValue]);

  useImperativeHandle(ref, () => ({
    show: () => {
      setStateScreen({isShowPicker: true});
    },
    hide: () => {
      setStateScreen({isShowPicker: false});
    },
  }));
  /////

  const onOrientationChange = () => {};

  const handleOnChange = (date) => {
    refValueTemp.current = date;
  };
  const cancelPicker = () => {
    setStateScreen({isShowPicker: false});
  };
  const onPressAgree = () => {
    let value = refValueTemp.current || new Date();
    onChange && onChange({id, data: value});
    setStateScreen({
      isShowPicker: false,
      dataSelected: value,
    });
  };
  ////////
  return (
    <Modal
      testID="ios_modal"
      visible={isShowPicker}
      transparent
      animationType={animationType}
      supportedOrientations={['portrait', 'landscape']}
      onOrientationChange={onOrientationChange}>
      <View
        style={styles.stContainModal}
        // onStartShouldSetResponder={cancelPicker}
      >
        <View style={[styles.styContainPickerIOS]}>
          <View style={styles.stHeaderPicker}>
            <Text onPress={cancelPicker} style={styles.stTextCancellation}>
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
              ]}
            />
            <Text onPress={onPressAgree} style={styles.stTextAccept}>
              {'Xong'}
            </Text>
          </View>
          <DatePicker
            date={new Date(dataSelected)}
            mode={mode}
            textColor={'#161616'}
            style={{alignSelf: 'center'}}
            is24hourSource={is24hourSource}
            androidVariant="iosClone"
            onDateChange={handleOnChange}
          />
        </View>
      </View>
    </Modal>
  );
}

export default forwardRef(ModalPicker);
