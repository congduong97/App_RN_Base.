import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  RefreshControl,
  ScrollView,
} from "react-native";
import Icons from "react-native-vector-icons/dist/FontAwesome";

import {
  COLOR_GRAY_LIGHT,
  COLOR_BLACK,
  COLOR_WHITE,
  COLOR_BORDER,
  APP_COLOR,
} from "../../../const/Color";
import { Api } from "../util/api";
import { DEVICE_WIDTH, styleInApp } from "../../../const/System";
import { STRING } from "../util/string";

import { Loading, NetworkError, HeaderIconLeft } from "../../../commons";
import WebViewComponent from "../../../component/WebViewComponent";
import { AppImage } from "../../../component/AppImage";
import { getTimeFomartDDMMYY } from "../../../util";
import { TextTime } from "../../../component/TextTime/TextTime";
import ReloadScreen from "../../../service/ReloadScreen";
import MaintainView from "../../../commons/MaintainView";

export default class DetailNotification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      networkError: false,
      title: "",
      time: "",
      body: "",
      imageUrl: null,
      isLoadingRefresh: false,
      maintain: false,
    };
    this.refreshPage = this.refreshPage.bind(this);
  }
  componentDidMount() {
    this.getApi();
    const { routeName } = this.props.navigation.state;
    ReloadScreen.onChange(routeName, () => {
      this.getApi(true);
    });
  }
  componentWillUnmount() {
    const { routeName } = this.props.navigation.state;
    ReloadScreen.unChange(routeName);
  }

  getApi = async (loadRefresh) => {
    if (this.state.isLoadingRefresh || this.state.isLoading) {
      return;
    }
    try {
      const { data } = this.props.navigation.state.params;
      if (loadRefresh) this.setState({ isLoadingRefresh: true });
      else this.setState({ isLoading: true });
      const response = await Api.getNotificationDetail(data.id);
      if (response.code === 200 && response.res.status.code === 1000) {
        const {
          title,
          content,
          startTime,
          type,
          color,
          imageUrl,
          shortContent,
        } = response.res.data;
        this.state.startTime = startTime;
        this.state.title = title;
        this.state.imageUrl = imageUrl;
        this.state.body = content;
        this.state.colorCode = color;
        this.state.isImportant = type === 1;
        this.state.networkError = false;
        this.state.shortContent = shortContent;
        this.state.maintain = false;
      } else if (response.code === 502) {
        this.state.maintain = true;
        this.state.error = false;
      } else {
        this.state.networkError = true;
        this.state.maintain = false;
      }
    } catch (err) {
      this.state.networkError = true;
    } finally {
      this.setState({ isLoading: false, isLoadingRefresh: false });
    }
  };

  refreshPage() {
    this.getApi(true);
  }
  renderContent() {
    const {
      isLoadingRefresh,
      isLoading,
      networkError,
      body,
      isImportant,
      colorCode,
      title,
      imageUrl,
      shortContent,
      startTime,
      maintain,
    } = this.state;
    const { navigation } = this.props;

    if (isLoading) {
      return <Loading />;
    }
    if (networkError) {
      return (
        <NetworkError
          onPress={() => {
            this.getApi();
          }}
        />
      );
    }

    return (
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={isLoadingRefresh}
            onRefresh={this.refreshPage}
          />
        }
      >
        {!!imageUrl && (
          <AppImage
            useZoom
            url={imageUrl}
            style={styles.imageFeature}
            resizeMode={"cover"}
          />
        )}

        <View style={{ padding: 16 }}>
          <View style={styles.title}>
            {!!isImportant && (
              <Icons name={"star"} size={16} color={colorCode} />
            )}
            <Text
              style={[
                styleInApp.titleDetail,
                { color: isImportant ? colorCode : COLOR_BLACK },
              ]}
            >
              {title}
            </Text>
            {!!isImportant && (
              <Text style={[styles.exclamationMark, { color: colorCode }]}>
                !
              </Text>
            )}
          </View>

          <Text numberOffLines={3} style={styleInApp.shortDescription}>
            {shortContent}
          </Text>
          <TextTime time={getTimeFomartDDMMYY(startTime)} />
          <WebViewComponent html={body} navigation={navigation} />
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
    height: DEVICE_WIDTH,
    position: "relative",
  },
  wrapperCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  wrapperContainer: {
    backgroundColor: COLOR_WHITE,
    flex: 1,
  },

  wrapperCard: {
    padding: 20,
    borderColor: COLOR_BORDER,
    flexDirection: "row",
    marginBottom: 10,
    backgroundColor: COLOR_WHITE,
  },

  exclamationMark: {
    fontSize: 15,
    fontFamily: "SegoeUI",
    top: -2,
  },
});
