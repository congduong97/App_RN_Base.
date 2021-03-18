import React from "react";
import { StyleSheet, Text, View, Image, Platform, TouchableOpacity } from "react-native";
import { TextView, IconView } from "../../../../components";
import { ImagesUrl, Dimension, Fonts, Colors, fontsValue } from "../../../../commons";
import {
  convertTimeDate1,
  convertTimeDateVN,
  FORMAT_DD_MM_YYYY,
} from "../../../../commons/utils/DateTime";
import {
  validateImageUri,
} from "../../../../commons/utils/Validate";
import models from "../../../../models";
import { TextAvatar } from '../../../components/TextAvatar';

export default function PatientInfoView(props) {
  const { id, patientRecordId, onPress, navigateToPatientInfo } = props;
  const { name, dob, relationship, avatar } = models.getPatientRecordsInfo(patientRecordId);
  const birthday = convertTimeDateVN(dob, FORMAT_DD_MM_YYYY);
  return (

    <TouchableOpacity style={styles.stContainsInfo}>
      {avatar ?
        <Image source={validateImageUri(avatar, ImagesUrl.LogoApp)} style={styles.stImageAvatar} />
        : <TextAvatar containStyle={{margin:Dimension.margin}}  name={name || "User"} textColor={Colors.colorMain} size={fontsValue(90)} borderRadius={fontsValue(45)} backgroundColor={Colors.colorSecondary}></TextAvatar>
      }
      <View style={{ flex: 1, justifyContent: "center" ,marginLeft:Dimension.margin}}>
        <Text onPress={navigateToPatientInfo} style={styles.stTextName}>{name}</Text>
        <TextView
          style={styles.styleContainerDate}
          styleValue={styles.stTextValue}
          value={models.getRelationshipName(relationship)}
          styleIconLeft={styles.stylesIconLeft}
          nameIconLeft={"ic-user-dot"}
          colorIconLeft={Colors.textLabel}
          sizeIconLeft={16}
        />
        <TextView
          style={styles.styleContainerDate}
          styleValue={styles.stTextValue}
          value={birthday}
          styleIconLeft={styles.stylesIconLeft}
          nameIconLeft={"ic-calendar"}
          colorIconLeft={Colors.textLabel}
          sizeIconLeft={16}
        />
      </View>

      <IconView
        id={id}
        onPress={onPress}
        name={"ic-edit"}
        size={20}
        color={Colors.colorMain}
        style={{
          height: 57,
          width: 57,
          borderTopRightRadius: 12,
          borderBottomLeftRadius: 12,
          backgroundColor: "#DBFFFA",
          justifyContent: "center",
          alignItems: "center",
        }}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  stContainsInfo: {
    flexDirection: "row",
    borderRadius: 16,
    backgroundColor: "white",
    // padding:Dimension.padding,
    // marginHorizontal: 12,
    // marginTop: 30,
    // width: "90%",
    // alignSelf: "center",
    // position: "absolute",
    // top: Platform.OS === "ios" ? 90 : 70,
    // shadowOpacity: 0.25,
    // shadowRadius: 2,
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowColor: "#000000",
    // elevation: 3,
    // zIndex: 999,
    // overflow: "visible",
  },

  stTextName: {
    fontSize: Dimension.fontSizeHeaderPopup,
    color: Colors.colorTextMenu,
    fontFamily: Fonts.SFProDisplayRegular,
    alignSelf: "stretch",
    marginBottom: Dimension.margin,
  },

  stImageAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    margin: 12,
  },
  stTextValue: {
    fontSize: Dimension.fontSize14,
    color: Colors.colorTitleScreen,
    fontFamily: Fonts.SFProDisplayRegular,
    marginLeft: Dimension.margin,
  },
});
