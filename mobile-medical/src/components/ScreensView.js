import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Keyboard,
  ImageBackground,
} from "react-native";
import PropTypes from "prop-types";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSelector, useDispatch } from "react-redux";
import models from "../models";
import HeaderView from "./HeaderView";
import { Dimension } from "../commons";

export default function ScreensView(props) {
  const {
    isScroll,
    isCheckAuth,
    children,
    resizeMode,
    imageBg,
    renderFooter,
    styleBackground,
    styleHeader,
    styleContent,
    extraScrollHeight = 10,
  } = props;
  // const isLoginSuccess = useSelector(
  //   (state) => state.AccountReducer.isLoginSuccess,
  // );
  // const [isSignedIn, setSignedIn] = useState(models.isLoggedIn);
  // useEffect(() => {
  //   if (isLoginSuccess) {
  //     setSignedIn(isLoginSuccess);
  //   }
  // }, [isLoginSuccess]);

  let isScrollContent = isScroll !== undefined ? isScroll : true;
  let checkAuth = isCheckAuth !== undefined ? isCheckAuth : false;
  let styleContainContent = [styles.styleContainBody, styleContent];
  let styleBg = [styles.styleBackground, styleBackground];
  return (
    <View style={styleBg}>
      {imageBg && (
        <ImageBackground
          style={styleBg}
          resizeMode={resizeMode || "stretch"}
          source={imageBg}
          onStartShouldSetResponder={() => Keyboard.dismiss()}
        />
      )}
      <HeaderView
        {...props}
        style={styleHeader}
        isHeaderBottom={!checkAuth}
        // isHeaderBottom={!checkAuth || isSignedIn}
      />
      {isScrollContent ? (
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styleContainContent}
          extraScrollHeight={extraScrollHeight}
          // enableOnAndroid={true}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </KeyboardAwareScrollView>
      ) : (
        <View
          style={styleContainContent}
          onStartShouldSetResponder={() => Keyboard.dismiss()}
        >
          {children}
        </View>
      )}
      {/* {((checkAuth && isSignedIn) || !checkAuth) && renderFooter} */}
      {(!checkAuth) && renderFooter}
    </View>
  );
}

const styles = StyleSheet.create({
  styleBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    position: "absolute",
  },

  styleContainBody: {
    flexGrow: 1,
    backgroundColor: "white",
    // paddingHorizontal: Dimension.padding2x,
  },

  styleLinearGradient: {
    position: "relative",
  },
});

ScreensView.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleToolbar: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleContent: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  isScroll: PropTypes.bool,
  isToolbar: PropTypes.bool,
  isShowBack: PropTypes.bool,
  isStatusBar: PropTypes.bool,
  imageHeader: PropTypes.number,
  headerBottomView: PropTypes.object,
  renderFooter: PropTypes.object,
  colorsLinearGradient: PropTypes.array,
  titleScreen: PropTypes.string,
};
