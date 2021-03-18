//Library:
import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useContext,
} from 'react';
import {View, ScrollView, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native';
import hexToRgba from 'hex-to-rgba';
import Modal from 'react-native-modal';

//Setup:
import {SIZE, COLOR} from '../../../utils';

//Component:
import {AppText} from '../../../elements/AppText';
import {ContextContainer} from '../../../contexts/AppContext';

function ModalListCityOrDistrict(props, ref) {
  const {
    dataCityAndDistrict,
    keyActive,
    getNameCity,
    getNameDistrict,
    dataDistrichChooseCity,
  } = props;
  const {colorApp} = useContext(ContextContainer);
  const [showModal, setShowModal] = useState(false);
  useImperativeHandle(ref, () => ({openModal, closeModal}), []);
  //Bật modal:
  const openModal = () => {
    setShowModal(true);
  };
  //Đóng modal:
  const closeModal = () => {
    setShowModal(false);
  };

  //Hiển thị tên bảng Thành phố hoặc quận huyện:
  const renderNameBoard = () => {
    if (keyActive == 'CITY') {
      return '県名';
    } else {
      return '市区町村';
    }
  };

  //Hiển thị danh sách:
  const renderList = () => {
    if (
      dataCityAndDistrict &&
      dataCityAndDistrict.length > 0 &&
      keyActive == 'CITY'
    ) {
      return dataCityAndDistrict.map((item, index) => {
        return (
          <TouchableOpacity
            activeOpacity={0.8}
            key={`${index}`}
            onPress={chooseItemCityOrDistrict(item, index)}
            style={{
              height: SIZE.width(12),
              width: '100%',
              backgroundColor: COLOR.white,
              borderBottomWidth: SIZE.width(0.5),
              borderBottomColor: hexToRgba(colorApp.activeTabBackground),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <AppText>{item.cityName}</AppText>
          </TouchableOpacity>
        );
      });
    }
    if (
      dataDistrichChooseCity &&
      dataDistrichChooseCity.length > 0 &&
      keyActive == 'DISTRICT'
    ) {
      return dataDistrichChooseCity.map((item, index) => {
        return (
          <TouchableOpacity
            activeOpacity={0.8}
            key={`${index}`}
            onPress={chooseItemCityOrDistrict(item, index)}
            style={{
              height: SIZE.width(12),
              width: '100%',
              backgroundColor: COLOR.white,
              borderBottomWidth: SIZE.width(0.5),
              borderBottomColor: hexToRgba(colorApp.activeTabBackground),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <AppText>{item.districtName}</AppText>
          </TouchableOpacity>
        );
      });
    }
  };

  //Ấn chọn item:
  const chooseItemCityOrDistrict = (item, index) => () => {
    if (keyActive == 'CITY') {
      getNameCity(item.cityName, item.cityId, item.districtDtoList);
      getNameDistrict('市区町村', '');
    }
    if (keyActive == 'DISTRICT') {
      getNameDistrict(item.districtName, item.districtId);
    }
    closeModal();
  };

  //Hiển thị nội dung:
  const renderContent = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={closeModal}
        style={{
          height: SIZE.width(153),
          width: SIZE.width(96),
          marginLeft: SIZE.width(2),
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            height: SIZE.width(110),
            width: SIZE.width(80),
          }}>
          <View
            style={{
              height: SIZE.width(12),
              width: '100%',
              backgroundColor: COLOR.white,
              borderBottomColor: hexToRgba(colorApp.activeTabBackground),
              borderBottomWidth: SIZE.width(0.5),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <AppText style={{color: COLOR.red_light}}>
              {renderNameBoard()}
            </AppText>
          </View>
          <ScrollView>{renderList()}</ScrollView>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      useNativeDriver={true}
      backdropOpacity={0.2}
      hideModalContentWhileAnimating={true}
      animationOut="fadeOut"
      animationInTiming={300}
      backdropTransitionInTiming={300}
      backdropTransitionOutTiming={300}
      isVisible={showModal}
      deviceHeight={SIZE.device_height}
      deviceWidth={SIZE.device_width}
      style={{
        margin: 0,
        flex: 1,
      }}>
      <SafeAreaView>{renderContent()}</SafeAreaView>
    </Modal>
  );
}

export default forwardRef(ModalListCityOrDistrict);
