import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Modal, Image } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMergeState } from "../../AppProvider";
import {
  convertTimeServerToDateVN,
  FORMAT_DD_MM_YYYY,
} from "../../commons/utils/DateTime";
import styles from "./styles";
import { ImagesUrl } from "../../commons";

export default function DateTimePickerIOS(props) {
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
  /////
  const togglePicker = (animate = false) => {
    setStateScreen({ isShowPicker: !isShowPicker });
  };
  const onOrientationChange = () => { };

  const handleOnChange = (event, date) => {
    refValueTemp.current = date;
  };
  const cancelPicke = () => {
    setStateScreen({ isShowPicker: false });
  };
  const onPressAgree = () => {
    onChange && onChange({ id, data: refValueTemp.current });
    setStateScreen({
      isShowPicker: false,
      dataSelected: refValueTemp.current,
      valueDisplay: convertTimeServerToDateVN(
        refValueTemp.current,
        FORMAT_DD_MM_YYYY
      ),
    });
  };
  ////////
  let stContain = [styles.viewContainer, style];
  let stPicker = [styles.viewContainerButton, stylePicker];
  let stTextButton = valueDisplay
    ? { fontWeight: "700", color: textColor }
    : { fontWeight: "400", color: placeholderTextColor };

  return (
    <View style={stContain} onStartShouldSetResponder={cancelPicke}>
      <TouchableOpacity style={stPicker} onPress={() => togglePicker()}>
        <Text
          style={{
            ...styles.stTextButtonSelected,
            ...styleTextButton,
            ...stTextButton,
          }}
        >
          {valueDisplay || placeholder || "MM/DD/YYYY"}
        </Text>
        <Image source={ImagesUrl.iconCalendar} />
      </TouchableOpacity>
      <Modal
        testID="ios_modal"
        visible={isShowPicker}
        transparent
        animationType={animationType}
        supportedOrientations={["portrait", "landscape"]}
        onOrientationChange={onOrientationChange}
      >
        <View
          style={styles.stContainModal}
          onStartShouldSetResponder={cancelPicke}
        >
          <View style={[styles.styContainPickerIOS]}>
            <View style={styles.stHeaderPicker}>
              <Text onPress={cancelPicke} style={styles.stTextActionHeader}>
                {"Huỷ"}
              </Text>
              <Text
                style={[
                  styles.stTextActionHeader,
                  {
                    flex: 1,
                    color: "black",
                    fontWeight: "400",
                  },
                ]}
              >
                {""}
              </Text>
              <Text onPress={onPressAgree} style={styles.stTextActionHeader}>
                {"Đồng ý"}
              </Text>
            </View>
            <DateTimePicker
              testID="dateTimePicker"
              {...props}
              value={dataSelected || new Date()}
              //   mode={mode}
              display={"inline"}
              onChange={handleOnChange}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

// const styles = StyleSheet.create({
//   viewContainer: {
//     alignSelf: "stretch",
//     height: 45,
//     // backgroundColor: "#345",
//   },
//   stContainModal: {
//     flex: 1,
//     height: "100%",
//     width: "100%",
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0,0,0,0.5)",
//     borderBottomColor: "#345",
//   },
//   viewContainerButton: {
//     justifyContent: "center",
//     height: 45,
//     fontWeight: "700",
//   },
//   stTextButtonSelected: {
//     alignContent: "center",
//     fontSize: 16,
//     alignItems: "center",
//     marginHorizontal: 5,
//   },
//   stHeaderPicker: {
//     position: "absolute",
//     top: 0,
//     flexDirection: "row",
//     alignSelf: "stretch",
//     alignContent: "center",
//     justifyContent: "center",
//     backgroundColor: Color.backgroundSearch,
//     paddingHorizontal: 12,
//   },
//   styContainPickerIOS: {
//     height: 500,
//     width: "100%",
//     justifyContent: "center",
//     backgroundColor: "white",
//     position: "absolute",
//     bottom: 0,
//     // backgroundColor: '#345',
//   },

//   stTextActionHeader: {
//     textAlign: "center",
//     alignSelf: "center",
//     justifyContent: "center",
//     fontSize: 16,
//     color: Color.Indigo,
//     fontWeight: "700",
//     paddingVertical: 15,
//   },
// });
