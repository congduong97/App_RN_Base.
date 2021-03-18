import React, {PureComponent} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Platform,
  SafeAreaView,
} from 'react-native';
import {DEVICE_WIDTH, SYSTEAM_VERSION} from '../../../const/System';
import {
  COLOR_BLACK,
  COLOR_GRAY,
  APP_COLOR,
  COLOR_GRAY_LIGHT,
} from '../../../const/Color';
import {STRING} from '../../../const/String';
import Icon from 'react-native-vector-icons/Ionicons';

export default class Header extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title ? this.props.title.replace(/\n|\r/g, '') : '',
    };
  }
  componentWillReceiveProps(nextProps) {
    const {title} = nextProps;
    if (this.state.title !== nextProps.title && title) {
      this.setState({title: title.replace(/\n|\r/g, '')});
    }
  }
  setDataEmpty = () => {
    const {setDataEmpty, goBack} = this.props;
    goBack();
    if (setDataEmpty) {
      setDataEmpty();
    }
  };

  render() {
    const {onPressSearch, keySearch, onPressDelete, disableSearch} = this.props;
    console.log('keySearch', keySearch);
    const {title} = this.state;
    return (
      <SafeAreaView>
        <View style={[styles.wrapperHeader]}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              padding: 10,
              width: 100,
              paddingRight: 30,
              paddingLeft: 15,
              alignItems: 'center',
              flexDirection: 'row',
            }}
            onPress={() => {
              this.setDataEmpty();
            }}>
            <Icon
              name="ios-arrow-back"
              size={25}
              color={APP_COLOR.COLOR_TEXT}
            />
            <Text style={{fontSize: 16, color: APP_COLOR.COLOR_TEXT}}>
              {' '}
              {STRING.back}
            </Text>
          </TouchableOpacity>

          {!keySearch ? (
            <View style={styles.wrapperLogo}>
              <Text style={styles.textTitle}>{title}</Text>
            </View>
          ) : (
            <View style={styles.wrapperLogo}>
              <Text
                style={[
                  styles.textTitle,
                  {color: APP_COLOR.COLOR_TEXT, fontSize: 13},
                ]}>
                {keySearch}
              </Text>
              <Icon
                style={{padding: 20}}
                onPress={() => {
                  onPressDelete();
                }}
                name="ios-close-circle-outline"
                size={20}
              />
            </View>
          )}

          <View />
          {disableSearch ? (
            <View style={{width: 55, marginRight: 16}} />
          ) : (
            <TouchableOpacity
              onPress={() => {
                onPressSearch();
              }}
              style={{
                width: 55,
                marginLeft: 30,
                height: 24,
                marginRight: 16,
                borderColor: APP_COLOR.COLOR_TEXT,
                borderWidth: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{color: APP_COLOR.COLOR_TEXT, fontSize: 13}}>
                {STRING.search}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }
}

const isIOS = Platform.OS === 'ios';

const styles = StyleSheet.create({
  wrapperHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: DEVICE_WIDTH,
    height: isIOS ? 64 : 56,
    backgroundColor: '#FFF',
    marginBottom: 1,
    marginTop: parseInt(SYSTEAM_VERSION) < 11 && isIOS ? 20 : 0,
    borderBottomWidth: 1,
    borderColor: COLOR_GRAY_LIGHT,
  },
  textTitle: {
    // fontFamily: "SegoeUI",
    color: COLOR_BLACK,
    fontSize: 15,
  },
  wrapperLogo: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: DEVICE_WIDTH - 200,
  },
  imageLogo: {
    width: 30,
    height: 20,
    marginRight: 10,
  },
  shadow: isIOS
    ? {
        shadowColor: COLOR_GRAY,
        shadowOffset: {width: 1, height: 1},
        shadowOpacity: 0.5,
      }
    : {
        elevation: 1,
      },
});
