import React, { PureComponent } from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import { DEVICE_WIDTH, isIOS, SYSTEAM_VERSION, APP } from '../../../const/System';
import { COLOR_BLACK, COLOR_GRAY, COLOR_ORANGE, COLOR_GRAY_LIGHT } from '../../../const/Color';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/dist/FontAwesome';
import { AppImage } from '../../../component/AppImage';
export default class HeaderIconLeft extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    }
  }

  getTitle = (title) => {
    if (title) {
      return title.replace(/\n|\r/g, '');
    }
    return '';
  }
  renderRight = () => {
    const { RightComponent, useBookmark, onPressBookMark, bookmark, checkName } = this.props;

    if (useBookmark) {
      return (
        <View style={{ width: 100, alignItems: 'flex-end' }} >

          <Icons
            name={bookmark ? 'star' : 'star-o'}
            size={24}
            style={{ paddingLeft: 30, paddingRight: 15 }}
            color={bookmark ? COLOR_ORANGE : COLOR_GRAY}
            onPress={() => {
              onPressBookMark();
            }}
          />
        </View>
      );
    }
    if (RightComponent) {
      return RightComponent;
    }
    return <View style={{ width: 100 }} />;
  }
  goBack = () => {
    const { goBack, checkName } = this.props;
    if (goBack && checkName) {
      goBack() && checkName();
    }
  }
  render() {
    const { loading } = this.state;
    const { stylesView } = this.props;
    return (
      <SafeAreaView>
        <View style={[styles.wrapperHeader], stylesView}>
          <View style={{ width: '100%', height: '100%', position: 'absolute', justifyContent: 'center', alignItems: 'center' }}>
            <AppImage style={styles.imageLogo} url={APP.IMAGE_LOGO} resizeMode={'contain'} />
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{ padding: 10, width: 100, paddingRight: 30, paddingLeft: 15, alignItems: 'center', flexDirection: 'row', }}
            onPress={() => {
              this.goBack();
            }}
          >
            <Ionicons
              name={'ios-arrow-back'} size={22}
            />
          </TouchableOpacity>


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
const withHeader = isIOS ? (64 - 17) : (56 - 8.5);
const styles = StyleSheet.create({
  wrapperHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: DEVICE_WIDTH,
    height: isIOS ? 64 : 56,
    borderBottomWidth: 1,
    borderColor: COLOR_GRAY_LIGHT,
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
    width: withHeader * (109 / 27),
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
