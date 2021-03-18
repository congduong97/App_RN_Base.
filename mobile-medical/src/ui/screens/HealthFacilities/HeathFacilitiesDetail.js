import React, { } from "react";
import { StyleSheet, Text, View, ImageBackground, Image, Dimensions, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ScreensView, ButtonView, TextView } from "../../../components";
import IconView, { IconViewType } from "../../../components/IconView";
import {
  ImagesUrl,
  Fonts,
  Colors,
  Dimension,
  fontsValue,
  validateImageUri,
} from "../../../commons";
import API from "../../../networking";
import myStyles from "./styles";
import ItemView from "./ItemView";
import ProvinceAreaView from "./ProvinceAreaView";
import { useMergeState, useApp } from "../../../AppProvider";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import models from "../../../models";
import AppNavigate from "../../../navigations/AppNavigate";
import OpenMap from "react-native-open-map";
import DropShadow from "react-native-drop-shadow";

export default function HeathFacilitiesDetail(props) {
  const route = useRoute();
  const navigation = useNavigation();
  const { name, address, imgPath } = route.params;
  // const { name, address, phone, imgPath, description } = route.params;
  const dataItem = route?.params
  const imageUrl = validateImageUri(imgPath, ImagesUrl.imgeHospitalDefault);
  const imageQuyTrinhHoatDong = validateImageUri(dataItem.medicalProcessPath, null)
  const phone = dataItem.phone || ""
  const description = dataItem.description

  const onPress = ({ id, data }) => {
    if (id === 1) {
      AppNavigate.navigateToFeedbackScreen(navigation.dispatch)
    } else if (id === 2) {
      OpenMap.show({
        latitude: dataItem.latitude,
        longitude: dataItem.longitude,
      });
    }
  }
  const handleOpressAppointment = () => {
    AppNavigate.navigateToRegulationsBook(navigation.dispatch, {})

  }
  return (
    <ScreensView
      titleScreen={"Chi tiết cơ sở y tế"}
      styleContent={styles.styleContent}
      isScroll={false}
      renderFooter={
        <ButtonView
          title={"Đặt lịch khám"}
          onPress={handleOpressAppointment}
          style={{
            marginBottom: Dimension.margin2x,
            marginHorizontal: Dimension.margin2x,
          }}
        />
      }
    >
      <ImageBackground style={styles.stImageFacility} source={imageUrl}>
        <View style={styles.stContainName}>
          <Text style={styles.stTextName}>{name.toUpperCase()}</Text>
          <TextView
            nameIconLeft={"ic-pin"}
            colorIconLeft={"white"}
            style={styles.stDistanceView}
            styleValue={styles.stTextAddress}
            value={address}
          />
          <TextView
            nameIconLeft={"ic-whatsapp"}
            colorIconLeft={"white"}
            style={styles.stDistanceView}
            styleValue={styles.stTextAddress}
            value={phone}
          />
        </View>
      </ImageBackground>
      <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
        <DropShadow
          style={{
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.025,
            shadowRadius: 10,
          }}
        >
          <TextView
            id={1}
            onPress={onPress}
            nameIconLeft={"email-outline"}
            colorIconLeft={Colors.colorIcon}
            typeIconLeft={IconViewType.MaterialCommunityIcons}
            sizeIconLeft={28}
            styleIconLeft={styles.stContainIcon}
            style={styles.stContainButton}
            styleValue={styles.stTextActions}
            value={"Gửi góp ý"}
          />
        </DropShadow>
        <DropShadow
          style={{
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.025,
            shadowRadius: 10,
          }}
        >
          <TextView
            id={2}
            onPress={onPress}
            style={styles.stContainButton}
            nameIconLeft={"ic-pin"}
            colorIconLeft={Colors.colorCancel}
            styleIconLeft={{
              ...styles.stContainIcon,
              backgroundColor: Colors.colorBtEdit,
            }}
            styleValue={styles.stTextActions}
            value={"Xem bản đồ"}
          />
        </DropShadow>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.stTextTitle, { fontWeight: 'bold' }]}>{"Giới thiệu"}</Text>
          <Text style={styles.stTextDescription}>{description}</Text>

          <Text style={[styles.stTextTitle, { fontWeight: 'bold' }]}>{"Quy trình hoạt động"}</Text>
          {imageQuyTrinhHoatDong && <Image
            source={imageQuyTrinhHoatDong}
            style={{ height: Dimensions.get('window').height / 2, marginHorizontal: 12, resizeMode: 'contain' }}
          />}
        </View>
      </ScrollView>
    </ScreensView>
  );
}

const styles = StyleSheet.create({
  styleContent: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: Dimension.padding2x,
    paddingBottom: fontsValue(20),
  },
  stContainsItem: {
    paddingHorizontal: 16,
    flexDirection: "row",
    paddingVertical: 12,
    alignItems: "center",
  },

  stImageFacility: {
    marginVertical: Dimension.margin2x,
    borderRadius: Dimension.radiusButton,
    borderColor: Colors.colorBg2,
    borderWidth: 0.5,
    height: fontsValue(200),
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  stContainName: {
    bottom: 0,
    position: "absolute",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginBottom:fontsValue(16),
    // backgroundColor: "#345",
    marginHorizontal: Dimension.margin,
  },
  stTextName: {
    fontSize: Dimension.fontSize16,
    color: "white",
    fontFamily: Fonts.SFProDisplaySemibold,
    marginBottom: fontsValue(5),
  },
  stTextTitle: {
    fontSize: Dimension.fontSize18,
    color: Colors.colorTextMenu,
    fontFamily: Fonts.SFProDisplayRegular,
    marginTop: Dimension.margin2x,
    marginHorizontal: Dimension.margin2x,
  },
  stTextDescription: {
    fontSize: Dimension.fontSize16,
    color: Colors.colorTitleScreen,
    fontFamily: Fonts.SFProDisplayRegular,
    marginHorizontal: Dimension.margin2x,
    lineHeight: fontsValue(27),
    letterSpacing: fontsValue(0.5),
  },
  //   stTextAddress: {
  //     fontSize: Dimension.fontSize14,
  //     color: Colors.colorBorder,
  //     fontFamily: Fonts.SFProDisplayRegular,
  //     marginBottom: Dimension.margin,
  //   },
  stDistanceView: {
    // position: "absolute",
    // right: 0,
    // bottom: 0, //Dimension.margin,
    // borderRadius: fontsValue(6),
    // backgroundColor: Colors.colorBtBack,
    // padding: fontsValue(5),
  },
  stTextAddress: {
    marginLeft: fontsValue(5),
    fontSize: Dimension.fontSize14,
    color: "white",
    fontFamily: Fonts.SFProDisplayRegular,
  },
  stContainButton: {

    alignItems: "center",
    marginHorizontal: Dimension.margin,
    // flex: 1,
    paddingVertical: 4,
    paddingRight: 16,
    paddingLeft: 4,
    borderColor: "gray",
    borderRadius: fontsValue(8),
    backgroundColor: "white",
    // shadowOpacity: 0.25,
    // shadowRadius: 3,
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowColor: "#000000",
    // elevation: 3,
  },

  stTextActions: {
    marginLeft: fontsValue(5),
    fontSize: Dimension.fontSize14,
    color: Colors.textLabel,
    fontFamily: Fonts.SFProDisplayRegular,
  },
  stContainIcon: {
    height: fontsValue(36),
    width: fontsValue(36),
    borderRadius: fontsValue(10),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.colorBtBack,
  },
});
