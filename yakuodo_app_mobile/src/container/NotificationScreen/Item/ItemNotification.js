import React, { Component } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Alert, Linking } from 'react-native';
import { Grid, Col } from 'native-base';

import { COLOR_BLACK, COLOR_BLUE, COLOR_GRAY, COLOR_GRAY_LIGHT, COLOR_WHITE, }
  from '../../../const/Color';
import { screen, managerAcount, isIOS } from '../../../const/System';
import { STRING } from '../../../const/String';

import { AppImage } from '../../../component/AppImage';
import Icons from 'react-native-vector-icons/FontAwesome';
import NotificationCount from '../../../service/NotificationCount';
import { Api } from '../../../service';
import { openMenu } from '../../../util/module/openMenu';
import { ServiveModal } from '../../HomeScreen/util/service';

export default class ItemNotification extends Component {
  onPressNoti = () => {
    const { navigation, data } = this.props;
    const { typeNoti, urlWebview, linkApplyBanner, typeOpenWebview } = this.props.data;
    // console.log('notification', data);
    if (typeNoti !== 1) {
      this.clickNotification(data.id);
    }
    if (typeNoti === 1) {
      navigation.navigate('DetailNotification', { data });
      return;
    }
    if (typeNoti === 2) {
      openMenu(data.menuEntity, navigation);
      return;
    }
    if (typeNoti === 3 && urlWebview) {
      navigation.navigate('WEB_VIEW', { url: urlWebview });
      return;
    }
    if (!managerAcount.userId && (typeNoti === 4 || typeNoti === 5)) {
      Alert.alert(
        STRING.notification,
        STRING.please_login_to_use,
        [
          {
            text: STRING.cancel,
            onPress: () => { },
            style: 'cancel'
          },
          { text: STRING.ok, onPress: () => ServiveModal.set() },
        ],
        { cancelable: false }
      );
      return;
    }

    if (typeNoti === 4) {
      navigation.navigate('LIST_BANNER');
      return;
    }
    if (typeNoti === 5 && linkApplyBanner) {
      if (typeOpenWebview === 1) {
        navigation.navigate('WEB_VIEW', { url: `${linkApplyBanner}${managerAcount.memberCode}` });
      } else {
        Linking.openURL(`${linkApplyBanner}${managerAcount.memberCode}`);
      }
      return;
    }
  }
  clickNotification = async (id) => {
    try {
      Api.getNotificationDetail(id);
    } catch (error) {

    }
  }


  render() {
    const { data, end } = this.props;
    const { title, shortContent, createdTime, type, color, imageUrl } = data;
    const colorConvert = color && color[0] === '#' ? color : COLOR_BLACK;

    const borderBottomWidth = end ? 0 : 0.5;
    // console.log('ItemNotification', data);
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.wrapperCard, { borderBottomWidth }]}
        onPress={this.onPressNoti}
      >
        <Grid >
          <Col
            size={4}
          >
            <View >
              <View style={styles.title}>
                {type === 1 ?
                  <Icons name={'star'} size={16} color={colorConvert} /> : null}
                <Text
                  style={[styles.textTitleCard, { color: type === 1 ? colorConvert : COLOR_BLACK }]}
                >{title}
                </Text>
                {type === 1 ?
                  <Text style={[styles.exclamationMark, { color: colorConvert }]}>!</Text> : null}
              </View>
              <View style={{ height: 5 }} />
              <Text numberOffLines={3} style={styles.textDescriptionCard}>
                {shortContent}
              </Text>
              <View style={{ height: 5 }} />
              <Text style={styles.textTimeCard}>{createdTime}</Text>
              <View style={{ height: 5 }} />
            </View>
          </Col>
          {imageUrl && (<Col
            size={1}
            style={{ alignItems: 'flex-end', justifyContent: 'center', }}
          >
            <AppImage
              onPress={() => this.onPressNoti()}
              url={imageUrl}
              resizeMode={'cover'}
              style={{ width: 48, height: 48, borderRadius: 24, }}
            />
          </Col>)}
        </Grid>

      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  textTitleCard: {
    // fontFamily: 'SegoeUI',
    color: COLOR_BLACK,
    fontSize: 12,
    fontWeight: '700'
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  textDescriptionCard: {
    fontFamily: 'SegoeUI',
    color: COLOR_GRAY,
    fontSize: 11
  },
  textTimeCard: {
    fontSize: 10,
    color: COLOR_BLUE,
    fontFamily: 'SegoeUI'
  },
  exclamationMark: {
    fontSize: 15,
    fontFamily: 'SegoeUI',
    top: -2
  },
  wrapperCard: {
    padding: 12,
    borderColor: COLOR_GRAY_LIGHT,
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: COLOR_WHITE
  }
});
