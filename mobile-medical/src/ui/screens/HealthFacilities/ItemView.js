import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Dimension,
  Colors,
  Fonts,
  fontsValue,
  ImagesUrl,
  validateImageUri,
} from "../../../commons";
import { ScreensView, TextView, TouchableOpacityEx } from "../../../components";
import IconView, { IconViewType } from "../../../components/IconView";
import AppNavigate from "../../../navigations/AppNavigate";
import * as geolib from "geolib";
import { TextAvatar } from '../../components/TextAvatar';
import DropShadow from "react-native-drop-shadow";

export default function ItemView(props) {
  const { dataItem, onPress } = props;
  const navigation = useNavigation();
  const { imgPath, name, address } = dataItem;
  const imageUrl = validateImageUri(imgPath);

  const [khoangCach, setKhoangCach] = useState("");
  const nextToPatientInfo = () => {
    AppNavigate.navigateToHealthFacilitiesDetail(navigation.dispatch, dataItem);
  };

  useEffect(() => {
    let distance = 0;
    if (dataItem.latitude && dataItem.longitude) {
      distance = geolib.getPreciseDistance(props.dataGeolocation, {
        latitude: dataItem.latitude,
        longitude: dataItem.longitude,
      });
    }
    // if (distance) {
    // setKhoangCach(distance > 0 ? parseInt(distance / 1000) : "N/A");
    setKhoangCach(distance > 0 ? parseInt(distance / 1000) : null);
    // }
  });

  return (
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
      <TouchableOpacityEx style={styles.stContains} onPress={nextToPatientInfo}>
        {
          imageUrl ?
            <Image source={imageUrl} style={styles.stImageFacility} /> :
            <TextAvatar name={name || "User"} textColor={Colors.colorIcon} size={fontsValue(80)} borderRadius={Dimension.radiusButton} backgroundColor={Colors.colorBtBack}></TextAvatar>
        }
        {/* <Image source={imageUrl} style={styles.stImageFacility} /> */}
        <View style={styles.stContainName}>
          <Text
            onPress={nextToPatientInfo}
            style={styles.stTextName}
            numberOfLines={2}
          >
            {name}
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <TextView
              nameIconLeft={"ic-pin"}
              style={styles.stDistanceView}
              styleValue={styles.stTextDistance}
              value={khoangCach ? khoangCach + " km" : "không xác định"}
              
              sizeIconLeft={12}
            />
            <View style={{ flex: 1 }} />
          </View>
          <Text
            onPress={nextToPatientInfo}
            style={styles.stTextAddress}
            numberOfLines={2}
          >
            {address}
          </Text>

        </View>
      </TouchableOpacityEx>
    </DropShadow>
  );
}

const styles = StyleSheet.create({
  stContains: {
    paddingHorizontal: Dimension.padding,
    marginHorizontal: 1,
    //  paddingLeft:Dimension.padding,
    //  padding: Dimension.padding,
    //  margin: Dimension.margin,
    marginTop: 2,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: Dimension.radiusButton,
    // shadowOpacity: 0.25,
    // shadowRadius: 6,
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowColor: "#000000",
    // elevation: 3,
  },
  stImageFacility: {
    borderRadius: Dimension.radiusButton,
    marginLeft: fontsValue(4),
    width: fontsValue(80),
    height: fontsValue(80),
    // backgroundColor: "#345",
  },
  stContainName: {
    // justifyContent: "space-evenly",
    //  marginVertical: Dimension.margin,
    paddingTop: fontsValue(12),
    marginLeft: fontsValue(12),
    flex: 1,
    height: "100%",
  },
  stTextName: {
    fontSize: Dimension.fontSize16,
    color: Colors.colorTextMenu,
    fontFamily: Fonts.SFProDisplayRegular,
    marginBottom: fontsValue(5),
  },
  stTextAddress: {
    fontSize: Dimension.fontSize14,
    color: Colors.colorBorder,
    fontFamily: Fonts.SFProDisplayRegular,
    marginBottom: Dimension.margin2x,
  },
  stDistanceView: {
    //  position: "absolute",
    //  right: 0,
    //  bottom: 0, //Dimension.margin,

    // padding: fontsValue(5),
    paddingVertical: 2,
    borderRadius: fontsValue(6),
    backgroundColor: Colors.colorBtBack,
    // width:108,
    paddingHorizontal: 8
  },
  stTextDistance: {
    // flex:1,
    marginLeft: fontsValue(5),
    fontSize: Dimension.fontSize12,
    color: Colors.colorIcon,
    fontFamily: Fonts.SFProDisplayRegular,
  },
});
