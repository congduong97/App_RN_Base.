import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, FlatList, Image, ToastAndroid, Dimensions, TextInput } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  Colors,
  Dimension,
  Fonts,
} from "../../../../commons";
import {
  convertDateFormatVN,
  isCompareTime,
  FORMAT_DD_MM_YYYY,
  convertStringToFormatServer
} from "../../../../commons/utils/DateTime";
import { TextView, ButtonView, InputView, IconView } from "../../../../components";
import models from "../../../../models";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Toast from "react-native-simple-toast";
import { useApp, useMergeState } from "../../../../AppProvider";

export default function ChoiceValueView(props) {
  const { itemSelect, refDialog, onPress } = props;
  const keyFromDate = 'keyFromDate'
  const keyToDate = 'keyToDate'
  const [stateScreen, setStateScreen] = useMergeState({
    indexPickerDate: keyFromDate,
    isShowPickerDate: false,
    textFromDate: itemSelect.startDate,
    textToDate: itemSelect.endDate,
  });
  const { isShowPickerDate, textFromDate, textToDate, indexPickerDate } = stateScreen;


  let titleDialog = "";
  let dataChoice = [];
  titleDialog = "Chọn thời gian";
  dataChoice = []

  const onPressCancel = () => {
    refDialog.hideDialog();
  };

  const onPressValueInput = ({ id, value }) => {
    switch (id) {
      case keyFromDate:
        showPickerDate(id)
        break
      case keyToDate:
        showPickerDate(id)
        break
    }
  }

  const showPickerDate = (id, isShow = true) => {
    setStateScreen({
      isShowPickerDate: isShow,
      indexPickerDate: id
    })
  }

  const onChangeText = ({ id, data }) => {
    switch (id) {
      case keyFromDate:
        setStateScreen({ textFromDate: data })
        break
      case keyToDate:
        setStateScreen({ textToDate: data })
        break
    }
  };

  const handleSelectedPickerDate = (date) => {
    let dateFormat = convertDateFormatVN(date)
    if (indexPickerDate == keyFromDate) {
      if (textToDate && isCompareTime(dateFormat, textToDate)) {
        // console.log("indexPickerDate:    ", indexPickerDate)
        // console.log("textToDate:    ", textToDate)
        Toast.showWithGravity(
          "Từ ngày không được lớn hơn đến ngày",
          Toast.LONG,
          Toast.CENTER
        );
      } else {
        setStateScreen({
          textFromDate: convertDateFormatVN(date),
          isShowPickerDate: false
        })
      }
    } else if (indexPickerDate == keyToDate) {
      console.log("indexPickerDate:    ", indexPickerDate)
      console.log("textFromDate:    ", textFromDate)
      if (textFromDate && isCompareTime(textFromDate, dateFormat)) {
        Toast.showWithGravity(
          "Đến ngày không được nhỏ hơn từ ngày",
          Toast.LONG,
          Toast.CENTER
        );
      } else {
        setStateScreen({
          textToDate: convertDateFormatVN(date),
          isShowPickerDate: false
        })
      }
    }
  }

  const onPressAccept = () => {
    // if (!textFromDate) {
    //   Toast.show("Bạn cần chọn ngày bắt đầu")
    // } else if (!textToDate) {
    //   Toast.show("Bạn cần chọn ngày kết thúc")
    // } else {
    onPress && onPress({
      startDate: textFromDate,
      endDate: textToDate,
    });
    refDialog.hideDialog();
    // }
  };

  return (
    <View >
      <Text style={styles.stTextTitleDialog}>{titleDialog}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', margin: 12 }}>
        <View style={{ flex: 1 }}>
          {/* <Text style={[styles.styleTextLabel]}>{'Từ ngày'}</Text> */}
          <InputView
            id={keyFromDate}
            onPress={onPressValueInput}
            isCleared
            multiline
            editable={false}
            style={[{ flex: 1, marginRight: 8 }]}
            styleInput={[styles.styleTextInputElement, {
            }]}
            placeholder={"Từ ngày..."}
            value={textFromDate}
            onChangeText={onChangeText}
          />
        </View>

        <IconView
          name={'ic-arrow-right'}
          style={{ marginTop: 24 }}
        />

        <View style={{ flex: 1 }}>
          <Text style={[styles.styleTextLabel]}>{'Đến ngày'}</Text>

          <InputView
            id={keyToDate}
            onPress={onPressValueInput}
            isCleared
            multiline
            editable={false}
            style={[{ flex: 1, marginRight: 8 }]}
            styleInput={[styles.styleTextInputElement, {
            }]}
            placeholder={"Đến ngày..."}
            value={textToDate}
            onChangeText={onChangeText}
          />
        </View>
      </View>

      <View style={styles.stFooterBotton}>
        {/* <ButtonView
          title={"Thoát"}
          style={styles.stBottonCancel}
          textColor={Colors.colorMain}
          onPress={onPressCancel}
        /> */}
        <ButtonView

          title={"Lựa chọn"}
          style={styles.stBottonChoose}
          onPress={onPressAccept}
        />
      </View>

      <DateTimePickerModal
        isVisible={isShowPickerDate}
        mode={'date'}
        locale={'vi'}
        date={new Date()}
        confirmTextIOS='Thay Đổi'
        cancelTextIOS='Hủy'
        titleIOS={"Chọn ngày"}
        onConfirm={handleSelectedPickerDate}
        onCancel={() => setStateScreen({
          isShowPickerDate: false
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({

  stTextTitleDialog: {
    marginBottom: 16,
    color: Colors.colorTextenu,
    fontSize: Dimension.fontSizeHeader,
    fontFamily: Fonts.SFProDisplayRegular,
    // fontWeight: "bold",
    textAlign: "center",
    letterSpacing: -0.3,
    marginTop: 20,
  },

  styleTextInputElement: {
    flexDirection: 'row',
    borderColor: Colors.colorBorder,
    // borderColor: configs.colorBorder,
    borderWidth: 0.5,
    borderRadius: 12,
    alignItems: 'center',
  },

  stBottonCancel: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.colorMain,
    backgroundColor: "white",
    marginRight: 8,
  },

  stBottonChoose: {
    flex: 1,
  },
  stFooterBotton: {
    flexDirection: "row",
    marginBottom: 16,
    paddingHorizontal: 16,
    marginTop: 40
  },
  styleTextLabel: {
    backgroundColor: "transparent",
    fontSize: 10,
    color: Colors.textLabel,
    fontStyle: 'italic',
    marginLeft: 8
  },
});
