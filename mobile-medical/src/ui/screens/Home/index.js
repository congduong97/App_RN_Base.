import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Keyboard,
  ImageBackground,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import API from "../../../networking";
import CookieManager from "@react-native-community/cookies";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { ScreensView, TouchableOpacityEx } from "../../../components";
import IconView, { IconViewType } from "../../../components/IconView";
import { BookAppointmentKey } from "../../../models";
import AppStatusBar from "../../../components/AppStatusBar";

import AppNavigate from "../../../navigations/AppNavigate";
import actions from "../../../redux/actions";
import {
  Colors,
  Dimension,
  Fonts,
  SCREEN_WIDTH,
  ImagesUrl,
  NavigationKey,
  verticalScale,
  SCREEN_HEIGHT,
  widthPercent,
  scale,
} from "../../../commons";
import SlideBannerView from "./SlideBannerView";
import { SliderBox } from "react-native-image-slider-box";
import MenuHorizontalView from "./MenuHorizontalView";
import { dataMenu2 } from "./DataMenu";
import SlideBanner from "./SlideBanner";
import DropShadow from "react-native-drop-shadow";
import ExpiredAccount from "../../../components/ExpiredAccount";

function ItemMenuVertical(props) {
  const { data } = props;
  const { id, title, iconName, bgColor, iconColor, bgIconColor } = data;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isCheckBlockedUser, setIsCheck] = useState(false);

  useEffect(() => {
    checkUserBlocked();
  }, []);

  const checkUserBlocked = async () => {
    let isCheck = await API.requestCheckUserBlocked(dispatch);
    // console.log("isCheck:    ", isCheck)
    setIsCheck(isCheck);
  };

  const handleClick = () => {
    // dispatch(actions.actionBookType(id)); // luu loai hanh dong book lich kham
    // dispatch(
    //   actions.saveMakeAppointData({
    //     [BookAppointmentKey.TypeBook]:
    //       id === NavigationKey.NextToBookByDay ? 1 : 2, ///1: Theo ngày, 2: Theo bác sĩ
    //   })
    // );
    AppNavigate.navigateToRegulationsBook(navigation.dispatch); // Sang màn hình ĐIều kiện và Điều KHoàn
  };
  const style = [
    styles.styleContainItem,
    { backgroundColor: !isCheckBlockedUser ? bgColor : Colors.bgStatus3 },
  ];
  return (
    <DropShadow
      style={{
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.08,
        shadowRadius: 10,
      }}
    >
      <TouchableOpacityEx
        style={style}
        disabled={isCheckBlockedUser}
        onPress={handleClick}
      >
        <IconView
          style={[
            styles.styleIconMenu,
            { backgroundColor: "transparent", marginLeft: 12 },
          ]}
          name={"ic_examination"}
          color={!isCheckBlockedUser ? iconColor : "gray"}
          size={Dimension.sizeIconMenu}
        />
        <Text
          style={[
            styles.styleText,
            {
              flex: 1,
              textAlign: "center",
              color: !isCheckBlockedUser ? iconColor : "gray",
              fontSize: Dimension.fontSize18,
              fontFamily: Fonts.SFProDisplayRegular,
            },
          ]}
        >
          {title}
        </Text>
        <IconView
          name={"ic-arrow-right"}
          size={Dimension.sizeIconMenu}
          color={!isCheckBlockedUser ? iconColor : "gray"}
          style={styles.stIconArrow}
        />
      </TouchableOpacityEx>
    </DropShadow>
  );
}

export default function HomeScreen(props) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  useEffect(() => {
    ExpiredAccount.onChange("HomeScreen", (event) => {
      if (event == "401_API") {
        signOut();
      }
    });
    return () => {
      ExpiredAccount.remove("HomeScreen");
    };
  });

  const signOut = () => {
    API.requestSingOut(dispatch);
    CookieManager.clearAll().then((success) => { });
    AppNavigate.navigateWhenAppStart(navigation.dispatch);
  };

  return (
    // <ScreensView
    //   isBackAvatar
    //   rightView={<HeaderRightView />}
    //   styleContent={styles.styleContent}
    // >

    // </ScreensView>

    <View style={{ flex: 1 }}>
      <StatusBar
        translucent
        backgroundColor={"transparent"}
        barStyle='dark-content'
      />
      <SliderBox
        images={SlideBanner}
        sliderBoxHeight={Dimension.imageSlide}
        dotStyle={{
          width: 8,
          height: 8,
          borderRadius: 8,
          padding: 0,
          borderWidth: 1,
          borderColor: "white",
        }}
        ImageComponentStyle={{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
        dotColor="white"
        inactiveDotColor="#00C6AD"
        paginationBoxVerticalPadding={20}
        autoplay
        circleLoop
      />
      <View
        style={{
          // height: 50,
          marginTop: Platform.OS !== "ios" ? 40 : 30,
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          flexDirection: "row",
          marginHorizontal: Dimension.margin2x,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.styleTextToolbar}>{"Trang chủ"}</Text>
        </View>
        {/* <IconView
          
            name={"ic-search"}
            color={'white'}
            size={20}
          /> */}
      </View>

      <MenuHorizontalView />
      <ItemMenuVertical data={dataMenu2.BookByDay} />
      {/* <ItemMenuVertical data={dataMenu2.BookByDoctor} /> */}
      {/* <Text style={styles.stTextFooter}>
            {"Hỗ trợ kỹ thuật:    "}
            <Text style={styles.stTextFooterHotline}>{"1900 23567"}</Text>
          </Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  styleContent: {
    backgroundColor: "white",
    paddingBottom: Dimension.padding2x,
  },
  styleTextToolbar: {
    fontFamily: Fonts.SFProDisplayRegular,
    fontSize: Dimension.fontSize20,
    color: "white",
    textAlign: "center",
    // fontFamily: "SFProText-Regular",
  },
  styleContainItem: {
    flexDirection: "row",
    justifyContent: "center",
    height: Dimension.heightButtonHome,
    // marginTop: 16,
    // height: 136,
    marginHorizontal: Dimension.margin2x,
    marginBottom: Dimension.margin2x,
    paddingVertical: Dimension.padding2x,
    backgroundColor: "white",
    borderRadius: Dimension.radiusButton,
    // shadowColor:'#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 0
    // },
    // shadowOpacity:4,
    // shadowRadius:0.5,
    // elevation: 4,
    alignItems: "center",
  },

  styleIconMenu: {
    marginHorizontal: Dimension.margin5,
    justifyContent: "center",
    alignItems: "center",
    width: Dimension.sizeIconHeader,
    height: Dimension.sizeIconHeader,
    alignContent: "center",
    backgroundColor: Colors.colorBtBack,
    borderRadius: 10,
  },
  styleText: {
    textAlign: "center",
    alignSelf: "center",
    paddingHorizontal: Dimension.padding2x,
    fontSize: Dimension.fontSizeMenu,
    color: Colors.colorTextMenu,
    fontFamily: "SFProText-Regular",
    // backgroundColor: "#345",
  },
  stIconArrow: {
    alignSelf: "center",
    marginRight: 12,
  },

  stTextFooter: {
    alignSelf: "center",
    marginTop: 12,
    fontSize: Dimension.fontSize12,
    fontFamily: Fonts.SFProDisplayRegular,
    color: Colors.colorText1,

  },

  stTextFooterHotline: {
    // marginTop: 24,
    fontSize: Dimension.fontSizeHeaderPopup,
    fontFamily: Fonts.SFProDisplayRegular,
    color: Colors.colorMain,
  },

  stImageAvatar: {
    marginHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    width: Dimension.sizeIconHeader,
    height: Dimension.sizeIconHeader,
    alignContent: "center",
    borderRadius: 10,
  },

  styleBgMenu: {
    left: Dimension.margin2x,
    position: "absolute",
    justifyContent: "flex-start",
  },
  styleHeader: {
    elevation: 3,
    shadowOpacity: 1,
    justifyContent: "flex-start",

  },
});
