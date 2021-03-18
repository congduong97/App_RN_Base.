import React, { PureComponent } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  RefreshControl,
  ScrollView

} from 'react-native';
import {

  COLOR_GRAY_LIGHT,
  COLOR_BROWN,
  COLOR_WHITE,
  COLOR_GRAY,
  COLOR_BLACK,
  APP_COLOR,
  COLOR_BLUE,
} from '../../const/Color';
import { screen, DEVICE_WIDTH, DEVICE_HEIGHT, isIOS, tracker } from '../../const/System';
import { STRING } from '../../const/String';
import HeaderIconLeft from '../../commons/HeaderIconLeft';
import { Api } from '../../service';
import NetworkError from '../../commons/NetworkError';
import Loading from '../../commons/Loading';
import { AppImage } from '../../component/AppImage';
import WebViewComponent from '../../component/WebViewComponent';
import ReloadScreen from '../../service/ReloadScreen';
// import { WebView } from 'react-native-webview';

export class DetailPushNotifiCation extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isLoadingRefresh: false,
      networkError: false,
      error: false,
      display: true,
      time: '',
      title: '',
      urlImage: '',
      description: ''
    };
    this.onDidMount = this.onDidMount.bind(this);
  }

  componentDidMount() {
    this.onDidMount();
    const { routeName } = this.props.navigation.state

    ReloadScreen.onChange(routeName, () => {
      this.getApi(true);
    })
  }
  componentWillUnmount() {
    screen.name = false;
    const { routeName } = this.props.navigation.state
    ReloadScreen.unChange(routeName)

  }
  onDidMount() {
    screen.name = 'DetailPushNotifiCation';
    this.getApi();
  }
  getApi = async (loadingRefresh, id) => {
    const {isLoadingRefresh} = this.state
    if(isLoadingRefresh){
      return
    }
    try {
     
      const { params } = this.props.navigation.state;
      if (loadingRefresh) {
        this.setState({ isLoadingRefresh: true });
      } else {
        this.setState({ isLoading: true });
      }
      const response = await Api.getPushNotificationDetail(id || params.id);
      // console.log('response', response);

      if (response.code === 200) {
        const {
          pushTime,
          imageUrl,
          title,
          shortDescription,
          longDescription,
          id,
        } = response.res.data;


        this.state.pushTime = pushTime;
        this.state.imageUrl = imageUrl;
        this.state.title = title;
        this.state.shortDescription = shortDescription;
        this.state.longDescription = longDescription;
        this.state.id = id;
        this.state.error = false;
      } else {
        this.state.error = true;
      }
    } catch (err) {
      this.state.error = true;
    } finally {
      this.setState({ isLoadingRefresh: false, isLoading: false });
    }
  };
  renderContent() {
    const { isLoading, error, pushTime, imageUrl, title,
      shortDescription, longDescription, id } = this.state;
    if (isLoading) {
      return (
        <Loading />
      );
    }
    if (error) {
      return (
        <NetworkError
          onPress={this.onDidMount}
        />
      );
    }
    return (
      <ScrollView
        style={styles.wrapperBody}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isLoadingRefresh}
            onRefresh={() => this.getApi(true, id)}
          />
        }
      >
        {imageUrl && (
          <AppImage useZoom url={imageUrl} style={styles.imageFeature} resizeMode={'contain'} />
        )}

        <View style={{ padding: 16, paddingTop: 0, borderTopWidth: imageUrl ? 1 : 0, borderTopColor: COLOR_GRAY_LIGHT }}>
          <Text style={styles.textTitle}>{title}</Text>
          <Text style={styles.textDescription} >{shortDescription}</Text>
          <Text style={[styles.textTime, { color: COLOR_BLUE }]}>
            {pushTime}
          </Text>
          <WebViewComponent
            navigation={this.props.navigation}
            html={longDescription}
          />

        </View>
      </ScrollView>
    );
  }
  render() {
    const { goBack } = this.props.navigation;

    return (
      <View style={styles.wrapperContainer}>
        <StatusBar backgroundColor={COLOR_GRAY_LIGHT} barStyle="dark-content" />
        <HeaderIconLeft title={STRING.push_notification_detail} goBack={goBack} />
        {this.renderContent()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapperBody: {
    flex: 1,
    backgroundColor: COLOR_WHITE
  },
  wrapperCenter: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  wrapperItem: {
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 10
  },
  imageFeature: {
    width: DEVICE_WIDTH,
    height: DEVICE_WIDTH * (9 / 16)
  },

  textTitle: {
    color: COLOR_BLACK,
    fontSize: 15,
    fontWeight: 'bold',
    // fontFamily: 'SegoeUI',
    marginTop: 8

  },
  textTime: {
    fontFamily: 'SegoeUI',
    color: COLOR_BROWN,
    fontSize: 10,
    marginTop: 8,
    marginBottom: 8,
  },
  textDescription: {
    color: COLOR_GRAY,
    fontFamily: 'SegoeUI',
    fontSize: 14,
    marginTop: 8
  },
  wrapperContainer: {
    backgroundColor: COLOR_WHITE,
    flex: 1
  }
});
