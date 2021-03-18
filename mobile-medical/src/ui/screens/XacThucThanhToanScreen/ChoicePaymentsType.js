import React, { useCallback, useState, useEffect } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
} from "react-native";
import { Colors, Dimension, Fonts, fontsValue } from "../../../commons";
import { IconView, TouchableOpacityEx } from "../../../components";
const DEVICE_HEIGHT = Dimensions.get("window").height;
const checked = require("../../../../assets/images/checked.png");
const uncheck = require("../../../../assets/images/uncheck.png");

// const dataPayments = [
//   {
//     id: 1,
//     title: "Visa / Master card",
//     icon: "ic-pay",
//     value: 0,
//   },
//   {
//     id: 2,
//     title: "Thẻ bệnh viện",
//     icon: "ic-pay",
//     value: 1,
//   },
//   {
//     id: 3,
//     title: "Ví điện tử (Momo, Viettelpay)",
//     icon: "ic-pin",
//     value: 2,
//   },
//   {
//     id: 4,
//     title: "Thẻ ATM nội địa",
//     icon: "ic-cash",
//     value: 3,
//   },
// ];

const renderItem = ({ item, index, onPress }) => {
  return (
    <TouchableOpacityEx
      data={item}
      onPress={onPress}
      style={{
        flexDirection: "row",
        borderBottomWidth: 0.5,
        borderBottomColor: "#e6e6e6",
        // borderTopWidth: index === 0 ? 0.5 : 0,
        paddingHorizontal: 12,
        fontFamily: "Lato-Regular",
        paddingVertical: 12,
      }}
    >
      {/* <IconView
        name={item.icon}
        size={16}
        color={item.isChecked ? "black" : "#747F9E"}
      /> */}
      <Text
        style={{
          flex: 1,
          marginLeft: 12,
          color:  "black" ,
          fontSize:Dimension.fontSize16,
          fontFamily:Fonts.SFProDisplayRegular
        }}
      >
        {item.title}
      </Text>

      {item.isChecked ? (
        <IconView name={"ic-check1"} size={16} color={Colors.colorMain} />
      ) : (
        <View />
      )}
    </TouchableOpacityEx>
  );
};

export default function ChoicePaymentsType(props) {
  const { typeDialog, onChangeValue, refDialog, dataSelected, dataPayments } = props;
  const [reRender, setRerender] = useState(false);

  useEffect(() => {
    dataPayments.forEach(
      (item) => (item.isChecked = item.id === dataSelected?.id ? true : false)
    );
    setRerender(!reRender);
  }, [dataSelected]);
  const onSelectedItem = ({ data }) => {
    onChangeValue && onChangeValue({ id: typeDialog, data });
    refDialog.hideDialog();
  };

  const renderItemView = useCallback(({ item, index }) =>
    renderItem({
      item,
      index,
      onPress: onSelectedItem,
    })
  );

  return (
    <View style={styles.stContents}>
      <Text style={styles.stTextTitleDialog}>{"Phương pháp thanh toán"}</Text>
      <FlatList
        // style={{ height: DEVICE_HEIGHT / 2 }}
        data={dataPayments}
        renderItem={renderItemView}
        keyExtractor={(item) => item.id.toString()}
        numColumns={1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  stContents: {
    paddingHorizontal: Dimension.margin2x,
    paddingBottom: Dimension.margin2x,
  },
  stTextTitleDialog: {
    marginBottom: Dimension.margin3x,
    color: Colors.colorTextMenu,
    fontSize: Dimension.fontSizeHeader,
    fontFamily: Fonts.SFProDisplayRegular,
    textAlign: "center",
    letterSpacing: -fontsValue(0.3),
    marginTop: fontsValue(20),
  },
});
