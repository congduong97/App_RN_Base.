import React from "react";
import { StyleSheet, Text, View, Keyboard } from "react-native";
import PropTypes from "prop-types";
import { useNavigation } from "@react-navigation/native";
import { Colors, Dimension, Fonts, ImagesUrl } from "../commons";
import IconView, { IconViewType } from "./IconView";
import AppNavigate from "../navigations/AppNavigate";

function IconAvatar(props) {
  const { } = props;
  const navigation = useNavigation();
  const handleOnPress = () => {
    AppNavigate.navigateToTabSetting(navigation.dispatch);
  };
  return (
    <IconView
      onPress={handleOnPress}
      styleImage={styles.stImageAvatar}
      style={styles.styleIconMenu}
      imgSource={ImagesUrl.avatarDefault}
      type={IconViewType.EVImage}
    />
  );
}

function BackView(props) {
  const {
    isShowBack,
    isBackAvatar,
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
    return isBackAvatar ? (
      <IconAvatar />
    ) : (
        <IconView
          onPress={pressBack && naviGoback}
          style={style}
          name={nameIconBack || "ic-arrow-left"}
          type={typeIconBack || IconViewType.EVIcon}
          size={sizeIconBack || Dimension.sizeIcon20}
          color={colorIconBack || Colors.registrationDateCalendar}
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
        style={styleTitle}
      >
        {titleScreen}
      </Text>
      {subTitle ? (
        <Text
          onPress={onPressSubTitle}
          ellipsizeMode={ellipsizeMode}
          numberOfLines={numberOfLinesSubTitle}
          style={styleSubTitle}
        >
          {subTitle}
        </Text>
      ) : null}
    </View>
  );
}

function RightView(props) {
  const {
    styleRightView,
    styleRightIcon,
    rightView,
    onPressRight,
    nameIconRight,
    sizeIconRight,
    colorIconRight,
    typeIconRight,
  } = props;

  if (!props || (rightView && rightView.props)) {
    let style = [styles.styleRightView, styleRightView];
    return <View style={style}>{rightView}</View>;
  } else if (typeof nameIconRight === "string") {
    let style = { ...styles.styleRightIcon, styleRightIcon };
    const onPressIcon = () => {
      onPressRight && onPressRight();
    };

    return (
      <IconView
        onPress={onPressIcon}
        style={style}
        name={nameIconRight || "icon-list"}
        type={typeIconRight || IconViewType.EVIcon}
        size={sizeIconRight || Dimension.sizeIconToolbar}
        color={colorIconRight || Colors.colorIcon}
      />
    );
  }
  return null;
}

export default function ToolbarView(props) {
  const { style, backgroundColor } = props;
  let styleContainer = [styles.style, { backgroundColor }, style];
  return (
    <View
      style={styleContainer}
      onStartShouldSetResponder={() => Keyboard.dismiss()}
    >
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
    justifyContent: "center",
    alignSelf: "center",
    flexDirection: "column",
    position: "absolute",
    left: 0,
    right: 10,
  };
};

const styles = StyleSheet.create({
  style: {
    width: "100%",
    minHeight: Dimension.NAV_BAR_HEIGHT,
    flexDirection: "row",
    // paddingHorizontal: Dimension.padding2x,
    alignItems: "center",
    elevation: 4,
  },
  styleIcon: {
    width: Dimension.sizeIconHeader,
    height: Dimension.sizeIconHeader,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    // backgroundColor: Colors.colorBtBack,
    borderRadius: 10,
  },

  navBarTitleText: {
    fontSize: Dimension.fontSizeHeader,
    letterSpacing: 0.5,
    color: 'black',
    // fontWeight: "bold",
    alignSelf: "center",
    fontFamily: Fonts.SFProDisplayRegular,
  },
  subTitleText: {
    // fontSize: Dimension.fontSizeSubHeader,
    letterSpacing: 0.5,
    color: "white",
    alignSelf: "center",
    fontSize: Dimension.fontSize12,
  },

  customTitle: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 7,
    alignItems: "center",
  },

  styleRightView: {
    right: Dimension.margin,
    flexDirection: "row",
    position: "absolute",
  },

  styleRightIcon: {
    position: "absolute",
    right: Dimension.margin2x,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    // width: Dimension.sizeIconHeader,
    // height: Dimension.sizeIconHeader,
    // backgroundColor: Colors.colorBtBack,
    borderRadius: 10,
  },
  ///
  styleIconMenu: {
    justifyContent: "center",
    alignItems: "center",
    width: Dimension.sizeIconHeader,
    height: Dimension.sizeIconHeader,
    alignContent: "center",
    backgroundColor: Colors.colorBtBack,
    borderRadius: 10,
  },
  stImageAvatar: {
    justifyContent: "center",
    alignItems: "center",
    width: Dimension.sizeIconHeader,
    height: Dimension.sizeIconHeader,
    alignContent: "center",
    borderRadius: 10,
  },
});
