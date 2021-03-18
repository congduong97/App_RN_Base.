import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  ViewPropTypes,
  Keyboard,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {widthPercent} from '../commons/utils/devices';
import {Color, Dimension} from '../commons/constants';
import IconView from './IconView';
const {OS} = Platform;
const LogoSimThanhDat = require('../../assets/icons/logo.png');

export default class BaseDialog extends Component {
  // const refDropAlert = React.createRef();
  constructor(props) {
    super(props);
    this.contentsView = null;
    this.dataConfigsDialog = this.configsDefault();
    this.state = {
      visible: this.props.visible,
      children: this.props.children,
      onPressClose: this.props.onPressClose,
    };
  }

  configsDefault = () => {
    return {
      visible: true,
      headerVisible: true,
    };
  };

  configsDialog = (configs) => {
    this.dataConfigsDialog = {...this.dataConfigsDialog, ...configs};
    return this;
  };

  showDialog = ({...config}, children) => {
    this.setConfig(config, children);
  };

  visibleDialog = () => {
    this.setConfig({...this.dataConfigsDialog});
  };

  hideDialog = () => {
    this.state.onPressClose && this.state.onPressClose();
    this.setState((prevState) => ({visible: (prevState.visible = false)}));
  };

  drawContents = (children) => {
    return this.configsDialog({children});
  };
  drawHeader = (headerView) => {
    return this.configsDialog({headerView});
  };

  setConfig({...config}) {
    this.setState((prevState) => ({
      children: (prevState.children = config.children),
      visible: (prevState.visible = true),
      dialogStyle: (prevState.dialogStyle = config.dialogStyle),
      animationType: (prevState.animationType = config.animationType),
      onRequestClose: (prevState.onRequestClose = config.onRequestClose),
      onShow: (prevState.onShow = config.onShow),
      onOrientationChange: (prevState.onOrientationChange =
        config.onOrientationChange),
      onTouchOutside: (prevState.onTouchOutside = config.onTouchOutside),
      overlayStyle: (prevState.overlayStyle = config.overlayStyle),
      visibleClose: (prevState.visibleClose = config.visibleClose),
      headerVisible: (prevState.headerVisible = config.headerVisible || true),
      headerView: (prevState.headerView = config.headerView),
      onPressClose: (prevState.onPressClose = config.onPressClose),
      supportedOrientations: (prevState.supportedOrientations =
        config.supportedOrientations),
      urlLogo: (prevState.urlLogo = config.urlLogo || LogoSimThanhDat),
    }));
  }

  ///////

  renderOutsideTouchable(onTouch) {
    const view = <View style={{flex: 1, width: '100%'}} />;
    if (!onTouch) return view;
    return (
      <TouchableWithoutFeedback
        onPress={onTouch}
        style={{flex: 1, width: '100%'}}>
        {view}
      </TouchableWithoutFeedback>
    );
  }

  renderContent() {
    const {contentStyle, extraScrollHeight} = this.props;
    const {children} = this.state;
    const styleContent = [{width: '100%', marginTop: 20}, contentStyle];
    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styleContent}
        extraScrollHeight={extraScrollHeight}
        // enableOnAndroid={true}
        showsVerticalScrollIndicator={false}>
        {children}
      </KeyboardAwareScrollView>
    );
  }

  render() {
    const {
      dialogStyle,
      animationType,
      onRequestClose,
      onShow,
      onOrientationChange,
      onTouchOutside,
      overlayStyle,
      visibleClose = true,
      supportedOrientations,
      visible,
      headerVisible,
      headerView,
      urlLogo,
    } = this.state;
    const dialogBackgroundColor = '#ffffff';
    const dialogBorderRadius = OS === 'ios' ? 20 : 20;
    let borderTopRightRadius = visibleClose ? 0 : dialogBorderRadius;
    return (
      <Modal
        // ref={ref}
        animationType={animationType}
        transparent={true}
        visible={visible}
        onRequestClose={onRequestClose}
        onShow={onShow}
        onOrientationChange={onOrientationChange}
        supportedOrientations={supportedOrientations}>
        <View
          style={[
            {
              flex: 1,
              backgroundColor: '#000000AA',
              // padding: 8,
            },
            overlayStyle,
          ]}>
          {this.renderOutsideTouchable(onTouchOutside)}

          <View style={{maxHeight: '100%', margin: 10}}>
            {visibleClose && (
              <IconView
                name={'cancel'}
                color={Color.tomato}
                size={Dimension.fontSizeHeader}
                style={styles.styleIconClose}
                onPress={this.hideDialog}
              />
            )}
            <View
              style={[
                {
                  backgroundColor: dialogBackgroundColor,
                  width: '100%',
                  maxHeight: '100%',
                  shadowOpacity: 0.24,
                  overflow: 'hidden',
                  // alignItems: 'center',
                  paddingHorizontal: Dimension.padding,
                  borderRadius: dialogBorderRadius,
                  borderTopRightRadius: borderTopRightRadius,
                  elevation: 4,
                  shadowOffset: {
                    height: 4,
                    width: 2,
                  },
                },
                dialogStyle,
              ]}>
              {headerView}
              {headerVisible ? (
                <>
                  <View
                    style={styles.styleViewHeader}
                    onStartShouldSetResponder={() => Keyboard.dismiss()}
                  />
                  <Image
                    source={urlLogo}
                    resizeMode="contain"
                    style={styles.styleImageLogo}
                  />
                </>
              ) : null}
              {/* {this.renderTitle()} */}
              {this.renderContent()}
            </View>
          </View>
          {this.renderOutsideTouchable(onTouchOutside)}
        </View>
      </Modal>
    );
  }
}

BaseDialog.propTypes = {
  dialogStyle: ViewPropTypes.style,
  contentStyle: ViewPropTypes.style,
  buttonsStyle: ViewPropTypes.style,
  overlayStyle: ViewPropTypes.style,
  buttons: PropTypes.element,
  visible: PropTypes.bool,
  onRequestClose: PropTypes.func,
  showDialog: PropTypes.func,
  onShow: PropTypes.func,
  onTouchOutside: PropTypes.func,
  title: PropTypes.string,
  titleStyle: Text.propTypes.style,
  keyboardDismissMode: PropTypes.string,
  keyboardShouldPersistTaps: PropTypes.string,
};

BaseDialog.defaultProps = {
  visible: false,
  onRequestClose: () => null,
};

const styles = StyleSheet.create({
  styleViewHeader: {
    height: 230,
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    backgroundColor: '#aBFBFB',
    borderRadius: 100,
    marginTop: -120,
  },
  styleImageLogo: {
    width: widthPercent(60),
    height: 100,
    alignSelf: 'center',
    marginBottom: 10,
  },
  styleIconClose: {
    height: 40,
    width: 40,
    position: 'absolute',
    right: 0,
    borderRadius: 30,
    top: -Dimension.margin20,
    borderColor: Color.tomato,
    borderWidth: 0.5,
    backgroundColor: '#aBFBFB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.23,
    shadowRadius: 20,
    elevation: 4,
    zIndex: 9999,
  },
});
