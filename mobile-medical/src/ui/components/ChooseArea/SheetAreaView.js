import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { useMergeState } from "../../../AppProvider";
import { InputView } from "../../../components";
import AreaObject from "./AreaObject";
import {
  SCREEN_HEIGHT,
  Dimension,
  Fonts,
  Colors,
  fontsValue,
  heightSheet,
} from "../../../commons";
import ChooseAreaView from "./ChooseAreaView";

export default function SheetAreaView(props) {
  const {
    id: idView,
    onReponse,
    stypeContainInput,
    styleInput,
    styleTextInput,
    textDisable,
    initName = "",
  } = props;
  const refBottomSheet = useRef();
  const [stateScreen, setStateScreen] = useMergeState({
    sheetHeight: null,
    areaFullName: initName,
  });
  const { sheetHeight, areaFullName } = stateScreen;

  useEffect(() => {
    sheetHeight > 0
      ? refBottomSheet.current.open()
      : refBottomSheet.current.close();
  }, [sheetHeight]);

  const showSheet = () => {
    setStateScreen({ sheetHeight: SCREEN_HEIGHT });
  };

  const onCloseSheet = () => {
    setStateScreen({ sheetHeight: 0 });
  };
  /////
  const onResponseArea = ({ data }) => {
    onReponse && onReponse({ id: idView, data });
    ////
    setStateScreen({ sheetHeight: 0, areaFullName: data?.areaFullName });
  };
  ////////////

  return (
    <View>
      <InputView
        id={idView}
        isShowLabel
        editable={false}
        label={
          <Text>
          <Text style={{ color: "red" }}>*</Text> {"Khu vực"} 
          </Text>
        }
        isLableTick={true}
        placeholder={"Chọn phường/Xã - Quận/huyện - Tỉnh/thành phố..."}
        placeholderTextColor={Colors.textLabel}
        style={{ ...styles.stContainInput, ...stypeContainInput }}
        styleInput={{ ...styles.stInput, ...styleInput }}
        styleTextInput={{ ...styles.styleTextInput, ...styleTextInput }}
        textDisable={{ ...styles.textDisable, ...textDisable }}
        value={areaFullName}
        onChangeText={onResponseArea}
        onPress={showSheet}
      />
      <RBSheet
        ref={refBottomSheet}
        animationType="fade"
        height={sheetHeight}
        openDuration={200}
        closeOnPressMask={true}
        closeOnPressBack={false}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(255, 255, 255,0.6)",
          },
          container: {
            borderTopRightRadius: Dimension.radius,
            borderTopLeftRadius: Dimension.radius,
          },
        }}
      >
        <ChooseAreaView
          bottomSheet={refBottomSheet.current}
          onResponse={onResponseArea}
          onClose={onCloseSheet}
        />
      </RBSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  stContainInput: {
    marginTop: Dimension.margin4x,
    borderBottomColor: Colors.colorBg2,
    borderBottomWidth: 1,
    position: "relative",
  },
  stInput: {
    borderWidth: 0,
  },
  styleTextInput: {
    color: Colors.colorText,
    fontSize: Dimension.fontSize14,
    fontFamily: Fonts.SFProDisplayRegular,
    marginHorizontal: Dimension.margin5,
  },
  textDisable: {
    color: Colors.colorText,
    fontSize: Dimension.fontSize14,
    fontFamily: Fonts.SFProDisplayRegular,
    marginHorizontal: Dimension.margin5,
  },
});
