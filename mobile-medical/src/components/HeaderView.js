import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Keyboard,
  ImageBackground,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import PropTypes from "prop-types";
import AppStatusBar from "./AppStatusBar";
import ToolbarView from "./ToolbarView";
import { Colors } from "../commons";

const ContainerView = (props) => {
  const {
    style,
    styleImge,
    children,
    imageHeader,
    colorsLinearGradient,
    resizeModeImage,
    start,
    end,
  } = props;
  const styleHeader = [styles.style, style];
  let contenrView = "";

  if (imageHeader) {
    let styleImage = [styles.styleImage, styleImge];
    return (
      <ImageBackground
        style={styleHeader}
        imageStyle={styleImage}
        resizeMode={resizeModeImage || "stretch"}
        source={imageHeader}
        onStartShouldSetResponder={() => Keyboard.dismiss()}
      >
        {children}
      </ImageBackground>
    );
  } else {
    return (
      <LinearGradient
        // locations={[0, 0.5, 0.8]}
        start={start}
        end={end}
        colors={colorsLinearGradient}
        style={styleHeader}
        onStartShouldSetResponder={() => Keyboard.dismiss()}
      >
        {children}
      </LinearGradient>
    );
  }
};

export default function HeaderView(props) {
  const {
    isHeaderBottom,
    headerBottomView,
    isToolbar = true,
    bgColorStatusBar,
    styleToolbar,
  } = props;
  // const bgStatusBar = bgColorStatusBar || Colors.colorsLinearGradient[0];
  const bgStatusBar = bgColorStatusBar || Colors.colorsLinearGradient[0];
  return (
    <>
      <ContainerView {...props}>
        <AppStatusBar
          {...props}
          backgroundColor={bgStatusBar}
          barStyle="light-content"
        />
        {isToolbar ? <ToolbarView {...props} style={styleToolbar} /> : null}
      </ContainerView>
      {isHeaderBottom && headerBottomView}
    </>
  );
}

HeaderView.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  imageHeader: PropTypes.number,
  headerBottomView: PropTypes.object,
  colorsLinearGradient: PropTypes.array,
};

HeaderView.defaultProps = {
  colorsLinearGradient: Colors.colorsLinearGradient,
  // end: {x: 0, y: 1},
  // start: {x: 1, y: 0},
};

const styles = StyleSheet.create({
  // style: {paddingVertical: Dimension.padding5},
  style: {
    justifyContent: "center",
    // position: "absolute",
    // left: 0,
    // right: 0,
  },
  styleImage: {},
});
