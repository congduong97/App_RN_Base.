import {useNavigation} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import {Platform, StyleSheet} from 'react-native';
import {Color, Dimension, Font} from '../../commons/constants';
import {InputView, ScreensView, TextView} from '../../components';
import {IconViewType} from '../../components/IconView';
import AppNavigate from '../../navigations/AppNavigate';
import GuideView from './Guide';

export default function SearchGuideScreen(props) {
  const {} = props;
  const [categoriesname, setCategoriesName] = useState('Tất cả danh mục');
  const reftSearch = useRef({pattern: '', categoryId: null});
  const navigation = useNavigation();
  const handleRequestSearch = () => {
    AppNavigate.navigateToSearchScreen(navigation.dispatch, reftSearch.current);
  };
  const onChangeTextSearch = ({data}) => {
    reftSearch.current['pattern'] = data;
  };
  const onResponseCategory = (dataResponse) => {
    reftSearch.current['categoryId'] = dataResponse.categoryId;
    reftSearch.current['categoryName'] = dataResponse.categoryName;
    setCategoriesName(dataResponse.categoryName);
  };
  const navigationToSearchScreen = () => {
    AppNavigate.navigateToSimCategoriesScreen(navigation.dispatch, {
      pattern: reftSearch.current['pattern'],
      categoryId: reftSearch.current['categoryId'],
      onResponse: onResponseCategory,
    });
  };
  return (
    <ScreensView
      titleScreen={'Tìm Kiếm'}
      styleContent={styles.styleContainBody}>
      <InputView
        id={'pattern'}
        iconLeft={'search'}
        iconLeftSize={18}
        offsetLabel={-4}
        onPressIconLeft={handleRequestSearch}
        style={styles.containsInputView}
        styleInput={styles.styleInputSearch}
        styleTextInput={{
          fontWeight: '700',
          fontFamily: Font.FiraSansRegular,
          color: 'black',
        }}
        value={reftSearch.current['pattern']}
        iconLeftColor={Color.colorIcon}
        placeholder="Nhập số cần tìm..."
        placeholderTextColor={Color.colorText}
        onChangeText={onChangeTextSearch}
        onSubmitEditing={handleRequestSearch}
        keyboardType={'phone-pad'}
        returnKeyType={Platform.OS === 'ios' ? 'done' : 'search'}
      />

      <TextView
        onPress={navigationToSearchScreen}
        nameIconLeft="list-ul"
        typeIconLeft={IconViewType.FontAwesome}
        sizeIconLeft={20}
        colorIconLeft={Color.MayaBlue}
        style={styles.containsCategiries}
        styleValue={styles.styleTextAllCategories}
        value={categoriesname}
      />
      <GuideView showGuide={true} />
      {/* </View> */}
    </ScreensView>
  );
}

const styles = StyleSheet.create({
  styleContainBody: {
    backgroundColor: 'white',
  },

  stylesContainSearch: {
    alignItems: 'center',
    width: null,
    margin: Dimension.margin,
    alignSelf: 'center',
  },
  containsCategiries: {
    margin: Dimension.margin15,
    marginTop: Dimension.margin,
  },
  styleTextAllCategories: {
    marginLeft: Dimension.margin10,
    fontWeight: '700',
  },
  styleInputSearch: {
    height: 45,
    borderRadius: 30,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: Color.Border,
  },
  containsInputView: {
    marginHorizontal: Dimension.margin20,
    marginVertical: Dimension.margin10,
  },
});
