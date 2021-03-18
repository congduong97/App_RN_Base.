import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef,
} from "react";
import { StyleSheet, Text, View } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { useMergeState } from "../../../AppProvider";
import { InputView } from "../../../components";
import {
  SCREEN_HEIGHT,
  Dimension,
  Fonts,
  Colors,
  fontsValue,
  heightSheet,
} from "../../../commons";
import ChoosePictureView from "./ChoosePictureView";
import ActionSheetType from "./ActionSheetType";
import ChooseTypeExamination from "./ChooseTypeExamination";
import ChoosePictureMultiple from "./ChoosePictureMultiple";
export { ChoosePictureView, ActionSheetType };

function ActionSheet(props, ref) {
  const {
    children,
    id: idView,
    onReponse,
    actionType = ActionSheetType.ChoosePicture,
  } = props;
  const refBottomSheet = useRef(ref);
  const [stateScreen, setStateScreen] = useMergeState({
    sheetHeight: 0,
  });
  const { sheetHeight } = stateScreen;
  useImperativeHandle(ref, () => ({
    open: () => {
      onOpenSheet();
    },
    close: () => {
      onCloseSheet();
    },
  }));
  useEffect(() => {
    sheetHeight > 0
      ? refBottomSheet.current.open()
      : refBottomSheet.current.close();
  }, [sheetHeight]);

  function onOpenSheet() {
    setStateScreen({ sheetHeight: 220 });
  }

  const onCloseSheet = () => {
    setStateScreen({ sheetHeight: 0 });
  };
  /////
  const onResponses = (id) => {
    onReponse && onReponse(id);
    ////
    setStateScreen({ sheetHeight: 0 });
  };
  ////////////

  const renderContentSheet = (bottomSheet) => {
    if (children) {
      return children
    } else if (actionType === ActionSheetType.ChoosePicture) {
      return (<ChoosePictureView
        id={idView}
        bottomSheet={bottomSheet}
        onResponses={onResponses}
        onClose={onCloseSheet}
      />)
    } else if (actionType === ActionSheetType.ChooseTypeExamination) {
      return (<ChooseTypeExamination
        id={idView}
        bottomSheet={bottomSheet}
        onResponses={onResponses}
        onClose={onCloseSheet}
        dataOptions={props.dataOptions}
      />)
    } else if (actionType === ActionSheetType.ChoosePictureMultiple) {
      return (<ChoosePictureMultiple
        id={idView}
        bottomSheet={bottomSheet}
        onResponses={onResponses}
        onClose={onCloseSheet}
        dataOptions={props.dataOptions}
      />)
    }
  };

  return (
    <RBSheet
      ref={refBottomSheet}
      animationType="fade"
      height={sheetHeight}
      openDuration={200}
      closeOnPressMask={false}
      closeOnPressBack={true}
      onClose={onCloseSheet}
      customStyles={{
        wrapper: {
          backgroundColor: "#00000050",
        },
        container: {
          backgroundColor: "transparent",
          borderTopRightRadius: Dimension.radius,
          borderTopLeftRadius: Dimension.radius,
        },
      }}
    >
      {renderContentSheet(refBottomSheet.current)}
    </RBSheet>
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
    fontFamily: Fonts.SFProTextSemibold,
    marginHorizontal: Dimension.margin5,
  },
  textDisable: {
    color: Colors.colorText,
    fontSize: Dimension.fontSize14,
    fontFamily: Fonts.SFProTextSemibold,
    marginHorizontal: Dimension.margin5,
  },
});

export default forwardRef(ActionSheet);
