/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useMemo, useRef} from 'react';
import {FlatList, StyleSheet, View, Platform} from 'react-native';
import {useDispatch} from 'react-redux';
import {useMergeState} from '../../AppProvider';
import {Color, Dimension, Font} from '../../commons/constants';
import {concatenateString} from '../../commons/utils/format';

import {HeaderView, InputView, TextView} from '../../components';
import models from '../../models';
import API from '../../networking';
import AreaObject, {Areakey} from './AreaObject';

const renderItem = ({item, index, onPress}) => {
  const onPressHandle = () => {
    onPress && onPress({data: item});
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
  const {id: idRequest, data, onResponse, onClose} = props;
  const dispatch = useDispatch();
  const [stateScreen, setStateScreen] = useMergeState({
    dataSheet: models.getProvinceData(),
    typeSheet: 1,
    titleSheet: 'Chọn tỉnh thành',
    keySearch: '',
    dataAll: [],
  });
  const {dataSheet, typeSheet, titleSheet, keySearch, dataAll} = stateScreen;
  const refArea = useRef(new AreaObject());
  const areaData = useMemo(() => refArea.current, [typeSheet]);

  const onSelectedItem = ({id, data}) => {
    if (typeSheet === 1) {
      areaData[Areakey.cityCode] = data?.id;
      areaData[Areakey.cityName] = data?.name;
      requestAreaChildren(data?.id, 1);
    } else if (typeSheet === 2) {
      areaData[Areakey.districtCode] = data?.id;
      areaData[Areakey.districtName] = data?.name;
      requestAreaChildren(data?.id, 2);
    } else if (typeSheet === 3) {
      areaData[Areakey.wardCode] = data?.id;
      areaData[Areakey.wardName] = data?.name;
      areaData[Areakey.areaFullName] = concatenateString(
        ', ',
        areaData[Areakey.wardName],
        areaData[Areakey.districtName],
        areaData[Areakey.cityName],
      );
      console.log('areaData', areaData);
      onResponse && onResponse({id: idRequest, data: areaData});
    }
  };

  const goBackHandle = () => {
    if (typeSheet === 1) {
      onClose && onClose();
    } else if (typeSheet === 2) {
      setStateScreen({
        dataSheet: models.getProvinceData(),
        typeSheet: 1,
        titleSheet: 'Chọn Tỉnh thành',
      });
    } else if (typeSheet === 3) {
      requestAreaChildren(areaData[Areakey.cityCode], 1);
    }
  };

  const onChangeSearchValue = ({id, data}) => {
    setStateScreen({
      keySearch: data,
    });
  };
  const handleSearch = () => {
    let data = [];
    if (typeSheet === 1) {
      data = models.filtterDataProvinces(keySearch);
    } else if (typeSheet === 2) {
      data = dataAll.filter((item) => item.name.indexOf(keySearch) > -1);
    } else if (typeSheet === 3) {
      data = dataAll.filter((item) => item.name.indexOf(keySearch) > -1);
    }
    setStateScreen({
      dataSheet: data,
    });
  };
  const requestAreaChildren = async (parentCode, typeSheetCurren) => {
    if (typeSheetCurren === 1) {
      let areaResponse = models.getDistrictData(parentCode);
      setStateScreen({
        dataSheet: areaResponse,
        dataAll: areaResponse,
        typeSheet: 2,
        titleSheet: 'Chọn Quận huyện',
      });
    } else if (typeSheetCurren === 2) {
      let areaResponse = models.getWardData(parentCode);
      setStateScreen({
        dataSheet: areaResponse,
        dataAll: areaResponse,
        typeSheet: 3,
        titleSheet: 'Chọn Phường xã',
      });
    }
  };
  ///////////
  const renderItemCall = useCallback(({item, index}) =>
    renderItem({
      item,
      index,
      onPress: onSelectedItem,
    }),
  );
  return (
    <View style={styles.stContain}>
      <HeaderView titleScreen={titleSheet} onGoBack={goBackHandle} />
      <InputView
        label={
          typeSheet === 1
            ? 'Tìm tỉnh thành:'
            : typeSheet === 2
            ? 'Tìm quận huyện'
            : 'Tìm phường xã'
        }
        placeholder={'Nhập tên cần tìm...'}
        placeholderTextColor={'gray'}
        iconRightName={'ic-search'}
        iconRighSize={24}
        onPressIconRight={handleSearch}
        iconRightStyle={styles.stIconSearch}
        offsetLabel={Platform.OS === 'ios' ? -1 : -3}
        styleViewLabel={{backgroundColor: 'white', paddingHorizontal: 3}}
        iconRightColor={Color.MayaBlue}
        style={styles.stInput}
        styleInput={styles.styleContainInput}
        onChangeText={onChangeSearchValue}
      />
      <FlatList
        style={{
          margin: Dimension.margin2x,
          marginTop: 0,
        }}
        data={dataSheet}
        renderItem={renderItemCall}
        keyExtractor={(item, index) => index.toString()}
        numColumns={1}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  stContain: {
    flex: 1,
    paddingBottom: 30,
  },
  stContainRow: {
    height: Dimension.heightButton,
    marginHorizontal: Dimension.margin,
    alignItems: 'center',
    borderBottomColor: Color.colorBg2,
    borderBottomWidth: 0.5,
  },
  stTextValue: {
    fontSize: Dimension.fontSize16,
    fontFamily: Font.FiraSansMedium,
  },
  /////

  stInput: {
    margin: Dimension.margin2x,
    borderRadius: Dimension.borderRadius,
  },

  styleContainInput: {
    height: 46,
    borderColor: Color.borderColor,
  },
  stIconSearch: {
    backgroundColor: Color.MayaBlue,
    height: '100%',
    width: Platform.OS === 'ios' ? 56 : 40,
  },
});
