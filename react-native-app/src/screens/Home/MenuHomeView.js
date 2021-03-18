import {useNavigation, useIsFocused} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {Icon, MenuHome} from '../../commons/constants';
import {validateImageUri} from '../../commons/utils/validate';
import {IconView, withPreventDoubleClick} from '../../components';
import {IconViewType} from '../../components/IconView';
import models from '../../models';
import AppNavigate from '../../navigations/AppNavigate';
import styles from './styles';

const TouchableOpacityEx = withPreventDoubleClick(TouchableOpacity);

export default function MenuHomeView(props) {
  const navigation = useNavigation();
  const handleOnPressMenu = ({id}) => {
    if (id === 1) {
      AppNavigate.navigateToSimCategoriesScreen(navigation.dispatch);
    } else if (id === 2) {
      AppNavigate.navigateToIntroductionScreen(navigation.dispatch);
    } else if (id === 3) {
      AppNavigate.navigateToTabSetting(navigation.dispatch);
    }
  };
  const renderMenuView = useCallback(() => renderMenu(handleOnPressMenu), []);
  return <View style={styles.menuHomeContainer}>{renderMenuView()}</View>;
}

function ItemMenu(props) {
  const {id, colorBg, name, iconName, onPress} = props;
  const handleOnPress = () => {
    onPress && onPress({id});
  };
  if (id === 3) {
    const isFocused = useIsFocused();
    const [currentUser, setUserInfo] = useState();
    useEffect(() => {
      if (isFocused) {
        setUserInfo(models.getUserInfo());
      }
    }, [isFocused]);
    let imageUrl = validateImageUri(currentUser?.avatar, Icon.avatarDefault);
    return (
      <TouchableOpacityEx
        onPress={handleOnPress}
        style={styles.containerMenuHomeItem}>
        <View
          style={{
            ...styles.menuHomeItem,
            backgroundColor: colorBg,
          }}>
          <Image
            source={imageUrl}
            style={{
              ...styles.menuHomeItem,
            }}
          />
        </View>
        <Text
          style={{textAlign: 'center', marginVertical: 8}}
          numberOfLines={2}>
          {currentUser?.fullName || ''}
        </Text>
      </TouchableOpacityEx>
    );
  }

  return (
    <TouchableOpacityEx
      onPress={handleOnPress}
      style={styles.containerMenuHomeItem}>
      <IconView
        name={iconName}
        type={IconViewType.FontAwesome}
        color="white"
        size={25}
        style={[styles.containsImageItemMenu, {backgroundColor: colorBg}]}
      />
      <Text style={{textAlign: 'center', marginVertical: 8}} numberOfLines={2}>
        {name || ''}
      </Text>
    </TouchableOpacityEx>
  );
}

function renderMenu(onPress) {
  return MenuHome.map((item, index) => {
    return <ItemMenu key={index} {...item} onPress={onPress} />;
  });
}
