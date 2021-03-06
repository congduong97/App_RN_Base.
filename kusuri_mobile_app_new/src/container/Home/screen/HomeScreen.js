import React, { PureComponent } from "react";
import {
  StyleSheet,
  StatusBar,
  RefreshControl,
  UIManager,
  View,
  ScrollView,
  Alert,
  Text,
  TouchableOpacity,
} from "react-native";
import Orientation from "react-native-orientation";
import NetInfo from "@react-native-community/netinfo";
import { ShopSdk } from "../../../service/ShopSdk";
import Modal from "react-native-modal";

//Setup:
import {
  isIOS,
  DEVICE_WIDTH,
  managerAccount,
  getWidthInCurrentDevice,
} from "../../../const/System";
import { COLOR_GRAY_LIGHT, COLOR_WHITE, APP_COLOR } from "../../../const/Color";
import { Header } from "../item/Header";
import { ListItemMenu } from "../item/ListItemMenu";
import { SliderImage } from "../item/SliderImage";
import { SetUpNotification } from "../util/SetUpNotifications";
import { checkPermissionNotification } from "../util/CheckPemission";
import { BannerImage } from "../item/BannerImage";
import { checkUpdateDataApp, checkMemberCodeInBlacklist } from "../../Launcher/util/checkVersionAllApp";
import MaintainView from "../../../commons/MaintainView";

//Setvices:
import ServicesUpdateComponent from "../../../service/ServicesUpdateComponent";
import { STRING } from "../../../const/String";
import DetailUser from "../item/DetailUser";
import { SIZE } from "../../../const/size";
let checkPermission = false;

export default class Home extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      isLoadingRefresh: false,
      slider: [],
      dataNotification: [],
      dataNotificationImportant: [],
      columnMenu: 2,
      menu: [],
      point: 0,
      listNotificationChange: [],
      openByNotification: false,
      maintain: false,
      confirmPlayVideo: false,
      isModalVisible: false,
      receiveCouponVideo: false,
      itemVideo: {},
    };
    this.userDetail = React.createRef();
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  componentDidMount() {
    console.log("member", managerAccount);
    ServicesUpdateComponent.onChange("home_screen", (event) => {
      if (event == "MAIN_TAIN_TRUE") {
        this.setState({ maintain: true });
      } else {
        this.setState({ maintain: false });
      }
      if (event == "RELOAD_SLIDER") {
        checkUpdateDataApp();
      }
    });
    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      NetInfo.isConnected.fetch().then((isConnected) => {
        if (!isConnected) {
          Alert.alert(
            "???????????????????????????",
            "?????????????????????????????????????????????????????????"
          );
        }
      });
    });
    ShopSdk.collectDeviceInfo();
    this.checkMemberCode();
    Orientation.lockToPortrait();
    checkUpdateDataApp();
    if (!checkPermission) {
      checkPermission = true;
      if (isIOS) {
        checkPermissionNotification();
      }
    }
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  //Ho??n th??nh vi???c xem video nh???n coupon:
  endVideoReceiveCoupon = () => {
    this.setState({ receiveCouponVideo: true });
  };

  //T???t modal:
  unVisibleModal = () => {
    this.setState({ isModalVisible: false });
  };

  //B???t modal:
  isVisibleModal = (item) => {
    this.setState({ isModalVisible: true, itemVideo: item });
  };

  //Hi???n th??? popup b???n mu???n xem qu???ng c??o ????? nh???n coupon kh??ng?
  clickSeenVideoReceiveCoupon = () => {
    this.setState({ clickVideoSlider: true });
  };

  //Ki???m tra m?? member code:
  checkMemberCode = async () => {
    if (managerAccount.userId) {
      const res = await checkMemberCodeInBlacklist(managerAccount.memberCode);
      if (res) {
        this.props.navigation.navigate("HOME");
      }
    }
  };

  //G???i l???i API khi app maintain xong:
  resetHomeWhenMaintain = () => {
    this.header.getApi();
    checkUpdateDataApp();
    this.userDetail.current?.reloadDetail();
    this.slider.getListPkikakuHasCoupon();
  };

  //G???i l???i API ki???m tra c?? noti m???i hay kh??ng?
  reCallNotiHeader = () => {
    this.header.getApi();
  };

  //Load l???i m??n h??nh home:
  refreshPage = () => {
    checkUpdateDataApp();
    this.listItemMenu.refresh();
    this.header.getApi();
    this.checkMemberCode;
  };

  //M??? video IOS:
  playVideoHasCoupon = () => {
    setTimeout(() => {
      this.props.navigation.navigate("VIDEO_COUPON_PLAYER", {
        itemVideo: this.state.itemVideo,
      });
    }, 1500);
    this.setState({ isModalVisible: false });
  };

  //M??? m??n h??nh Video Android:
  playVideoAndroid = () => {
    this.unVisibleModal();
    this.props.navigation.navigate("VIDEO_COUPON_PLAYER", {
      itemVideo: this.state.itemVideo,
    });
  };

  //Hi???n th??? Modal:
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

  renderContent = () => {
    const { isLoadingRefresh } = this.state;
    const { navigation, screenProps } = this.props;

    return (
      <>
        <SetUpNotification
          navigation={this.props.navigation}
          header={this}
          screenProps={screenProps}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={[
            styles.wrapperBody,
            { backgroundColor: APP_COLOR.BACKGROUND_COLOR },
            {
              backgroundColor: "#F6F6F6",
            },
          ]}
          refreshControl={
            <RefreshControl
              refreshing={isLoadingRefresh}
              onRefresh={() => this.resetHomeWhenMaintain()}
            />
          }
        >
          <SliderImage
            isVisibleModal={this.isVisibleModal}
            delay={1}
            navigation={navigation}
            onRef={(ref) => {
              this.slider = ref;
            }}
          />

          <BannerImage
            delay={1.5}
            navigation={navigation}
            onRef={(ref) => {
              this.banerImage = ref;
            }}
          />
          <DetailUser ref={this.userDetail} navigation={navigation} />
          <ListItemMenu
            screenProps={screenProps}
            onRef={(ref) => {
              this.listItemMenu = ref;
            }}
            navigation={navigation}
          />
        </ScrollView>
      </>
    );
  };

  render() {
    const { maintain } = this.state;
    const { navigation } = this.props;
    if (maintain) {
      return <MaintainView onPress={this.resetHomeWhenMaintain} />;
    }
    return (
      <View
        style={[
          styles.wrapperContainer,
          { backgroundColor: APP_COLOR.BACKGROUND_COLOR },
        ]}
      >
        <StatusBar backgroundColor={COLOR_GRAY_LIGHT} barStyle='dark-content' />
        <Header
          onRef={(ref) => {
            this.header = ref;
          }}
          navigation={navigation}
        />
        {this.renderContent()}
        {this.renderModalPlayVideo()}
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
  wrapperCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  wrapperContainer: {
    // backgroundColor: COLOR_WHITE,
    flex: 1,
  },

  wrapperSpace: {
    height: 10,
  },
});
