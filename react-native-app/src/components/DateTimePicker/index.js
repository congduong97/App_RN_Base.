import React, {useEffect, useRef} from 'react';
import {View, Text} from 'react-native';
import {useMergeState} from '../../AppProvider';
import {Color} from '../../commons/constants';
import {
  convertTimeDate,
  convertTimeDateFromToFormat,
  FORMAT_DDMMYYYY,
  FORMAT_DD_MM_YYYY,
  FORMAT_YYYY_MM_DD,
} from '../../commons/utils/format';
import {IconViewType} from '../IconView';
import InputView from '../InputView';
import TouchableOpacityEx from '../TouchableOpacityEx';
import DateTimeModal from './ModalPicker';
import styles from './styles';
export {DateTimeModal};

export default function DateTimePicker(props) {
  const {
    id: idView,
    style,
    styleContainInput,
    isShowLabel,
    styleTextButton,
    stylePicker,
    placeholder,
    placeholderTextColor,
    textColor = 'black',
    value,
    onChange,
    mode = 'date',
    is24hourSource,
    animationType = 'fade',
  } = props;
  const refDateModal = useRef();
  const [stateScreen, setStateScreen] = useMergeState({
    isShowPicker: false,
  });
  const {isShowPicker, dataSelected, valueDisplay} = stateScreen;
  /////
  useEffect(() => {
    setStateScreen({
      dataSelected: convertTimeDateFromToFormat(
        value,
        FORMAT_DDMMYYYY,
        FORMAT_YYYY_MM_DD,
      ),
      valueDisplay: value,
      // convertTimeDate(
      //   value,
      //   mode === 'date' ? FORMAT_DD_MM_YYYY : 'HH:mm',
      // ),
    });
  }, [value]);
  ////
  const togglePicker = (animate = false) => {
    refDateModal.current.show();
  };
  const handleOnChange = ({id, data}) => {
    onChange && onChange({id: idView, data: data});
    setStateScreen({
      dataSelected: data || new Date(),
      valueDisplay: convertTimeDate(
        data,
        mode === 'date' ? FORMAT_DD_MM_YYYY : 'HH:mm',
      ),
    });
  };
  const cancelPicke = () => {
    setStateScreen({isShowPicker: false});
  };

  ////////
  let stContain = {...styles.stContain, ...style};
  let stContainInput = {...styles.stContainInput, ...styleContainInput};

  let stTextButton = valueDisplay
    ? {fontWeight: '700', color: textColor}
    : {fontWeight: '400', color: placeholderTextColor};
  let textButton = {...styles.stValue, ...styleTextButton, ...stTextButton};
  return (
    <>
      <InputView
        {...props}
        style={stContain}
        styleInput={stContainInput}
        id={idView}
        isShowClean={false}
        isShowLabel={isShowLabel}
        editable={false}
        placeholder={placeholder}
        placeholderTextColor={'gray'}
        textDisable={textButton}
        // onChangeText={onChangeText}
        onPress={togglePicker}
        value={valueDisplay}
      />
      <DateTimeModal
        id={idView}
        ref={refDateModal}
        mode={mode || 'date'}
        is24hourSource={is24hourSource}
        onChange={handleOnChange}
        // data={dataSelected}
        currentValue={dataSelected}
      />
    </>
  );
}
