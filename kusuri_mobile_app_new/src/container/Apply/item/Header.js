import React, { PureComponent } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import { DEVICE_WIDTH, isIOS, SYSTEAM_VERSION, APP } from '../../../const/System';
import { COLOR_BLACK, COLOR_GRAY, COLOR_GRAY_LIGHT, COLOR_WHITE, APP_COLOR } from '../../../const/Color';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AppImage } from '../../../component/AppImage';

export class Header extends PureComponent {
 

  getTitle = (title) => {
    if (title) {
      return title.replace(/\n|\r/g, '');
    }
    return '';
  }
  renderRight = () => {
    const { RightComponent } = this.props;
    if (RightComponent) {
      return RightComponent;
    }
    return <View style={{ width: 100 }} />;
  }
  render() {
    const { goBack, imageUrl, title } = this.props;
    return (
      <SafeAreaView style={{backgroundColor: COLOR_WHITE}}>
        <View style={[styles.wrapperHeader]}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{ padding: 10, width: 100, paddingRight: 30, paddingLeft: 15, alignItems: 'center', flexDirection: 'row', }}
            onPress={() => {
              goBack();
            }}
          >
            <Ionicons
              name={'ios-arrow-back'} size={22} color={APP_COLOR.COLOR_TEXT}
            />
          </TouchableOpacity>
          <AppImage style={styles.imageLogo} url={APP.IMAGE_LOGO} resizeMode={'contain'} />

          {/* <View style={styles.wrapperLogo}>
            {imageUrl ? (
              <AppImage style={styles.imageLogo} url={imageUrl} resizeMode={'contain'} />
            ) : null}
            <Text style={styles.textTitle}>{this.getTitle(title)}</Text>
          </View> */}

          {/* right component in header  */}
          {this.renderRight()}
        </View>
      </SafeAreaView>

    );
  }
}
const withHeader =  isIOS ? (64 - 17) : (56 - 8.5);
const styles = StyleSheet.create({
  wrapperHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: DEVICE_WIDTH,
    height: isIOS ? 64 : 56,
    borderBottomWidth: 1,
    borderColor: COLOR_GRAY_LIGHT,
    backgroundColor: COLOR_WHITE,
    marginTop: parseInt(SYSTEAM_VERSION) < 11 && isIOS ? 20 : 0,

  },
  textTitle: {
    // fontFamily: "SegoeUI",
    color: COLOR_BLACK,
    fontSize: 16
  },
  wrapperLogo: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  imageLogo: {
    width:  withHeader * (109/27)  ,
    height: withHeader
  },
  shadow: isIOS
    ? {
      shadowColor: COLOR_GRAY,
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.5
    }
    : {
      elevation: 1
    }
});
