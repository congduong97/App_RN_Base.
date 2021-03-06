import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ScreensView, ButtonView, InputView } from "../../../components";
import { useApp, useMergeState } from "../../../AppProvider";
import AppNavigate from "../../../navigations/AppNavigate";
import ActionKey from "../BookAppointment/ActionKey";
import {
  ImagesUrl,
  Colors,
  Dimension,
  Fonts,
  SCREEN_WIDTH,
  fontsValue,
} from "../../../commons";
import styles from "./styles";
import ChoiceValueView from "../BookAppointment/components/ChoiceValueView";

export default function ExaminationResultsScreen(props) {
  const navigation = useNavigation();
  const [stateScreen, setStateScreen] = useMergeState({
    heathFacility: {},
    patientRecord: {},
  });
  const { refDialog } = useApp();

  const { heathFacility, patientRecord } = stateScreen;

  const handleOnPress = ({ id, data }) => {
    if (id === "TypePatientRecord") {
      AppNavigate.navigateToRegulationsExaminationScreen(navigation.dispatch, {
        typeScreen: 2,
        onResponseResult: onChangePatientRecord,
      });
      // AppNavigate.navigateToPatientRecords(navigation.dispatch, {
      //   typeScreen: 2,
      //   onResponseResult: onChangePatientRecord,
      // });
    } else if (id === ActionKey.ShowPoupHeathFacilities) {
      setStateScreen({ heathFacility: data });
    } else if (id === "TypeHeathFacility") {
      showDialog();
    }
  };

  const onChangePatientRecord = ({ data }) => {
    setStateScreen({ patientRecord: data });
  };
  const onChangeText = () => {};
  const handleAgree = () => {};

  //////

  const showDialog = () => {
    refDialog?.current &&
      refDialog.current
        .configsDialog({
          // visibleClose: true,
          isScroll: true,
        })
        .drawContents(
          <ChoiceValueView
            dataSelected={heathFacility}
            typeDialog={ActionKey.ShowPoupHeathFacilities}
            refDialog={refDialog.current}
            onPress={handleOnPress}
          />
        )
        .visibleDialog();
  };

  return (
    <ScreensView
      titleScreen={"Tra c???u k???t qu??? kh??m"}
      styleContent={styles.styleContent}
      renderFooter={
        <ButtonView
          // disabled={!dataSelected?.id}
          title={"Ti???p t???c"}
          onPress={handleAgree}
          style={{ marginBottom: 20, marginHorizontal: 15 }}
        />
      }
    >
      <Image
        source={ImagesUrl.imHospitals}
        style={{
          width: fontsValue(SCREEN_WIDTH - 220),
          alignSelf: "center",
          marginVertical: fontsValue(12),
          resizeMode: "contain",
        }}
      />
      <Text style={styles.stylesText}>
        {
          "Vui l??ng cung c???p  ????? tra c???u k???t qu??? kh??m b???nh, n???u b???n kh??ng nh??? m?? b???nh nh??n c???a m??nh, vui l??ng li??n h??? c?? quan y t??? ????? ???????c tr??? gi??p!"
        }
      </Text>
      <InputView
        id={"TypePatientRecord"}
        onPress={handleOnPress}
        isShowLabel={true}
        editable={false}
        isShowClean={false}
        iconRightName={"ic-arrow-down"}
        iconRighSize={Dimension.sizeIcon20}
        iconRightColor={Colors.colorMain}
        label={"M?? b???nh nh??n"}
        placeholder={"Ch???n m?? b???nh nh??n..."}
        placeholderTextColor={"gray"}
        style={styles.stInputTime}
        // multiline
        styleInput={styles.stInput}
        textDisable={styles.textDisable}
        onChangeText={onChangeText}
        value={patientRecord?.patientRecordCode}
      />
      <InputView
        id={"TypePatientRecord"}
        onPress={handleOnPress}
        isShowLabel={true}
        editable={false}
        isShowClean={false}
        iconRightName={"ic-arrow-down"}
        iconRighSize={Dimension.sizeIcon20}
        iconRightColor={Colors.colorMain}
        label={"H??? t??n b???nh nh??n"}
        placeholder={"Nh???p h??? t??n b???nh nh??n..."}
        placeholderTextColor={"gray"}
        style={styles.stInputTime}
        // multiline
        styleInput={styles.stInput}
        textDisable={styles.textDisable}
        onChangeText={onChangeText}
        value={patientRecord?.name}
      />
      <InputView
        onPress={handleOnPress}
        id={"TypeHeathFacility"}
        isShowLabel={true}
        editable={false}
        isShowClean={false}
        iconRightName={"ic-arrow-down"}
        iconRighSize={Dimension.sizeIcon20}
        iconRightColor={Colors.colorMain}
        label={"Ch???n c?? s??? y t???"}
        placeholder={"Ch???n c?? s??? y t???..."}
        placeholderTextColor={"gray"}
        style={styles.stInputTime}
        styleInput={styles.stInput}
        textDisable={styles.textDisable}
        onChangeText={onChangeText}
        value={heathFacility?.name}
      />
    </ScreensView>
  );
}
