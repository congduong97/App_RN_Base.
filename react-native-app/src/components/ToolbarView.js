import React from 'react';
import {StyleSheet, Text, View, Keyboard} from 'react-native';
import PropTypes from 'prop-types';
import {useNavigation} from '@react-navigation/native';
import commons from '../commons/constants';
import IconView, {IconViewType} from './IconView';

function BackView(props) {
  const {
    isShowBack,
    isPressBack,
    onGoBack,
    styleIconBack,
    nameIconBack,
    typeIconBack,
    sizeIconBack,
    colorIconBack,
  } = props;
  let showBack = isShowBack !== undefined ? isShowBack : true;
  if (showBack) {
    let pressBack = isPressBack !== undefined ? isPressBack : true;
    const navigation = useNavigation();
    const naviGoback = () => {
      onGoBack ? onGoBack() : navigation.goBack();
    };
    let style = [styles.styleIcon, styleIconBack];
    return (
      <IconView
        onPress={pressBack && naviGoback}
        style={style}
        name={nameIconBack || 'left-arrow'}
        type={typeIconBack || IconViewType.EVIcon}
        size={sizeIconBack || commons.sizeIconToolbar}
        color={colorIconBack || 'white'}
      />
    );
  }
  return null;
}

function getLeftElement(props) {
  if (!props || (props.leftView && props.leftView.props)) {
    return props.leftView;
  }
}

function getCenterElement(props) {
  const {
    titleScreen,
    subTitle,
    onPressSubTitle,
    styleCenterElement,
    tintColor = null,
    subTintColor = null,
    numberOfLinesTitle = 1,
    numberOfLinesSubTitle = 1,
    isShowBack = true,
    ellipsizeMode,
  } = props;
  let style = [stylesCenterElement(isShowBack), styleCenterElement];
  if (!props || (props.centerElement && props.centerElement.props)) {
    return <View style={style}>{props.centerElement}</View>;
  }
  let styleTitle = [styles.navBarTitleText, props.styleTitle, tintColor];
  let styleSubTitle = [styles.subTitleText, props.styleSubTitle, subTintColor];
  return (
    <View style={style}>
      <Text
        ellipsizeMode={ellipsizeMode}
        numberOfLines={numberOfLinesTitle}
        style={styleTitle}>
        {titleScreen}
      </Text>
      {subTitle ? (
        <Text
          onPress={onPressSubTitle}
          ellipsizeMode={ellipsizeMode}
          numberOfLines={numberOfLinesSubTitle}
          style={styleSubTitle}>
          {subTitle}
        </Text>
      ) : null}
    </View>
  );
}

function RightView(props) {
  const {
    styleRightView,
    rightView,
    onPressRight,
    nameIconRight,
    sizeIconRight,
    colorIconRight,
    typeIconRight,
  } = props;
  let style = [styles.styleRightView, styleRightView];
  if (!props || (rightView && rightView.props)) {
    return <View style={style}>{rightView}</View>;
  } else if (typeof nameIconRight === 'string') {
    const onPressIcon = () => {
      onPressRight && onPressRight();
    };

    return (
      <IconView
        onPress={onPressIcon}
        style={style}
        name={nameIconRight || 'icon-list'}
        type={typeIconRight || IconViewType.EVIcon}
        size={sizeIconRight || commons.sizeIconToolbar}
        color={colorIconRight || 'white'}
      />
    );
  }
  return null;
}

export default function ToolbarView(props) {
  const {style, backgroundColor} = props;
  let styleContainer = [styles.style, {backgroundColor}, style];
  return (
    <View
      style={styleContainer}
      onStartShouldSetResponder={() => Keyboard.dismiss()}>
      {getCenterElement(props)}
      <BackView {...props} />
      {getLeftElement(props)}
      <RightView {...props} />
    </View>
  );
}

ToolbarView.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  backgroundColor: PropTypes.string,
};
const widthIcon = 40;

const stylesCenterElement = (isShowBack) => {
  return {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    position: 'absolute',
    left: 0,
    right: 10,
  };
};

const styles = StyleSheet.create({
  style: {
    width: '100%',
    minHeight: commons.NAV_BAR_HEIGHT,
    flexDirection: 'row',
    paddingHorizontal: commons.padding5,
  },
  styleIcon: {
    width: widthIcon,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },

  navBarTitleText: {
    fontSize: commons.fontSizeHeader,
    letterSpacing: 0.5,
    color: 'white',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  subTitleText: {
    // fontSize: commons.fontSizeSubHeader,
    letterSpacing: 0.5,
    color: 'white',
    alignSelf: 'center',
    fontSize: commons.fontSize12,
  },

  customTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 7,
    alignItems: 'center',
  },

  styleRightView: {
    // width: 40,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: commons.padding15,
  },
});
