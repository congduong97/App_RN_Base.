//Library:
import React, { PureComponent } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";

//Setup:
import { Api } from "../util/api";
import {
  tab,
  DEVICE_WIDTH,
  sizePage,
  getWidthInCurrentDevice,
} from "../../../const/System";
import { COLOR_GRAY_LIGHT, COLOR_WHITE, APP_COLOR } from "../../../const/Color";

//Component:
import { ItemVideo } from "../item/ItemVideo";
import MaintainView from "../../../commons/MaintainView";
import { NetworkError, HeaderIconLeft, Loading } from "../../../commons";
import { STRING } from "../../../const/String";
import NavigationService from "../../../service/NavigationService";
//Services:
import ReloadScreen from "../../../service/ReloadScreen";
import Modal from "react-native-modal";
export default class Video extends PureComponent {
  constructor() {
    super();
    this.state = {
      networkError: false,
      data: [],
      page: 1,
      isLoading: false,
      isLoadingRefresh: false,
      iconUrl: false,
      totalPages: 1,
      loadNextPage: false,
      maintain: false,
      isModalVisible: false,
      itemVideo: null,
    };
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

  //Lấy danh sách Video:
  getApi = async (loadRefresh) => {
    if (this.state.isLoadingRefresh || this.state.isLoading) {
      return;
    }
    try {
      loadRefresh
        ? this.setState({ isLoadingRefresh: true, page: 1 })
        : this.setState({ isLoading: true });
      const response = await Api.getVideo(sizePage, 1);
      console.log(response, "res");
      if (response.code === 200) {
        const { totalPages, content } = response.res;
        this.state.data = content;
        this.state.totalPages = totalPages;
        this.state.networkError = false;
        this.state.maintain = false;
      } else if (response.code == 502) {
        this.state.networkError = false;
        this.state.maintain = true;
        return;
      } else {
        this.state.maintain = false;
        this.state.networkError = true;
      }
    } catch (err) {
      this.state.networkError = true;
    } finally {
      this.setState({ isLoadingRefresh: false, isLoading: false });
    }
  };

  //Lấy thêm danh sách Video:
  getApiNextPage = async () => {
    try {
      this.setState({ loadNextPage: true });
      const response = await Api.getVideo(sizePage, this.state.page + 1);
      this.state.page = this.state.page + 1;
      if (response.code === 200) {
        this.state.data = [...this.state.data, ...response.res.content];
      }
    } catch (err) {
    } finally {
      this.setState({ loadNextPage: false });
    }
  };
  refreshPage() {
    this.getApi(true);
  }
  //Bật modal:
  isVisibleModal = (item) => {
    this.setState({ isModalVisible: true, itemVideo: item });
  };
  unVisibleModal = () => {
    this.setState({ isModalVisible: false });
  };
  //Item video
  renderItemVideo = ({ item }) => (
    <ItemVideo
      data={item}
      key={`${item.id}`}
      isVisibleModal={this.isVisibleModal}
      showAlertNotLogin={this.showAlertNotLogin}
    />
  );
  // playVideo
  playVideoHasCoupon = () => {
    const { itemVideo } = this.state;
    setTimeout(() => {
      NavigationService.navigate("VIDEO_COUPON_PLAYER", {
        itemVideo: {
          linkYoutube: itemVideo.url,
          timeVideo: itemVideo.duration,
          pKikakuId: itemVideo.pKikakuId,
          numberDayCanUseCoupon: itemVideo.numberDayCanUseCoupon,
        },
      });
    }, 500);
    this.setState({ isModalVisible: false });
  };

  //show popup
  renderModalPlayVideo = () => {
    const { isModalVisible } = this.state;
    return (
      <Modal
        deviceWidth={getWidthInCurrentDevice(375)}
        isVisible={isModalVisible}
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: "100%",
            backgroundColor: "white",
            alignItems: "center",
            borderRadius: 2,
            paddingTop: 20,
            paddingBottom: 50,
          }}
        >
          <Text
            style={{
              marginHorizontal: getWidthInCurrentDevice(22),
              fontSize: 20,
              fontWeight: "bold",
              color: "black",
            }}
          >
            {STRING.play_video_again}
          </Text>
          <Text
            style={{
              marginHorizontal: getWidthInCurrentDevice(22),
              fontSize: 18,
              marginTop: 10,
              color: "black",
            }}
          >
            {STRING.content_has_coupon}
          </Text>
          <TouchableOpacity
            onPress={this.playVideoHasCoupon}
            style={{
              height: 50,
              width: "90%",
              backgroundColor: "red",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 40,
              borderRadius: 2,
            }}
          >
            <Text
              style={{
                margin: getWidthInCurrentDevice(6),
                fontSize: 18,
                color: "white",
              }}
            >
              {STRING.play_video_has_coupon}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.unVisibleModal}
            style={{
              height: 50,
              width: "90%",
              marginTop: 10,
              backgroundColor: "white",
              borderWidth: 2,
              borderColor: "red",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 2,
            }}
          >
            <Text
              style={{
                margin: getWidthInCurrentDevice(6),
                fontSize: 18,
                color: "black",
              }}
            >
              {STRING.close_modal_video_coupon}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };
  showAlertNotLogin = () => {
    Alert.alert(
      STRING.notification,
      STRING.please_login_to_use,
      [
        {
          text: STRING.cancel,
          onPress: () => {},
          style: "cancel",
        },
        {
          text: STRING.ok,
          onPress: () => {
            NavigationService.navigate("EnterMemberCodeScreen");
          },
        },
      ],
      { cancelable: false }
    );
  };

  //Nội dung trang:
  renderContent = () => {
    const {
      isLoading,
      networkError,
      loadNextPage,
      totalPages,
      page,
      data,
    } = this.state;
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
    if (!data || data.length === 0) {
      return (
        <NetworkError
          title={"データなし"}
          iconName={"reload"}
          onPress={() => this.getApi()}
        />
      );
    }
    return (
      <FlatList
        ListFooterComponent={() => (loadNextPage ? <Loading /> : null)}
        data={this.state.data}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isLoadingRefresh}
            onRefresh={() => this.getApi(true)}
          />
        }
        extraData={this.state}
        keyExtractor={(item, i) => `${item.id}`}
        renderItem={this.renderItemVideo}
        onEndReached={() => {
          if (totalPages > page && !loadNextPage) {
            this.getApiNextPage();
          }
        }}
        onEndReachedThreshold={0.2}
      />
    );
  };

  render() {
    const { goBack } = this.props.navigation;
    const { iconUrlVideoScreen, nameVideoScreen } = tab.screenTab;
    const { disableBackButton } = this.props;
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
        <StatusBar backgroundColor={COLOR_GRAY_LIGHT} barStyle="dark-content" />
        <HeaderIconLeft
          disableBackButton={disableBackButton}
          title={nameVideoScreen}
          goBack={goBack}
          imageUrl={iconUrlVideoScreen}
        />
        {this.renderContent()}
        {this.renderModalPlayVideo()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapperContainer: {
    flex: 1,
    backgroundColor: COLOR_WHITE,
    width: DEVICE_WIDTH,
  },
});
