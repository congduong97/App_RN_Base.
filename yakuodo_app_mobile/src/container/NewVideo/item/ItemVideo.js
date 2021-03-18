import React, {PureComponent} from 'react';
import {
  COLOR_BLACK,
  COLOR_BLUE,
  COLOR_GRAY,
  COLOR_GRAY_LIGHT,
  COLOR_WHITE,
  APP_COLOR,
  COLOR_RED,
} from '../../../const/Color';
import {
  DEVICE_HEIGHT,
  DEVICE_WIDTH,
  isIOS,
  API_KEY_YOUTUBE,
} from '../../../const/System';
import {getImageWithLinkYouTube, getIDWithLinkYouTube} from '../../../util';
import {StyleSheet, Text, TouchableOpacity, View, Linking} from 'react-native';
import {AppImage} from '../../../component/AppImage';
import Icon from 'react-native-vector-icons/Ionicons';
import {Api} from '../until/api';
import {
  YouTubeStandaloneIOS,
  YouTubeStandaloneAndroid,
} from 'react-native-youtube';
import Orientation from 'react-native-orientation-locker';

export default class ItemVideo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getTimeFomartDDMMYY = time => {
    if (!time) {
      return '';
    }
    const date = new Date(time);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  onPressVideo = () => {
    const {data} = this.props;
    const {url, id} = data;

    this.clickVideos(id);
    if (isIOS) {
      Orientation.unlockAllOrientations();
      YouTubeStandaloneIOS.playVideo(getIDWithLinkYouTube(url))
        .then(() => {
          Orientation.lockToPortrait();
        })
        .catch(errorMessage => {
          Linking.openURL(url);
          // console.log('errorMessage', errorMessage);
          Orientation.lockToPortrait();
        });
    } else {
      YouTubeStandaloneAndroid.playVideo({
        apiKey: API_KEY_YOUTUBE, // Your YouTube Developer API Key
        videoId: getIDWithLinkYouTube(url), // YouTube video ID
        autoplay: true, // Autoplay the video
        startTime: 0, // Starting point of video (in seconds)
      })
        .then(() => {})
        .catch(errorMessage => {
          Linking.openURL(url);
        });
    }
  };

  clickVideos = async id => {
    try {
      const response = await Api.countVideo(id);
    } catch (e) {}
  };

  render() {
    const {data} = this.props;
    const {url, startDate, endDate, createdTime, name} = data;
    return (
      <TouchableOpacity
        onPress={this.onPressVideo}
        activeOpacity={0.8}
        style={styles.wrapperCard}>
        <View style={styles.wrapperImageAvatarVideo}>
          <AppImage
            notLoading
            url={getImageWithLinkYouTube(url)}
            style={styles.imageAvatarVideo}
            resizeMode={'cover'}
            notDomain
          />
          <View
            style={[
              styles.wrapperImageAvatarVideo,
              {
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.5,
              },
            ]}>
            <Icon name={'logo-youtube'} size={70} color={COLOR_RED} />
          </View>
        </View>
        <View style={styles.wrapperTextVideo}>
          {name ? (
            <Text style={styles.textTitleCard} numberOfLines={2}>
              {name}
            </Text>
          ) : null}
          <View style={{height: 5}} />
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View width={20}>
              <Icon name="md-time" size={12} color={APP_COLOR.COLOR_TEXT} />
            </View>
            <Text
              style={{
                paddingLeft: 5,
                fontSize: 12,
                color: APP_COLOR.COLOR_TEXT,
              }}>
              {this.getTimeFomartDDMMYY(createdTime)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  wrapperBody: {
    flex: 1,
    backgroundColor: COLOR_WHITE,
  },
  wrapperContainer: {
    paddingBottom: isIOS && DEVICE_HEIGHT === 812 ? 44 : 0,
    backgroundColor: COLOR_WHITE,
  },
  wrapperCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textDescriptionCard: {
    fontFamily: 'SegoeUI',
    fontSize: 14,
  },
  textTitleCard: {
    color: COLOR_BLACK,
    fontSize: 14,
    fontWeight: 'bold',
  },
  textTimeCard: {
    fontSize: 12,
    color: COLOR_BLUE,
    fontFamily: 'SegoeUI',
  },
  wrapperTextVideo: {
    marginTop: 10,
    width: DEVICE_WIDTH - 40,
  },
  wrapperCard: {
    height: 295,
    alignItems: 'center',
    padding: 16,
    paddingBottom: 5,
    backgroundColor: COLOR_WHITE,
    borderWidth: 1,
    borderColor: COLOR_GRAY_LIGHT,
  },
  wrapperImageAvatarVideo: {
    width: DEVICE_WIDTH - 32,
    height: 200,
  },
  imageAvatarVideo: {
    width: DEVICE_WIDTH - 32,
    height: 200,
  },
  shadow: isIOS
    ? {
        shadowColor: COLOR_GRAY,
        shadowOffset: {width: 2, height: 2},
        shadowOpacity: 0.5,
      }
    : {
        elevation: 2,
      },
  wrapperSpace: {
    height: 50,
  },
});
