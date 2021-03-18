import React, {memo, useCallback, useEffect, useState} from 'react';
import {FlatList, ImageBackground, Text, TouchableOpacity} from 'react-native';
import {Color} from '../../../commons/constants';
import {windowSize} from '../../../commons/utils/devices';
import styles from './styles';

const ItemIconView = memo((props) => {
  const {
    isSelected,
    style,
    styleItem,
    styleText,
    item,
    isShowNameItem = true,
    onPress,
  } = props;

  const iconName = item?.icon;
  const itemName = item?.name;
  const colorText = isSelected ? 'white' : Color.colorText;
  const styleTextItem = [styles.itemText, styleText, {color: colorText}];
  const backgroundColor = isSelected ? item.backgroundColor : Color.Gainsboro;
  const handleClickItem = () => {
    onPress && onPress(item);
  };
  return (
    <TouchableOpacity
      style={[style, {backgroundColor}]}
      onPress={handleClickItem}>
      {iconName ? (
        <ImageBackground
          source={iconName}
          resizeMode="contain"
          style={styleItem}>
          {isShowNameItem && (
            <Text style={styleTextItem} numberOfLines={1}>
              {itemName}
            </Text>
          )}
        </ImageBackground>
      ) : (
        <Text style={styleTextItem}>{itemName}</Text>
      )}
    </TouchableOpacity>
  );
});

export default function FengshuiView(props) {
  const {
    id,
    initialValue,
    onValueChange,
    listData,
    styleContainsItem,
    styleItem,
    styleText,
    isShowNameItem,
  } = props;

  const [itemSelected, setItemSelected] = useState();
  useEffect(() => {
    setItemSelected(initialValue);
  }, [props]);
  const numberColumn = listData.length;
  const width = (windowSize.width - 50) / numberColumn;
  const styleItemContains = [
    styleContainsItem,
    {
      width: width,
      height: width,
      borderRadius: width / 2,
      flex: 1,
      paddingVertical: 5,
      marginVertical: 5,
    },
  ];
  const handleOnPress = (data) => {
    onValueChange && onValueChange({id, data});
    setItemSelected(data);
  };
  const getItemSelected = (itemData) => {
    return itemSelected?.key === itemData?.key;
  };
  const renderItem = useCallback(
    (data, index) => {
      let isCheck = getItemSelected(data?.item);
      return (
        <ItemIconView
          {...data}
          index={index}
          isSelected={isCheck}
          onPress={handleOnPress}
          numberColumn={numberColumn}
          style={styleItemContains}
          styleItem={styleItem}
          styleText={styleText}
          isShowNameItem={isShowNameItem}
        />
      );
    },
    [itemSelected],
  );
  return (
    // <View style={[styles.styleContainsBlock]}>
    <FlatList
      data={listData}
      renderItem={renderItem}
      style={styles.styleListFengshui}
      keyExtractor={(item, index) => item.id.toString()}
      numColumns={numberColumn}
      contentContainerStyle={styles.styleContentListCategories}
    />
    // </View>
  );
}
