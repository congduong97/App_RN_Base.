import {useNavigation, useRoute} from '@react-navigation/native';
import React from 'react';
import {StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import {Color} from '../../../commons/constants';
import {ScreensView} from '../../../components';
import {OrderStatusRequest} from '../../../models/ConfigsData';
import OrdersView from '../OrdersView';

export default function CartsScreen(props) {
  const route = useRoute();
  const {isTabarOrder, simId, reloadSearchSim }= route.params;

  const handleOnReload = () => {
    reloadSearchSim && reloadSearchSim();
  };

  return isTabarOrder ? (
    <OrdersView
      isTabarOrder={isTabarOrder}
      onSelected={handleOnReload}
      statusCart={OrderStatusRequest.DRAFT_CART}
    />
  ) : (
    <ScreensView
      titleScreen={'Danh Sách Giỏ Hàng'}
      styleContent={{backgroundColor: Color.colorBGSQM}}>
      <OrdersView
        isTabarOrder={isTabarOrder}
        simId={simId}
        onSelected={handleOnReload}
        statusCart={OrderStatusRequest.DRAFT_CART}
      />
    </ScreensView>
  );
}

const styles = StyleSheet.create({});
