import React, { useEffect, useState, useRef } from "react";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import {
  Image,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch } from "react-redux";
import Toast from "react-native-simple-toast";
import { useApp, useMergeState } from "../../../../AppProvider";
import {
  Colors,
  Dimension,
  Fonts,
  fontsValue,
  isValidPhoneNumber,
  SCREEN_HEIGHT,
  validateEmail,
  ImagesUrl,
} from "../../../../commons";
import {
  convertTimeServerToDateVN,
  FORMAT_TO_SERVER,
  FORMAT_DD_MM_YYYY,
  isCompareTime,
  FORMAT_YYYY_MM_DD,
  convertNewDateToServer,
  FORMAT_YYYYMMDDhhmmssZ,
} from "../../../../commons/utils/DateTime";
import { ButtonView, DateTimePicker, InputView } from "../../../../components";
import IconView from "../../../../components/IconView";
import API from "../../../../networking";
import {
  AvatarView,
  ActionSheet,
  ActionSheetType,
  SheetAreaView,
  PopupsChoiceView,
  PopupType,
} from "../../../components";
import ActionKey from "../ActionKey";
import { handleArea, checkForm } from "./ObjectData";
import Objectkey from "./Objectkey";
import { getGenderName } from "../../../../models";
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
  // console.log("objectData?.dob:   ", objectData?.dob)
  // console.log("convertTimeServerToDateVN(new Date(), FORMAT_DD_MM_YYYY):   ", convertTimeServerToDateVN(new Date(), FORMAT_TO_SERVER))
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const refBHYT = useRef(null);

  useEffect(() => {
    console.log("objectData[Objectkey.dob]1233:    ",objectData?.dob)
    // objectData[Objectkey.dob] =
    //   objectData?.dob ? objectData?.dob : (convertTimeServerToDateVN(new Date(), FORMAT_YYYY_MM_DD) + "T00:00:00.000Z");
    isFocusBHYT && showChoosePicture();

    console.log("objectData[Objectkey.dob]:    ",objectData?.dob)
    // if (objectData[Objectkey.dob] === 'T00:00:00.000Z') {
    //   objectData[Objectkey.dob] = ""
    // }
    // console.log("objectData[Objectkey.GenderName]:", objectData[Objectkey.GenderName])
    // if (objectData[Objectkey.GenderName] == '...') {
    //   objectData[Objectkey.GenderName] = ""
    // }

    // console.log("objectData[Objectkey.GenderName]:1", objectData[Objectkey.GenderName])
  }, []);

  const showChoosePicture = () => {
    refBHYT && refBHYT.current.focus();
  };

  const onConvertText = ({ id, data }) => {
    let dataFilter = data
    if(data.indexOf("-") > -1) {
      dataFilter = data.replace("-", "")
    }
    return dataFilter
  }

  const [stateScreen, setStateScreen] = useMergeState({
    // isValid: false,
    isValid: checkForm(objectData),
    reRender: false,
    date: objectData?.dob,
    messageCheckBHYT: "",
  });
  const { reRender, isValid, date, messageCheckBHYT } = stateScreen;

  const handleCreateRecord = async () => {
    console.log("objectData", objectData);
    if (
      objectData[Objectkey.name] === "" ||
      objectData[Objectkey.name].trim() === ""
    ) {
      Toast.showWithGravity(
        "Bạn cần nhập tên người dùng",
        Toast.LONG,
        Toast.CENTER
      );
      // } else if (convertTimeServerToDateVN(objectData[Objectkey.dob], FORMAT_DD_MM_YYYY) === convertTimeServerToDateVN(new Date(), FORMAT_DD_MM_YYYY)) {
      //   Toast.showWithGravity("Bạn không được chọn ngày sinh là ngày hôm nay",
      //     Toast.LONG,
      //     Toast.CENTER)
    } else if (!isValidPhoneNumber(objectData[Objectkey.phone])) {
      Toast.showWithGravity(
        "Số điện thoại không đúng định dạng. Vui lòng kiểm tra lại.",
        Toast.LONG,
        Toast.CENTER
      );
    } else if (
      objectData[Objectkey.email] &&
      !validateEmail(objectData[Objectkey.email])
    ) {
      Toast.showWithGravity(
        "Email không đúng định dạng. Vui lòng kiểm tra lại.",
        Toast.LONG,
        Toast.CENTER
      );
    } else if (
      !Number.isInteger(parseInt(objectData[Objectkey.height])) &&
      objectData[Objectkey.height] !== ""
    ) {
      Toast.showWithGravity(
        "Chiều cao không đúng định dạng. Vui lòng kiểm tra lại.",
        Toast.LONG,
        Toast.CENTER
      );
    } else if (
      !Number.isInteger(parseInt(objectData[Objectkey.weight])) &&
      objectData[Objectkey.weight] !== ""
    ) {
      Toast.showWithGravity(
        "Cân nặng không đúng định dạng. Vui lòng kiểm tra lại.",
        Toast.LONG,
        Toast.CENTER
      );
    } else {
      let isDone = await API.requestCreatePatientRecord(dispatch, objectData);
      if (isDone) {
        Toast.showWithGravity(
          isEdit ? "Cập nhật hồ sơ thành công" : "Bạn đã tạo hồ sơ thành công",
          Toast.LONG,
          Toast.CENTER
        );
        navigation.goBack();
      } else if (isDone !== null) {
        Toast.showWithGravity(
          "Tạo hồ sơ bị lỗi. Bạn hãy kiểm tra lại các thông tin",
          Toast.SHORT,
          Toast.CENTER
        );
      }
    }
  };

  const checkBHYT = async (healthInsuranceCode) => {
    // if (!isEdit) {
    let dataMessage = await API.checkBaoHiemYTePantient(dispatch, {
      maThe: healthInsuranceCode,
      hoTen: objectData[Objectkey.name],
      ngaySinh: objectData[Objectkey.dob],
    });
    setStateScreen({
      messageCheckBHYT: dataMessage.message,
      isValid: dataMessage.isCheck ? checkForm(objectData) : false,
    });
    // }
  };

  const handleOnPress = ({ id, data }) => {
    if (id === PopupType.ShowGender) {
      showDialog(id, Objectkey.Gender);
    } else if (id === PopupType.ShowRelationships && !isDisableRelationship) {
      showDialog(id, Objectkey.relationship, objectData[Objectkey.Gender]);
    } else if (id === ActionKey.ShowChooseArea) {
      onPress && onPress({ id });
    }
  };

  const handleSelected = ({ id, data }) => {
    if (id === PopupType.ShowGender) {
      objectData[Objectkey.Gender] = data?.code;
      objectData[Objectkey.GenderName] = data?.name;

      // objectData[Objectkey.RelationshipName] = "";
      // objectData[Objectkey.relationship] = "";
    }
    if (id === PopupType.ShowRelationships) {
      objectData[Objectkey.RelationshipName] = data?.name;
      objectData[Objectkey.relationship] = data?.code;

      //them vao gioi tinh
      objectData[Objectkey.Gender] = data?.gender;
      objectData[Objectkey.GenderName] = getGenderName(data?.gender);
    }
    setStateScreen({ reRender: !reRender, isValid: checkForm(objectData) });
  };

  const onClearText = ({ id, data }) => {
    objectData[id] = data;
    setStateScreen({ isValid: checkForm(objectData), messageCheckBHYT: '' });
  }

  const onCausedError = ({ id, data }) => {
    console.log("data:    ", data)
    if (!data || data == '') {
      return false
    }
    return true
  }

  const onChangeText = ({ id, data }) => {
    if (id === Objectkey.dob) {
      // console.log("----", data)
      // console.log("convertTimeServerToDateVN(objectData?.dob, FORMAT_DD_MM_YYYY):   ", convertTimeServerToDateVN(data, FORMAT_YYYY_MM_DD) + "T01:00:00.000Z")
      objectData[id] =
        convertTimeServerToDateVN(data, FORMAT_YYYY_MM_DD) + "T00:00:00.000Z";
      // onsole.log("data1", objectData[id])
    } else if (id === ActionKey.ShowChooseArea) {
      handleArea(data, objectData);
    } else if (id === Objectkey.healthInsuranceCode && data.length === 15) {
      objectData[id] = data;
      checkBHYT(data);
    } else if (id === Objectkey.file) {
      objectData[Objectkey.file] = {
        uri: data?.uri,
        name: data?.fileName,
        type: data?.type,
      };
    } else {
      objectData[id] = data;
    }
    setStateScreen({ isValid: checkForm(objectData) });
  };
  /////
  //////////
  const showDialog = (typeDialog, keyCheck, idGender) => {
    refDialog?.current &&
      refDialog.current
        .configsDialog({
          // visibleClose: false,
          isScroll: true,
        })
        .drawContents(
          <PopupsChoiceView
            dataSelected={objectData}
            keyCheck={keyCheck}
            typeDialog={typeDialog}
            refDialog={refDialog.current}
            onPress={handleSelected}
            idGender={idGender}
          />
        )
        .visibleDialog();
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
          avatarUrl={objectData[Objectkey.avatar]}
          pictureData={objectData[Objectkey.file]?.uri}
          onPress={onChangeText}
          name={objectData[Objectkey.name]}
        />
        <View style={{ marginTop: fontsValue(60) }}>
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps='handled'
            contentContainerStyle={styles.stContainContent}
            // enableAutomaticScroll={false}
            extraHeight={0}
            enableOnAndroid={true}
            extraScrollHeight={Platform.OS === "android" ? 100 : 50}
            showsVerticalScrollIndicator={false}
          >
            <InputView
              id={Objectkey.name}
              // isShowLabel
              label={
                <Text>
                  <Text style={{ color: "red" }}>*</Text> {"Họ và tên"}
                </Text>
              }
              labelError={"Bạn cần nhập họ và tên..."}
              onCausedError={onCausedError}
              placeholder={"Nhập họ tên..."}
              isLableTick={true}
              placeholderTextColor={Colors.textLabel}
              style={styles.stContainInput}
              styleInput={styles.stInput}
              styleTextInput={styles.styleTextInput}
              onChangeText={onChangeText}
              value={objectData[Objectkey.name]}
            />
            <View style={styles.stContainRow}>
              <InputView
                id={PopupType.ShowRelationships}
                isShowLabel
                isShowClean={false}
                editable={false}
                label={
                  <Text>
                    <Text style={{ color: "red" }}>*</Text> {"Mối quan hệ"}
                  </Text>
                }
                isLableTick={true}
                placeholder={"Mối quan hệ"}
                placeholderTextColor={Colors.textLabel}
                style={{ ...styles.stContainInput, flex: 1 }}
                styleInput={styles.stInput}
                styleTextInput={[styles.styleTextInput]}
                textDisable={{ ...styles.textDisable }}
                onChangeText={onChangeText}
                onPress={handleOnPress}
                value={objectData[Objectkey.RelationshipName]}
              />
              <InputView
                id={PopupType.ShowGender}
                isShowLabel
                isShowClean={false}
                editable={false}
                label={
                  <Text>
                    <Text style={{ color: "red" }}>*</Text> {"Giới tính"}
                  </Text>
                }
                isLableTick={true}
                placeholder={"Chọn giới tính..."}
                placeholderTextColor={Colors.textLabel}
                style={{ ...styles.stContainInput, flex: 1 }}
                styleInput={styles.stInput}
                styleTextInput={styles.styleTextInput}
                textDisable={styles.textDisable}
                onChangeText={onChangeText}
                onPress={handleOnPress}
                value={objectData[Objectkey.GenderName] == '...' ? "" : objectData[Objectkey.GenderName]}
              />
            </View>
            <View style={styles.stContainDate}>
              {objectData[Objectkey.dob] && objectData[Objectkey.dob] !== 'T00:00:00.000Z' ? <Text
                style={{
                  fontSize: 15,
                  color: Colors.textLabel,
                  fontFamily: Fonts.SFProTextRegular,
                }}
              >
                <Text style={{ color: "red" }}>*</Text> {"Ngày sinh"}
              </Text> : null}
              <View style={styles.styleIconDateTime}>
                <DateTimePicker
                  id={Objectkey.dob}
                  // isDeleteDate={true}
                  placeholder={<Text style={{ fontSize: 12 }}>
                    <Text style={{ color: "red", }}>{'*'}</Text> {"Chọn ngày sinh..."}
                  </Text>}
                  placeholderTextColor={Colors.textLabel}
                  textColor={Colors.colorText}
                  styleTextButton={styles.styleTextInput}
                  value={date ? new Date(date) : null}
                  display={Platform.OS === "ios" ? "inline" : "default"}
                  maximumDate={new Date()}
                  onChange={onChangeText}
                />
              </View>
            </View>
            <SheetAreaView
              id={ActionKey.ShowChooseArea}
              initName={objectData[Objectkey.AreaFullName]}
              onReponse={onChangeText}
            />

            <InputView
              id={Objectkey.address}
              // isShowLabel
              // offsetLabel={}
              // isLableTick={true}
              label={"Địa chỉ cụ thể"}
              placeholder={"Nhập địa chỉ cụ thể..."}
              placeholderTextColor={Colors.textLabel}
              style={styles.stContainInput}
              styleInput={[styles.stInput]}
              styleTextInput={[styles.styleTextInput]}
              onChangeText={onChangeText}
              value={objectData[Objectkey.address]}
            />
            <InputView
              id={Objectkey.phone}
              // isShowLabel
              label={
                <Text>
                  <Text style={{ color: "red" }}>*</Text> {"Số điện thoại"}
                </Text>
              }
              isLableTick={true}
              labelError={"Bạn cần nhập số điện thoại..."}
              onCausedError={onCausedError}
              placeholder={"Nhập số điện thoại..."}
              placeholderTextColor={Colors.textLabel}
              style={styles.stContainInput}
              keyboardType={"phone-pad"}
              styleInput={styles.stInput}
              styleTextInput={styles.styleTextInput}
              onChangeText={onChangeText}
              value={objectData[Objectkey.phone]}
            />
            {/* <TextInput
            ref={refBHYT}
          /> */}
            <InputView
              id={Objectkey.healthInsuranceCode}
              // isShowLabel
              // offsetLabel={}
              refInputView={refBHYT}
              label={"Mã thẻ bảo hiểm"}
              checkisFocusBHYT={true}
              placeholder={"Nhập mã thẻ bảo hiểm..."}
              placeholderTextColor={Colors.textLabel}
              style={styles.stContainInput}
              styleInput={styles.stInput}
              styleTextInput={styles.styleTextInput}
              onChangeText={onChangeText}
              onClearText={onClearText}
              value={objectData[Objectkey.healthInsuranceCode]}
            />
            {/* messageCheckBHYT */}
            {messageCheckBHYT !== "" && (
              <Text
                style={[
                  styles.styleTextInput,
                  { color: "red", fontSize: 10 },
                ]}
              >
                {"Chú ý: " + messageCheckBHYT}
              </Text>
            )}

            <View style={styles.stContainRow}>
              <InputView
                id={Objectkey.height}
                // isShowLabel
                // offsetLabel={}
                label={"Chiều cao (cm)"}
                placeholder={"Nhập chiều cao..."}
                placeholderTextColor={Colors.textLabel}
                keyboardType={"numeric"}
                style={{ ...styles.stContainInput, flex: 1 }}
                styleInput={styles.stInput}
                styleTextInput={styles.styleTextInput}
                onChangeText={onChangeText}
                value={objectData[Objectkey.height]}
                onConvertText={onConvertText}
              />
              <InputView
                id={Objectkey.weight}
                // isShowLabel
                // offsetLabel={}
                label={"Cân nặng (kg)"}
                placeholder={"Nhập cân nặng..."}
                placeholderTextColor={Colors.textLabel}
                keyboardType={"numeric"}
                style={{ ...styles.stContainInput, flex: 1 }}
                styleInput={styles.stInput}
                styleTextInput={styles.styleTextInput}
                onChangeText={onChangeText}
                value={objectData[Objectkey.weight]}
                onConvertText={onConvertText}
              />
            </View>
            <InputView
              id={Objectkey.email}
              // isShowLabel
              // offsetLabel={}
              label={"Email"}
              placeholder={"Nhập email..."}
              placeholderTextColor={Colors.textLabel}
              keyboardType={"email-address"}
              style={styles.stContainInput}
              styleInput={styles.stInput}
              styleTextInput={styles.styleTextInput}
              onChangeText={onChangeText}
              value={objectData[Objectkey.email] || ""}
            />
          </KeyboardAwareScrollView>
        </View>
        <View style={styles.stContainFooter}>
          <ButtonView
            disabled={!isValid}
            title={isEdit ? "Cập nhật" : "Tạo hồ sơ"}
            onPress={handleCreateRecord}
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
    // position: "absolute",
    // top: fontsValue(110),
    marginTop: fontsValue(50),
    // shadowOpacity: 0.25,
    // shadowRadius: 2,
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowColor: "#000000",
    // elevation: 8,
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
    // marginBottom: -fontsValue(5),
    borderBottomColor: Colors.colorBg2,
    borderBottomWidth: 1,
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
    //  marginBottom: -fontsValue(20),
    marginHorizontal: fontsValue(31),
    marginVertical: fontsValue(11),
    // shadowOpacity: 0.25,
    // shadowRadius: 2,
    // shadowOffset: {
    //   width: 0,
    //   height: 5,
    // },
    // shadowColor: "#000000",
    // elevation: 4,
    // zIndex: 999,
    // position: "absolute",
    // left: 0,
    // right: 0,
    // bottom: 0,
  },
  styleIconDateTime: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stContainFooter: {
    //  flexDirection: "row",
    justifyContent: "space-around",
    position: "absolute",
    backgroundColor: "#FFFF",
    //  paddingHorizontal: fontsValue(20),
    left: 0,
    right: 0,
    bottom: 0,
    borderBottomLeftRadius: Dimension.radiusButton,
    borderBottomRightRadius: Dimension.radiusButton,
  },
});
