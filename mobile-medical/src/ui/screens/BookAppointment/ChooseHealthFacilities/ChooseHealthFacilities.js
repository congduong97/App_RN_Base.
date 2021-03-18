import React, { useCallback } from "react";
import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { Colors, Dimension, Fonts, fontsValue, } from "../../../../commons";
import { TextView, InputView } from "../../../../components";
import { IconViewType } from "../../../../components/IconView";
import { PopupType } from "../../../components";
import { useApp, useMergeState } from "../../../../AppProvider";
import { eraseCharacterVietnameseToLowerCase } from "../../../../commons/utils/Validate";
export { PopupType };
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
      // sizeIconLeft={Dimension.sizeIcon20}
      nameIconRight={isChecked && "check-circle"}
      typeIconRight={IconViewType.MaterialCommunityIcons}
      sizeIconRight={20}
      colorIconRight={Colors.colorMain}
      style={styles.stContainsItem}
      value={item?.name}
      styleContainerText={styles.styContainText}
      styleValue={[
        styles.stTextItem,
        { color: colorText},
      ]}
    />
  );
};

export default function PopupChoiceView(props) {
  const { typeDialog, refDialog, onPress, dataSelected, keyCheck } = props;
  const { medicalSpecial } = useSelector(
    (state) => state.MakeAppointmentReducer
  );

  const { heathFaciProcessFeeb } = useSelector(
    (state) => state.HeathFacilitiesReducer
  );
  let titleDialog = "";
  let dataDialog = [];
  if (typeDialog === PopupType.ShowHealthFacilities) {
    titleDialog = "Chọn cơ sở y tế khám";
    dataDialog = props.data
    if (dataDialog && dataDialog.length > 0) {
      dataDialog.forEach(
        (item) =>
          (item.isChecked = item.id === dataSelected?.[keyCheck] ? true : false)
      );
    }
  }

  const [stateScreen, setStateScreen] = useMergeState({
    keySearch: '',
    dataList: dataDialog
  });
  const { keySearch, dataList } = stateScreen;

  const onSelectedItem = ({ index, data }) => {
    onPress && onPress({ id: typeDialog, data });
    refDialog.hideDialog();
  };

  const handleSearch = () => {
    let data = dataDialog.filter((item) => eraseCharacterVietnameseToLowerCase(item.name).includes(eraseCharacterVietnameseToLowerCase(keySearch)))
    setStateScreen({ dataList: data })
  }

  const onChangeSearchValue = ({ id, data }) => {
    setStateScreen({ keySearch: data })
  }

  const renderItemView = useCallback(({ item, index }) =>
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
          {"Không có dữ liệu cơ sở y tế !"}
        </Text>
      </View>
    );
  };

  return (
    <View style={{ height: Dimensions.get('window').height * 5 / 6 }}>
      <Text style={styles.stTextTitleDialog}>{titleDialog}</Text>
      <InputView
        id={"idSearch"}
        // label={"Tìm kiếm tên cơ sở y tế:"}
        placeholder={"Nhập tên cơ sở y tế..."}
        placeholderTextColor={Colors.textLabel}
        iconRightName={"ic-search"}
        iconRighSize={24}
        onPressIconRight={handleSearch}
        iconRightStyle={styles.stIconSearch}
        // offsetLabel={Platform.OS === "ios" ? -1 : -3}
        styleViewLabel={{ backgroundColor: "white", paddingHorizontal: 3 }}
        iconRightColor={'black'}
        style={styles.stInput}
        value={keySearch}
        styleInput={styles.styleContainInput}
        onChangeText={onChangeSearchValue}
      />
      <FlatList
        style={{flex:1,marginBottom:20}}
        data={dataList}
        renderItem={renderItemView}
        keyExtractor={(item, index) => index.toString()}
        numColumns={1}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyView />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  stContainsItem: {
    paddingHorizontal: Dimension.padding2x,
    paddingVertical: Dimension.padding,
    flexDirection: "row",
    alignItems: "center",
  },

  stTextTitleDialog: {
    marginBottom: Dimension.margin2x,
    color: Colors.colorTextMenu,
    fontSize: Dimension.fontSizeHeader,
    fontFamily: Fonts.SFProDisplayRegular,
    textAlign: "center",
    letterSpacing: -fontsValue(0.3),
    marginTop: fontsValue(20),
  },

  styContainText: {
    marginLeft: Dimension.margin5,
    flex: 1,
  },

  stTextItem: {
    color: Colors.colorTitleScreen,
    fontSize: Dimension.fontSizeMenu,
    fontFamily: Fonts.SFProDisplayRegular,
  },
  stIconSearch: {
    // backgroundColor: Colors.colorBtBack,
    // height: "100%",
    // width: Platform.OS === "ios" ? 56 : 40,
  },

  stInput: {
    marginVertical: 12,
    marginHorizontal: Dimension.margin2x,
    // backgroundColor: "#3456",
    borderRadius: Dimension.radiusButton,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
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
