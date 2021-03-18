import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  Colors,
  Dimension,
  Fonts,
  fontsValue,
} from "../../../../commons";
import { TextView, ButtonView } from "../../../../components";
import models from "../../../../models";
import ActionKey from "../ActionKey";

export default function ChoiceValueView(props) {
  const { typeDialog, refDialog, onPress } = props;
  let titleDialog = "";
  let dataChoice = [];
  if (typeDialog === ActionKey.ShowPoupRelationship) {
    titleDialog = "Chọn mối quan hệ";
    dataChoice = models.getRelationship();
  } else if (typeDialog === ActionKey.Gender) {
    titleDialog = "Chọn giới tính";
    dataChoice = [
      {
        id: 1,
        name: "nam",
        code: "male",
      },
      {
        id: 2,
        name: "Nữ",
        code: "female",
      },
      {
        id: 3,
        name: "Khác",
        code: "other",
      },
    ];
  }

  // dataChoice.forEach(
  //   (item) => (item.isChecked = item.id === props.itemSelect?.id ? true : false)
  // );
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

    const onPressAccept = () => {
      onPress && onPress({ id: typeDialog, data: item });
      refDialog.hideDialog();
    };

    return (
      <TextView
        onPress={onPressAccept}
        nameIconLeft={"ic-pin"}
        colorIconLeft={colorText}
        sizeIconLeft={Dimension.sizeIcon}
        nameIconRight={item?.isChecked && "ic-check"}
        colorIconRight={Colors.colorMain}
        style={styles.stContainsItem}
        value={item?.name}
        styleContainerText={styles.styContainText}
        styleValue={[styles.stTextItem, { color: colorText }]}
      />
    );
  };

  const onSelectedItem = ({ index, data }) => {
    // dataDialog.forEach(
    //   (item) => (item.isChecked = item.id === data.id ? true : false)
    // );
    // setItemSelected(data);
    // setRefresh(!refresh)
  };

  return (
    <>
      <Text style={styles.stTextTitleDialog}>{titleDialog}</Text>
      <FlatList
        style={{ marginBottom: fontsValue(80) }}
        data={dataDialog}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={1}
        showsVerticalScrollIndicator={false}
      />
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
    color: Colors.colorTextMenu,
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
});
