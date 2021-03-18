import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useApp, useMergeState } from "../../../AppProvider";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  Alert
} from "react-native";
import {
  Colors,
  Dimension,
  Fonts,
  ImagesUrl,
  validateImageUri,
} from "../../../commons";
import {
  ScreensView,
  InputView,
  TextView,
  ButtonView,
} from "../../../components";
import styles from "./styles";
import ActionKey from "./ActionKey";
import ChoiceValueView from "./component/ChoiceValueView";
import AppNavigate from "../../../navigations/AppNavigate";
import Autocomplete from "react-native-autocomplete-input";
import models from "../../../models";
import actions from "../../../redux/actions";
import API from "../../../networking";
import Toast from "react-native-simple-toast";
const { width, height } = Dimensions.get("window");

// const imageUrl = validateImageUri(imgPath, ImagesUrl.imgeHospitalDefault);
const TypePatientCode = "TypePatientCode";
const TypePatientName = "TypePatientName";
const TypeDoctorAppointmentCode = "TypeDoctorAppointmentCode";

export default function ExaminationResultsScreen(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { refDialog } = useApp();

  const [stateScreen, setStateScreen] = useMergeState({
    dataMedicalFacility: {},
    dataCoSoYTe: [],
    dataMedicalResults: [],
    textRecordCode: "",
    textRecordName: "",
    //search mã bệnh nhân
    dataCodePatient: [],
    filteredCodePatient: [],
    filteredNamePatient: [],
  });
  const {
    dataMedicalFacility,
    dataCoSoYTe,
    dataCodePatient,
    filteredCodePatient,
    textRecordCode,
    textRecordName,
    filteredNamePatient,
  } = stateScreen;

  useEffect(() => {
    getCoSoYTe();
  }, []);

  const getCoSoYTe = async () => {
    dispatch(actions.showLoading());
    let dataCoSoYTe = await API.getCoSoYTe(dispatch, {
      // appointmentOption: 1,
    });
    let dataMedicalResults = await API.responsesDataMediacalResults(dispatch, {
      healthFacilityId: dataCoSoYTe[0]?.config?.healthFacilitiesId,
      isLoadding: true,
    });
    console.log("dataMedicalResults:    ", dataMedicalResults);
    setStateScreen({
      dataMedicalFacility: dataCoSoYTe[0],
      dataCodePatient: dataMedicalResults,
      dataCoSoYTe: dataCoSoYTe,
    });
    dispatch(actions.hideLoading());
  };

  const handleOnPress = ({ id }) => {
    switch (id) {
      case ActionKey.ShowChooseAMedicalFacility:
        showDialog(
          id,
          dataMedicalFacility ? dataMedicalFacility : {},
          dataCoSoYTe
        );
        break;
      case ActionKey.idPatientCode:
        AppNavigate.navigateToSearchFitterCodePatientScreen(
          navigation.dispatch
        );
        break;
    }
  };

  const getMedicalResultsSuggestion = async (data) => {
    let dataMedicalResults = await API.responsesDataMediacalResults(dispatch, {
      healthFacilityId: data?.config?.healthFacilitiesId,
    });
    // console.log(dataMedicalResults);
    setStateScreen({
      dataCodePatient: dataMedicalResults,
      textRecordCode: "",
      textRecordName: "",
      dataMedicalFacility: data,
    });
  };

  const handleSelected = ({ id, data }) => {
    switch (id) {
      case ActionKey.ShowChooseAMedicalFacility:
        // setDataMedicalFacility(data);
        getMedicalResultsSuggestion(data);
        break;
    }
  };

  const showDialog = (typeDialog, itemSelect, data) => {
    refDialog?.current &&
      refDialog.current
        .configsDialog({
          visibleClose: true,
          isScroll: true,
        })
        .drawContents(
          <ChoiceValueView
            typeDialog={typeDialog}
            refDialog={refDialog.current}
            onPress={handleSelected}
            itemSelect={itemSelect}
            data={data}
          />
        )
        .visibleDialog();
  };

  const responseDoctorAppointment = async (params) => {
    let data = await API.responseDoctorAppointment(dispatch, params);
    // let arrayDoctorAppointmentCode = await API.responsePatientRecord(dispatch, data.patientRecordId);
    // if (data && data.phone) {
    if (data) {
      // data.doctorAppointmentCode = arrayDoctorAppointmentCode && arrayDoctorAppointmentCode[0] ? arrayDoctorAppointmentCode[0] : ''
      // AppNavigate.navigateToVerifyPhoneScreen(navigation.dispatch, { data: data });

      // AppNavigate.navigateToResultPatient(navigation.dispatch, { data: data })
      AppNavigate.navigateToResultPatient(navigation.dispatch, { data: data });
      // AppNavigate.navigateToExaminationResultsSearch(navigation.dispatch, { data: data })
    }
    else {
      // Toast.showWithGravity(
      //   "Mã bệnh nhân hoặc họ trên bệnh nhân không tồn tại. Vui lòng kiểm tra lại",
      //   Toast.LONG,
      //   Toast.CENTER
      // );
      setTimeout(() => {
        Alert.alert("Tra cứu kết quả khám", "Mã bệnh nhân hoặc họ tên bệnh nhân không tồn tại. Vui lòng kiểm tra lại", [{ text: "Đồng ý" }]);
      }, 700);
    }
  };

  const handleAgree = () => {
    if (!dataMedicalFacility?.id) {
      Toast.showWithGravity(
        "Bạn phải chọn cơ sở y tế",
        Toast.LONG,
        Toast.CENTER
      );
    } else if (!textRecordCode || !textRecordCode.trim()) {
      Toast.showWithGravity(
        "Bạn không được để trống mã bệnh nhân",
        Toast.LONG,
        Toast.CENTER
      );
    } else if (!textRecordName || !textRecordName.trim()) {
      Toast.showWithGravity(
        "Bạn không được để trống tên bệnh nhân",
        Toast.LONG,
        Toast.CENTER
      );
    } else {
      let params = {
        healthFacilityId: dataMedicalFacility.id,
        patientRecordCode: textRecordCode,
        patientRecordName: textRecordName,
      };
      responseDoctorAppointment(params);
      // AppNavigate.navigateToVerifyPhoneScreen(navigation.dispatch);
    }
  };

  const findDataCodePatient = (query, isSearchNamePatient = false) => {
    if (query) {
      const regex = new RegExp(`${query.trim()}`, "i");
      if (isSearchNamePatient) {
        setStateScreen({
          filteredNamePatient: dataCodePatient.filter(
            (film) => film.patientName.search(regex) >= 0
          ),
          textRecordName: query,
        });
      } else {
        setStateScreen({
          filteredCodePatient: dataCodePatient.filter(
            (film) => film.patientCode.search(regex) >= 0
          ),
          textRecordCode: query,
        });
      }
    } else {
      if (isSearchNamePatient) {
        setStateScreen({
          filteredCodePatient: [],
          textRecordName: query,
        });
      } else {
        setStateScreen({
          filteredCodePatient: [],
          textRecordCode: query,
        });
      }
    }
  };

  const onSelectCodePatient = (item) => {
    setStateScreen({
      textRecordName: item.patientName,
      textRecordCode: item.patientCode,
      filteredNamePatient: [],
      filteredCodePatient: [],
    });
  };

  const renderItemSelectCodePatient = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.viewSelectItemCodePatient,
        { borderTopWidth: index === 0 ? 0 : 0.5, zIndex: 1 },
      ]}
      onPress={() => onSelectCodePatient(item)}
    >
      <Text style={[styles.stValueButton, { marginLeft: 8, marginTop: 0 }]}>
        {item.patientName ? item.patientName + " - " : ""}
      </Text>

      <Text style={[styles.itemText]}>{"(Mã: " + item.patientCode + ")"}</Text>
    </TouchableOpacity>
  );

  return (
    <ScreensView
      styleContent={{ paddingHorizontal: 12 }}
      titleScreen={"Tra cứu kết quả khám"}
      renderFooter={
        <ButtonView
          title={"Tiếp tục"}
          onPress={handleAgree}
          style={{ marginBottom: 20, marginHorizontal: 15 }}
        />
      }
    >
      <Image
        source={require("../../../../assets/images/imHospitals.png")}
        style={{
          height: height / 4,
          resizeMode: "contain",
          alignSelf: "center",
        }}
      />

      <Text
        style={[
          styles.styleText,
          { textAlign: "center", color: Colors.textLabel },
        ]}
      >
        Vui lòng cung cấp để tra cứu kết quả khám bệnh, nếu bạn không nhớ mã
        bệnh nhân của mình, vui lòng liên hệ cơ quan y tế để được trợ giúp
      </Text>

      <View style={{ position: "relative", paddingBottom: 40 }}>

        <TextView
          id={ActionKey.ShowChooseAMedicalFacility}
          onPress={handleOnPress}
          nameIconRight={"ic-arrow-down"}
          sizeIconRight={Dimension.sizeIcon20}
          styleIconRight={{ alignSelf: "flex-end", marginBottom: 4 }}
          style={[styles.stButtonSelectbox]}
          styleContainerText={styles.stContainButton}
          styleTitle={styles.stTitleButton}
          styleValue={styles.stValueButton}
          title={
            <Text>
              {"Chọn cơ sở y tế khám:"}{" "}
              <Text style={{ fontSize: 10, color: "red" }}>{"(*)"}</Text>
            </Text>
          }
          value={
            dataMedicalFacility && dataMedicalFacility.name
              ? dataMedicalFacility.name
              : ""
          }
        />

        <View style={[styles.stButtonSelectbox]}>
          <Text style={styles.stTitleButton}>
            {"Mã bệnh nhân"}{" "}
            <Text style={{ fontSize: 10, color: "red" }}>{"(*)"}</Text>
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
              position: 'relative'
            }}
            data={filteredCodePatient}
            defaultValue={textRecordCode}
            onChangeText={(text) => findDataCodePatient(text)}
            placeholder="Nhập mã bệnh nhân"
            renderItem={renderItemSelectCodePatient}
          />
        </View>

        <View style={[styles.stButtonSelectbox]}>
          <Text style={styles.stTitleButton}>
            {"Nhập tên bệnh Nhân"}{" "}
            <Text style={{ fontSize: 10, color: "red" }}>{"(*)"}</Text>
          </Text>
          <Autocomplete
            autoCapitalize="none"
            autoCorrect={false}
            // style={styles.styleViewSearch}
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
            data={filteredNamePatient}
            defaultValue={textRecordName}
            onChangeText={(text) => findDataCodePatient(text, true)}
            placeholder="Tên bệnh nhân"
            renderItem={renderItemSelectCodePatient}
          />
        </View>
      </View>
    </ScreensView>
  );
}
