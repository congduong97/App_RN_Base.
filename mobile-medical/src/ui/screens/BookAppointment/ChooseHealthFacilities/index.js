import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useRef } from "react";
import { Image, StyleSheet, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useApp } from "../../../../AppProvider";
import {
  Colors,
  Dimension,
  Fonts,
  fontsValue,
  ImagesUrl,
  NavigationKey,
  SCREEN_WIDTH,
} from "../../../../commons";
import { ButtonView, ScreensView, TextView, TouchableOpacityEx } from "../../../../components";
import models, { BookAppointmentKey } from "../../../../models";
import AppNavigate from "../../../../navigations/AppNavigate";
import API from "../../../../networking";
import actions from "../../../../redux/actions";
import { ActionSheet, ActionSheetType, PopupType } from "../../../components";
import PopupsChoiceView from './ChooseHealthFacilities'
import ChooseTypeExamination from "./ChooseTypeExamination"

const optionsDaily = {
  id: NavigationKey.NextToBookByDay,
  title: "Đăng ký khám theo ngày"
}

const optionsDoctor = {
  id: NavigationKey.NextToBookByDoctor,
  title: "Đăng ký khám theo bác sỹ"
}

export default function ChooseHealthFacilities(props) {
  const dispatch = useDispatch();
  const [dataSelected, setDataSelected] = useState();
  const [dataOptions, setDataOptions] = useState();
  const [dataHeadthFacilities, setDataHeadthFacilities] = useState();
  const navigation = useNavigation();
  const { refDialog } = useApp();
  const { actionBookType } = useSelector((state) => state.CommonsReducer);
  const isExistPatient = models.isExistPatient();
  const refActionSheet = useRef({});

  useEffect(() => {
    getDataHeadthFacilities()
    // setTimeout(() => {
    //   showDialogTypeExamination()
    // }, 500);
  }, []);

  const getDataHeadthFacilities = async (appointmentOption = 3) => {
    let data = await API.requestDataHeathFacilities(dispatch, {
      // "appointmentOption": appointmentOption
    })
    console.log("data:     ", data)
    setDataHeadthFacilities(data)
  }

  const onPressHandleAgree = async (id) => {
    dispatch(actions.resetMakeAppointData())
    if (id !== NavigationKey.Cancel) {
      dispatch(actions.showLoading());
      dispatch(actions.actionBookType(id)); // luu loai hanh dong book lich kham
      dispatch(
        actions.saveMakeAppointData({
          [BookAppointmentKey.TypeBook]:
            id === NavigationKey.NextToBookByDay ? 1 : 2, ///1: Theo ngày, 2: Theo bác sĩ
        })
      );

      // getDataHeadthFacilities(id === NavigationKey.NextToBookByDay ? 1 : 2)

      let isRequestDone = await API.getMedicalSpecialization(
        dispatch,
        dataSelected.id
      );
      dispatch(actions.hideLoading());
      if (isRequestDone) {
        let paramHeathFacilities = {
          [BookAppointmentKey.HealthFacilityId]: dataSelected.id,
          [BookAppointmentKey.HealthFacilityName]: dataSelected?.name,
          [BookAppointmentKey.HealthFacilityAddress]: dataSelected?.address,
          [BookAppointmentKey.connectWithHis]: dataSelected?.config?.connectWithHis,
          //1 cho phép thanh toán online, 2 là k
          [BookAppointmentKey.prepaymentMedicalService]: dataSelected?.config?.prepaymentMedicalService,
        };
        dispatch(actions.saveMakeAppointData(paramHeathFacilities));
        if (isExistPatient) {
          AppNavigate.navigateToPatientRecords(navigation.dispatch, {
            typeScreen: 2,
          });
        } else {
          AppNavigate.navigateToPatientRecords(navigation.dispatch, {
            typeScreen: 2,
          });
          AppNavigate.navigateToCreateRecord(navigation.dispatch);
        }
      }
    } else {
      // navigation.goBack();
    }
  }

  const handleSelected = ({ data }) => {
    console.log("data:     ", data)
    var dataOptions = []
    if (data && data.config && data.config.appointmentDaily === 1) {
      dataOptions.push(optionsDaily)
    }
    if (data && data.config && data.config.appointmentDoctor === 1) {
      dataOptions.push(optionsDoctor)
    }
    setDataOptions(dataOptions)

    setDataSelected({
      ...data,
      [BookAppointmentKey.HealthFacilityId]: data?.id,
    });
  };

  const handleAgree = async () => {
    // console.log("dataSelected?.config?.connectwithhis:    ", dataSelected?.config?.connectWithHis)
    // dispatch(actions.showLoading());
    // let isRequestDone = await API.getMedicalSpecialization(
    //   dispatch,
    //   dataSelected.id
    // );
    // if (isRequestDone) {
    //   let paramHeathFacilities = {
    //     [BookAppointmentKey.HealthFacilityId]: dataSelected.id,
    //     [BookAppointmentKey.HealthFacilityName]: dataSelected?.name,
    //     [BookAppointmentKey.HealthFacilityAddress]: dataSelected?.address,
    //     [BookAppointmentKey.connectWithHis]: dataSelected?.config?.connectWithHis,
    //   };
    //   // console.log("dataSelected?.config?.connectwithhis:    ", dataSelected?.config?.connectWithHis)
    //   // console.log("paramHeathFacilities:    ", paramHeathFacilities)
    //   dispatch(actions.saveMakeAppointData(paramHeathFacilities));
    //   dispatch(actions.hideLoading());
    //   if (isExistPatient) {
    //     AppNavigate.navigateToPatientRecords(navigation.dispatch, {
    //       typeScreen: 2,
    //     });
    //   } else {
    //     AppNavigate.navigateToCreateRecord(navigation.dispatch);
    //   }

    //luồng cũ
    // if (actionBookType === NavigationKey.NextToBookByDay) {
    //   AppNavigate.navigateToChooseBookTime(navigation.dispatch);
    // } else if (actionBookType === NavigationKey.NextToBookByDoctor) {
    //   AppNavigate.navigateToDoctorSearch(navigation.dispatch, {
    //     typeScreen: 2,
    //   });
    // }

    // }
    showDialogTypeExamination()
  };

  const showDialogTypeExamination = () => {
    refActionSheet && refActionSheet.current.open();
    // refDialog?.current &&
    //   refDialog.current
    //     .configsDialog({
    //       visibleClose: false,
    //       isScroll: true,
    //     })
    //     .drawContents(
    //       <ChooseTypeExamination
    //         dataSelected={dataSelected}
    //         refDialog={refDialog.current}
    //         onPress={onPressHandleAgree}
    //         data={dataHeadthFacilities}
    //       />
    //     )
    //     .visibleDialog();
  };

  const showDialog = () => {
    refDialog?.current &&
      refDialog.current
        .configsDialog({
          visibleClose: true,
          isScroll: true,
        })
        .drawContents(
          <PopupsChoiceView
            dataSelected={dataSelected}
            keyCheck={BookAppointmentKey.HealthFacilityId}
            typeDialog={PopupType.ShowHealthFacilities}
            refDialog={refDialog.current}
            onPress={handleSelected}
            data={dataHeadthFacilities}
          />
        )
        .visibleDialog();
  };

  return (
    <ScreensView
      titleScreen={"Chọn cơ sở y tế khám"}
      renderFooter={
        <ButtonView
          disabled={!dataSelected?.id}
          title={"Chọn"}
          onPress={handleAgree}
          style={{ marginBottom: 20, marginHorizontal: 15, borderRadius: 16 }}
        />
      }
    >
      <Image source={ImagesUrl.hospitals} style={{
        width: fontsValue(SCREEN_WIDTH - 220),
        alignSelf: "center",
        marginVertical: fontsValue(12),
        resizeMode: 'contain'
      }} />
      <Text style={styles.stylesText}>
        {
          "Đăng ký lịch khám trực tuyến giúp bạn giảm thời gian chờ đợi và để chúng tôi được phục vụ bạn tốt hơn !"
        }
      </Text>
      <TextView
        onPress={showDialog}
        nameIconRight={"ic-arrow-down"}
        sizeIconRight={Dimension.sizeIcon}
        style={styles.stButtonSelectbox}
        styleContainerText={styles.stContainButton}
        styleTitle={styles.stTitleButton}
        styleValue={styles.stValueButton}
        title={"Chọn cơ sở y tế khám"}
        value={dataSelected?.name}
      />


      <ActionSheet
        id={"file"}
        dataOptions={dataOptions}
        ref={refActionSheet}
        actionType={ActionSheetType.ChooseTypeExamination}
        onReponse={onPressHandleAgree}
      />
    </ScreensView>
  );
}

const styles = StyleSheet.create({
  stImgae: {
    marginTop: 50,
    width: SCREEN_WIDTH - 160,
    height: SCREEN_WIDTH - 160,
    alignSelf: "center",
    marginVertical: 12,
  },
  stylesText: {
    marginHorizontal: 20,
    marginTop: 16,
    color: Colors.colorTitleScreen,
    fontSize: Dimension.fontSize14,
    fontFamily: Fonts.SFProDisplayRegular,
    paddingHorizontal: 24,
    textAlign: "center",
    letterSpacing: 0.5,
  },

  stButtonSelectbox: {
    marginHorizontal: 36,
    marginTop: 16,
    // height: 56,
    borderBottomWidth: 1,
    borderBottomColor: Colors.colorBg2,
  },

  stContainButton: {
    flex: 1,
    marginBottom: 8,
  },
  stTitleButton: {
    marginTop: 8,
    color: Colors.textLabel,
    fontSize: Dimension.fontSize12,
    fontFamily: Fonts.SFProDisplayRegular,
  },
  stValueButton: {
    marginTop: 8,
    color: Colors.colorText,
    fontSize: Dimension.fontSize16,
    fontFamily: Fonts.SFProDisplaySemibold,
  },
});
