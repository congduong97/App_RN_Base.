import React, {useRef, useState} from 'react';
import {View, StyleSheet, Animated} from 'react-native';

import {COLOR, SIZE} from '../utils/resources';
import {AppText} from './AppText';
import {AppIconButton} from './AppIconButton';
import {useNavigation} from '@react-navigation/native';

const AppHeader = (props) => {
  const {
    style,
    Left,
    renderLeftProp,
    leftGoBack,
    onPressLeft,
    Title,
    title,
    titleStyle,
    numberOfLines,
    renderTitleProp,
    Right,
    renderRightProp,
    renderView,
    wrappedStyle,
  } = props;
  const [visibleTopView, setVisibleTopView] = useState(false);
  const [animateValue, setAnimateValue] = useState(new Animated.Value(0));
  const navigation = useNavigation();

  const onGoBack = () => {
    navigation.goBack();
  };

  const showTopView = () => {
    if (!visibleTopView) {
      setVisibleTopView(true);
      Animated.timing(animateValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animateValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setVisibleTopView(false));
    }
  };

  const renderLeft = () => {
    if (Left) {
      return (
        <View
          style={{
            flexDirection: 'row',
            position: 'absolute',
            left: SIZE.padding,
          }}>
          {Left}
        </View>
      );
    }
    if (renderLeftProp) {
      return (
        <View
          style={{
            flexDirection: 'row',
            position: 'absolute',
            left: SIZE.padding,
          }}>
          {renderLeftProp()}
        </View>
      );
    }
    if (leftGoBack) {
      const onPress = onPressLeft || onGoBack;
      return (
        <View
          style={{
            flexDirection: 'row',
            position: 'absolute',
            left: SIZE.padding,
          }}>
          <AppIconButton
            hitSlop={{top: 10, bottom: 10, left: 20, right: 20}}
            icon={{
              iconName: 'chevron-thin-left',
              iconType: 'Entypo',
              iconColor: COLOR.main_color,
              iconSize: SIZE.H3,
            }}
            onPress={onPress}
          />
        </View>
      );
    }
    return null;
  };

  const renderTitle = () => {
    if (Title) {
      return Title;
    }
    if (renderTitleProp) {
      return renderTitleProp();
    }
    if (title) {
      return (
        <AppText
          numberOfLines={numberOfLines || 1}
          style={[
            {
              fontFamily: 'irohamaru-Medium',
              fontSize: SIZE.title_size,
              color: COLOR.main_color,
              paddingVertical: 22,
            },
            titleStyle,
          ]}>
          {title}
        </AppText>
      );
    }
    return null;
  };

  const renderRight = () => {
    if (Right) {
      return (
        <View
          style={{
            flexDirection: 'row',
            position: 'absolute',
            right: SIZE.padding,
            backgroundColor: 'red',
            width: 60,
            height: 60,
          }}>
          {Right}
        </View>
      );
    }
    if (renderRightProp) {
      return (
        <View
          style={{
            flexDirection: 'row',
            position: 'absolute',
            right: SIZE.padding,
          }}>
          {renderRightProp()}
        </View>
      );
    }
    return null;
  };

  const renderTopView = () => {
    const opacity = animateValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0.7, 1],
    });
    // const translateY = animateValue.interpolate({
    //   inputRange: [0, 1],
    //   outputRange: [50, 0],
    // });
    if (visibleTopView && renderView) {
      return (
        <Animated.View
          style={{
            flexDirection: 'row',
            position: 'absolute',
            top: heightHeader,
            width: SIZE.device_width,
            height: SIZE.device_height - heightHeader,
            zIndex: 4,
            minHeight: 50,
            backgroundColor: COLOR.BG_TRANSPARENT_50,
            opacity,
          }}
          pointerEvents={'auto'}
        />
      );
    }
    return null;
  };

  return (
    //show shadow bottom
    <View style={[styles.container, style]}>
      {renderLeft()}
      {renderTitle()}
      {renderRight()}
      {renderTopView()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SIZE.device_width,
    elevation: 3,
    zIndex: 1,
    flexDirection: 'row',
    backgroundColor: COLOR.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: COLOR.BG_TRANSPARENT_70,
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2.4,
    },
    shadowOpacity: 0.22,
    shadowRadius: 1.4,
  },
});
// const AHeader = copilot({
//   animated: true, // Can be true or false
//   overlay: "svg"
// })(Header);

export {AppHeader};
