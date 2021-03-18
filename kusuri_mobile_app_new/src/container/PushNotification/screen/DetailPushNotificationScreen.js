//Library:
import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  RefreshControl,
  ScrollView,
} from "react-native";
import {
  COLOR_GRAY_LIGHT,
  COLOR_WHITE,
  COLOR_GRAY,
  COLOR_BLACK,
  COLOR_BLUE,
  APP_COLOR,
} from "../../../const/Color";

//Setup:
import { Api } from "../util/api";
import { screen, DEVICE_WIDTH, styleInApp } from "../../../const/System";
import { STRING } from "../util/string";

//Component:
import { Loading, NetworkError, HeaderIconLeft } from "../../../commons";
import { AppImage } from "../../../component/AppImage";
import WebViewComponent from "../../../component/WebViewComponent";
import { getTimeFomartDDMMYY } from "../../../util";
import { TextTime } from "../../../component/TextTime/TextTime";
import ReloadScreen from "../../../service/ReloadScreen";
import MaintainView from "../../../commons/MaintainView";

export default class DetailPushNotifiCation extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isLoadingRefresh: false,
      networkError: false,
      error: false,
      display: true,
      time: "",
      title: "",
      urlImage: "",
      description: "",
      maintain: false,
    };
    this.onDidMount = this.onDidMount.bind(this);
  }

  componentDidMount() {
    this.onDidMount();
    const { routeName } = this.props.navigation.state;

    ReloadScreen.onChange(routeName, () => {
      this.getApi(true);
    });
  }
  componentWillUnmount() {
    const { routeName } = this.props.navigation.state;
    ReloadScreen.unChange(routeName);
  }

  onDidMount() {
    screen.name = "DetailPushNotifiCation";
    const getApi = this.getApi;
    getApi();
  }

  getApi = async (loadingRefresh, id) => {
    if (this.state.isLoadingRefresh || this.state.isLoading) {
      return;
    }
    try {
      const { params } = this.props.navigation.state;
      if (loadingRefresh) {
        this.setState({ isLoadingRefresh: true });
      } else {
        this.setState({ isLoading: true });
      }
      const response = await Api.getPushNotificationDetail(id || params.id);
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
        this.state.maintain = false;
      } else if (status.code == 502) {
        this.state.maintain = true;
        this.state.error = false;
      } else {
        this.state.error = true;
        this.state.maintain = false;
      }
    } catch (err) {
      this.state.error = true;
      this.state.maintain = false;
    } finally {
      this.setState({ isLoadingRefresh: false, isLoading: false });
    }
  };
  renderContent() {
    const {
      isLoading,
      error,
      pushTime,
      imageUrl,
      title,
      shortDescription,
      longDescription,
      id,
    } = this.state;
    const { navigation } = this.props;
    if (isLoading) {
      return <Loading />;
    }

    if (error) {
      return <NetworkError onPress={this.onDidMount} />;
    }

    return (
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isLoadingRefresh}
            onRefresh={() => this.getApi(true, id)}
          />
        }
      >
        {imageUrl && (
          <AppImage
            useZoom
            url={imageUrl}
            style={styles.imageFeature}
            resizeMode={"cover"}
          />
        )}

        <View style={{ padding: 16 }}>
          <Text style={[styleInApp.titleDetail]}>{title}</Text>
          <Text style={styleInApp.shortDescription}>{shortDescription}</Text>
          <TextTime time={getTimeFomartDDMMYY(pushTime)} />
          <WebViewComponent html={longDescription} navigation={navigation} />
        </View>
      </ScrollView>
    );
  }
  render() {
    const { goBack } = this.props.navigation;
    const { maintain } = this.state;
    if (maintain) {
      return <MaintainView onPress={this.getApi} />;
    }
    return (
      <View
        style={[
          styles.wrapperContainer,
          { backgroundColor: APP_COLOR.BACKGROUND_COLOR },
        ]}
      >
        <StatusBar backgroundColor={COLOR_GRAY_LIGHT} barStyle='dark-content' />
        <HeaderIconLeft
          title={STRING.push_notification_detail}
          goBack={goBack}
        />

        {this.renderContent()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapperBody: {
    flex: 1,
    backgroundColor: COLOR_WHITE,
  },
  wrapperCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  wrapperItem: {
    flexDirection: "row",
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 10,
  },
  imageFeature: {
    width: DEVICE_WIDTH,
    height: DEVICE_WIDTH,
  },

  textTitle: {
    fontFamily: "SegoeUI",
    color: COLOR_BLACK,
    fontSize: 16,
    fontWeight: "bold",
  },
  textTimeCard: {
    fontFamily: "SegoeUI",
    color: COLOR_BLUE,
    fontSize: 10,
    marginBottom: 5,
  },
  textDescriptionCard: {
    color: COLOR_GRAY,
    fontSize: 12,
    marginVertical: 5,
  },
  wrapperContainer: {
    backgroundColor: COLOR_WHITE,
    flex: 1,
  },
});
