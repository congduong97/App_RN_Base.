import React, {forwardRef, useImperativeHandle, useEffect, useRef} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useMergeState} from '../../AppProvider';
import {InputView} from '../../components';
import {SCREEN_HEIGHT, fontsValue} from '../../commons/utils/devices';
import {Dimension, Font, Color} from '../../commons/constants';
import ChoosePictureView from './ChoosePictureView';
import ActionSheetType from './ActionSheetType';
export {ChoosePictureView, ActionSheetType};

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
  const {sheetHeight} = stateScreen;
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
    setStateScreen({sheetHeight: 220});
  }

  const onCloseSheet = () => {
    setStateScreen({sheetHeight: 0});
  };
  /////
  const onResponses = ({data}) => {
    onReponse && onReponse({id: idView, data});
    ////
    setStateScreen({sheetHeight: 0});
  };
  ////////////

  const renderContentSheet = (bottomSheet) => {
    return children
      ? children
      : actionType === ActionSheetType.ChoosePicture && (
          <ChoosePictureView
            id={idView}
            bottomSheet={bottomSheet}
            onResponses={onResponses}
            onClose={onCloseSheet}
          />
        );
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
          backgroundColor: '#00000050',
        },
        container: {
          backgroundColor: 'transparent',
          borderTopRightRadius: Dimension.radius,
          borderTopLeftRadius: Dimension.radius,
        },
      }}>
      {renderContentSheet(refBottomSheet.current)}
    </RBSheet>
  );
}

const styles = StyleSheet.create({
  stContainInput: {
    marginTop: Dimension.margin25,
    borderBottomColor: Color.light_gray,
    borderBottomWidth: 1,
    position: 'relative',
  },
  stInput: {
    borderWidth: 0,
  },
  styleTextInput: {
    color: Color.colorText,
    fontSize: Dimension.fontSize14,
    fontFamily: Font.FiraSansBold,
    marginHorizontal: Dimension.margin5,
  },
  textDisable: {
    color: Color.colorText,
    fontSize: Dimension.fontSize14,
    fontFamily: Font.FiraSansBold,
    marginHorizontal: Dimension.margin5,
  },
});

export default forwardRef(ActionSheet);
