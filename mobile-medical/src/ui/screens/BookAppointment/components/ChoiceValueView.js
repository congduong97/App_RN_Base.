import React, { useCallback } from "react";
import { Dimensions, FlatList, StyleSheet, Text } from "react-native";
import { useSelector } from "react-redux";
import { Colors, Dimension, Fonts, fontsValue } from "../../../../commons";
import { TextView } from "../../../../components";
import { IconViewType } from "../../../../components/IconView";
import models, { BookAppointmentKey } from "../../../../models";
import ActionKey from "../ActionKey";
import API from "../../../../networking";
const renderItem = ({ index, item, onPress }) => {
  const isChecked = item?.isChecked;
  const colorText = isChecked ? Colors.colorTextMenu : Colors.colorTitleScreen;
  const handleOnPress = () => {
    onPress && onPress({ index: index, data: item });
  };
  return (
    <TextView
      onPress={handleOnPress}
      // nameIconLeft={"ic-pin"}
      // colorIconLeft={isChecked ? Colors.colorMain : Colors.colorTitleScreen}
      // sizeIconLeft={Dimension.sizeIcon}
      nameIconRight={isChecked && "check-circle"}
      typeIconRight={IconViewType.MaterialCommunityIcons}
      sizeIconRight={fontsValue(20)}
      colorIconRight={Colors.colorMain}
      style={styles.stContainsItem}
      value={item?.name}
      styleContainerText={styles.styContainText}
      styleValue={[
        styles.stTextItem,
        { color: colorText, fontWeight: isChecked ? "700" : "400" },
      ]}
    />
  );
};

export default function ChoiceValueView(props) {
  const { typeDialog, refDialog, onPress, dataSelected } = props;
  const { medicalSpecial } = useSelector(
    (state) => state.MakeAppointmentReducer
  );
  let titleDialog = "";
  let dataDialog = [];
  if (typeDialog === ActionKey.ShowPoupHeathFacilities) {
    titleDialog = "Chọn cơ sở y tế khám";
    dataDialog = models.getListHealthFacilities();
    dataDialog.forEach(
      (item) =>
      (item.isChecked =
        item.id === dataSelected?.[BookAppointmentKey.HealthFacilityId]
          ? true
          : false)
    );
  } else if (typeDialog === ActionKey.ShowPopupMedicalServices) {
    titleDialog = "Chọn dịch vụ khám";
    dataDialog = props.dataAll || [];
    // dataDialog = models.getMedicalServices();
    // console.log("dataDialog:   ", dataDialog)
    dataDialog.forEach(
      (item) =>
        (item.isChecked =
          item.id === dataSelected[BookAppointmentKey.MedicalServiceId]
            ? true
            : false)
    );
  } else if (typeDialog === ActionKey.ShowPopupMedicalSpecialist) {
    titleDialog = "Chọn Chuyên khoa khám";
    dataDialog = props.dataAll || [];
    dataDialog.forEach(
      (item) =>
      (item.isChecked =
        item.id === dataSelected[BookAppointmentKey.medicalSpecialityId]
          ? true
          : false)
    );
  } else if (typeDialog === ActionKey.ShowPopupClinic) {
    titleDialog = "Chọn Phòng khám";
    dataDialog = props.dataAll || [];
    dataDialog.forEach(
      (item) =>
      (item.isChecked =
        item.id === dataSelected[BookAppointmentKey.ClinicsId]
          ? true
          : false)
    );
  }

  const onSelectedItem = ({ index, data }) => {
    onPress && onPress({ id: typeDialog, data });
    refDialog.hideDialog();
  };

  const renderItemCall = useCallback(({ item, index }) =>
    renderItem({
      item,
      index,
      onPress: onSelectedItem,
    })
  );

  return (
    <>
      <Text style={styles.stTextTitleDialog}>{titleDialog}</Text>
      <FlatList
        style={{ marginBottom: fontsValue(35), maxHeight: Dimensions.get('window').height / 2 }}
        data={dataDialog}
        renderItem={renderItemCall}
        keyExtractor={(item) => item.id.toString()}
        numColumns={1}
      />
    </>
  );
}

const styles = StyleSheet.create({
  stContainsItem: {
    padding: Dimension.padding2x,
    flexDirection: "row",
    alignItems: "center",
  },

  stTextTitleDialog: {
    marginBottom: Dimension.margin2x,
    color: Colors.colorTextMenu,
    fontSize: Dimension.fontSizeHeader,
    fontFamily: Fonts.SFProDisplayRegular,
    // fontWeight: "bold",
    textAlign: "center",
    letterSpacing: -fontsValue(0.3),
    marginTop: fontsValue(20),
  },

  styContainText: {
    marginLeft: Dimension.margin5,
    flex: 1,
  },

  stTextItem: {
    color: Colors.colorTitleScreen,
    fontSize: Dimension.fontSizeMenu,
    fontFamily: Fonts.SFProDisplayRegular,
  },
});
