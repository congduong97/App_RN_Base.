import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import Actions from '../../redux/actions';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import Toast, {DURATION} from 'react-native-easy-toast';
import {useDispatch, useSelector} from 'react-redux';
import {useApp, useMergeState} from '../../AppProvider';
import ActionsKey from '../../commons/ActionsKey';
import {Color, Dimension, Size, Telecoms} from '../../commons/constants';
import {verticalScale} from '../../commons/utils/devices';
import {IconView, InputView, ScreensView, Checkbox} from '../../components';
import models from '../../models';
import AppNavigate from '../../navigations/AppNavigate';
import API from '../../networking';
import actions from '../../redux/actions';
import CreatCartView from '../Orders/Cart/CreatCartView';
import ButtonCopyView from './ButtonCopyView';
import FilterView from './FilterView';
import FilterKey from './FilterView/FilterKey';
import FilterObject, {selectTelecom} from './FilterView/FilterObject';
import SimDetailView from './SimDetailView';
import SimItemView from './SimItemView';
import styles from './styles';
import MenuDrawer from '../../components/MenuDrawer';

const SORT = {
  ASC: 'price.asc',
  DESC: 'price.desc',
};

const TagTelecom = (props) => {
  const {id, onSelectTag, multipleTeco = ''} = props;
  let telcoIds = multipleTeco ? multipleTeco.split(',').map((x) => +x) : [];
  let tagAll = [{id: 0, name: 'Tất Cả', code: 'Tất Cả', icon: null}];
  let tagTelecom = [...tagAll, ...Telecoms];
  const handleSelectTag = (telecomId) => {
    onSelectTag && onSelectTag({id, telecomId});
  };
  return tagTelecom.map((item) => {
    let styleTag =
      telcoIds.indexOf(item.id) > -1
        ? styles.tagTelecomFocus
        : styles.tagTelecomNotFocus;
    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => handleSelectTag(item.id)}
        style={{justifyContent: 'center', borderRadius: 10}}>
        <Text style={[styles.tagTelecom, styleTag]}>{item.code}</Text>
      </TouchableOpacity>
    );
  });
};

export default function SearchScreen(props) {
  const {} = props;
  const route = useRoute();
  const {refDialog} = useApp();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const toastRef = useRef(null);
  const {
    showGuide,
    pattern = '',
    telecomId,
    priceFrom,
    priceTo,
    fengshui,
    categoryId,
  } = route.params;
  const refFilterData = useRef(
    new FilterObject().initialData(
      pattern,
      telecomId,
      priceFrom,
      priceTo,
      fengshui,
      categoryId,
    ),
  );
  const heightSheet = verticalScale(fengshui ? 200 : 530);
  const {isQuickOrder, isShowWebPrices, isCompactUnit} = models.getAllSetting();
  const userInfo = models.getUserInfo();
  const {resultSimSearch} = useSelector((state) => state.SimReducer);
  const {isCreatedSucces} = useSelector((state) => state.OrderReducer);
  const onMomentumScrollBegin = useRef(false);
  const refSearchWords = useRef(pattern ? pattern.split('*') : []);
  useSelector((state) => state.CommonsReducer.listSimCopied);
  const dataResponse = useRef({
    listSimData: [],
    isFinished: false,
  });

  const [stateScreen, setStateScreen] = useMergeState({
    isReloadData: true,
    reRender: false,
  });

  const {isSortASC, isReloadData, reRender} = stateScreen;
  const filterCurent = useMemo(() => refFilterData.current, [isReloadData]);
  const isExistingFilter = true;
  const refBottomSheet = useRef();
  const refSimsCopy = useRef([]);
  const [menuDrawer, setMenuDrawer] = React.useState(false);

  ///////
  const simsCopy = useMemo(() => {
    return refSimsCopy.current;
  }, [refSimsCopy.current]);
  useEffect(() => {
    // showGuide && showSheetFilter();
  }, []);
  useEffect(() => {
    return () => resetComponent();
  }, []);
  useEffect(() => {
    if (isReloadData) {
      filterCurent[FilterKey.Page] = 0;
      filterCurent.isReloadData = true;
      requestSearchSim();
    }
  }, [isReloadData]);

  const resetComponent = () => {
    dispatch(actions.resetSearchSim(null));
  };
  useEffect(() => {
    if (resultSimSearch?.isRequestDone) {
      handleDataResponse();
      setStateScreen({isReloadData: false});
    }
  }, [resultSimSearch?.listSimData]);
  useEffect(() => {
    if (isCreatedSucces) {
      toastRef.current.show(
        'Bạn đã tạo đơn hàng thành công. Chúng tôi sẽ check và phản hồi lại đơn hàng sớm nhất, hoặc liên hệ: 0822.822.822 .',
        5000,
      );
      dispatch(actions.responseCreatedCart(null));
      setStateScreen({isReloadData: true});
    }
  }, [isCreatedSucces]);

  const handleDataResponse = () => {
    dataResponse.current.totalRecords = resultSimSearch.totalRecords;
    dataResponse.current.isFinished = resultSimSearch.isFinished;
    dataResponse.current.listSimData = resultSimSearch.listSimData;
    filterCurent[FilterKey.IsReloadData] = false;
    filterCurent[FilterKey.Page] = resultSimSearch.pageNext;
  };

  ////////////
  const onSelectTelecom = ({id, telecomId}) => {
    filterCurent[FilterKey.MultipleTeco] = selectTelecom(
      telecomId,
      filterCurent[FilterKey.MultipleTeco],
    );
    setStateScreen({isReloadData: true});
  };

  const onPressSort = () => {
    filterCurent[FilterKey.Sort] = isSortASC ? SORT.DESC : SORT.ASC;
    setStateScreen({isSortASC: !isSortASC, isReloadData: true});
  };

  const onChangeTextSearch = ({id, data}) => {
    filterCurent[id] = data;
    refSearchWords.current = data ? data.split('*') : [];
  };

  const showSheetFilter = () => {
    setMenuDrawer(true);
  };

  const handleOnCopy = (data) => {
    refSimsCopy.current = [];
  };

  const createCart = (simnId) => {
    refDialog.current.hideDialog();
    const {fullName, fullAddress, phone} = userInfo;
    console.log('userInfo', userInfo);
    let data = {
      customerAddress: fullAddress,
      customerName: fullName,
      customerPhone: phone,
      simId: simnId,
    };
    API.requestCreateCart(dispatch, data, isQuickOrder);
  };

  const handleOnPress = ({id, data}) => {
    if (id === ActionsKey.ShowFilterSim) {
      refFilterData.current = data;
      reloadSearchSim();
    } else if (id === ActionsKey.ShowDetailSim) {
      refDialog?.current &&
        refDialog.current
          .configsDialog({
            visibleClose: true,
          })
          .drawContents(drawSimDetailView(data, id))
          .visibleDialog();
    } else if (id === ActionsKey.ShowCreateCart) {
      if (isQuickOrder) {
        Alert.alert(
          'Xác nhận',
          'Bạn có muốn giữ sim ' + data.alias + ' không ?',
          [
            {
              text: 'Không',
              style: 'cancel',
            },
            {text: 'Có', onPress: () => createCart(data.id)},
          ],
          {cancelable: false},
        );
      } else {
        refDialog?.current &&
          refDialog.current
            .configsDialog({
              visibleClose: true,
            })
            .drawContents(drawSimDetailView(data, id))
            .visibleDialog();
      }
    } else if (id === ActionsKey.NextToCartList) {
      AppNavigate.navigateToCartsScreen(navigation.dispatch, {
        simId: data.simId,
        reloadSearchSim: () => reloadSearchSim(),
      });
    } else if (id === ActionsKey.ApiCreateCartNewAPI) {
      API.requestCreateCart(dispatch, data);
    }
  };
  /////////////

  const reloadSearchSim = () => {
    filterCurent[FilterKey.IsReloadData] = true;
    filterCurent[FilterKey.Page] = 0;
    setStateScreen({isReloadData: true});
  };

  const handleLoadMore = () => {
    if (!onMomentumScrollBegin.current) {
      dataResponse.current.isFinished = false;
      requestSearchSim();
      onMomentumScrollBegin.current = true;
    }
  };

  const requestSearchSim = () => {
    Keyboard.dismiss();
    dispatch(actions.showLoading());
    filterCurent[FilterKey.NotContains] &&
      delete filterCurent[FilterKey.NotContains];
    !filterCurent[FilterKey.MultipleTeco] &&
      delete filterCurent[FilterKey.MultipleTeco];
    API.requestSimSearch(dispatch, filterCurent);
  };

  const navigateToCreateImage = () => {
    Keyboard.dismiss();
    AppNavigate.navigateToSimsImageDesignScreen(
      navigation.dispatch,
      dataResponse.current.listSimData,
    );
  };

  /////////////

  const drawSimDetailView = (simData, typeView) => {
    return typeView === ActionsKey.ShowDetailSim ? ( ///'Act-Order'
      <SimDetailView
        navigation={navigation}
        simData={simData}
        onPress={handleOnPress}
        refDialog={refDialog.current}
      />
    ) : (
      <CreatCartView
        simData={simData}
        navigation={navigation}
        refDialog={refDialog.current}
        onPress={handleOnPress}
      />
    );
  };

  const renderContentFilter = () => {
    return (
      <FilterView
        id={ActionsKey.ShowFilterSim}
        filterData={filterCurent}
        onPressApply={handleOnPress}
        fengshui={fengshui}
        menuDrawer={setMenuDrawer}
      />
    );
  };

  const renderFooter = () => {
    if (!dataResponse.current.isFinished) {
      return (
        <>
          <Text style={{alignContent: 'center', textAlign: 'center'}}>
            Đang tải thêm
          </Text>
          <ActivityIndicator color={Color.MayaBlue} />
        </>
      );
    }
    return null;
  };

  const viewSeparator = () => {
    return <View style={styles.lineSeparator} />;
  };

  const renderItem = ({index, item}) => {
    return (
      <SimItemView
        index={index}
        isShowWebPrice={isShowWebPrices}
        itemData={item}
        simsCopy={simsCopy}
        onPress={handleOnPress}
        searchWords={refSearchWords.current}
      />
    );
  };

  const colorFiltered = isExistingFilter ? Color.MayaBlue : Color.colorText;
  const iconSort =
    isSortASC === undefined ? 'sort' : isSortASC ? 'sort-asc' : 'sort-decs';
  const colorSort = isSortASC === undefined ? Color.colorText : Color.MayaBlue;

  const handleCopyAll = ({isChecked}) => {
    if (isChecked) {
      refSimsCopy.current = [...dataResponse.current.listSimData];
    } else {
      refSimsCopy.current = [];
    }
    setStateScreen({reRender: !reRender});
  };

  const renderCopy = useCallback(() => {
    return <ButtonCopyView onPress={handleOnCopy} simCopy={simsCopy} />;
  }, [simsCopy]);

  const FilterContainer = () => (
    <View style={styles.containsSort}>
      <Text style={styles.labelResult}>
        {'Kết quả: '}
        <Text
          style={{
            fontStyle: 'italic',
            fontWeight: '700',
            fontSize: Dimension.fontSize16,
            color: 'red',
          }}>
          {dataResponse.current.totalRecords || '0'}
        </Text>
        {' Sim'}
      </Text>
      <IconView
        onPress={onPressSort}
        name={iconSort}
        color={colorSort}
        size={20}
        style={styles.styleContainIcon}
      />
    </View>
  );

  return (
    <ScreensView
      isScroll={false}
      titleScreen={'Tìm Kiếm'}
      styleContent={styles.styleContains}
      nameIconRight={'camera-filled'}
      onPressRight={navigateToCreateImage}
      renderFooter={renderCopy()}>
      <View style={styles.containsSearch}>
        <InputView
          id={FilterKey.Pattern}
          onPressIconLeft={reloadSearchSim}
          style={styles.stylesContainSearch}
          value={`${filterCurent[FilterKey.Pattern]}`}
          styleTextInput={{fontWeight: 'bold', color: Color.colorText}}
          styleInput={styles.styleInputSearch}
          iconLeft={'search'}
          iconLeftColor={Color.colorBorderDisable}
          iconLeftSize={20}
          placeholder="Nhập số cần tìm kiếm..."
          placeholderTextColor={Color.colorText}
          onChangeText={onChangeTextSearch}
          keyboardType={'phone-pad'}
          onSubmitEditing={reloadSearchSim}
          returnKeyType={Platform.OS === 'ios' ? 'done' : 'search'}
        />

        <IconView
          onPress={showSheetFilter}
          name={'filter-outline'}
          color={colorFiltered}
          size={20}
          style={styles.styleContainIcon}
        />
      </View>
      <View style={styles.containerTagTelecom}>
        <ScrollView
          style={styles.listTag}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps={'always'}>
          <TagTelecom
            id="TagTelecom"
            onSelectTag={onSelectTelecom}
            multipleTeco={filterCurent[FilterKey.MultipleTeco]}
          />
        </ScrollView>
      </View>
      <View style={styles.filterContainer}>
        <FilterContainer />
        <Checkbox
          style={{marginLeft: 2}}
          label={'Chọn tất cả'}
          onToggle={handleCopyAll}
        />
      </View>
      <FlatList
        data={dataResponse.current.listSimData}
        keyboardShouldPersistTaps="never"
        extraData={dataResponse.current.listSimData}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}${index}`}
        onEndReachedThreshold={0.02}
        removeClippedSubviews
        // initialNumToRender={10}
        ItemSeparatorComponent={viewSeparator}
        style={{marginTop: 20, marginBottom: 8}}
        showsVerticalScrollIndicator={false}
        onMomentumScrollBegin={() => {
          onMomentumScrollBegin.current = false;
        }}
        refreshControl={
          <RefreshControl
            refreshing={isReloadData}
            onRefresh={reloadSearchSim}
          />
        }
        onEndReached={handleLoadMore}
        ListFooterComponent={renderFooter}
      />
      {/**Drawer menu filter */}
      <MenuDrawer
        open={menuDrawer}
        drawerContent={renderContentFilter()}
        drawerPercentage={100}
        animationTime={250}
        overlay={true}
        opacity={0.9}
        position="right"
      />
      <Toast
        ref={toastRef}
        style={{
          backgroundColor: 'black',
          width: Size.width(95),
        }}
        position="center"
        positionValue={500}
        fadeInDuration={750}
        fadeOutDuration={2000}
        opacity={0.8}
        textStyle={{color: 'white', fontWeight: 'bold', fontSize: Size.H5}}
      />
    </ScreensView>
  );
}
