import React, { useCallback, useRef, useState } from "react";
import { StyleSheet, Text, View, FlatList, Platform, Dimensions } from "react-native";
import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  Colors,
  Dimension,
  Fonts,
  fontsValue,
} from "../../../commons";
import { useApp, useMergeState } from "../../../AppProvider";
import { TextView, ButtonView, InputView } from "../../../components";
import IconView, { IconViewType } from "../../../components/IconView";
import models from "../../../models";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { eraseCharacterVietnameseToLowerCase } from "../../../commons/utils/Validate";

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

const renderItem = ({ index, item, onPress }) => {
  const isChecked = item?.isChecked;
  const colorText = isChecked ? Colors.colorTextMenu : Colors.colorTitleScreen;
  const handleOnPress = () => {
    onPress && onPress({ index: index, data: item });
  };
  return (
    <TextView
      onPress={handleOnPress}
      // nameIconLeft={"ic-pin"}
      // colorIconLeft={isChecked ? Colors.colorMain : Colors.colorTitleScreen}
      // sizeIconLeft={Dimension.sizeIcon}
      nameIconRight={isChecked && "check-circle"}
      typeIconRight={IconViewType.MaterialCommunityIcons}
      sizeIconRight={20}
      colorIconRight={Colors.colorMain}
      style={styles.stContainsItem}
      value={item?.name}
      styleContainerText={styles.styContainText}
      styleValue={[
        styles.stTextItem,
        { color: colorText, fontWeight: isChecked ? "700" : "400" },
      ]}
    />
  );
};

export default function ProvinceAreaView(props) {
  const { refDialog } = props;
  const onSelectedItem = ({ id, data }) => {
    refDialog && refDialog.hideDialog();
    props.onPress(id, data)
  };
  var dataArea = models.getProvinces();

  var dataItemYenBai = dataArea.filter(item => item.areaCode == 15);
  if (dataArea.indexOf(dataItemYenBai[0]) !== -1) {
    dataArea = array_move(dataArea, dataArea.indexOf(dataItemYenBai[0]), 0)
  }

  const [stateScreen, setStateScreen] = useMergeState({
    keySearch: '',
    dataList: dataArea
  });
  const { keySearch, dataList } = stateScreen;

  const handleSearch = () => {
    let data = dataArea.filter((item) => eraseCharacterVietnameseToLowerCase(item.name).includes(eraseCharacterVietnameseToLowerCase(keySearch)))
    setStateScreen({ dataList: data })
  }

  const onChangeSearchValue = ({ id, data }) => {
    setStateScreen({ keySearch: data })
  }

  const renderItemCall = useCallback(({ item, index }) =>
    renderItem({
      item,
      index,
      onPress: onSelectedItem,
    })
  );

  const EmptyView = () => {
    return (
      <View style={{ justifyContent: "center", minHeight: 100 }}>
        <Text style={styles.stTextTitleEmpty}>
          {"Không có dữ liệu Địa lý !"}
        </Text>
      </View>
    );
  };

  return (
    <View style={{ height: Dimensions.get('window').height * 5 / 6 }}>
      <Text style={styles.stTextTitleDialog}>{"Địa lý"}</Text>
      <InputView
        id={"idSearch"}
        // label={"Tìm kiếm địa lý:"}
        placeholder={"Nhập địa chỉ..."}
        placeholderTextColor={Colors.textLabel}
        iconRightName={"ic-search"}
        iconRighSize={24}
        onPressIconRight={handleSearch}
        // iconRightStyle={styles.stIconSearch}
        // offsetLabel={Platform.OS === "ios" ? -1 : -3}
        styleViewLabel={{ backgroundColor: "white", paddingHorizontal: 3 }}
        iconRightColor={'black'}
        style={styles.stInput}
        value={keySearch}
        styleInput={styles.styleContainInput}
        onChangeText={onChangeSearchValue}
      />
      <FlatList
        style={{}}
        data={dataList}
        renderItem={renderItemCall}
        keyExtractor={(item) => item.id.toString()}
        numColumns={1}
        ListEmptyComponent={<EmptyView />}
      />
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
  stIconSearch: {
    backgroundColor: Colors.colorBtBack,
    height: "100%",
    width: Platform.OS === "ios" ? 56 : 40,
  },
  stInput: {
    margin: Dimension.margin,
    marginHorizontal: 12,
    // marginTop: Dimension.margin2x,
    borderRadius: Dimension.radiusButton,
    // borderBottomWidth: 1,
    // borderBottomColor: Colors.colorBg2,
  },
  styleContainInput: {
    height: fontsValue(46),
    borderRadius:fontsValue(16),
    backgroundColor:'#F8F8F8',
    borderColor:'white',
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
});
