import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef } from 'react';
import { Platform, SectionList, StyleSheet, Text, View } from 'react-native';
import { Color, Dimension, Font } from '../../commons/constants';
import { groupBy } from '../../commons/utils';
import { IconView, InputView, ScreensView, TextView } from '../../components';
import models from '../../models';
import AppNavigate from '../../navigations/AppNavigate';

const NUM_COLUMN = 2;

function HeaderView(props) {
  const { onPress, valueCurrent, isDisable } = props;
  const onChangeValue = ({ id, data }) => {
    valueCurrent[id] = data;
  };
  return (
    <InputView
      id={'pattern'}
      iconLeft={'search'}
      iconLeftSize={18}
      offsetLabel={-4}
      editable={!isDisable}
      onPressIconLeft={onPress}
      style={styles.containsInputView}
      styleInput={styles.styleInputSearch}
      styleTextInput={{
        fontWeight: '700',
        fontFamily: Font.FiraSansRegular,
      }}
      value={valueCurrent['pattern']}
      iconLeftColor={Color.colorIcon}
      placeholder="Nhập số cần tìm..."
      placeholderTextColor={Color.colorText}
      onChangeText={onChangeValue}
      keyboardType={'phone-pad'}
      returnKeyType={Platform.OS === 'ios' ? 'done' : 'search'}
    />
  );
}

function renderSectionHeader({ section }) {
  const { title } = section;
  return (
    <View style={styles.titleBlock}>
      <IconView
        name="caret-right"
        type="FontAwesome"
        color="white"
        size={25}
        color={Color.MayaBlue}
        size={25}
        style={{ marginRight: 8 }}
      />
      <Text style={styles.titleSection}>{title.toUpperCase()}</Text>
    </View>
  );
}

function renderButtom({ item, idSelected, onPress }) {
  if (!item.code) {
    return <View style={styles.containsButtom} key={item.name.toString()} />;
  }
  const isSelected = idSelected === item.id;
  const styleSelect = isSelected
    ? styles.styleButtonSelected
    : styles.styleButton;
  const styleText = isSelected ? styles.textButtonSelected : styles.textButton;
  return (
    <TextView
      key={item.name.toString()}
      nameIconLeft={isSelected && 'tick-inside-circle'}
      sizeIconLeft={14}
      colorIconLeft={'white'}
      styleIconLeft={styles.styleIconCheck}
      id={'Type-SelectedItem'}
      data={item}
      onPress={onPress}
      style={styleSelect}
      styleContainerText={styles.styleContainerTextUtilitiesTag}
      styleText={styleText}>
      {`${item.name}`}
    </TextView>
  );
}

function renderItemView({ item, index, section, idSelected, onPress }) {
  if (index % NUM_COLUMN !== 0) return null;
  const items = [];
  for (let i = index; i < index + NUM_COLUMN; i++) {
    if (i >= section.data.length) {
      break;
    }
    items.push(renderButtom({ item: section.data[i], idSelected, onPress }));
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
      }}>
      {items}
    </View>
  );
}

export default function SimCategoriesScreen(props) {
  const { } = props;
  const categoryList = models.getCategoriesData();
  const route = useRoute();
  const { pattern, categoryId = null } = route.params || {};
  const onResponse = route?.params?.onResponse || null;
  const refData = useRef({
    categoryId: categoryId,
    pattern: pattern,
  });
  const navigation = useNavigation();
  const handleOnPress = ({ id, data }) => {
    if (id === 'Type-SelectedItem') {
      refData.current['categoryId'] = data.id;
      if (onResponse) {
        refData.current['categoryName'] = data.name;
        onResponse(refData.current);
        navigation.goBack();
      } else {
        AppNavigate.navigateToSearchScreen(
          navigation.dispatch,
          refData.current,
        );
      }
    }
  };

  const cateforiesGroup = Object.entries(groupBy(categoryList, 'typeName')).map(
    (item) => {
      return {
        title: item[0],
        data: item[1],
      };
    },
  );
  useEffect(() => { }, []);
  ///

  const renderItem = useCallback(
    ({ item, index, section }) =>
      renderItemView({
        item,
        index,
        section,
        idSelected: categoryId,
        onPress: handleOnPress,
      }),
    [],
  );

  return (
    <ScreensView
      isScroll={false}
      centerElement={
        <HeaderView
          onPress={handleOnPress}
          isDisable={onResponse}
          // onChangeValue={onChangeValue}
          valueCurrent={refData.current}
        />
      }
      styleContent={styles.container}>
      <SectionList
        style={{ width: '100%' }}
        sections={cateforiesGroup}
        keyExtractor={(item, index) => item.toString() + index}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyboardShouldPersistTaps={'handled'}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
        stickySectionHeadersEnabled={true}
      />
    </ScreensView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Color.HomeColor,
  },

  styleContainsHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stylesContainSearch: {
    width: null,
    margin: Dimension.margin,
    marginLeft: 50,
    height: 40,
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderWidth: 0,
    borderRadius: 40,
    marginRight: 10,
  },

  titleBlock: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: Color.HomeColor,
    marginBottom: Dimension.margin10,
  },

  titleSection: {
    fontFamily: Font.FiraSansRegular,
    fontSize: 16,
    fontWeight: '700',
    // textAlign: 'center',
    paddingVertical: 10,
  },

  containsButtom: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 3,
    backgroundColor: Color.White,
    marginHorizontal: 10,
  },

  styleButton: {
    width: '100%',
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 5,
    backgroundColor: Color.White,
    shadowOpacity: 0.25,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowColor: '#000000',
    elevation: 3,

    margin: 3,
  },
  styleButtonSelected: {
    width: '100%',
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    elevation: 3,
    flex: 1,
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: Color.Supernova,
    marginHorizontal: 5,
    padding: 1,
    borderWidth: 1,
    borderColor: 'white',
    shadowColor: Color.Border,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,

    margin: 3,
  },

  textButton: {
    // textAlign: 'center',
    color: 'black',
    padding: 5,
    fontSize: 14,
  },
  textButtonSelected: {
    // textAlign: 'center',
    color: Color.Indigo,
    color: 'white',
    padding: 5,
    fontSize: 14,
    fontWeight: '700',
  },
  styleInputSearch: {
    height: 40,
    borderRadius: 30,
    backgroundColor: 'white',
    borderColor: 'white',
    marginLeft: 25,
  },
  containsInputView: {
    marginHorizontal: Dimension.margin20,
    marginVertical: Dimension.margin10,
  },
  //////////
  containerUtilitiesTagSelect: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    margin: 3,
    borderColor: Color.Indigo,
    borderWidth: 1,
    borderRadius: 2,
    backgroundColor: 'white',
    elevation: 3,
    shadowColor: Color.Border,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
  },
  styleIconCheck: {
    position: 'absolute',
    top: 2,
    left: 2,
  },
});
