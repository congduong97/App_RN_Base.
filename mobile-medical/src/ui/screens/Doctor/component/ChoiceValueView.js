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
  fontsValue
} from "../../../../commons";
import { TextView, ButtonView, InputView, IconView } from "../../../../components";
import models from "../../../../models";
import ActionKey from "../ActionKey";
import { useApp, useMergeState } from "../../../../AppProvider";
import { eraseCharacterVietnameseToLowerCase } from "../../../../commons/utils/Validate";

export default function ChoiceValueView(props) {
  const { typeDialog, refDialog, onPress } = props;
  const [refresh, setRefresh] = useState(false)
  let titleDialog = "";
  let dataChoice = [];
  var titleKeySearch = ''
  var titleEmpty = ''
  if (typeDialog === ActionKey.ShowChooseAMedicalFacility) {
    titleDialog = "Chọn cơ sở y tế khám";
    titleKeySearch = "Tìm kiếm cơ sở y tế"
    titleEmpty = "Không có dữ liệu cơ sở y tế"
    dataChoice = props.data
  } else if (typeDialog === ActionKey.ShowChooseChuyenKhoa) {
    titleDialog = "Chọn chuyên khoa";
    titleKeySearch = "Tìm kiếm chuyên khoa"
    titleEmpty = "Không có dữ liệu chuyên khoa"
    dataChoice = props.data
  } else if (typeDialog === ActionKey.ShowChooseHocHamHocVi) {
    titleDialog = "Học hàm học vị";
    titleKeySearch = "Tìm kiếm Học hàm học vị"
    titleEmpty = "Không có dữ liệu Học hàm học vị"
    dataChoice = props.data
  } else if (typeDialog === ActionKey.ShowChooseClinic) {
    titleDialog = "Chọn phòng khám";
    titleKeySearch = "Tìm kiếm phòng khám"
    titleEmpty = "Không có dữ liệu phòng khám"
    dataChoice = props.data
  } else if (typeDialog === ActionKey.Gender) {
    titleDialog = "Chọn giới tính";
    titleKeySearch = "Tìm kiếm giới tính"
    titleEmpty = "Không có dữ liệu giới tính"
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

  dataChoice && dataChoice.forEach(
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

  const [stateScreen, setStateScreen] = useMergeState({
    keySearch: '',
    dataList: dataDialog
  });
  const { keySearch, dataList } = stateScreen;

  const handleSearch = () => {
    let data = dataDialog.filter((item) => eraseCharacterVietnameseToLowerCase(item.name).includes(eraseCharacterVietnameseToLowerCase(keySearch)))
    setStateScreen({ dataList: data })
  }

  const onChangeSearchValue = ({ id, data }) => {
    setStateScreen({ keySearch: data })
  }

  const onSelectedItem = ({ index, data }) => {
    // console.log("data:    ", JSON.stringify(data.id))
    // dataDialog.map(
    //   (item) => {
    //     console.log("item:    ", JSON.stringify(item.id))
    //     item.isChecked = (item.id == data.id ? true : false)
    //   }
    // );
    // console.log("dataDialog:    ", dataDialog)
    // setDataDialog(dataDialog)
    // setItemSelected(data);
    // setRefresh(!refresh)

    onPress && onPress({ id: typeDialog, data: data });
    refDialog.hideDialog();
  };

  // const renderItemCall = useCallback(({ item, index }) =>
  //   renderItem({
  //     item,
  //     index,
  //     onPress: onSelectedItem,
  //   })
  // );

  const EmptyView = () => {
    return (
      <View style={{ justifyContent: "center", minHeight: 100 }}>
        <Text style={styles.stTextTitleEmpty}>
          {titleEmpty}
        </Text>
      </View>
    );
  };

  return (
    <>
      <Text style={styles.stTextTitleDialog}>{titleDialog}</Text>

      <InputView
        id={"idSearch"}
        // label={titleKeySearch}
        placeholder={titleKeySearch}
        placeholderTextColor={Colors.textLabel}
        iconRightName={"ic-search"}
        iconRighSize={24}
        onPressIconRight={handleSearch}
        // iconRightStyle={styles.stIconSearch}
        // offsetLabel={Platform.OS === "ios" ? -1 : -3}
        styleViewLabel={{ backgroundColor: "white", paddingHorizontal: 3 }}
        iconRightColor={"black"}
        style={styles.stInput1}
        value={keySearch}
        styleInput={styles.styleContainInput}
        onChangeText={onChangeSearchValue}
      />

      <FlatList
        style={{ marginBottom: 35, maxHeight: Dimensions.get('window').height / 2 }}
        // data={dataDialog}
        data={dataList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={1}
        ListEmptyComponent={<EmptyView />}
      />
      {/* <View style={styles.stFooterBotton}>
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
      </View> */}
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

  stInput1: {
    marginVertical: 12,
    marginHorizontal: Dimension.margin,
    // backgroundColor: "#3456",
    borderRadius: Dimension.radiusButton,
    // borderBottomWidth: 1,
    // borderBottomColor: Colors.colorBg2,
  },

  styleContainInput: {
    height: fontsValue(46),
    borderRadius: fontsValue(16),
    backgroundColor: '#F8F8F8',
    borderColor: 'white',
  },
  stTextTitleEmpty: {
    textAlign: "center",
    fontSize: Dimension.fontSize18,
    fontFamily: Fonts.SFProDisplaySemibold,
    color: Colors.colorTextMenu,
    letterSpacing: 0.5,
    lineHeight: 27,
    marginBottom: Dimension.margin,
    marginTop: -18,
  },
  stIconSearch: {
    backgroundColor: Colors.colorBtBack,
    height: "100%",
    width: Platform.OS === "ios" ? 56 : 40,
  },
});
