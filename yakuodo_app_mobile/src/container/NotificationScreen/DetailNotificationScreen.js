import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  RefreshControl,
  ScrollView,
} from 'react-native';
import Icons from 'react-native-vector-icons/dist/FontAwesome';

import HeaderIconLeft from '../../commons/HeaderIconLeft';
import {
  COLOR_GRAY_LIGHT,
  COLOR_GRAY,
  COLOR_BLACK,
  COLOR_BLUE,
  COLOR_WHITE,
  COLOR_BORDER,
} from '../../const/Color';
import {Api} from '../../service';
import {
  screen,
  DEVICE_WIDTH,
  DEVICE_HEIGHT,
  tracker,
  isIOS,
} from '../../const/System';
import {STRING} from '../../const/String';

import NetworkError from '../../commons/NetworkError';
import Loading from '../../commons/Loading';
import WebViewComponent from '../../component/WebViewComponent';
import {AppImage} from '../../component/AppImage';
import ReloadScreen from '../../service/ReloadScreen';
export class DetailNotification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      networkError: false,
      title: '',
      time: '',
      body: '',
      imageUrl: null,
      isLoadingRefresh: false,
      shortContent: '',
    };
    this.refreshPage = this.refreshPage.bind(this);
  }

  componentDidMount() {
    this.getApi();
    const {routeName} = this.props.navigation.state;

    ReloadScreen.onChange(routeName, () => {
      this.getApi(true);
    });
  }
  componentWillUnmount() {
    const {routeName} = this.props.navigation.state;
    ReloadScreen.unChange(routeName);
  }
  getApi = async loadRefresh => {
    const {isLoadingRefresh} = this.state;
    if (isLoadingRefresh) {
      return;
    }

    try {
      const {data} = this.props.navigation.state.params;

      if (loadRefresh) {
        this.setState({isLoadingRefresh: true});
      } else {
        this.setState({isLoading: true});
      }
      const response = await Api.getNotificationDetail(data.id);
      // console.log('response', response);
      if (response.code === 200 && response.res.status.code === 1000) {
        const {
          title,
          content,
          createdTime,
          type,
          color,
          imageUrl,
          shortContent,
        } = response.res.data;
        this.state.time = createdTime;
        this.state.title = title;
        this.state.imageUrl = imageUrl;
        this.state.body = content;
        this.state.colorCode = color;
        this.state.isImportant = type === 1;
        this.state.shortContent = shortContent;
        this.state.error = false;
      } else {
        this.state.error = true;
      }
    } catch (err) {
      this.state.error = true;
    } finally {
      this.setState({isLoading: false, isLoadingRefresh: false});
    }
  };

  refreshPage() {
    this.getApi(true);
  }
  renderContent() {
    const {
      isLoadingRefresh,
      isLoading,
      body,
      isImportant,
      colorCode,
      title,
      imageUrl,
      shortContent,
      error,
    } = this.state;
    if (error) {
      return (
        <NetworkError
          onPress={() => {
            this.getApi();
          }}
        />
      );
    }
    if (isLoading) {
      return <Loading />;
    }
    return (
      <ScrollView
        style={[styles.wrapperBody]}
        refreshControl={
          <RefreshControl
            refreshing={isLoadingRefresh}
            onRefresh={this.refreshPage}
          />
        }>
        {!!imageUrl && (
          <AppImage
            useZoom
            url={imageUrl}
            style={styles.imageFeature}
            resizeMode={'contain'}
          />
        )}

        <View
          style={{
            padding: 16,
            borderTopWidth: imageUrl ? 1 : 0,
            borderTopColor: COLOR_GRAY_LIGHT,
          }}>
          <View style={styles.title}>
            {!!isImportant && (
              <Icons name={'star'} size={16} color={colorCode} />
            )}
            <Text
              style={[
                styles.textTitleCard,
                {color: isImportant ? colorCode : COLOR_BLACK},
              ]}>
              {title}
            </Text>
            {!!isImportant && (
              <Text style={[styles.exclamationMark, {color: colorCode}]}>
                !
              </Text>
            )}
          </View>
          <Text style={styles.textDescriptionCard}>{shortContent}</Text>

          <Text style={styles.textTimeCard}>{this.state.time}</Text>
          <WebViewComponent navigation={this.props.navigation} html={body} />
        </View>
      </ScrollView>
    );
  }
  render() {
    const {goBack} = this.props.navigation;
    const {isLoading, imageUrl} = this.state;
    // console.log('imageUrl', imageUrl);
    return (
      <View style={styles.wrapperContainer}>
        <HeaderIconLeft title={STRING.notification_detail} goBack={goBack} />
        {this.renderContent()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapperBody: {
    flex: 1,
    backgroundColor: COLOR_WHITE,
    width: DEVICE_WIDTH,
  },
  imageFeature: {
    width: DEVICE_WIDTH,
    flex: 1,
    height: DEVICE_WIDTH * (9 / 16),
    position: 'relative',
  },
  wrapperCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapperContainer: {
    backgroundColor: COLOR_WHITE,
    flex: 1,
  },
  textTitleCard: {
    // fontFamily: 'SegoeUI',
    color: COLOR_BLACK,
    fontSize: 15,
    fontWeight: 'bold',
  },
  textDescriptionCard: {
    fontFamily: 'SegoeUI',
    color: COLOR_GRAY,
    fontSize: 14,
    marginTop: 8,
  },
  textTimeCard: {
    fontSize: 10,
    color: COLOR_BLUE,
    fontFamily: 'SegoeUI',
    marginTop: 8,
  },
  wrapperCard: {
    padding: 20,
    borderColor: COLOR_BORDER,
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: COLOR_WHITE,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exclamationMark: {
    fontSize: 15,
    fontFamily: 'SegoeUI',
    top: -2,
  },
});
