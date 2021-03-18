import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, FlatList, Dimensions } from "react-native";
import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  Colors,
  Dimension,
  Fonts,
} from "../../../../commons";
import { TextView, ButtonView } from "../../../../components";
import models from "../../../../models";
import ActionKey from "../ActionKey";

export default function ChoiceValueView(props) {
  const { typeDialog, refDialog, onPress } = props;
  let titleDialog = "";
  let dataChoice = [];
  if (typeDialog === ActionKey.ShowPoupLocation) {
    titleDialog = "Địa lý";
    dataChoice = [
      {
        id: 1,
        name: "Tỉnh Yên Bái",
        code: "BV1",
      },
      {
        id: 2,
        name: "Lào Cai",
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
      ? Colors.colorText
      : Colors.colorTitleScreen;
    const handleOnPress = () => {
      onSelectedItem({ index: index, data: item });
    };
    return (
      <TextView
        onPress={handleOnPress}
        // nameIconLeft={"ic-pin"}
        // colorIconLeft={colorText}
        // sizeIconLeft={Dimension.sizeIcon}
        nameIconRight={item?.isChecked && "ic-check"}
        colorIconRight={Colors.colorMain}
        style={styles.stContainsItem}
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
        style={{ marginBottom: 35, maxHeight: Dimensions.get('window').height / 2 }}
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
