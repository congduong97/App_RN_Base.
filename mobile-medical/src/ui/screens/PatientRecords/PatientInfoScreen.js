import React, { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, View, Text, Keyboard } from "react-native";
import {
  useNavigation,
  useRoute,
  useIsFocused,
} from "@react-navigation/native";
import Toast from "react-native-simple-toast";
import { useDispatch, useSelector } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useApp, useMergeState } from "../../../AppProvider";
import {
  Colors,
  Dimension,
  Fonts,
  fontsValue,
  SCREEN_HEIGHT,
  concatenateString,
} from "../../../commons";
import { ScreensView, ButtonView, TextView } from "../../../components";
import {
  AvatarView,
  ActionSheet,
  ActionSheetType,
  SheetAreaView,
  PopupsChoiceView,
  PopupType,
} from "../../components";
import {
  convertTimeServerToDateVN,
  FORMAT_DD_MM_YYYY,
} from "../../../commons/utils/DateTime";
import IconView from "../../../components/IconView";
import models, { Gender, getGenderName } from "../../../models";
import AppNavigate from "../../../navigations/AppNavigate";
import API from "../../../networking";
import DropShadow from "react-native-drop-shadow";

function FormInfoView(props) {
  const { patientData } = props;
  const { refDialog } = useApp();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const birthday = convertTimeServerToDateVN(
    patientData?.dob,
    FORMAT_DD_MM_YYYY
  );
  const addressFull = concatenateString(
    ", ",
    patientData?.address,
    patientData?.wardName,
    patientData?.districtName,
    patientData?.cityName
  );
  const gender = getGenderName(patientData?.gender);
  const relationship = models.getRelationshipName(patientData?.relationship);
  const height = (patientData?.height ? patientData?.height : "") + " cm";
  const weight = (patientData?.weight ? patientData?.weight : "") + " kg";
  ////
  const handleOnPress = ({ id }) => {
    if (id === "EditRecord") {
      AppNavigate.navigateToCreateRecord(navigation.dispatch, {
        dataInfo: patientData,
        isEdit: true,
      });
    } else if (id === "RemoveRecord") {
      showDialogConfirm();
    } else if (id === "PerformRemove") {
      requestDeletePatientRecord();
      refDialog.current.hideDialog();
    } else if (id === "CancelRemove") {
      refDialog.current.hideDialog();
    }
  };

  const requestDeletePatientRecord = async () => {
    let isDone = await API.requestDeletePatientRecord(
      dispatch,
      patientData?.id
    );
    if (isDone) {
      Toast.showWithGravity(
        "Bạn đã xoá hồ sơ thành công",
        Toast.LONG,
        Toast.CENTER
      );
      // AppNavigate.navigateToTabPatientRecord(navigation.dispatch);
      navigation.goBack();
    } else if (isDone !== null) {
      Toast.showWithGravity(
        // "Xoá hồ sơ bị lỗi. Bạn hãy kiểm tra lại các thông tin",
        "Không thể xóa hồ sơ y tế đã được sử dụng",
        Toast.SHORT,
        Toast.CENTER
      );
    }
  };

  const showDialogConfirm = () => {
    refDialog?.current &&
      refDialog.current
        .configsDialog({
          visibleClose: false,
          isScroll: true,
        })
        .drawContents(
          <>
            <Text style={styles.stTextTitleConfirm}>{"Thông báo"}</Text>
            <Text style={styles.stTextConfirm}>
              {"Bạn chắc chắn muốn xoá hồ sơ này?"}
            </Text>
            <View style={styles.stConfirmFooter}>
              <ButtonView
                id={"CancelRemove"}
                title={"Thoát"}
                onPress={handleOnPress}
                bgColor={"#E8E8E8"}
                textColor={Colors.textLabel}
                style={{
                  ...styles.stButtonConfirm,
                  //  borderColor: Colors.colorMain,
                  //  borderWidth: 1,
                }}
              />
              <ButtonView
                id={"PerformRemove"}
                title={"Xoá"}
                onPress={handleOnPress}
                bgColor={Colors.colorCancel}
                style={styles.stButtonConfirm}
              />
            </View>
          </>
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
        shadowOpacity: 0.025,
        shadowRadius: 10,
      }}
    >
      <View
        style={styles.stContainForm}
        onStartShouldSetResponder={() => Keyboard.dismiss()}
      >
        {/* <AvatarView
        isCapture={false}
        // pictureData={objectData[Objectkey.file]}
        // onPress={onChangeText}
      /> */}
        <AvatarView isCapture={false} name={patientData?.name} avatarUrl={patientData?.avatar} />
        <View style={{ marginTop: fontsValue(60), marginBottom: fontsValue(20) }}>
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.stContainContentForm}
            enableOnAndroid={true}
            extraScrollHeight={Platform.OS === "android" ? 100 : 0}
            showsVerticalScrollIndicator={false}
          >
            <TextView
              title={"Mã bệnh nhân"}
              style={styles.stRow}
              styleValue={styles.stTextTitleRow}
              value={patientData?.patientRecordCode}
              styleValue={styles.stTextValueRow}
            />
            <TextView
              title={"Họ và tên"}
              style={styles.stRow}
              styleValue={styles.stTextTitleRow}
              value={patientData?.name}
              styleValue={styles.stTextValueRow}
            />
            <TextView
              title={"Ngày sinh"}
              style={styles.stRow}
              styleValue={styles.stTextTitleRow}
              value={birthday}
              styleValue={styles.stTextValueRow}
            />
            <TextView
              title={"Giới tính"}
              style={styles.stRow}
              styleValue={styles.stTextTitleRow}
              value={gender}
              styleValue={styles.stTextValueRow}
            />
            <TextView
              title={"Mối quan hệ"}
              style={styles.stRow}
              styleValue={styles.stTextTitleRow}
              value={relationship || "Khác"}
              styleValue={styles.stTextValueRow}
            />
            <TextView
              title={"Chiều cao"}
              style={styles.stRow}
              styleValue={styles.stTextTitleRow}
              value={height}
              styleValue={styles.stTextValueRow}
            />
            <TextView
              title={"Cân nặng"}
              style={styles.stRow}
              styleValue={styles.stTextTitleRow}
              value={weight}
              styleValue={styles.stTextValueRow}
            />
            <TextView
              title={"Mã BHYT"}
              style={styles.stRow}
              styleValue={styles.stTextTitleRow}
              value={patientData?.healthInsuranceCode}
              styleValue={styles.stTextValueRow}
            />
            <TextView
              title={"Địa chỉ"}
              style={styles.stRow}
              styleValue={styles.stTextTitleRow}
              value={addressFull}
              styleValue={styles.stTextValueRow}
            />
            <TextView
              title={"Số điện thoại"}
              style={styles.stRow}
              styleValue={styles.stTextTitleRow}
              value={patientData?.phone}
              styleValue={styles.stTextValueRow}
            />
            <TextView
              title={"Email"}
              style={styles.stRow}
              styleValue={styles.stTextTitleRow}
              value={patientData?.email}
              styleValue={styles.stTextValueRow}
            />
          </KeyboardAwareScrollView>
        </View>
        <View style={styles.stContainFooter}>
          {!props.isHideDelete && <ButtonView
            id={"RemoveRecord"}
            title={"Xoá hồ sơ"}
            onPress={handleOnPress}
            bgColor={Colors.colorBtEdit}
            textColor={Colors.colorCancel}
            style={styles.stButton}
          />}
          <ButtonView
            id={"EditRecord"}
            title={"Sửa hồ sơ"}
            onPress={handleOnPress}
            style={styles.stButton}
          />
        </View>
      </View>
    </DropShadow>
  );
}

export default function PatientInfoScreen() {
  const route = useRoute();
  const isFocused = useIsFocused();
  const recordId = route?.params?.recordId || {};
  const isHideDelete = route?.params?.isHideDelete || false;

  const [stateScreen, setStateScreen] = useMergeState({
    reRender: false,
    patientData: {},
  });
  // const recordData = models.getListPatientRecords();
  const { patientData } = stateScreen;

  useEffect(() => {
    if (isFocused) {
      let dataRecord = models.getPatientRecordsInfo(recordId);
      setStateScreen({ patientData: dataRecord });
    }
  }, [isFocused]);

  ///
  const handleOnPress = () => { };

  ///
  return (
    <ScreensView
      styleBackground={{ backgroundColor: "white" }}
      titleScreen={"Thông tin hồ sơ"}
      bgColorStatusBar="transparent"
    // styleContent={styles.styleContent}
    //  styleTitle={{ color: "white" }}
    // styleToolbar={styles.styleToolbar}
    // end={{ x: 0.5, y: -1 }}
    // start={{ x: 0, y: 1 }}
    // colorsLinearGradient={Colors.colorsLinearGradient}
    // styleHeader={styles.styleHeader}

    >
      <FormInfoView patientData={patientData} isHideDelete={isHideDelete} onPress={handleOnPress} />
    </ScreensView>
  );
}

const styles = StyleSheet.create({
  styleContent: {
    backgroundColor: "white",
    paddingHorizontal: Dimension.padding4x,
    marginTop: fontsValue(40),
  },

  styleHeader: {
    height: fontsValue(300),
    borderBottomLeftRadius: fontsValue(60),
    borderBottomRightRadius: fontsValue(60),
    elevation: fontsValue(3),
    shadowOpacity: fontsValue(1),
    justifyContent: "flex-start",
  },
  styleToolbar: {
    paddingHorizontal: Dimension.padding2x,
  },
  stButton: {
    flex: 1,
    //  marginBottom: fontsValue(20),
    // marginHorizontal: Dimension.margin,
    marginHorizontal: 6,
    marginTop: 10,
    height: 44
    // shadowOpacity: 0.25,
    // shadowRadius: 13,
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowColor: "#000000",
    // elevation: 5,
    // zIndex: 9999,
  },

  stContainForm: {
    borderRadius: Dimension.radiusButton,
    backgroundColor: "white",
    marginHorizontal: Dimension.margin2x,
    width: "90%",
    // paddingBottom: 50,
    height: SCREEN_HEIGHT - fontsValue(170),
    alignSelf: "center",
    marginTop: fontsValue(80),
    // shadowOpacity: 0.25,
    // shadowRadius: 0,
    // shadowOffset: {
    //   width: 0,
    //   height: 0,
    // },
    // shadowColor: "#000000",
    // elevation: 10,
    // zIndex: 99,
    // overflow: "visible",
  },
  stContainContentForm: {
    flexGrow: 1,
    paddingHorizontal: Dimension.padding2x,
    paddingBottom: fontsValue(50),
    paddingTop: Dimension.padding,
  },
  stContainFooter: {
    flexDirection: "row",
    justifyContent: "space-around",
    position: "absolute",
    backgroundColor: '#FFFF',
    paddingHorizontal: fontsValue(20),
    left: 0,
    right: 0,
    bottom: fontsValue(20),
    borderBottomLeftRadius: Dimension.radiusButton,
    borderBottomRightRadius: Dimension.radiusButton
    //  marginBottom: -fontsValue(40),
  },

  stTextTitleConfirm: {
    fontFamily: Fonts.SFProDisplayRegular,
    fontSize: Dimension.fontSize20,
    color: Colors.colorTextMenu,
    alignSelf: "center",
    marginTop: Dimension.margin2x,
  },
  stTextConfirm: {
    fontFamily: Fonts.SFProDisplayRegular,
    fontSize: Dimension.fontSize16,
    color: Colors.textLabel,
    alignSelf: "center",
    marginTop: Dimension.margin2x,
  },
  stContainDialog: {
    minHeight: 200,
    marginTop: Dimension.margin4x,
  },
  stButtonConfirm: {
    flex: 1,
    marginBottom: fontsValue(20),
    marginHorizontal: Dimension.margin,
    height: 44,
    fontSize: fontsValue(16)
  },

  stConfirmFooter: {
    marginTop: fontsValue(57),
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: fontsValue(16)
  },
  stRow: {
    marginBottom: Dimension.margin2x,
  },
  stTextTitleRow: {
    fontSize: Dimension.fontSize14,
    color: Colors.textLabel,
  },
  stTextValueRow: {
    fontSize: Dimension.fontSize16,
    color: Colors.colorTextMenu,
    marginTop: Dimension.margin5,
  },
});
