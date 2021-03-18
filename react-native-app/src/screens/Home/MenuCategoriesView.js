import React, {memo, useCallback} from 'react';
import {
  FlatList,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import commons from '../../commons';
import {windowSize} from '../../commons/utils/devices';
import styles from './styles';
import TitleBlock from './TitleBlock';
import {withPreventDoubleClick} from '../../components';
const TouchableOpacityEx = withPreventDoubleClick(TouchableOpacity);

const ItemIconView = memo((props) => {
  const {
    style,
    styleItem,
    styleText,
    item,
    isShowNameItem = true,
    onPress,
  } = props;
  const iconName = item?.icon;
  const itemName = item?.name;
  const styleTextItem = styleText || styles.itemText;
  const backgroundColor = item.backgroundColor || 'white';
  const handleClickItem = () => {
    onPress && onPress(item);
  };
  return (
    <TouchableOpacityEx
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
    </TouchableOpacityEx>
  );
});

const ItemHilightView = memo((props) => {
  const {style, item, onPress} = props;
  const backgroundColor = item.color || 'white';
  const handleClickItem = () => {
    onPress && onPress(item);
  };
  return (
    <TouchableOpacityEx
      style={[style, {backgroundColor}]}
      onPress={handleClickItem}>
      <Text
        style={{
          ...styles.itemHightlightText,
          color: 'white',
          fontSize: commons.Dimension.fontSizeHeader,
          fontWeight: '700',
        }}
        numberOfLines={1}>
        {item.exam}
      </Text>
      <Text
        style={{...styles.itemHightlightText, color: 'white'}}
        numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacityEx>
  );
});

export default function MenuCategoriesView(props) {
  const {
    id,
    onPress,
    titleBlock,
    listData,
    numberColumn,
    style,
    styleContainsItem,
    styleItem,
    styleText,
    isShowNameItem,
    isCircle,
    isHilight,
  } = props;
  const width = (windowSize.width - 50) / numberColumn;
  const styleItemContains = isCircle
    ? [
        styleContainsItem,
        {
          width: width,
          height: width,
          borderRadius: width / 2,
        },
      ]
    : isHilight
    ? [styleContainsItem, {width: width, height: width, borderRadius: 8}]
    : styleContainsItem;

  const handleOnPress = (data) => {
    onPress && onPress({id, data});
  };

  const renderItem = useCallback((data) => {
    return (
      <View style={{flex: 1, paddingVertical: 5}}>
        {isHilight ? (
          <ItemHilightView
            {...data}
            onPress={handleOnPress}
            numberColumn={numberColumn}
            style={styleItemContains}
            styleItem={styleItem}
            styleText={styleText}
            isHilight={isHilight}
            isShowNameItem={isShowNameItem}
          />
        ) : (
          <ItemIconView
            {...data}
            onPress={handleOnPress}
            numberColumn={numberColumn}
            style={styleItemContains}
            styleItem={styleItem}
            styleText={styleText}
            isShowNameItem={isShowNameItem}
          />
        )}
      </View>
    );
  }, []);
  return (
    <View style={[styles.styleContainsBlock]}>
      <TitleBlock title={titleBlock} />
      <FlatList
        data={listData}
        renderItem={renderItem}
        style={styles.styleListCategories}
        keyExtractor={(item, index) => item.id.toString()}
        numColumns={numberColumn}
        contentContainerStyle={styles.styleContentListCategories}
      />
    </View>
  );
}
