import React, { useState, useRef } from "react";
import { ScreensView, ButtonView, TextView } from "../../../components";
import { View, Text, Image, StyleSheet, TextInput } from "react-native";
import { Dimension, Colors, Fonts } from "../../../commons";
import { scale } from "../../../commons/utils/Devices";
import StarRating from "react-native-star-rating";
import IconView, { IconViewType } from "../../../components/IconView";
import { ActionSheetType, ActionSheet } from "../../../ui/components";
import { TouchableOpacity } from "react-native-gesture-handler";
import API from "../../../networking";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import Toast from "react-native-simple-toast";
import { debounce } from "lodash";

export default function DoctorFeedback(props) {
  const [textValue, setTextValue] = useState(null);
  const [numberText, setNumberText] = useState(0);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [rating, setRating] = useState(4);
  const refActionSheet = useRef({});
  const route = useRoute();
  const doctorInfo = route?.params?.doctorInfo;
  const getFeedbacks = route?.params?.getFeedbacks;
  const addNumberComment = route?.params?.addNumberComment;
  // console.log("doctorInfo", doctorInfo);

  const onChangeText = (text) => {
    setTextValue(text);
    setNumberText(text.length);
  };

  const onPressSent = async () => {
    if (textValue.length > 0) {
      const params = {
        rate: rating,
        content: textValue,
        doctorId: doctorInfo.id,
      };
      const response = await API.sentFeedbackDoctor(dispatch, params);
      if (response.status) {
        Toast.showWithGravity(
          "Thông báo: \n Cảm ơn bạn đã gửi nhận xét cho chúng tôi",
          Toast.LONG,
          Toast.CENTER
        );
        getFeedbacks();
        addNumberComment();
        navigation.goBack();
      }
    } else {
      Toast.showWithGravity(
        "Vui lòng nhập nhận xét của bạn!!",
        Toast.LONG,
        Toast.CENTER
      );
    }

    console.log("check response", response);
  };

  const showChoosePicture = () => {
    // refActionSheet && refActionSheet.current.open(dispatch, params);
  };

  return (
    <ScreensView
      styleContent={styles.container}
      titleScreen={"Nhận xét của bạn"}
    >
      <View style={styles.content}>
        <View style={{ flexDirection: "row", flex: 1 }}>
          <Image
            style={styles.viewImage}
            source={{
              uri:
                "https://i.pinimg.com/originals/a0/dc/35/a0dc35e337a9c7bf922bf5edc022236d.jpg",
            }}
          />
          <View style={styles.viewContent}>
            <Text style={styles.textNameDoctor}>Nguyễn Thị Mai</Text>
            <TextView
              style={styles.styleContainerText}
              styleValue={styles.stTextValue}
              value={"Tôi"}
              styleIconLeft={styles.stylesIconLeft}
              nameIconLeft={"ic-user-dot"}
              iconColor={Colors.colorMain}
              iconSize={14}
            />
            <TextView
              style={styles.styleContainerDate}
              styleValue={styles.stTextValue}
              value={"21/09/1999"}
              styleIconLeft={styles.stylesIconLeft}
              nameIconLeft={"ic-calendar"}
              colorIconLeft={Colors.colorCancel}
              iconSize={14}
            />
          </View>
          <View style={{ justifyContent: "center" }}>
            <View style={styles.viewRadioButton}>
              <View style={styles.viewRadio} />
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.content2, { marginTop: 12 }]}>
        <TextInput
          style={styles.input}
          value={textValue}
          onChangeText={onChangeText}
          multiline={true}
          maxLength={1000}
          placeholder={"Hãy viết nhận xét của bạn ở đây"}
          underlineColorAndroid="transparent"
        />
        <View style={styles.viewStar}>
          <View style={styles.viewNumberText}>
            <Text>{numberText}/1000</Text>
          </View>
          <View style={{ width: scale(102) }}>
            <StarRating
              disabled={false}
              maxStars={5}
              rating={rating}
              fullStarColor={"#FEC12D"}
              emptyStarColor={"#747F9E"}
              starSize={scale(14)}
              selectedStar={(rating) => setRating(rating)}
            />
          </View>
        </View>
        <View style={styles.viewCameraAndSend}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            onPress={debounce(onPressSent, 300, {
              trailing: false,
              leading: true,
            })}
          >
            <Image
              style={styles.imageSent}
              source={require("../../../../assets/icons/iconSend.png")}
            />
          </TouchableOpacity>
        </View>
      </View>
      <ActionSheet
        id={"file"}
        ref={refActionSheet}
        actionType={ActionSheetType.ChoosePicture}
        // onReponse={onReponsePicture}
      />
    </ScreensView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Dimension.padding2x,
    backgroundColor: "white",
    paddingHorizontal: Dimension.padding2x,
    paddingBottom: 20,
  },
  content: {
    width: scale(327),
    flexDirection: "row",
    padding: Dimension.padding,
    borderRadius: Dimension.radiusButton,
    backgroundColor: "white",
    shadowOpacity: 0.25,
    shadowRadius: 3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowColor: "#000000",
    elevation: 3,
  },
  content2: {
    width: scale(327),
    padding: Dimension.padding,
    borderRadius: Dimension.radiusButton,
    backgroundColor: "white",
    shadowOpacity: 0.25,
    shadowRadius: 3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowColor: "#000000",
    elevation: 3,
  },
  viewImage: {
    height: scale(80),
    width: scale(80),
    borderRadius: scale(40),
    paddingTop: scale(16),
    paddingLeft: scale(16),
  },
  viewRadioButton: {
    borderRadius: scale(12),
    borderColor: "#00C6AD",
    borderWidth: 1,
    height: scale(24),
    width: scale(24),
    justifyContent: "center",
    alignItems: "center",
  },
  viewRadio: {
    width: scale(14),
    height: scale(14),
    backgroundColor: "#00C6AD",
    borderRadius: scale(7),
  },
  input: {
    marginHorizontal: scale(16),
    marginTop: scale(8),
    height: scale(113),
    textAlignVertical: "top",
  },
  flexRow: {
    flexDirection: "row",
  },
  viewStar: {
    width: "100%",
    alignItems: "center",
  },
  viewNumberText: {
    width: "100%",
    alignItems: "flex-end",
    marginRight: 12,
  },
  styleContainerText: {
    marginVertical: 3,
  },
  stTextValue: {
    fontSize: Dimension.fontSize14,
    color: Colors.colorTitleScreen,
    fontWeight: "400",
    fontFamily: Fonts.SFProDisplayRegular,
    marginLeft: Dimension.margin,
    letterSpacing: 0.5,
  },
  viewCameraAndSend: {
    backgroundColor: "#F8F8F8",
    marginHorizontal: 12,
    height: scale(44),
    marginTop: scale(18),
    borderRadius: 16,
    alignItems: "center",
    flexDirection: "row",
  },
  textNameDoctor: {
    color: "#262C3D",
    fontSize: Dimension.fontSizeHeaderPopup,
    fontFamily: Fonts.SFProDisplayRegular,
  },
  imageSent: { width: 24, height: 24, marginRight: 16 },
  viewContent: { paddingLeft: 12, flex: 1 },
});
