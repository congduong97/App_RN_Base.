import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import DropShadow from "react-native-drop-shadow";
import {
  Colors,
  Dimension,
  Fonts,
  fontsValue,
  validateImageUri
} from "../../../commons";
import { TextView } from "../../../components";
import IconView, { IconViewType } from "../../../components/IconView";
import { getGenderName } from "../../../models";
import AppNavigate from "../../../navigations/AppNavigate";
import { TextAvatar } from '../../components/TextAvatar';

export default function ItemPatientView(props) {
  const { index, dataItem, onPress, typeScreen } = props;
  const navigation = useNavigation();
  const {
    name = "",
    medicalSpecialityName = "",
    gender = "",
    avatar,
    academicCode
  } = dataItem;

  useEffect(() => { }, []);
  const nextToPatientInfo = () => {
    onPress && onPress({ data: dataItem });
    // AppNavigate.navigateToPatientInfo(navigation.dispatch);
  };

  const handleSelected = () => {
    if (typeScreen === 1) {
      AppNavigate.navigateToDoctorDetail(navigation.dispatch, {
        doctorInfo: dataItem,
      });
    } else {
      onPress && onPress({ data: dataItem });
    }
  };
  const imageUrl = validateImageUri(avatar);

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
      <View style={[styles.stylesContain,]}>
        {
          imageUrl ?
            <Image source={imageUrl} style={styles.stImageFacility} /> :
            <TextAvatar name={name || "User"} textColor={Colors.colorMain} size={fontsValue(60)} borderRadius={fontsValue(45)} backgroundColor={Colors.colorSecondary}></TextAvatar>
        }
        <View
          style={{
            // justifyContent: "space-evenly",
            marginLeft: 12,
            flex: 1
            // height: "100%",
          }}
        >
          <Text onPress={nextToPatientInfo} style={styles.stTextName}>
            {`${academicCode || 'BS'}.${name}`}
          </Text>
          {/* <TextView
          style={styles.stContainText}
          styleValue={styles.stTextValue}
          value={medicalSpecialityName}
          stylesIconLeft={styles.stylesIconLeft}
          nameIconLeft={"ic-stomach"}
          iconColor={Colors.colorMain}
          iconSize={14}
        /> */}

          <View style={[styles.stContainText, { flexDirection: "row" }]}>
            {/* <Image
              source={ImagesUrl.iconDoctor}
              style={{ width: 14, height: 14, resizeMode: "contain", tintColor: '#747F9E' }}
            /> */}
            <Text style={styles.stTextValue}>{medicalSpecialityName}</Text>
          </View>

          <TextView
            style={styles.stContainText}
            styleValue={styles.stTextValue}
            value={getGenderName(gender)}
          // }  stylesIconLeft={styles.stylesIconLeft}
          //   nameIconLeft={"ic-gender"}
          //   colorIconLeft={Colors.textLabel}
          //   iconSize={14
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
        />
      </View>
    </DropShadow>
  );
}

const styles = StyleSheet.create({
  stylesContain: {
    padding: Dimension.padding,
    flex: 1,
    marginBottom: fontsValue(16),
    // marginHorizontal: 2,
    // marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: Dimension.radiusButton,
    // shadowOpacity: 0.25,
    // shadowRadius: 3,
    // shadowOffset: {
    //   width: 0,
    //   height: 3,
    // },
    // shadowColor: "#000000",
    // elevation: 3,
  },
  stContainText: {
    //  flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    //  height: 18,
  },
  stTextName: {
    fontSize: Dimension.fontSize16,
    color: 'black',
    fontFamily: Fonts.SFProDisplaySemibold,
  },

  stTextValue: {
    fontSize: Dimension.fontSize14,
    color: 'black',
    fontFamily: Fonts.SFProDisplayRegular,
    // marginLeft: Dimension.margin,
  },

  stIconCheck: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    // flex:1,
    marginLeft: 8
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
    color: "#9AA6B4",
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
    borderRadius: fontsValue(60),
    width: fontsValue(60),
    height: fontsValue(60),
    // backgroundColor: "#345",
  },
});
