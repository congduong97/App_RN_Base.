import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, FlatList, Image, ToastAndroid } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  Colors,
  Dimension,
  Fonts,
  convertTimeDateVN
} from "../../../../commons";
import { TextView, ButtonView, InputView, IconView } from "../../../../components";
import models from "../../../../models";
import ActionKey from "../ActionKey";

export default function ChoiceValueView(props) {
  const { typeDialog, refDialog, onPress } = props;
  let titleDialog = "";
  let dataChoice = [];
  if (typeDialog === ActionKey.ShowChooseAMedicalFacility) {
    titleDialog = "Chọn cơ sở y tế khám";
    dataChoice = [
      {
        id: 1,
        name: "Bệnh viện đa khoa Yên Bái",
        code: "BV1",
      },
      {
        id: 2,
        name: "Bệnh viện đa khoa Yên Bái 1",
        code: "BV1",
      },
    ];
  }

  dataChoice.forEach(
    (item) => (item.isChecked = item.id === props.itemSelect?.id ? true : false)
  );
  const [itemSelected, setItemSelected] = useState(props.itemSelect);
  const [dataDialog, setDataDialog] = useState(dataChoice);

  const onPressCancel = () => {
    refDialog.hideDialog();
  };

  var renderItem = ({ item, index }) => {
    const colorText = item?.isChecked
      ? Colors.colorTextMenu
      : Colors.colorTitleScreen;
    const handleOnPress = () => {
      onSelectedItem({ index: index, data: item });
    };
    return (
      <TextView
        onPress={handleOnPress}
        // nameIconLeft={typeDialog !== ActionKey.ShowChooseNamePatient ? "ic-pin" : null}
        // colorIconLeft={colorText}
        // sizeIconLeft={Dimension.sizeIcon}
        nameIconRight={item?.isChecked && "ic-check"}
        colorIconRight={Colors.colorMain}
        style={[styles.stContainsItem, { flex: 1, marginLeft: 4 }]}
        value={item?.name}
        styleContainerText={styles.styContainText}
        styleValue={[styles.stTextItem, { color: colorText }]}
      />
    );
  };

  const onPressAccept = () => {
    onPress && onPress({ id: typeDialog, data: itemSelected });
    refDialog.hideDialog();
  };

  const onSelectedItem = ({ index, data }) => {
    dataDialog.forEach(
      (item) => (item.isChecked = item.id === data.id ? true : false)
    );
    setItemSelected(data);
    // setRefresh(!refresh)
  };

  // const renderItemCall = useCallback(({ item, index }) =>
  //   renderItem({
  //     item,
  //     index,
  //     onPress: onSelectedItem,
  //   })
  // );

  return (
    <>
      <Text style={styles.stTextTitleDialog}>{titleDialog}</Text>
      <FlatList
        style={{ marginBottom: 35 }}
        data={dataDialog}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={1}
      />
      <View style={styles.stFooterBotton}>
        <ButtonView
          title={"Thoát"}
          style={styles.stBottonCancel}
          textColor={Colors.colorMain}
          onPress={onPressCancel}
        />
        <ButtonView
          title={"Lựa chọn"}
          style={styles.stBottonChoose}
          onPress={onPressAccept}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  stContainsItem: {
    paddingHorizontal: 16,
    flexDirection: "row",
    paddingVertical: 12,
    alignItems: "center",
  },

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

  styContainText: {
    marginLeft: 5,
    flex: 1,
  },

  stTextItem: {
    color: Colors.colorTitleScreen,
    fontSize: Dimension.fontSizeMenu,
    fontFamily: Fonts.SFProDisplayRegular,
    fontFamily: Fonts.SFProDisplayRegular,
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
    marginLeft: 8,
  },

  stFooterBotton: {
    flexDirection: "row",
    marginBottom: 16,
    paddingHorizontal: 16,
  },

  stInput: {
    borderColor: Colors.colorBg2,
    borderWidth: 0,
  },
  textDisable: {
    color: Colors.colorText,
    fontSize: Dimension.fontSize16,
    fontFamily: Fonts.SFProDisplaySemibold,
    marginHorizontal: Dimension.margin5,
  },
  stInputTime: {
    flex: 1,
    // marginTop: 40,
    borderWidth: 0,
    // borderBottomColor: Colors.colorBg2,
    // borderBottomWidth: 1,
    position: "relative",
  },
});
