import React from "react";
import { StyleSheet, Text, View, FlatList, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScreensView, TextView, TouchableOpacityEx } from "../../../components";
import IconView, { IconViewType } from "../../../components/IconView";
import models, { Gender, getGenderName } from "../../../models";
import {
  Colors,
  Dimension,
  Fonts,
  ImagesUrl,
  validateImageUri,
  fontsValue,
} from "../../../commons";
import {
  convertTimeDateVN,
  FORMAT_DD_MM_YYYY,
} from "../../../commons/utils/DateTime";
import AppNavigate from "../../../navigations/AppNavigate";
import { TextAvatar } from '../../components/TextAvatar';
import DropShadow from "react-native-drop-shadow";

export default function ItemPatientView(props) {
  const { index, dataItem, onPress, typeScreen } = props;
  const navigation = useNavigation();
  const name = dataItem?.name;
  const dob = dataItem?.dob;
  const birthday = convertTimeDateVN(dob, FORMAT_DD_MM_YYYY);
  const avatarItem = dataItem?.avatar;
  const gender = getGenderName(dataItem?.gender);
  const relationship = models.getRelationshipName(dataItem?.relationship);

  const handleSelected = () => {
    if (typeScreen === 1) {
      AppNavigate.navigateToPatientInfo(navigation.dispatch, {
        recordId: dataItem?.id,
      });
    } else {
      onPress && onPress({ data: dataItem });
    }
  };
  const imageUrl = validateImageUri(avatarItem);
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
    <View style={styles.stylesContain}>
      {imageUrl ?
        <Image source={imageUrl} style={styles.stImageFacility} />
        : <TextAvatar name={name || "User"} textColor={Colors.colorMain} size={60} borderRadius={30} backgroundColor={Colors.colorSecondary}></TextAvatar>
      }
      <View
        style={{
          justifyContent: "space-evenly",
          marginLeft: 12,
          flex: 1,
          height: "100%",
        }}
      >
        <TouchableOpacityEx
          onPress={handleSelected}
        >
          <Text style={styles.stTextName}>
            {name}
          </Text>
        </TouchableOpacityEx>

        <TextView
          style={styles.stContainText}
          styleValue={styles.stTextValue}
          value={relationship || "Khác"}
          stylesIconLeft={styles.stylesIconLeft}
          nameIconLeft={"ic-user"}
          colorIconLeft={Colors.colorDefault}
          sizeIconLeft={14}
        />
        {/* <TextView
          style={styles.stContainText}
          styleValue={styles.stTextValue}
          value={gender}
          stylesIconLeft={styles.stylesIconLeft}
          nameIconLeft={"ic-gender"}
          colorIconLeft={Colors.colorMain}
          sizeIconLeft={14}
        /> */}
        <TextView
          style={styles.stContainText}
          styleValue={styles.stTextValue}
          value={birthday}
          stylesIconLeft={styles.stylesIconLeft}
          nameIconLeft={"ic-calendar"}
          colorIconLeft={Colors.colorDefault}
          sizeIconLeft={14}
        />
      </View>
      <IconView
        style={styles.stIconCheck}
        onPress={handleSelected}
        name={
          typeScreen === 1
            ? "chevron-right"
            : dataItem.isChecked
              ? "radiobox-marked"
              : "radiobox-blank"
        }
        type={IconViewType.MaterialCommunityIcons}
        size={24}
      />
    </View>
    </DropShadow>
  );
}

const styles = StyleSheet.create({
  stylesContain: {
    padding: fontsValue(15),
    flex: 1,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderBottomWidth: 0,
    borderRadius: Dimension.radius,
  //   shadowOpacity: 0.25,
  //   shadowRadius: Dimension.radius,
  //   shadowOffset: {
  //     width: 0,
  //     height: 6,
  //   },
  // //  shadowColor: "#ffff",
  //   elevation: 6,
    //  marginBottom: 10
  },
  stContainText: {
    // flex: 1,
    alignItems: "center",
  },
  stTextName: {
    fontSize: Dimension.fontSize16,
    color: Colors.colorTextMenu,
    fontFamily: Fonts.SFProDisplaySemibold,
  },

  stTextValue: {
    fontSize: Dimension.fontSize14,
    color: Colors.colorTextMenu,
    fontWeight: "400",
    fontFamily: Fonts.SFProDisplayRegular,
    marginLeft: Dimension.margin,
  },
  stIconCheck: {
  //  width: 24,
  //  height: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  /////

  styleText: {
    fontSize: Dimension.fontSizeHeaderPopup,
    color: Colors.colorText1,
    fontWeight: "700",
    fontFamily: Fonts.SFProDisplayRegular,
  },
  styleContainerDate: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
  },

  stylesIconLeft: {
    width: 30,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    color: Colors.textLabel,
  },

  styleButton: {
    backgroundColor: "#00C6AD",
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 24,
    marginBottom: 12,
    borderRadius: 12,
  },
  stImageFacility: {
    borderRadius: 30,
    width: 60,
    height: 60,
  },
});
