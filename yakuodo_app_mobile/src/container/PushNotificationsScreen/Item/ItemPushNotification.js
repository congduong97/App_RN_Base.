import React, {PureComponent} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Linking,
} from 'react-native';
import {Text, View, Col, Grid} from 'native-base';
import {
  COLOR_BLACK,
  COLOR_BLUE,
  COLOR_GRAY_LIGHT,
  COLOR_WHITE,
  APP_COLOR,
  COLOR_GRAY,
  COLOR_YELLOW,
} from '../../../const/Color';
import {DEVICE_WIDTH, screen} from '../../../const/System';
import {AppImage} from '../../../component/AppImage';
import {Api} from '../../../service';
import Icon from 'react-native-vector-icons/Ionicons';
import Triangle from 'react-native-triangle';
import {managerAcount, isIOS} from '../../../const/System';
import {STRING} from '../../../const/String';
import NotificationCount from '../../../service/NotificationCount';
import {openMenu} from '../../../util/module/openMenu';
import {ServiveModal} from '../../HomeScreen/util/service';

export class ItemPushNotification extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      wiewed: this.props.item.wiewed,
    };
  }
  onPress = () => {
    const {navigation, item} = this.props;
    // console.log('item', item);
    const {wiewed} = this.state;
    const {
      typePush,
      id,
      linkWebview,
      menuEntity,
      keyword,
      typeOpenBanner,
      linkApply,
    } = this.props.item;
    if (!wiewed) {
      if (typePush !== 1) {
        Api.getPushNotificationDetail(id)
          .then(res => {})
          .catch(e => {});
      }
      this.props.item.wiewed = true;
      this.setState({wiewed: true});
    }
    if (typePush == 1) {
      navigation.navigate('DetailPushNotification', {id: item.id});
    } else if (typePush == 2) {
      navigation.navigate('WEB_VIEW', {url: linkWebview});
    } else if (typePush === 4) {
      if (managerAcount.userId) {
        if (typeOpenBanner === 1) {
          navigation.navigate('LIST_BANNER');
        } else if (linkApply) {
          navigation.navigate('WEB_VIEW', {
            url: `${linkApply}${managerAcount.memberCode}`,
          });
        }
      } else {
        Alert.alert(
          STRING.notification,
          STRING.please_login_to_use,
          [
            {
              text: STRING.cancel,
              onPress: () => {},
              style: 'cancel',
            },
            {text: STRING.ok, onPress: () => ServiveModal.set()},
          ],
          {cancelable: false},
        );
      }
    } else {
      openMenu(menuEntity, navigation, keyword, undefined);
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.item.wiewed !== this.state.wiewed) {
      this.setState({wiewed: nextProps.item.wiewed});
    }
  }

  render() {
    const {
      pushTime,
      imageUrl,
      title,
      description,
      linkWebview,
    } = this.props.item;
    const {wiewed} = this.state;
    return (
      <TouchableOpacity
        onPress={this.onPress}
        actionOpacity={0.8}
        style={[
          styles.wrapperCard,
          {backgroundColor: wiewed ? COLOR_WHITE : APP_COLOR.COLOR_TEXT + 20},
        ]}>
        {imageUrl ? (
          <AppImage
            onPress={this.onPress}
            url={imageUrl}
            resizeMode={'cover'}
            style={{
              width: '100%',
              height: DEVICE_WIDTH * (9 / 16),
              marginBottom: 10,
            }}
          />
        ) : null}

        <View>
          <Text style={styles.textTitleCard}>{title}</Text>
          <Text style={styles.textDescriptionCard}>{description}</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: 20,
              marginBottom: 16,
            }}>
            {/* <Icon name={'md-time'} size={10} color={APP_COLOR.COLOR_TEXT} /> */}
            <Text style={styles.textTimeCard}>{pushTime}</Text>
          </View>
        </View>
        {!linkWebview ? null : isIOS ? (
          <Image
            source={require('../../../images/tagweb.png')}
            resizeMode={'cover'}
            style={{
              position: 'absolute',
              right: 0,
              width: 70,
              height: 45,
            }}
          />
        ) : (
          <Triangle
            style={{position: 'absolute', right: 0}}
            width={70}
            height={45}
            color={COLOR_YELLOW}
            direction={'up-right'}
          />
        )}
        {!linkWebview ? null : (
          <Icon
            style={{position: 'absolute', right: 5, top: 5}}
            name={'ios-globe'}
            color={COLOR_WHITE}
            size={20}
          />
        )}
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  textDescriptionCard: {
    fontFamily: 'SegoeUI',
    fontSize: 10,
    color: COLOR_GRAY,
    marginBottom: 6,
  },
  textTitleCard: {
    color: COLOR_BLACK,
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  textTimeCard: {
    fontSize: 10,
    color: COLOR_BLUE,
    fontFamily: 'SegoeUI',
    marginLeft: 0,
  },
  wrapperCard: {
    borderColor: COLOR_GRAY_LIGHT,
    borderBottomWidth: 1,
    padding: 16,
    paddingBottom: 0,
    flexDirection: 'column',
    backgroundColor: COLOR_WHITE,
  },
});
