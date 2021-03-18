import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, FlatList, Image, ToastAndroid, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  Colors,
  Dimension,
  Fonts,
  convertTimeDateVN,
  fontsValue,
  validateImageUri,
  deepCopyObject
} from "../../../../commons";
import { FORMAT_DD_MM_YYYY } from "../../../../commons/utils/DateTime";
import { TextView, ButtonView, InputView, IconView, TouchableOpacityEx } from "../../../../components";
import { IconViewType } from "../../../../components/IconView";
import models from "../../../../models";
import { TextAvatar } from "../../../components/TextAvatar";

function array_move(arr, old_index, new_index) {
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr; // for testing
};

export default function ChoiceValueView(props) {
  const { typeDialog, refDialog, onPress } = props;
  let titleDialog = "";
  let dataChoice = [];
  titleDialog = "Chọn người khai báo y tế";

  let data = deepCopyObject(props.data) || []
  // let data = models.getListPatientRecords();
  dataChoice = data.filter(item => item.relationship == "me");
  if (data && dataChoice && data.length > 0) {
    dataChoice = array_move(data, data.indexOf(dataChoice[0]), 0)
  } else {
    dataChoice = []
  }
  console.log("data;:   ", data)

  dataChoice.forEach(
    (item) => (item.isChecked = item.id === props.itemSelect?.id ? true : false)
  );
  const [itemSelected, setItemSelected] = useState(props.itemSelect);
  const [dataDialog, setDataDialog] = useState(dataChoice);

  const onPressCancel = () => {
    refDialog.hideDialog();
  };

  const renderItem = ({ item, index }) => {
    // const colorText = item?.isChecked
    //   ? Colors.colorTextMenu
    //   : Colors.colorTitleScreen;
    // const handleOnPress = () => {
    //   onSelectedItem({ index: index, data: item });
    // };
    // return (
    //   <TextView
    //     onPress={handleOnPress}
    //     nameIconLeft={"ic-pin"}
    //     colorIconLeft={colorText}
    //     sizeIconLeft={Dimension.sizeIcon}
    //     // nameIconRight={item?.isChecked ? "ic-check": ''}
    //     nameIconRight={item?.isChecked ? "radiobox-marked" : "radiobox-blank"}
    //     typeIconRight={IconViewType.MaterialCommunityIcons}
    //     sizeIconRight={20}
    //     colorIconRight={Colors.colorMain}
    //     style={[styles.stContainsItem, { flex: 1, marginLeft: 4 }]}
    //     value={item?.name + (item?.relationship ? ' (' + models.getRelationshipName(item?.relationship) + ')' : '')}
    //     styleContainerText={styles.styContainText}
    //     styleValue={[styles.stTextItem, { color: colorText }]}
    //   />
    // );
    const name = item?.name;
    const dob = item?.dob;
    const birthday = convertTimeDateVN(dob, FORMAT_DD_MM_YYYY);
    const relationship = models.getRelationshipName(item?.relationship);
    const avatarItem = item?.avatar;
    const imageUrl = validateImageUri(avatarItem);

    return (
      <View style={styles.stylesContain}>
        {imageUrl ?
          <Image source={imageUrl} style={styles.stImageFacility} />
          : <TextAvatar name={name || "User"} textColor={Colors.colorMain} size={60} borderRadius={30} backgroundColor={Colors.colorSecondary}></TextAvatar>
        }
        <View
          style={{
            justifyContent: "space-evenly",
            marginLeft: 12,
            flex: 1,
            height: "100%",
          }}
        >
          <TouchableOpacityEx
            onPress={() => { onSelectedItem({ index: index, data: item }); }}
          >
            <Text style={styles.stTextName}>
              {name}
            </Text>
          </TouchableOpacityEx>

          <TextView
            style={styles.stContainText}
            styleValue={styles.stTextValue}
            value={relationship || "Khác"}
            stylesIconLeft={styles.stylesIconLeft}
            nameIconLeft={"ic-user"}
            colorIconLeft={Colors.colorDefault}
            sizeIconLeft={14}
          />
          {/* <TextView
          style={styles.stContainText}
          styleValue={styles.stTextValue}
          value={gender}
          stylesIconLeft={styles.stylesIconLeft}
          nameIconLeft={"ic-gender"}
          colorIconLeft={Colors.colorMain}
          sizeIconLeft={14}
        /> */}
          <TextView
            style={styles.stContainText}
            styleValue={styles.stTextValue}
            value={birthday}
            stylesIconLeft={styles.stylesIconLeft}
            nameIconLeft={"ic-calendar"}
            colorIconLeft={Colors.colorDefault}
            sizeIconLeft={14}
          />
        </View>
        <IconView
          style={styles.stIconCheck}
          onPress={() => { onSelectedItem({ index: index, data: item }); }}
          name={item?.isChecked
            ? "radiobox-marked"
            : "radiobox-blank"
          }
          type={IconViewType.MaterialCommunityIcons}
          size={24}
        />
      </View>
    )
  };

  const onPressAccept = () => {
    onPress && onPress({ id: typeDialog, data: itemSelected });
    refDialog.hideDialog();
  };

  const onSelectedItem = ({ index, data }) => {
    dataDialog.map(
      (item) => (item.isChecked = item.id === data.id ? true : false)
    );
    // setDataDialog(dataDialog)
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
    <View style={{ height: Dimensions.get('window').height * 3 / 4 }}>
      <Text style={styles.stTextTitleDialog}>{titleDialog}</Text>
      <FlatList
        style={{ marginBottom: 35, flex: 1 }}
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
          disabled={!itemSelected.id}
          title={"Lựa chọn"}
          style={styles.stBottonChoose}
          onPress={onPressAccept}
        />
      </View>
    </View>
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
  stylesContain: {
    padding: fontsValue(15),
    flex: 1,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderBottomWidth: 0,
    borderRadius: Dimension.radius,
    //   shadowOpacity: 0.25,
    //   shadowRadius: Dimension.radius,
    //   shadowOffset: {
    //     width: 0,
    //     height: 6,
    //   },
    // //  shadowColor: "#ffff",
    //   elevation: 6,
    //  marginBottom: 10
  },
  stContainText: {
    // flex: 1,
    alignItems: "center",
  },
  stTextName: {
    fontSize: Dimension.fontSize16,
    color: Colors.colorTextMenu,
    fontFamily: Fonts.SFProDisplaySemibold,
  },

  stTextValue: {
    fontSize: Dimension.fontSize14,
    color: Colors.colorTextMenu,
    fontWeight: "400",
    fontFamily: Fonts.SFProDisplayRegular,
    marginLeft: Dimension.margin,
  },
  stIconCheck: {
    //  width: 24,
    //  height: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  /////

  styleText: {
    fontSize: Dimension.fontSizeHeaderPopup,
    color: Colors.colorText1,
    fontWeight: "700",
    fontFamily: Fonts.SFProDisplayRegular,
  },
  styleContainerDate: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
  },

  stylesIconLeft: {
    width: 30,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    color: Colors.textLabel,
  },

  styleButton: {
    backgroundColor: "#00C6AD",
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 24,
    marginBottom: 12,
    borderRadius: 12,
  },
  stImageFacility: {
    borderRadius: 30,
    width: 60,
    height: 60,
  },
});
