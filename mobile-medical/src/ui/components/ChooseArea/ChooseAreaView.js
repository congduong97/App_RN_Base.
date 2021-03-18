import React, { useCallback, useEffect, useRef, useMemo } from "react";
import { StyleSheet, Text, View, FlatList, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  TextView, HeaderView, InputView,
  SCREEN_WIDTH,
} from "../../../components";
import IconView, { IconViewType } from "../../../components/IconView";
import {
  Dimension,
  Colors,
  Fonts,
  fontsValue,
  concatenateString,
  ImagesUrl,
} from "../../../commons";
import { useApp, useMergeState } from "../../../AppProvider";
import models from "../../../models";
import AreaObject, { Areakey } from "./AreaObject";
import API from "../../../networking";
import { eraseCharacterVietnameseToLowerCase } from "../../../commons/utils/Validate";

const renderItem = ({ item, index, onPress }) => {
  const onPressHandle = () => {
    onPress && onPress({ data: item });
  };
  return (
    <TextView
      waitTitme={10}
      onPress={onPressHandle}
      style={styles.stContainRow}
      value={item?.name}
    />
  );
};

export default function ChooseAreaView(props) {
  const { id: idRequest, data, onResponse, onClose } = props;
  const dispatch = useDispatch();
  const [stateScreen, setStateScreen] = useMergeState({
    dataSheet: models.getProvinces(),
    typeSheet: 1,
    titleSheet: "Chọn tỉnh thành",
    keySearch: '',
    dataAll: models.getProvinces()
  });
  const { dataSheet, typeSheet, titleSheet, keySearch, dataAll } = stateScreen;
  const refArea = useRef(new AreaObject());
  const areaData = useMemo(() => refArea.current, [typeSheet]);

  const onSelectedItem = ({ id, data }) => {
    if (typeSheet === 1) {
      areaData[Areakey.cityCode] = data?.areaCode;
      areaData[Areakey.cityName] = data?.name;
      requestAreaChildren(data?.areaCode, 1);
    } else if (typeSheet === 2) {
      areaData[Areakey.districtCode] = data?.areaCode;
      areaData[Areakey.districtName] = data?.name;
      requestAreaChildren(data?.areaCode, 2);
    } else if (typeSheet === 3) {
      areaData[Areakey.wardCode] = data?.areaCode;
      areaData[Areakey.wardName] = data?.name;

      areaData[Areakey.areaFullName] = concatenateString(
        ", ",
        areaData[Areakey.wardName],
        areaData[Areakey.districtName],
        areaData[Areakey.cityName]
      );
      onResponse && onResponse({ id: idRequest, data: areaData });
    }
  };

  const goBackHandle = () => {
    if (typeSheet === 1) {
      onClose && onClose();
    } else if (typeSheet === 2) {
      setStateScreen({
        dataSheet: models.getProvinces(),
        dataAll: models.getProvinces(),
        typeSheet: 1,
        keySearch: "",
        titleSheet: "Chọn Tỉnh thành",
      });
    } else if (typeSheet === 3) {
      requestAreaChildren(areaData[Areakey.cityCode], 1);
    }
  };

  const onChangeSearchValue = ({ id, data }) => {
    setStateScreen({
      keySearch: data
    })
  };
  const handleSearch = () => {
    let data = []
    // if (typeSheet === 1) {
    // data = models.filtterDataProvinces(keySearch)
    data = dataAll.filter((item) => eraseCharacterVietnameseToLowerCase(item.name).indexOf(eraseCharacterVietnameseToLowerCase(keySearch)) > -1);
    // } else if (typeSheet === 2) {
    //   data = dataAll.filter((item) => item.name.toLowerCase().indexOf(keySearch.toLowerCase()) > -1);
    // } else if (typeSheet === 3) {
    //   data = dataAll.filter((item) => item.name.toLowerCase().indexOf(keySearch.toLowerCase()) > -1);
    // }
    setStateScreen({
      dataSheet: data
    })
  };
  const requestAreaChildren = async (parentCode, typeSheetCurren) => {
    let areaResponse = await API.requestAreaChildren(dispatch, parentCode);
    if (areaResponse) {
      if (typeSheetCurren === 1) {
        setStateScreen({
          dataSheet: areaResponse,
          dataAll: areaResponse,
          typeSheet: 2,
          keySearch: '',
          titleSheet: "Chọn Quận huyện",
        });
      } else if (typeSheetCurren === 2) {
        setStateScreen({
          dataSheet: areaResponse,
          dataAll: areaResponse,
          typeSheet: 3,
          keySearch: '',
          titleSheet: "Chọn Phường xã",
        });
      }
    }
  };
  ///////////
  const renderItemCall = useCallback(({ item, index }) =>
    renderItem({
      item,
      index,
      onPress: onSelectedItem,
    })
  );

  const EmptyView = () => {
    return (
      <View style={styles.stContentEmpty}>
        <Text style={styles.stTextTitleEmpty}>
          {"Không có dữ liệu !"}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.stContain}>
      <HeaderView titleScreen={titleSheet} onGoBack={goBackHandle} />
      <InputView
        // label={typeSheet === 1 ? "Tìm tỉnh thành:" : (typeSheet === 2 ? "Tìm quận huyện" : "Tìm phường xã")}
        placeholder={typeSheet === 1 ? "Nhập tỉnh thành.." : (typeSheet === 2 ? "Nhập quận huyện.." : "Nhập phường xã")}
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
        style={{
        //   margin: Dimension.margin2x,
        //  marginTop: 0,
          flex: 1
        }}
        data={dataSheet}
        renderItem={renderItemCall}
        keyExtractor={(item, index) => index.toString()}
        numColumns={1}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyView />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  stContain: {
    flex: 1,
    paddingBottom: fontsValue(30),
  },
  stContainRow: {
    // height: Dimension.heightInputView,\
    paddingVertical:fontsValue(12),
    marginHorizontal: Dimension.margin3x,
    alignItems: "center",
    borderBottomColor: Colors.colorBg2,
    borderBottomWidth: 0.5,
  },
  stTextValue: {
    fontSize: Dimension.fontSize16,
    fontFamily: Fonts.SFProTextLight,
  },
  /////

  stInput: {
    margin: Dimension.margin2x,
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
  stIconSearch: {
    backgroundColor: Colors.colorBtBack,
    height: "100%",
    width: Platform.OS === "ios" ? 56 : 40,
  },
  stImageEmpty: {
    marginTop: -56,
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    alignSelf: "center",
  },
  stContentEmpty: { justifyContent: "center" },
  stTextTitleEmpty: {
    textAlign: "center",
    fontSize: Dimension.fontSize18,
    fontFamily: Fonts.SFProDisplaySemibold,
    color: Colors.colorTextMenu,
    letterSpacing: 0.5,
    lineHeight: 27,
    marginBottom: Dimension.margin,
  },
});
