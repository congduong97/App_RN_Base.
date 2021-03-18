import React, {memo, useMemo, useRef} from 'react';
import {
  Text,
  View,
  Image,
  TouchableHighlight,
  Platform,
  ScrollView,
} from 'react-native';
import {useMergeState} from '../../../AppProvider';
import {Color, Dimension, Fates} from '../../../commons/constants';
import DeviceInfo from 'react-native-device-info';
import {ratioW} from '../../../commons/utils/devices';
import {
  Button,
  InputView,
  ScreensView,
  SelectBox,
  SelectBoxView,
  DropDownView,
  ModalDropdown,
} from '../../../components';
import Icon from 'react-native-vector-icons/Feather';
import models from '../../../models';
import {
  FirstNumbersTelco,
  NotContainNumbers,
  PaymentPackagesPicker,
} from '../../../models/ConfigsData';
import FengshuiView from './FengshuiView';
import FilterKey from './FilterKey';
import FilterObject, {convertArrayContain} from './FilterObject';
import GroupFirstNumber from './GroupFirstNumber';
import styles from './styles';

function RenderButtonFooter(props) {
  const {handleOnPress} = props;

  return (
    <View
      style={{
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'white',
        // position: 'absolute',
        left: 0,
        bottom: DeviceInfo.hasNotch() ? 60 : 75,
        paddingBottom: DeviceInfo.hasNotch() ? 50 : 0,
      }}>
      <Button
        id={'Type-Reset'}
        onPress={handleOnPress}
        color={'#fff'}
        title="Đặt Lại"
        style={styles.styleButtonReset}
        titleStyle={{color: '#000'}}
      />
      <View style={{width: 10 * ratioW}} />
      <Button
        id={'Type-ApplyFilter'}
        onPress={handleOnPress}
        color={Color.MayaBlue}
        title="TÌM KIẾM"
        style={{flex: 1, marginVertical: 20}}
      />
    </View>
  );
}

function FilterView(props) {
  const {bootSheet, filterData, onPressApply, fengshui, menuDrawer} = props;
  const categoriesArray = models.getCategoriesData(true);
  // const [isError, setIsError] = useState(false);
  const [stateScreen, setStateScreen] = useMergeState({isError: false});
  const {reRender} = stateScreen;
  const refFilterData = useRef(new FilterObject(filterData));
  const filterCurent = useMemo(() => refFilterData.current, [reRender]);
  const closedBottomSheet = () => {
    // bootSheet && bootSheet.close();
    menuDrawer(false);
  };
  const handleOnPress = ({id, data}) => {
    if (id === 'Type-Reset') {
      refFilterData.current = new FilterObject(filterData);
      setStateScreen({reRender: !reRender});
    } else if (id === 'Type-ApplyFilter') {
      convertArrayContain(filterCurent);
      onPressApply && onPressApply({id: props.id, data: filterCurent});
      closedBottomSheet();
    }
  };

  const handleChangeValue = ({id, data}) => {
    if (id === FilterKey.MenhSim) {
      filterCurent[id] = data;
    } else if (
      id === FilterKey.NotContains ||
      id === FilterKey.FirstPhones ||
      id === FilterKey.Score ||
      id === FilterKey.CategoryId ||
      id === FilterKey.PaymentPackage
    ) {
      filterCurent[id] = data;
    } else if (id === FilterKey.PriceFrom || id === FilterKey.PriceTo) {
      filterCurent[id] = data;
      if (filterCurent[FilterKey.PriceFrom] > filterCurent[FilterKey.PriceTo]) {
        setStateScreen({isError: true});
      } else {
        setStateScreen({isError: false});
      }
    } else {
      filterCurent[id] = data.id;
    }
  };
  return (
    <ScreensView
      titleScreen={'Điều Kiện Lọc'}
      isStatusBar={false}
      // isScroll={false}
      isShowBack={false}
      styleTitle={{color: Color.star}}
      extraScrollHeight={100}
      nameIconRight={'cancel'}
      styleBackground={{width: '90%', alignSelf: 'flex-end'}}
      colorIconRight={Color.Glaucous}
      onPressRight={closedBottomSheet}
      styleToolbar={{backgroundColor: 'white'}}
      styleContent={styles.styleContains}
      headerBottomView={<View style={styles.styleLineHeader} />}
      renderFooter={<RenderButtonFooter handleOnPress={handleOnPress} />}>
      {
        fengshui?.key ? (
          <>
            <Text
              style={[styles.styleTitleBlock, {width: null, marginBottom: 5}]}>
              {'SIM hợp mệnh:'}
            </Text>
            <FengshuiView
              id={FilterKey.MenhSim}
              onValueChange={handleChangeValue}
              initialValue={filterCurent[FilterKey.MenhSim]}
              titleBlock={'Chọn Sim Theo Mệnh'}
              listData={Fates}
              styleContainsItem={styles.styleContainsItemCircle}
              styleText={styles.textMenuFates}
            />
          </>
        ) : (
          <>
            <View style={[styles.styleContainPrices, {}]}>
              <Text style={styles.styleTitleBlock}>Loại số đẹp:</Text>
              <SelectBoxView
                id={FilterKey.CategoryId}
                style={styles.styleContainPicker}
                initialValue={filterCurent[FilterKey.CategoryId]}
                stylePicker={styles.stylePicker}
                onValueChange={handleChangeValue}
                label={'Tất cả'}
                data={categoriesArray}
                displayKey={'name'}
                valueKey={'id'}
              />
            </View>
            <View style={styles.styleContainPrices}>
              <Text style={styles.styleTitleBlock}>Loại thuê bao:</Text>
              <SelectBoxView
                id={FilterKey.PaymentPackage}
                initialValue={filterCurent[FilterKey.PaymentPackage]}
                style={styles.styleContainPicker}
                stylePicker={styles.stylePicker}
                onValueChange={handleChangeValue}
                label={'Tất cả'}
                data={PaymentPackagesPicker}
                displayKey={'name'}
                valueKey={'id'}
              />
            </View>

            <Text
              style={[
                styles.styleTitleBlock,
                {width: null, marginTop: Dimension.margin10},
              ]}>
              Khoảng giá (
              <Text style={{color: Color.colorText, fontWeight: '500'}}>
                VNĐ
              </Text>
              ):
            </Text>
            <View style={[styles.styleContainPrices, {marginTop: 5}]}>
              <InputView
                id={FilterKey.PriceFrom}
                style={styles.styleInputPrice}
                value={`${filterCurent[FilterKey.PriceFrom] || ''}`}
                keyboardType="phone-pad"
                styleTextInput={{fontWeight: 'bold'}}
                styleInput={styles.styleInput}
                placeholder="Giá thấp nhất"
                placeholderTextColor={Color.colorText}
                onChangeText={handleChangeValue}
                returnKeyType="done"
              />
              <Text style={{justifyContent: 'center', alignSelf: 'center'}}>
                {'=>'}
              </Text>
              <InputView
                id={FilterKey.PriceTo}
                style={styles.styleInputPrice}
                value={`${filterCurent[FilterKey.PriceTo] || ''}`}
                keyboardType="phone-pad"
                styleInput={styles.styleInput}
                styleTextInput={{fontWeight: 'bold'}}
                placeholder="Giá cao nhất"
                placeholderTextColor={Color.colorText}
                onChangeText={handleChangeValue}
                returnKeyType="done"
              />
            </View>
            {/* {isError && (
        <Text style={styles.styleTextError}>
          {"'Giá thấp nhất' không được lớn hơn 'Giá cao nhất'"}
        </Text>
      )} */}
            <GroupFirstNumber
              style={{marginLeft: 10}}
              typeGroup={FilterKey.FirstPhones}
              titleGroup={'Đầu số'}
              listValue={FirstNumbersTelco}
              initialValue={filterCurent[FilterKey.FirstPhones]}
              onPressSelected={handleChangeValue}
            />
            <GroupFirstNumber
              style={{marginLeft: 10}}
              typeGroup={FilterKey.NotContains}
              titleGroup={'Tránh số'}
              initialValue={filterCurent[FilterKey.NotContains]}
              listValue={NotContainNumbers}
              styleContainerGroup={{justifyContent: 'center', width: 300}}
              onPressSelected={handleChangeValue}
            />
            <View style={[styles.styleContainPrices, {marginHorizontal: 10}]}>
              <Text style={styles.styleTitleBlock}>Tổng điểm:</Text>
              <InputView
                id={FilterKey.Score}
                value={`${filterCurent[FilterKey.Score] || ''}`}
                keyboardType="phone-pad"
                style={{flex: 1}}
                styleTextInput={{fontWeight: 'bold'}}
                styleInput={styles.styleInput}
                placeholder="Tổng điểm"
                placeholderTextColor={Color.colorText}
                onChangeText={handleChangeValue}
                returnKeyType="done"
              />
            </View>
          </>
        )
        /* <RenderButtonFooter handleOnPress={handleOnPress} /> */
      }
    </ScreensView>
  );
}

export default memo(FilterView);
