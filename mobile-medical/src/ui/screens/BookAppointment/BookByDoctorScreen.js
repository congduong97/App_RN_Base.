import React, { useEffect, useRef, useMemo } from "react";
import { StyleSheet, Text, View, Image, Keyboard, Alert, TouchableOpacity } from "react-native";
import {
  useNavigation,
  useRoute,
  useIsFocused,
} from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { useApp, useMergeState } from "../../../AppProvider";
import AppNavigate from "../../../navigations/AppNavigate";
import models, { BookAppointmentKey } from "../../../models";
import Toast from "react-native-simple-toast";
import {
  ScreensView,
  ButtonView,
  TextView,
  InputView,
} from "../../../components";
import IconView, { IconViewType } from "../../../components/IconView";
import ObjectBook, { handleChooseValue } from "./ObjectBook";
import actions from "../../../redux/actions";
import { NavigationKey, ImagesUrl, Colors, Dimension } from "../../../commons";
import { PatientInfoView, ChoiceValueView } from "./components";
import ActionKey from "./ActionKey";
import API from "../../../networking";
import styles from "./styles";
import Autocomplete from "react-native-autocomplete-input";
import DropShadow from "react-native-drop-shadow";
import { isCompareTime } from "../../../commons/utils/DateTime";

export default function BookByDayScreen(props) {
  const { refDialog } = useApp();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const makeAppointData = useSelector(
    (state) => state.MakeAppointmentReducer.makeAppointData
  );
  const refDataBook = useRef(new ObjectBook(makeAppointData));
  const { healthInsuranceCode } = models.getPatientRecordsInfo(makeAppointData?.patientRecordId);

  const [stateScreen, setStateScreen] = useMergeState({
    isError: false,
    isHaveHealthInsurance: healthInsuranceCode ? true : false,
    //neu cos refDataBook.current[BookAppointmentKey.id] laf đặt lịch khám: --filter ma lan kham cũ
    isReExamination: refDataBook.current[BookAppointmentKey.id] ? (refDataBook.current[BookAppointmentKey.IsReExamination] === 1) : false,
    reRender: false,
    isValid:
      refDataBook.current[BookAppointmentKey.MedicalReason] &&
      refDataBook.current[BookAppointmentKey.MedicalReason].length > 3 &&
      refDataBook.current[BookAppointmentKey.MedicalServiceName] &&
      refDataBook.current[BookAppointmentKey.DoctorId],
    dataSpecialities: [],
    checkBaoHiemYTe: "true",
    dataMedicalServices: [],

    //search mã bệnh nhân
    dataCodePatient: [],
    filteredCodePatient: [],
    textRecordCode: refDataBook.current[BookAppointmentKey.id] ? refDataBook.current[BookAppointmentKey.OldAppointmentCode] : false,
  });
  const {
    isValid,
    reRender,
    isHaveHealthInsurance,
    isReExamination,
    dataSpecialities,
    checkBaoHiemYTe,
    dataMedicalServices,

    dataCodePatient,
    filteredCodePatient,
    textRecordCode,

  } = stateScreen;
  useEffect(() => {

    if (isFocused) {
      refDataBook.current = new ObjectBook(makeAppointData);
      getDataFitterSpecialities(refDataBook.current[BookAppointmentKey.HealthFacilityId])
    }
  }, [isFocused]);

  const getDataFitterSpecialities = async (id) => {
    dispatch(actions.showLoading())
    let data = await API.getSpecialities(dispatch, id, {
      hasClinic: true
    }, false);
    const dataMedicalServices = await API.requestDataMedicalServices(dispatch, { healthFacilityId: refDataBook.current[BookAppointmentKey.HealthFacilityId] })

    // let dataPatientRecords = await API.getPatientRecords(dispatch, refDataBook.current[BookAppointmentKey.patientRecordId]);
    let dataPatientRecords = await API.getMaLanKhamCu(dispatch, refDataBook.current[BookAppointmentKey.PatientRecordId], {
      healthFacilityId: refDataBook.current[BookAppointmentKey.HealthFacilityId],
    });

    if (healthInsuranceCode) {
      let checkBaoHiemYTe = 'Bạn không có mã bảo hiểm y tế'
      if (healthInsuranceCode) {
        checkBaoHiemYTe = await API.checkBaoHiemYTe(dispatch, {
          maThe: healthInsuranceCode,
          hoTen: refDataBook.current[BookAppointmentKey.PatientRecordName],
          ngaySinh: refDataBook.current[BookAppointmentKey.PatientRecordBirthday],
        }, false);
      }

      setStateScreen({
        checkBaoHiemYTe: checkBaoHiemYTe,
        isHaveHealthInsurance: checkBaoHiemYTe === 'true'
      })
    }

    setStateScreen({
      dataSpecialities: data,
      dataCodePatient: dataPatientRecords,
      dataMedicalServices: dataMedicalServices,
      reRender: !reRender,
      isValid: refDataBook.current[BookAppointmentKey.MedicalReason] &&
        refDataBook.current[BookAppointmentKey.MedicalReason].length > 3 &&
        refDataBook.current[BookAppointmentKey.MedicalServiceName] &&
        refDataBook.current[BookAppointmentKey.DoctorId]
    })
    dispatch(actions.hideLoading())
  }

  const onCausedError = ({ id, data }) => {
    console.log("data:    ", data)
    if (!data || data == '') {
      return false
    }
    return true
  }

  const navigateToCreateRecord = (isFocusBHYT) => {
    setStateScreen({
      isHaveHealthInsurance: false
    })
    AppNavigate.navigateToCreateRecord(navigation.dispatch, {
      dataInfo: models.getPatientRecordsInfo(makeAppointData?.patientRecordId),
      isFocusBHYT: isFocusBHYT,
      isEdit: true,
    });
  }

  const handleOnPress = ({ id }) => {
    if (id === ActionKey.NextToEditPatientRecords) {
      navigateToCreateRecord(false)
    } else if (
      id === ActionKey.ShowPoupHeathFacilities
    ) {
      showDialog(id);
    } else if (id === ActionKey.NextToChooseTime) {
      AppNavigate.navigateToChooseBookTime(navigation.dispatch, {
        onResponse: true,
      });
      navigation.canGoBack();
    } else if (id === ActionKey.NextChooseDoctor) {
      AppNavigate.navigateToDoctorSearch(navigation.dispatch, {
        typeScreen: 2,
      });
    } else if (id === ActionKey.ShowPopupMedicalServices) {
      showDialog(id, dataMedicalServices);
    } else if (id === BookAppointmentKey.HaveHealthInsuranceYes) {
      if (!healthInsuranceCode) {
        // Toast.showWithGravity(
        //   "Hồ sơ này không có BHYT.",
        //   Toast.LONG,
        //   Toast.CENTER
        // );
        Alert.alert("Đặt lịch khám",
          'Hồ sơ này chưa có BHYT. Bạn có muốn cập nhật thêm thông tin BHYT?',
          [{
            text: "Từ chối"
          }, {
            text: "Đồng ý",
            onPress: () => { navigateToCreateRecord(true) }
          }])
      } else if (checkBaoHiemYTe !== "true") {
        Alert.alert("Đặt lịch khám",
          checkBaoHiemYTe + ', Vui lòng cập nhật thẻ mới',
          [{
            text: "Từ chối"
          }, {
            text: "Đồng ý",
            onPress: () => { navigateToCreateRecord(true) }
          }])
      } else {
        setStateScreen({ isHaveHealthInsurance: true });
      }
    } else if (id === BookAppointmentKey.HaveHealthInsuranceNo) {
      setStateScreen({ isHaveHealthInsurance: false });
    } else if (id === BookAppointmentKey.IsReExaminationYes) {
      setStateScreen({ isReExamination: true });
    } else if (id === BookAppointmentKey.IsReExaminationNo) {
      setStateScreen({ isReExamination: false });
    } else if (id === ActionKey.ShowHealthInsuranceCode) {
    }
  };

  const handleAgree = async () => {
    let isExistsOldAppointment = true
    // console.log("textRecordCode:    ", textRecordCode)
    // console.log("isReExamination:    ", isReExamination)
    dispatch(actions.showLoading())
    if (isReExamination) {
      isExistsOldAppointment = await API.checkExistsOldAppointment(dispatch, textRecordCode)
    }
    if (isExistsOldAppointment) {
      //check ma bhyt da het han so voi ngay da chon
      let dataBHYT = await API.getDataBaoHiemYTe(dispatch, {
        maThe: healthInsuranceCode,
        hoTen: refDataBook.current[BookAppointmentKey.PatientRecordName],
        ngaySinh: refDataBook.current[BookAppointmentKey.PatientRecordBirthday],
      })

      dispatch(actions.hideLoading())
      let checkDate = true
      if (dataBHYT && dataBHYT.ngayKT) {
        let time1 = dataBHYT.ngayKT.split("/").reverse().join("-")
        let time2 = refDataBook.current[BookAppointmentKey.DateChoose].split("/").reverse().join("-")
        checkDate = isCompareTime(time1, time2)
      }
      if (!checkDate) {
        Alert.alert("Đặt lịch khám", "Bảo hiểm y tế của bạn hết hạn vào ngày bạn đã chọn. Vui lòng kiểm tra lại",
          [
            {
              text: "Đồng ý",
            },
          ],
          {
            cancelable: false,
          })
      } else {
        makeAppointData[
          BookAppointmentKey.HaveHealthInsurance
        ] = isHaveHealthInsurance ? 1 : 0;
        makeAppointData[BookAppointmentKey.IsReExamination] = isReExamination
          ? 1
          : 0;

        refDataBook.current[BookAppointmentKey.PatientRecordCode] = textRecordCode;

        // console.log("refDataBook.current:   ", refDataBook.current)
        dispatch(actions.saveMakeAppointData(refDataBook.current));
        AppNavigate.navigateToAppointmentInfo(navigation.dispatch);
      }
    } else {
      dispatch(actions.hideLoading())
      setTimeout(() => {
        Alert.alert("Đặt lịch khám", "Mã lần tái khám không tồn tại", [{ text: "Đồng ý" }]);
      }, 700);
    }
  };

  const handleSelected = ({ id, data }) => {
    handleChooseValue({ id, data }, refDataBook.current);
    if (id == ActionKey.ShowPopupMedicalServices) {
      setStateScreen({ isValid: refDataBook.current[BookAppointmentKey.MedicalReason] && refDataBook.current[BookAppointmentKey.MedicalReason].length > 3 && refDataBook.current[BookAppointmentKey.MedicalServiceName] && refDataBook.current[BookAppointmentKey.DoctorId] });
    }
    dispatch(actions.saveMakeAppointData(refDataBook.current));
    setStateScreen({ reRender: !reRender });
  };

  const onChangeText = ({ id, data }) => {
    refDataBook.current[id] = data;
    dispatch(actions.saveMakeAppointData(refDataBook.current));
    setStateScreen({ isValid: data && data.length > 3 && refDataBook.current[BookAppointmentKey.MedicalServiceName] && refDataBook.current[BookAppointmentKey.DoctorId] });
  };

  //////////
  const showDialog = (typeDialog, dataAll) => {
    refDialog?.current &&
      refDialog.current
        .configsDialog({
          // visibleClose: false,
          isScroll: true,
        })
        .drawContents(
          <ChoiceValueView
            dataSelected={refDataBook.current}
            typeDialog={typeDialog}
            refDialog={refDialog.current}
            onPress={handleSelected}
            dataAll={dataAll}
          />
        )
        .visibleDialog();
  };

  const onSelectPatientRecord = (item) => {
    refDataBook.current[BookAppointmentKey.OldAppointmentCode] = item
    setStateScreen({
      textRecordCode: item,
      filteredCodePatient: [],
    });
  }

  const findDataCodePatient = (query) => {
    if (query) {
      refDataBook.current[BookAppointmentKey.OldAppointmentCode] = query;
      const regex = new RegExp(`${query.trim()}`, "i");
      setStateScreen({
        filteredCodePatient: (dataCodePatient && dataCodePatient.length > 0 ? dataCodePatient.filter(
          (film) => film.search(regex) >= 0
        ) : []),
        textRecordCode: query,
      });
    } else {
      setStateScreen({
        filteredCodePatient: [],
        textRecordCode: query,
      });
    }
  };

  const navigateToPatientInfo = (data) => {
    // console.log("data:   ", data)
    AppNavigate.navigateToPatientInfo(navigation.dispatch, {
      recordId: refDataBook.current[BookAppointmentKey.PatientRecordId],
      isHideDelete: true
    });
  }

  const renderItemSelectCodePatient = ({ item, index }) => (
    <TouchableOpacity style={[styles.viewSelectItemCodePatient, { borderTopWidth: index === 0 ? 0 : 0.5 }]}
      onPress={() => onSelectPatientRecord(item)}>
      <Text style={[{ fontSize: 15, }]}>
        {"Mã: " + item}
      </Text>
    </TouchableOpacity>
  )

  return (
    <ScreensView
      isScroll={true}
      styleBackground={{ backgroundColor: "white" }}
      titleScreen={"Đăng ký lịch khám bác sỹ"}
      bgColorStatusBar="transparent"
      styleContent={styles.styleContent}
      styleTitle={{ color: "black" }}
    // styleToolbar={styles.styleToolbar}
    // end={{ x: 0.5, y: -1 }}
    // start={{ x: 0, y: 1 }}
    // colorsLinearGradient={[
    //   Colors.colorMain,
    //   Colors.colorMain,
    //   Colors.colorMain,
    // ]}
    // styleHeader={styles.styleHeader}



    // renderFooter={
    //   <ButtonView
    //     title={"Tôi đồng ý"}
    //     onPress={handleAgree}
    //     style={{ marginBottom: 20, marginHorizontal: 15 }}
    //   />
    // }
    >
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
        <PatientInfoView
          navigateToPatientInfo={navigateToPatientInfo}
          id={ActionKey.NextToEditPatientRecords}
          patientRecordId={makeAppointData?.patientRecordId}
          onPress={handleOnPress}
        />
      </DropShadow>
      <InputView
        // onPress={handleOnPress}
        id={ActionKey.ShowPoupHeathFacilities}
        editable={false}
        isShowClean={false}
        // iconRightName={"ic-arrow-down"}
        // iconRighSize={Dimension.sizeIcon20}
        // iconRightColor={Colors.colorMain}
        label={
          <Text>
            <Text style={{ color: "red" }}>*</Text>{" Chọn cơ sở y tế khám"}
          </Text>
        }
        isLableTick={true}
        placeholder={"Chọn cơ sở y tế khám..."}
        placeholderTextColor={Colors.textLabel}
        style={styles.stInputTime}
        multiline
        styleInput={styles.stInput}
        textDisable={styles.textDisable}
        // onChangeText={onChangeText}
        value={refDataBook.current[BookAppointmentKey.HealthFacilityName]}
      />

      <InputView
        onPress={handleOnPress}
        id={ActionKey.NextChooseDoctor}
        isShowLabel={true}
        editable={false}
        isShowClean={false}
        iconRightName={"ic-arrow-down"}
        iconRighSize={Dimension.sizeIcon20}
        iconRightColor={Colors.colorMain}
        label={
          <Text>
            <Text style={{ color: "red" }}>*</Text>{" Bác sỹ khám"}
          </Text>
        }
        isLableTick={true}
        placeholder={"Chọn Bác sỹ khám..."}
        placeholderTextColor={Colors.textLabel}
        style={styles.stInputTime}
        multiline
        styleInput={styles.stInput}
        textDisable={styles.textDisable}
        onChangeText={onChangeText}
        value={refDataBook.current[BookAppointmentKey.DoctorName]}
      />

      <View style={{ flexDirection: "row" }}>
        <InputView
          onPress={handleOnPress}
          id={ActionKey.NextToChooseTime}
          editable={false}
          isShowClean={false}
          iconRightName={"ic-calendar"}
          iconRighSize={Dimension.sizeIcon20}
          iconRightColor={Colors.textLabel}
          label={
            <Text>
              <Text style={{ color: "red" }}>*</Text>{" Ngày khám"}
            </Text>
          }
          isLableTick={true}
          placeholder={"Chọn ngày khám..."}
          placeholderTextColor={Colors.textLabel}
          style={[styles.stInputTime, { marginRight: Dimension.margin }]}
          multiline
          styleInput={styles.stInput}
          textDisable={styles.textDisable}
          onChangeText={onChangeText}
          value={refDataBook.current[BookAppointmentKey.DateChoose]}
        />
        <InputView
          id={ActionKey.NextToChooseTime}
          onPress={handleOnPress}
          editable={false}
          isShowClean={false}
          iconRightName={"ic-time-clock"}
          iconRighSize={Dimension.sizeIcon20}
          iconRightColor={Colors.textLabel}
          isShowLabel={true}
          label={
            <Text>
              <Text style={{ color: "red" }}>*</Text>{" Giờ khám"}
            </Text>
          }
          isLableTick={true}
          placeholder={"Chọn giờ khám..."}
          placeholderTextColor={Colors.textLabel}
          style={[styles.stInputTime, { marginLeft: Dimension.margin }]}
          styleInput={styles.stInput}
          textDisable={styles.textDisable}
          multiline
          // numberOfLines={1}
          value={refDataBook.current[BookAppointmentKey.TimeDisPlay]}
          onChangeText={onChangeText}
        />
      </View>
      <InputView
        maxLength={1000}
        id={BookAppointmentKey.MedicalReason}
        // isShowLabel
        offsetLabel={-15}
        label={
          <Text>
            <Text style={{ color: "red" }}>*</Text>{" Lý do khám"}
          </Text>
        }
        isLableTick={true}
        placeholder={"Nhập lý do khám..."}
        labelError={"Bạn cần nhập lý do khám!"}
        onCausedError={onCausedError}
        placeholderTextColor={Colors.textLabel}
        style={[styles.stInputReason, { borderBottomWidth: 0 }]}
        height={110}
        multiline
        value={refDataBook.current[BookAppointmentKey.MedicalReason]}
        styleInput={[styles.stInput, {
          // height: 90,
          borderBottomColor: Colors.colorBg2,
          borderBottomWidth: 0.75,
        }]}
        onChangeText={onChangeText}
      />

      <InputView
        id={ActionKey.ShowPopupMedicalServices}
        onPress={handleOnPress}
        isShowLabel={true}
        editable={false}
        isShowClean={false}
        iconRightName={"ic-arrow-down"}
        iconRighSize={Dimension.sizeIcon20}
        iconRightColor={Colors.colorMain}
        label={
          <Text>
            <Text style={{ color: "red" }}>*</Text>{" Dịch vụ khám"}
          </Text>
        }
        isLableTick={true}
        placeholder={"Chọn Dịch vụ khám..."}
        placeholderTextColor={Colors.textLabel}

        style={styles.stInputTime}
        multiline
        styleInput={styles.stInput}
        textDisable={styles.textDisable}
        onChangeText={onChangeText}
        value={refDataBook.current[BookAppointmentKey.MedicalServiceName]}
      />
      <View style={[styles.stRowSelectbox]}>
        <Text style={styles.stTitleButton}>{"Sử dụng BHYT"}</Text>
        <TextView
          id={BookAppointmentKey.HaveHealthInsuranceYes}
          onPress={handleOnPress}
          nameIconLeft={
            isHaveHealthInsurance ? "radiobox-marked" : "radiobox-blank"
          }
          typeIconLeft={IconViewType.MaterialCommunityIcons}
          colorIconLeft={Colors.colorMain}
          sizeIconLeft={Dimension.sizeIcon}
          style={{ flex: 1, marginRight: 6 }}
          styleContainerText={styles.stContainCheckbox}
          styleValue={styles.stValueButton}
          value={"Có"}
        />
        <TextView
          id={BookAppointmentKey.HaveHealthInsuranceNo}
          onPress={handleOnPress}
          nameIconLeft={
            isHaveHealthInsurance ? "radiobox-blank" : "radiobox-marked"
          }
          typeIconLeft={IconViewType.MaterialCommunityIcons}
          colorIconLeft={Colors.colorMain}
          sizeIconLeft={Dimension.sizeIcon}
          style={{ flex: 1, justifyContent: "center" }}
          styleContainerText={styles.stContainCheckbox}
          styleValue={styles.stValueButton}
          value={"Không"}
        />
      </View>
      <View style={styles.stRowSelectbox}>
        <Text style={styles.stTitleButton}>{"Tái khám"}</Text>
        <TextView
          id={BookAppointmentKey.IsReExaminationYes}
          onPress={handleOnPress}
          nameIconLeft={isReExamination ? "radiobox-marked" : "radiobox-blank"}
          typeIconLeft={IconViewType.MaterialCommunityIcons}
          sizeIconLeft={Dimension.sizeIcon}
          colorIconLeft={Colors.colorMain}
          style={{ flex: 1 }}
          styleContainerText={styles.stContainCheckbox}
          styleValue={styles.stValueButton}
          value={"Có"}
        />
        <TextView
          id={BookAppointmentKey.IsReExaminationNo}
          onPress={handleOnPress}
          nameIconLeft={isReExamination ? "radiobox-blank" : "radiobox-marked"}
          typeIconLeft={IconViewType.MaterialCommunityIcons}
          sizeIconLeft={Dimension.sizeIcon}
          colorIconLeft={Colors.colorMain}
          style={{
            flex: 1,
            justifyContent: "center",
          }}
          styleContainerText={styles.stContainCheckbox}
          styleValue={styles.stValueButton}
          value={"Không"}
        />
      </View>
      {/* <InputView
        onPress={handleOnPress}
        id={ActionKey.ShowHealthInsuranceCode}
        isShowLabel={true}
        editable={false}
        isShowClean={false}
        iconRightName={"ic-arrow-down"}
        iconRighSize={Dimension.sizeIcon20}
        iconRightColor={Colors.colorMain}
        label={"Mã lần khám cũ"}
        placeholder={"Chọn Mã lần khám cũ..."}
        placeholderTextColor={"gray"}
        style={styles.stInputTime}
        multiline
        styleInput={styles.stInput}
        textDisable={styles.textDisable}
        onChangeText={onChangeText}
        value={refDataBook.current[BookAppointmentKey.HealthInsuranceCode]}
      /> */}

      {isReExamination && <View style={[styles.stButtonSelectbox, {
        zIndex: 1
      }]}>
        <Text style={styles.styleTextMaLanKham}>
          <Text style={{ fontSize: 10, color: "red" }}>{"*"}</Text>{" Mã lần tái khám: "}
        </Text>
        <Autocomplete
          autoCapitalize="none"
          autoCorrect={false}
          containerStyle={styles.autocompleteContainer}
          inputContainerStyle={styles.inputContainerStyle}
          listContainerStyle={{
            backgroundColor: "#f2f2f2",
            // paddingTop: 12,
            borderRadius: 12,
          }}
          listStyle={{
            borderWidth: 0,
            backgroundColor: "#f2f2f2",
          }}
          data={filteredCodePatient}
          defaultValue={textRecordCode}
          onChangeText={(text) => findDataCodePatient(text)}
          placeholder="Mã lần tái khám"
          renderItem={renderItemSelectCodePatient}
        />
      </View>}

      <ButtonView
        title={"Tôi đồng ý"}
        disabled={!isValid}
        onPress={handleAgree}
        style={styles.stButtonSend}
      />
    </ScreensView>
  );
}
