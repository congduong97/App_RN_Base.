import moment from 'moment';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Color, Dimension} from '../../commons/constants';
import {formatCurrency} from '../../commons/utils/format';
import {TextView} from '../../components';
import models, {PaymentPackage} from '../../models';
import AppNavigate from '../../navigations/AppNavigate';
import ActionsKey from '../../commons/ActionsKey';

export default function SimDetailView(props) {
  const {id, simData, onPress, navigation, refDialog} = props;
  const zone = moment().utcOffset();
  const {
    alias,
    telcoName,
    telco,
    paymentPackage,
    packOfData,
    collaboratorPrice,
    websitePrice,
    pledgePrice,
    pledgeMonths,
    pledgeExpDate,
    note,
  } = simData;
  const isAuthent = models.isLoggedIn();
  const telecomName = telcoName || telco?.name;
  const packageName = PaymentPackage[paymentPackage];
  const priceCTV = formatCurrency(collaboratorPrice);
  const priceWeb = formatCurrency(websitePrice);
  const pledgePriceName = pledgePrice ? formatCurrency(pledgePrice) : null;
  const pledgeExpDateDis = pledgeExpDate
    ? moment(pledgeExpDate, 'YYYY/MM/DD hh:mm:ss')
        .utcOffset(zone * 2)
        .format('DD/MM/YYYY')
    : '';
  const handleOrderSim = () => {
    onPress && onPress({id: ActionsKey.ShowCreateCart, data: simData});
  };

  const navigateToSelectTemplateDesign = () => {
    refDialog.hideDialog();
    AppNavigate.navigateToSelectTemplateDesignScreen(
      navigation.dispatch,
      simData,
    );
  };

  return (
    <>
      <View style={styles.styleViewLine}>
        <View style={{flex: 1, height: 2, backgroundColor: Color.border}} />
        <Text style={styles.styleTitleDialog}>{alias}</Text>
        <View style={{flex: 1, height: 2, backgroundColor: Color.border}} />
      </View>
      <View style={styles.styleContent}>
        <TextView
          style={styles.styleRowText}
          styleContainerText={styles.styleContainerText}
          styleTitle={styles.styleTitle}
          styleValue={styles.styleValue}
          title={'Nhà mạng:'}
          value={telecomName}
        />
        <TextView
          style={styles.styleRowText}
          styleContainerText={styles.styleContainerText}
          styleTitle={styles.styleTitle}
          styleValue={styles.styleValue}
          title={'Loại thuê bao:'}
          value={packageName}
        />
        <TextView
          style={styles.styleRowText}
          styleContainerText={styles.styleContainerText}
          styleTitle={styles.styleTitle}
          styleValue={styles.styleValue}
          title={'Gói cước:'}
          value={packOfData}
        />
        {isAuthent ? (
          <TextView
            style={styles.styleRowText}
            styleContainerText={styles.styleContainerText}
            styleTitle={styles.styleTitle}
            styleValue={styles.styleValue}
            title={'Giá thu về:'}
            value={priceCTV}
          />
        ) : null}
        <TextView
          style={styles.styleRowText}
          styleContainerText={styles.styleContainerText}
          styleTitle={styles.styleTitle}
          styleValue={styles.styleValue}
          title={isAuthent ? 'Giá bán lẻ:' : 'Giá bán:'}
          value={priceWeb}
        />
        <TextView
          style={styles.styleRowText}
          styleContainerText={styles.styleContainerText}
          styleTitle={styles.styleTitle}
          styleValue={styles.styleValue}
          title={'Giá cam kết:'}
          value={pledgePriceName}
        />
        <TextView
          style={styles.styleRowText}
          styleContainerText={styles.styleContainerText}
          styleTitle={styles.styleTitle}
          styleValue={styles.styleValue}
          title={'Số tháng cam kết:'}
          value={pledgeMonths}
        />
        <TextView
          style={styles.styleRowText}
          styleContainerText={styles.styleContainerText}
          styleTitle={styles.styleTitle}
          styleValue={styles.styleValue}
          title={'Ngày kết thúc:'}
          value={pledgeExpDateDis}
        />
        <TextView
          style={styles.styleRowText}
          styleContainerText={styles.styleContainNote}
          styleTitle={styles.styleTitleNote}
          styleValue={styles.styleValue}
          title={'Ghi chú:'}
          value={note}
        />
        <View style={styles.styleContainButton}>
          <TextView
            onPress={navigateToSelectTemplateDesign}
            style={[styles.styleButton, {backgroundColor: Color.MayaBlue}]}
            styleValue={styles.styleTextButton}
            value={'Tạo ảnh SIM'}
          />
          <TextView
            onPress={handleOrderSim}
            style={styles.styleButton}
            styleValue={styles.styleTextButton}
            value={'Giữ Sim'}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  styleViewLine: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Dimension.margin10,
  },
  styleTitleDialog: {
    backgroundColor: 'white',
    fontSize: Dimension.fontSize21,
    color: Color.star,
    fontWeight: '700',
    textAlign: 'center',
    marginLeft: 5,
    marginRight: 5,
    marginTop: -5,
  },

  styleContent: {
    paddingBottom: Dimension.padding10,
  },

  styleRowText: {flexDirection: 'row'},
  styleContainerText: {
    flex: 1,
    flexDirection: 'row',
    height: 30,
    marginBottom: 5,
    paddingHorizontal: Dimension.padding5,
  },
  styleTitle: {
    // backgroundColor: '#abc',
    fontSize: Dimension.fontSize15,
    flex: 1,
    alignSelf: 'center',
    alignContent: 'flex-start',
  },

  styleValue: {
    fontSize: Dimension.fontSize15,
    alignSelf: 'center',
    fontWeight: '700',
  },
  styleContainButton: {
    flexDirection: 'row',
    marginTop: Dimension.margin20,
    justifyContent: 'space-around',
  },
  styleButton: {
    // flex: 1,
    width: '45%',
    backgroundColor: Color.colorButtonPrice,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 20,
    borderColor: Color.Supernova,
    borderWidth: 1,
  },
  styleTextButton: {
    fontSize: Dimension.fontSizeHeader,
    color: Color.White,
    fontWeight: '700',
  },

  styleContainNote: {
    marginBottom: 5,
    paddingHorizontal: Dimension.padding5,
  },
  styleTitleNote: {
    marginBottom: 8,
    fontSize: Dimension.fontSize15,
    flex: 1,
    alignContent: 'flex-start',
  },
});
