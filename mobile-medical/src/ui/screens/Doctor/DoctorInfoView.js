import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import {
  NavigationKey,
  Dimension,
  Colors,
  Fonts,
  fontsValue,
  validateImageUri,
  ImagesUrl,
} from "../../../commons";
import {
  ScreensView,
  ButtonView,
  InputView,
  TextView,
  TouchableOpacityEx,
} from "../../../components";
import { scale } from "../../../commons/utils/Devices";
import StarRating from "react-native-star-rating";
import DropShadow from "react-native-drop-shadow";
import IconView, { IconViewType } from "../../../components/IconView";

export default function DoctorInfoView(props) {
  const [rating, setRating] = useState(4);

  const { doctorInfo } = props;

  const { name, avatar, medicalSpecialityName, gender, averagePoint, experience, dob, academicCode } = doctorInfo;
  console.log("doctorInfo", doctorInfo)
  // console.log("Name ===", doctorInfo);
  const imageUrl = validateImageUri(avatar, ImagesUrl.imgAvatar);
  let experienceNew = experience ? experience.slice(0, 5) : null
  const getAge = birthDate => Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e+10)
  let ageNumber = dob ?getAge(dob) :null
  useEffect(() => {
    checkUserBlocked()
  }, []);

  const checkUserBlocked = async () => {
    let isCheck = await API.requestCheckUserBlocked(dispatch)
    // console.log("isCheck:    ", isCheck)
    setIsCheck(isCheck)
  }

  const getGender = (gender) => {
    switch (gender) {
      case 'male': return 'Nam';
      case 'female': return 'Nữ';
      default: return 'Khác';
    }
  }

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
      <View style={styles.stContain}>
        <Image source={imageUrl} style={styles.stImageFacility} />
        <View style={{}}>
          <Text style={styles.stTextName}>{academicCode + '.' +name}</Text>
          {/* <Text style={styles.stTextName}>{name}</Text> */}

          <Text style={styles.styleTextGender}>{getGender(gender)}</Text>
          {/* <TextView
            style={styles.styleContainerText}
            styleValue={styles.stTextValue}
            value={getGender(gender)}
            styleIconLeft={styles.stylesIconLeft}
            nameIconLeft={"ic-gender"}
            colorIcon={Colors.colorCancel}
            iconSize={14}
          /> */}
          <View style={{ flexDirection: 'row', alignItems: 'center', }}>
            <ItemInformation title={"Đánh giá"} isShowIcon={true} valueText={averagePoint} />
            <View style={{ height: "60%", width: 1, backgroundColor: '#70707016', marginTop: 14 }}></View>
            <ItemInformation title={"Kinh nghiệm"} valueText={(experienceNew ? experienceNew + ' năm' : '')} />
            <View style={{ height: "60%", width: 1, backgroundColor: '#70707016', marginTop: 14 }}></View>
            <ItemInformation title={"Tuổi đời"} valueText={ageNumber} />

            {/* <Text style={styles.styleTextRating}>{averagePoint}</Text> */}
            {/* <Text style={styles.styleTextRating}>{"4.5 (834)"}</Text> */}

          </View>


        </View>
      </View>
    </DropShadow>
  );
}
const ItemInformation = (props) => {
  const { title, valueText, isShowIcon } = props
  return (
    <View style={styles.styleBorderViewText}>
      <Text>{title}</Text>
      <View style={{ flexDirection: 'row', marginTop: 5 }}>
        {isShowIcon ?
          <IconView
            style={{ marginRight: 8 }}
            color={'#FFC107'}
            name={'star'}
            type={IconViewType.Fontisto}
            size={Dimension.sizeIconText}
          /> : []}

        <Text style={{ color: '#00C6AD' }}>{valueText}</Text>
      </View>


    </View>
  )
}
const styles = StyleSheet.create({
  stContain: {
    // flexDirection: "row",
    // justifyContent:'center',
    // alignItems:'center',
    paddingVertical: Dimension.padding2x,
    marginHorizontal: Dimension.margin2x,
    // padding: Dimension.padding,
    borderRadius: Dimension.radiusButton,
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
  stImageFacility: {
    borderRadius: fontsValue(90),
    width: fontsValue(90),
    height: fontsValue(90),
    alignSelf: 'center'
    // backgroundColor: "#345",
  },
  stTextValue: {
    fontSize: Dimension.fontSize14,
    color: Colors.colorTitleScreen,
    fontWeight: "400",
    fontFamily: Fonts.SFProDisplayRegular,
    marginLeft: Dimension.margin5,
  },
  styleContainerText: {
    // flex: 1,
    marginVertical: fontsValue(5),
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  stylesIconLeft: {
    width: fontsValue(30),
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    color: "#9AA6B4",
  },
  stTextName: {
    fontSize: Dimension.fontSize18,
    color: 'black',
    fontFamily: Fonts.SFProDisplaySemibold,
    marginLeft: Dimension.margin,
    textAlign: 'center',
  },
  styleTextRating: {
    marginLeft: 5,
    fontFamily: Fonts.SFProDisplayRegular,
    fontSize: Dimension.fontSize10,
    color: '#B0B3C7'

  },
  styleTextGender: {
    alignSelf: 'center',
    textAlign: 'center',
    paddingVertical: 2,
    marginTop: 4,
    fontSize: Dimension.fontSize14,
    fontFamily: Fonts.SFProDisplayRegular,
    backgroundColor: '#DBFFFA',
    color: '#00C6AD',
    borderRadius: Dimension.radiusButton,
    width: 50
  },
  styleBorderViewText: {
    alignItems: 'center',
    flex: 1,
    marginTop: Dimension.margin

  }
});
