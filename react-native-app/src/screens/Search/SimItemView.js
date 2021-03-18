import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Highlighter from 'react-native-highlight-words';
import {useDispatch} from 'react-redux';
import {Color, Font} from '../../commons/constants';
import {ratioW} from '../../commons/utils/devices';
import {formatCurrency} from '../../commons/utils/format';
import {IconView, TextView} from '../../components';
import {IconViewType} from '../../components/IconView';
import {TelcoIcon} from '../../models/ConfigsData';
import Actions from '../../redux/actions';
import ActionsKey from '../../commons/ActionsKey';

export default function SimItemView(props) {
  const {
    index,
    isShowWebPrice,
    itemData,
    simsCopy,
    searchWords,
    onPress,
  } = props;
  const {id, alias, telcoId, telco, websitePrice, collaboratorPrice} = itemData;
  const dispatch = useDispatch();
  const [isRender, setReRender] = useState();
  const imageName = TelcoIcon[telcoId || telco?.id];
  const indexCheck = simsCopy.findIndex((item) => item.id === id);
  const iconName =
    indexCheck > -1 ? 'checkbox-marked' : 'checkbox-blank-outline';
  const colorCheck = indexCheck > -1 ? Color.MayaBlue : Color.colorText;
  const simPrice = isShowWebPrice
    ? formatCurrency(websitePrice)
    : formatCurrency(collaboratorPrice);
  const handleOnPress = ({id, data}) => {
    if (id === ActionsKey.ShowCreateCart) {
      onPress && onPress({id, data: itemData});
    } else if (id === 'Act-Copy') {
      if (indexCheck > -1) {
        simsCopy.splice(indexCheck, 1);
      } else {
        simsCopy.push({
          id: data.id,
          alias: data.alias,
          websitePrice: data.websitePrice,
          collaboratorPrice: data.collaboratorPrice,
        });
      }
      dispatch(Actions.changeCopySim(simsCopy));
      setReRender(!isRender);
    } else {
      onPress && onPress({id: ActionsKey.ShowDetailSim, data: itemData});
    }
  };

  return (
    <View style={styles.styleContains}>
      <IconView
        id={'Act-Copy'}
        data={itemData}
        size={22}
        name={iconName}
        type={IconViewType.MaterialCommunityIcons}
        onPress={handleOnPress}
        color={colorCheck}
        style={styles.styleIconCheck}
      />
      <TouchableOpacity
        onPress={handleOnPress}
        style={styles.styleContainCenter}>
        <Text style={styles.itemText}>
          <Highlighter
            highlightStyle={{color: Color.MayaBlue}}
            searchWords={searchWords || []}
            textToHighlight={alias || ''}
          />
        </Text>
        <IconView
          type={IconViewType.EVImage}
          imgSource={imageName}
          styleImage={styles.itemImage}
        />
      </TouchableOpacity>
      <View>
        <Text style={styles.styleTextPrice}>{simPrice}</Text>
        <TextView
          id={ActionsKey.ShowCreateCart}
          onPress={handleOnPress}
          styleText={styles.styleTextButtonOrder}
          style={styles.styleButtonOrder}>
          {'Giữ SIM'}
        </TextView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  styleContains: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: Color.colorBorderDisable,
    paddingBottom: 5,
  },
  styleIconCheck: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  styleContainCenter: {
    flex: 1,
    paddingHorizontal: 30,
    alignContent: 'center',
  },
  itemText: {
    marginTop: 5,
    color: Color.Supernova,
    fontFamily: Font.FiraSansMedium,
    fontSize: 18,
  },

  itemImage: {
    width: 60,
    height: 40,
    resizeMode: 'stretch',
  },
  styleTextPrice: {
    flex: 1,
    marginTop: 5,
    fontFamily: Font.FiraSansRegular,
    fontSize: 16 * ratioW,
  },

  styleButtonOrder: {
    // height: 20,
    // width: 60,
    margin: 3,
    marginBottom: 8,
    borderRadius: 4,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    backgroundColor: Color.MayaBlue,
  },
  styleTextButtonOrder: {
    color: 'white',
    marginVertical: 3,
    marginHorizontal: 10,
  },
});
