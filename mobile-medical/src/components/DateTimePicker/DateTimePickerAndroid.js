import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMergeState } from "../../AppProvider";
import {
  convertTimeServerToDateVN,
  FORMAT_DD_MM_YYYY,
} from "../../commons/utils/DateTime";
import styles from "./styles";
import { ImagesUrl } from "../../commons";
export default function DateTimePickerAndroid(props) {
  const {
    id,
    label,
    style,
    styleTextButton,
    stylePicker,
    placeholder,
    placeholderTextColor,
    textColor,
    value,
    onChange,
    animationType = "fade",
  } = props;
  const refValueTemp = useRef();
  const [stateScreen, setStateScreen] = useMergeState({
    isShowPicker: false,
    dataSelected: value,
    valueDisplay: convertTimeServerToDateVN(value, FORMAT_DD_MM_YYYY),
  });
  const { isShowPicker, dataSelected, valueDisplay } = stateScreen;
  const togglePicker = (animate = false) => {
    setStateScreen({ isShowPicker: !isShowPicker });
  };
  ///////
  const handleOnChange = (event, date) => {
    //biến này giúp khi bấm nút thoát nó k reset về null
    if (!date) {
      setStateScreen({
        isShowPicker: false,
        // dataSelected: date,
        // valueDisplay: convertTimeServerToDateVN(date, FORMAT_DD_MM_YYYY),
      });
    } else {
      setStateScreen({
        isShowPicker: false,
        dataSelected: date,
        valueDisplay: convertTimeServerToDateVN(date, FORMAT_DD_MM_YYYY),
      });
    }
  };

  useEffect(() => {
    onChange && onChange({ id, data: dataSelected });
  }, [dataSelected]);
  ////////
  let stContain = [styles.viewContainer, style];
  let stPicker = [styles.viewContainerButton, stylePicker];
  let stTextButton = valueDisplay
    ? { fontWeight: 'normal', color: textColor }
    : { fontWeight: "normal", color: placeholderTextColor };
  return (
    <>
      <TouchableOpacity style={stPicker} onPress={() => togglePicker()}>
        <Text
          style={{
            ...styles.stTextButtonSelected,
            ...styleTextButton,
            ...stTextButton,
          }}
        >
          {valueDisplay || placeholder || "DD/MM/YYYY"}
        </Text>
        <Image source={ImagesUrl.iconCalendar} />
      </TouchableOpacity>
      {isShowPicker && (
        <DateTimePicker
          {...props}
          testID="dateTimePicker"
          value={dataSelected || new Date()}
          //   mode={mode}
          display={"default"}
          onChange={handleOnChange}
        />
      )}
    </>
  );
}
