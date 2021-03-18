import React from 'react';
import {StyleSheet, Text, View, Keyboard, ImageBackground} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import AppStatusBar from './AppStatusBar';
import ToolbarView from './ToolbarView';
import commons from '../commons';

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
  let contenrView = '';

  if (imageHeader) {
    let styleImage = [styles.styleImage, styleImge];
    contenrView = (
      <ImageBackground
        style={styleHeader}
        imageStyle={styleImage}
        resizeMode={resizeModeImage || 'stretch'}
        source={imageHeader}
        onStartShouldSetResponder={() => Keyboard.dismiss()}>
        {children}
      </ImageBackground>
    );
  } else {
    contenrView = (
      <LinearGradient
        // locations={[0, 0.5, 0.8]}
        start={start}
        end={end}
        colors={colorsLinearGradient}
        style={styleHeader}
        onStartShouldSetResponder={() => Keyboard.dismiss()}>
        {children}
      </LinearGradient>
    );
  }
  return contenrView;
};

export default function HeaderView(props) {
  const {
    isHeaderBottom,
    headerBottomView,
    isToolbar = true,
    bgColorStatusBar,
    styleToolbar,
  } = props;
  const bgStatusBar = bgColorStatusBar || commons.Color.colorsLinearGradient[0];
  return (
    <ContainerView {...props}>
      <AppStatusBar
        {...props}
        backgroundColor={bgStatusBar}
        barStyle="light-content"
      />
      {isToolbar ? (
        <ToolbarView
          {...props}
          style={styleToolbar}
        />
      ) : null}
      {isHeaderBottom && headerBottomView}
    </ContainerView>
  );
}

HeaderView.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  imageHeader: PropTypes.number,
  headerBottomView: PropTypes.object,
  colorsLinearGradient: PropTypes.array,
};

HeaderView.defaultProps = {
  colorsLinearGradient: commons.Color.colorsLinearGradient,
  // end: {x: 0, y: 1},
  // start: {x: 1, y: 0},
};

const styles = StyleSheet.create({
  // style: {paddingVertical: commons.Dimension.padding5},
  style: {justifyContent: 'center',},
  styleImage: {},
});
