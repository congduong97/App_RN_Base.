import React, { useEffect, useRef } from "react";
import {
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  View,
  Alert,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch } from "react-redux";
import Toast from "react-native-simple-toast";
import { useApp, useMergeState } from "../../../AppProvider";
import {
  Colors,
  Dimension,
  Fonts,
  fontsValue,
  isValidPhoneNumber,
  SCREEN_HEIGHT,
  validateEmail,
} from "../../../commons";
import {
  convertTimeServerToDateVN,
  FORMAT_YYYY_MM_DD,
} from "../../../commons/utils/DateTime";
import { ButtonView, DateTimePicker, InputView } from "../../../components";
import API from "../../../networking";
import {
  AvatarView,
  SheetAreaView,
  PopupsChoiceView,
  PopupType,
} from "../../components";
import {
  StackActions,
  useNavigation, useRoute
} from "@react-navigation/native";
import ActionKey from "../../screens/PatientRecords/ActionKey";
import {
  handleArea,
  checkForm,
} from "../../screens/PatientRecords/CreateRecord/ObjectData";
import Objectkey from "../../screens/PatientRecords/CreateRecord/Objectkey";
import models, { getGenderName } from "../../../models";
import DropShadow from "react-native-drop-shadow";

export default function FormCreateView(props) {
  const {
    onPress,
    objectData,
    isEdit,
    isFocusBHYT,
    isDisableRelationship,
  } = props;
  const { refDialog } = useApp();
  const route = useRoute();
  const onReLoadData = route?.params?.onReLoadData;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const refBHYT = useRef(null);
  const dataUserInfo = models.getUserInfo()

  const [stateScreen, setStateScreen] = useMergeState({
    isValid: false,
    reRender: false,
    date: objectData?.dob,
    dataUserAccount: dataUserInfo,
    textName: dataUserInfo.name,
    dataAvatar: {}
  });
  const { reRender, isValid, date, dataUserAccount, textName, dataAvatar } = stateScreen;

  const updateInfoUser = async () => {
    let params = {
      name: textName,
      avatar: dataAvatar && dataAvatar.uri ? [dataAvatar] : dataUserAccount.avatar,
      dob: dataUserAccount.dob || ""
    }
    let isUpdate = await API.requestUpdateAccountInfo(dispatch, params)
    if (isUpdate) {
      Toast.showWithGravity(
        "Cập nhật thông tin cá nhân thành công",
        Toast.LONG,
        Toast.CENTER
      );
      navigation.goBack();
      onReLoadData()
    } else {
      Toast.showWithGravity(
        "Cập nhật thông tin cá nhân thất bại",
        Toast.LONG,
        Toast.CENTER
      );
    }
  };

  const onChangeText = ({ id, data }) => {
    switch (id) {
      case Objectkey.name:
        setStateScreen({ textName: data })
        break;
      case Objectkey.file:
        setStateScreen({
          dataAvatar: {
            uri: data?.uri,
            name: data?.fileName,
            type: data?.type,
          }
        })
        break;

      default:
        break;
    }

    setStateScreen({ isValid: false });
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
      <View
        style={styles.stContain}
        onStartShouldSetResponder={() => Keyboard.dismiss()}
      >
        <AvatarView
          id={Objectkey.file}
          isEdit={isEdit}
          avatarUrl={dataUserAccount?.avatar}
          pictureData={dataAvatar.uri}
          onPress={onChangeText}
          name={objectData[Objectkey.name]}
        />
        <View style={{ marginTop: fontsValue(60) }}>
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps='handled'
            contentContainerStyle={styles.stContainContent}
            enableOnAndroid={true}
            extraScrollHeight={Platform.OS === "android" ? 100 : 0}
            showsVerticalScrollIndicator={false}
          >
            <InputView
              id={Objectkey.name}
              // isShowLabel
              label={"Họ và tên"}
              placeholder={"Nhập họ tên..."}
              placeholderTextColor={"gray"}
              style={styles.stContainInput}
              styleInput={styles.stInput}
              styleTextInput={styles.styleTextInput}
              onChangeText={onChangeText}
              value={textName}
            />
            {/* <View style={styles.stContainDate}>
              <Text
                style={{
                  fontSize: 15,
                  color: "gray",
                  fontFamily: Fonts.SFProTextRegular,
                }}
              >
                <Text style={{ color: "red" }}>*</Text> {"Ngày sinh"}
              </Text>
              <View style={styles.styleIconDateTime}>
                <DateTimePicker
                  id={Objectkey.dob}
                  // isDeleteDate={true}
                  placeholderTextColor={Colors.placeholderTextColor}
                  textColor={Colors.colorText}
                  styleTextButton={styles.styleTextInput}
                  value={date ? new Date(date) : new Date()}
                  display={Platform.OS === "ios" ? "inline" : "default"}
                  maximumDate={new Date()}
                  onChange={onChangeText}
                />
              </View>
            </View> */}

            <InputView
              id={Objectkey.address}
              isShowLabel
              editable={false}
              isShowClean={false}
              // offsetLabel={}
              label={"Số điện thoại"}
              placeholder={"Số điện thoại..."}
              placeholderTextColor={"gray"}
              style={styles.stContainInput}
              styleInput={styles.stInput}
              styleTextInput={styles.styleTextInput}
              onChangeText={onChangeText}
              value={dataUserAccount?.phoneNumber}
            />

            <InputView
              id={Objectkey.address}
              isShowLabel
              editable={false}
              isShowClean={false}
              // offsetLabel={}
              label={"Email"}
              placeholder={"Nhập email..."}
              placeholderTextColor={"gray"}
              style={styles.stContainInput}
              styleInput={styles.stInput}
              styleTextInput={styles.styleTextInput}
              onChangeText={onChangeText}
              value={dataUserAccount?.email}
            />

          </KeyboardAwareScrollView>
        </View>
        <View style={styles.stContainFooter}>
          <ButtonView
            // disabled={!isValid}
            title={"Cập nhật"}
            onPress={updateInfoUser}
            style={styles.stButton}
          />
        </View>
      </View>
    </DropShadow>
  );
}

const styles = StyleSheet.create({
  stContain: {
    borderRadius: Dimension.radiusButton,
    backgroundColor: "white",
    marginHorizontal: Dimension.margin2x,
    width: "90%",
    paddingBottom: 50,
    height: SCREEN_HEIGHT - fontsValue(170),
    alignSelf: "center",
    marginTop: fontsValue(50),
    zIndex: 99,
    overflow: "visible",
  },

  styleViewAvatar: {
    position: "absolute",
    top: -45,
    alignSelf: "center",
    zIndex: 99,
  },
  styleAvatar: {
    width: fontsValue(100),
    height: fontsValue(100),
    borderRadius: fontsValue(60),
  },
  styleIconCameara: {
    position: "absolute",
    bottom: -4,
    right: -4,
    padding: 8,
    backgroundColor: "white",
    borderRadius: fontsValue(20),
    elevation: 3,
    shadowColor: "gray",
  },
  ///
  stContainContent: {
    flexGrow: 1,
    paddingHorizontal: Dimension.padding2x,
    paddingBottom: fontsValue(50),
  },
  stContainRow: {
    flexDirection: "row",
  },
  stContainInput: {
    marginTop: Dimension.margin4x,
    borderBottomColor: Colors.colorBg2,
    borderBottomWidth: 1,
    position: "relative",
  },
  stContainDate: {
    marginTop: Dimension.margin2x,
    borderWidth: 0,
    borderBottomColor: Colors.colorBg2,
    borderBottomWidth: 1,
    position: "relative",
  },
  stInput: {
    borderWidth: 0,
  },
  styleTextInput: {
    color: Colors.colorText,
    fontSize: Dimension.fontSize14,
    fontFamily: Fonts.SFProDisplayRegular,
    marginHorizontal: Dimension.margin5,
  },
  textDisable: {
    color: Colors.colorText,
    fontSize: Dimension.fontSize14,
    fontFamily: Fonts.SFProDisplayRegular,
    marginHorizontal: Dimension.margin5,
  },
  stButton: {
    marginHorizontal: fontsValue(31),
    marginVertical: fontsValue(11),
  },
  styleIconDateTime: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stContainFooter: {
    justifyContent: "space-around",
    position: "absolute",
    backgroundColor: "#FFFF",
    left: 0,
    right: 0,
    bottom: 0,
    borderBottomLeftRadius: Dimension.radiusButton,
    borderBottomRightRadius: Dimension.radiusButton,
  },
});
