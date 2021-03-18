import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Image,

} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Colors, Dimension, SCREEN_WIDTH, Fonts, scale, verticalScale, NAV_BAR_HEIGHT } from "../../../commons";
import AppNavigate from "../../../navigations/AppNavigate";
import { IconView, TouchableOpacityEx } from "../../../components";
import { dataMenu1 } from "./DataMenu";
import DropShadow from "react-native-drop-shadow";
const avatar = require("../../../../assets/images/avatar.jpg");

export default function MenuHorizontalView(props) {
  const navigation = useNavigation();
  const handleClick = (item) => {
    const id = item?.id;
    if (id === 1) {
      // AppNavigate.navigateToDoctorSearch(navigation.dispatch);
      AppNavigate.navigateToAppointment(navigation.dispatch);
    } else if (id === 2) {
      AppNavigate.navigateToHealthFacilitySearch(navigation.dispatch);
    } else if (id === 3) {
      // AppNavigate.navigateToExaminationResultsSearch(navigation.dispatch);
      AppNavigate.navigateToRegulationsExaminationScreen(navigation.dispatch);
    } else if (id === 4) {
      // AppNavigate.navigateToHealthDeclaration(navigation.dispatch);
      AppNavigate.navigateToDoctorSearch(navigation.dispatch);
    }
  };
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
      <View style={[styles.stContains, styles.styleView]}>

        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacityEx onPress={() => handleClick({ id: 1 })} style={styles.styleContainItem}>
            <IconView
              style={styles.styleIconMenu}
              name={'icon_home_examination'}
              color={Colors.colorMain}
              size={Dimension.sizeIconHeader}
            />
            <Text style={styles.styleText}>{'Phiếu khám'}</Text>
          </TouchableOpacityEx>
          <TouchableOpacityEx onPress={() => handleClick({ id: 2 })} style={styles.styleContainItem}>
            <IconView
              style={styles.styleIconMenu}
              name={'icon_faclities'}
              color={Colors.colorMain}
              size={Dimension.sizeIconHeader}
            />
            <Text style={styles.styleText}>{'Tra cứu cơ sở y tế'}</Text>
          </TouchableOpacityEx>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacityEx onPress={() => handleClick({ id: 3 })} style={styles.styleContainItem}>
            <IconView
              style={styles.styleIconMenu}
              name={'icon_notepad'}
              color={Colors.colorMain}
              size={Dimension.sizeIconHeader}

            />
            <Text style={styles.styleText}>{'Tra cứu KQ khám'}</Text>
          </TouchableOpacityEx>
          <TouchableOpacityEx onPress={() => handleClick({ id: 4 })} style={styles.styleContainItem}>
            <IconView
              style={styles.styleIconMenu}
              name={'icon_doctor'}
              color={Colors.colorMain}
              size={Dimension.sizeIconHeader}



            />
            <Text style={styles.styleText}>{'Tra cứu bác sỹ'}</Text>
          </TouchableOpacityEx>
        </View>
      </View>
    </DropShadow>
  );
}

const styles = StyleSheet.create({
  stContains: {
    marginVertical: Dimension.margin4x,
    marginHorizontal: Dimension.margin2x,
  },
  styleView: {
    borderRadius: Dimension.radiusButton,
    padding: Dimension.margin5,
    backgroundColor: "white",
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 0
    // },
    // shadowOpacity: 4,
    // shadowRadius: 0.9,
    // elevation: 4,
  },
  styleContainItem: {
    // margin: scale(2),
    paddingVertical:Dimension.padding2x,
    flex: 1,
    borderRadius: Dimension.radiusButton,
    // backgroundColor: "white",

  },
  styleBgMenu: {
    margin: Dimension.margin2x,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  styleIconMenu: {
    marginHorizontal: Dimension.margin2x,
    justifyContent: "center",
    alignItems: "center",
  },
  styleText: {
    textAlign: "center",
    paddingHorizontal:Dimension.padding2x,

    fontSize: Dimension.fontSize14,
    color: Colors.colorTextMenu,
    fontFamily: Fonts.SFProDisplayRegular,

  },
});
