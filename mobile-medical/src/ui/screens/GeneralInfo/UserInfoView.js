import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import DropShadow from "react-native-drop-shadow";
import { validateImageUri } from "../../../../src/commons/utils";
import {
  Colors,
  Dimension,
  Fonts
} from "../../../commons";
import { ButtonView, TextView } from "../../../components";
import models from "../../../models";
import AppNavigate from "../../../navigations/AppNavigate";
import { TextAvatar } from "../../components/TextAvatar";

export default function UserInfoView(props) {
  // const { name } = props;
  const navigation = useNavigation();
  const { name, avatar, phoneNumber } = models.getUserInfo();
  const imageUrl = validateImageUri(avatar);
  const [isReLoad, setIsReLoad] = useState(false);
  const onToEditAccount = () => {
    // navigation.navigate("UpdateInfoUser");
    AppNavigate.navigateToEditAccount(navigation.dispatch, { onReLoadData: onReLoadData });
  };

  const onReLoadData = () => {
    setIsReLoad(!isReLoad)
  }

  return (
    <DropShadow
      style={{
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      }}
    >
      <View style={styles.stContain}>
        {imageUrl ? (
          <Image source={imageUrl} style={styles.stAvatar} />
        ) : (
          <TextAvatar
            containStyle={{ marginTop: 14 }}
            name={name || "User"}
            textColor={Colors.colorMain}
            size={120}
            borderRadius={60}
            backgroundColor={Colors.colorSecondary}
          ></TextAvatar>
        )}
        <View style={styles.stContainTextName}>
          <Text style={{ fontSize: Dimension.fontSize16, color: "black", fontFamily: Fonts.SFProDisplaySemibold }}>{name || "User"}</Text>
          {/* <TextView
          style={styles.styleContainerText}
          styleValue={styles.stTextValue}
          value={dob}
          styleIconLeft={styles.stylesIconLeft}
          nameIconLeft={"ic-user-dot"}
          iconColor={Colors.colorMain}
          iconSize={14}
        /> */}
          <TextView
            style={styles.styleContainerDate}
            styleValue={styles.stTextValue}
            value={phoneNumber || "Chưa cập nhật"}
          //  styleIconLeft={styles.stylesIconLeft}
          //  nameIconLeft={"ic-calendar"}
          //  iconColor={Colors.colorCancel}
          //  iconSize={14}
          />
        </View>
        <ButtonView
          id={"NaviRebooking"}
          title={"Chỉnh sửa"}
          onPress={onToEditAccount}
          textColor={Colors.colorMain}
          bgColor={"#DBFFFA"}
          style={styles.stButtonEdit}
        />
      </View>
    </DropShadow>
  );
}

const styles = StyleSheet.create({
  stContain: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: Dimension.radiusButton,
    marginTop: 10,
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "center",
    // shadowOpacity: 0.25,
    // shadowRadius: 16,
    // shadowColor: "#000000",
    // elevation: 4
  },

  stAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    margin: 10,
  },
  stContainTextName: {
    alignItems: "center",
  },
  styleContainerText: {
    marginVertical: 3,
  },

  stTextValue: {
    fontSize: Dimension.fontSize14,
    color: '#747F9E',
    fontFamily: Fonts.SFProDisplayRegular,
    marginLeft: Dimension.margin,
    // letterSpacing: 0.5,
  },
  stButtonEdit: {
    flex: 1,
    marginBottom: Dimension.margin2x,
    marginTop: Dimension.margin,
    marginHorizontal: Dimension.margin,
    width: 140,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
  },
});
