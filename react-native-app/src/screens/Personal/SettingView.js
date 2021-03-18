import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {View} from 'react-native';
import {useDispatch} from 'react-redux';
import {useApp, useMergeState} from '../../AppProvider';
import {SwitchView, TextView} from '../../components';
import models from '../../models';
import ActionsType from './ActionsType';
import styles from './styles';

export default function SettingView(props) {
  const {} = props;
  const [stateScreen, setStateScreen] = useMergeState({
    isShowSetting: false,
  });
  const {isQuickOrder, isShowWebPrices, isCompactUnit} = models.getAllSetting();
  const isAgency = models.isRoleAgency();
  const {isShowSetting} = stateScreen;

  const handleOnPress = ({id, data}) => {
    if (id === ActionsType.ShowSetting) {
      setStateScreen({isShowSetting: !isShowSetting});
    } else if (id === ActionsType.QuickOrder) {
      models.saveQuickOrder(data);
    } else if (id === ActionsType.ShowWebPrices) {
      models.saveShowWebPrices(data);
    } else if (id === ActionsType.CopyUnitsK) {
      models.saveCompactUnit(data);
    }
  };

  return (
    <>
      <TextView
        id={ActionsType.ShowSetting}
        onPress={handleOnPress}
        waitTitme={100}
        nameIconLeft={'settings'}
        nameIconRight={'next'}
        styleIconRight={{
          transform: [{rotate: isShowSetting ? '-90deg' : '90deg'}],
        }}
        sizeIconLeft={20}
        style={styles.styleRowText}
        styleContainerText={styles.styleContainerText}
        styleTitle={styles.styleTitle}
        styleValue={styles.styleValue}
        value={'Cài đặt'}
      />
      {isShowSetting && (
        <>
          <SwitchView
            id={ActionsType.QuickOrder}
            label="Giữ SIM Nhanh"
            disabled={isAgency}
            initialValue={isQuickOrder}
            onValueChange={handleOnPress}
            style={styles.stSwitch}
            styleLabel={styles.styleLabelSwitch}
          />
          <SwitchView
            id={ActionsType.ShowWebPrices}
            label="Hiển thị giá Web"
            initialValue={isShowWebPrices}
            onValueChange={handleOnPress}
            style={styles.stSwitch}
            styleLabel={styles.styleLabelSwitch}
          />
          <SwitchView
            id={ActionsType.CopyUnitsK}
            label="Copy theo đơn vị K"
            initialValue={isCompactUnit}
            style={styles.stSwitch}
            onValueChange={handleOnPress}
            styleLabel={styles.styleLabelSwitch}
          />
          <View style={styles.lineSeparation} />
        </>
      )}
    </>
  );
}
