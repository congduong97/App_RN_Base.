import React, {useEffect, useRef} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useMergeState} from '../../AppProvider';
import {Color, Dimension, Font} from '../../commons/constants';
import {SCREEN_HEIGHT} from '../../commons/utils/devices';
import {InputView} from '../../components';
import ChooseAreaView from './ChooseAreaView';
const iconSize = 18;

export default function SheetAreaView(props) {
  const {
    id: idView,
    onReponse,
    stypeContainInput,
    styleInput,
    styleTextInput,
    textDisable,
    initName = '',
  } = props;
  const refBottomSheet = useRef();
  const [stateScreen, setStateScreen] = useMergeState({
    sheetHeight: null,
    areaFullName: initName,
  });
  const {sheetHeight, areaFullName} = stateScreen;

  useEffect(() => {
    sheetHeight > 0
      ? refBottomSheet.current.open()
      : refBottomSheet.current.close();
  }, [sheetHeight]);

  const showSheet = () => {
    setStateScreen({sheetHeight: SCREEN_HEIGHT});
  };

  const onCloseSheet = () => {
    setStateScreen({sheetHeight: 0});
  };
  /////
  const onResponseArea = ({data}) => {
    onReponse && onReponse({id: idView, data});
    ////
    setStateScreen({sheetHeight: 0, areaFullName: data?.areaFullName});
  };
  ////////////
  console.log('areaFullName', areaFullName);
  return (
    <View>
      <InputView
        id={idView}
        editable={false}
        iconLeft={'home-address'}
        iconLeftSize={iconSize}
        offsetLabel={-4}
        style={styles.containsInputView}
        iconLeftColor={Color.colorIcon}
        styleTextInput={{fontWeight: 'bold', color: 'black'}}
        styleInput={styles.styleInput}
        styleViewLabel={styles.styleViewLabel}
        textDisable={{...styles.textDisable, ...textDisable}}
        value={areaFullName}
        label={<Text>{'Khu vực: '}</Text>}
        placeholder="Phường/xã, Quận/Huyện, Tỉnh /Thành"
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
            backgroundColor: 'rgba(255, 255, 255,0.6)',
          },
          container: {
            borderTopRightRadius: Dimension.borderRadius,
            borderTopLeftRadius: Dimension.borderRadius,
          },
        }}>
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
    borderColor: '#8B95A0',
    borderWidth: 1,
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
    color: 'black',
    fontSize: Dimension.fontSize14,
    fontFamily: Font.FiraSansBold,
    marginHorizontal: Dimension.margin5,
  },

  ////
  containsInputView: {
    // marginHorizontal: Dimension.margin20,
    marginVertical: Dimension.margin10,
  },

  styleInput: {},

  styleViewLabel: {
    backgroundColor: 'white',
    paddingHorizontal: 3,
  },
});
