import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useApp, useMergeState } from "../../../AppProvider";
import { StyleSheet, Text, View, Dimensions, Image, TouchableOpacity } from "react-native";
import { Colors, Dimension, Fonts, ImagesUrl, validateImageUri } from "../../../commons";
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
import Autocomplete from 'react-native-autocomplete-input';
import models from "../../../models";
import actions from "../../../redux/actions";
import API from "../../../networking";
const { width, height } = Dimensions.get("window");

// const imageUrl = validateImageUri(imgPath, ImagesUrl.imgeHospitalDefault);

export default function ExaminationResultsScreen(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [dataMedicalFacility, setDataMedicalFacility] = useState({});
  const [dataNamePatient, setDataNamePatient] = useState({});
  const [dataCoSoYTe, setDataCoSoYTe] = useState([]);
  const { refDialog } = useApp();

  // For Main Data
  const [dataCodePatient, setDataCodePatient] = useState([]);
  // For Filtered Data
  const [filteredCodePatient, setFilteredCodePatient] = useState([]);
  // For Selected Data
  // const [selectedValue, setSelectedValue] = useState({});
  const [stateScreen, setStateScreen] = useMergeState({
    selectedValue: {},
    textRecordCode: ""
  })
  const { selectedValue, textRecordCode } = stateScreen

  useEffect(() => {
    setDataCodePatient(models.getListPatientRecords());
    getCoSoYTe()
  }, []);

  const getCoSoYTe = async () => {
    dispatch(actions.showLoading())
    let dataCoSoYTe = await API.getCoSoYTe(dispatch, {
      "appointmentOption": 1
    });
    setDataCoSoYTe(dataCoSoYTe)
    dispatch(actions.hideLoading())
  }

  const handleOnPress = ({ id }) => {
    switch (id) {
      case ActionKey.ShowChooseAMedicalFacility:
        showDialog(id, dataMedicalFacility ? dataMedicalFacility : {}, dataCoSoYTe);
        break;
      case ActionKey.ShowChooseNamePatient:
        showDialog(id, dataNamePatient ? dataNamePatient : {});
        break;
      case ActionKey.idPatientCode:
        AppNavigate.navigateToSearchFitterCodePatientScreen(navigation.dispatch);
        break;
    }
  };

  const handleSelected = ({ id, data }) => {
    switch (id) {
      case ActionKey.ShowChooseAMedicalFacility:
        setDataMedicalFacility(data);
        break;
      case ActionKey.ShowChooseNamePatient:
        console.log("data:   ", data)
        setDataNamePatient(data);
        // setSelectedValue(item);
        setStateScreen({
          selectedValue: data,
          textRecordCode: data.patientRecordCode
        })
        setFilteredCodePatient([]);
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

  const handleAgree = () => {
    AppNavigate.navigateToVerifyPhoneScreen(navigation.dispatch);
    // if (!dataMedicalFacility || !dataMedicalFacility.areaCode) {
    //   Toast.showWithGravity(
    //     "B???n ph???i ch???n c?? s??? y t???",
    //     Toast.LONG,
    //     Toast.CENTER
    //   );
    // } else if (!textRecordCode) {
    //   Toast.showWithGravity(
    //     "B???n kh??ng ???????c ????? tr???ng m?? b???nh nh??n",
    //     Toast.LONG,
    //     Toast.CENTER
    //   );
    // } else {
    //   let params = {
    //     "healthFacilityId": dataMedicalFacility.areaCode,
    //     "patientRecordCode": textRecordCode,
    //     // "patientRecordName": "demothoi"
    //   }
    //   console.log("params:     ", params)
    //   AppNavigate.navigateToVerifyPhoneScreen(navigation.dispatch);
    // }
  };

  const findDataCodePatient = (query) => {
    setStateScreen({ textRecordCode: query })
    if (query) {
      const regex = new RegExp(`${query.trim()}`, 'i');
      setFilteredCodePatient(
        dataCodePatient.filter((film) => film.patientRecordCode.search(regex) >= 0)
      );
    } else {
      setFilteredCodePatient([]);
    }
  };

  const onSelectCodePatient = (item) => {
    setDataNamePatient(item);
    setFilteredCodePatient([]);
    setStateScreen({
      selectedValue: item,
      textRecordCode: item.patientRecordCode
    })

  }

  const renderItemSelectCodePatient = ({ item, index }) => (
    <TouchableOpacity style={[styles.viewSelectItemCodePatient, { borderTopWidth: index === 0 ? 0 : 0.5 }]}
      onPress={() => onSelectCodePatient(item)}>
      <Image
        source={validateImageUri(item.avatar, ImagesUrl.LogoApp)}
        style={{
          width: 22,
          height: 22,
          borderRadius: 11,
          marginTop: 4,
        }}
      />

      <Text style={[styles.stValueButton, { marginLeft: 8, marginTop: 0 }]}>
        {item.name ? item.name + ' - ' : ""}
      </Text>

      <Text style={[styles.itemText]}>
        {"(M??: " + item.patientRecordCode + ')'}
      </Text>
    </TouchableOpacity>
  )

  return (
    <ScreensView
      styleContent={{ paddingHorizontal: 12 }}
      titleScreen={"Tra c???u k???t qu??? kh??m"}
      renderFooter={
        <ButtonView
          title={"Ti???p t???c"}
          onPress={handleAgree}
          style={{ marginBottom: 20, marginHorizontal: 15 }}
        />
      }
    >
      <Image
        source={require("../../../../assets/images/imHospitals.png")}
        style={{
          height: height / 4,
          resizeMode: "center",
          alignSelf: "center",
        }}
      />

      <Text
        style={[
          styles.styleText,
          { textAlign: "center", color: Colors.textLabel },
        ]}
      >
        Vui l??ng cung c???p ????? tra c???u k???t qu??? kh??m b???nh, n???u b???n kh??ng nh??? m??
        b???nh nh??n c???a m??nh, vui l??ng lien h??? c?? quan y t??? ????? ???????c tr??? gi??p
      </Text>

      <View style={{ position: 'relative', paddingBottom: 40 }}>
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
          title={"Ch???n c?? s??? y t??? kh??m:"}
          value={dataMedicalFacility.name ? dataMedicalFacility.name : ""}
        />

        <View style={[styles.stButtonSelectbox]}>
          <Text
            style={styles.stTitleButton}>{'M?? b???nh nh??n'}</Text>
          <Autocomplete
            autoCapitalize="none"
            autoCorrect={false}
            containerStyle={styles.autocompleteContainer}
            inputContainerStyle={styles.inputContainerStyle}
            listContainerStyle={{
              backgroundColor: '#f2f2f2',
              // paddingTop: 12,
              borderRadius: 12
            }}
            listStyle={{
              borderWidth: 0,
              backgroundColor: '#f2f2f2'
            }}
            data={filteredCodePatient}
            defaultValue={
              textRecordCode
            }
            onChangeText={(text) => findDataCodePatient(text)}
            placeholder="M?? b???nh nh??n"
            renderItem={renderItemSelectCodePatient}
          />
        </View>

        {/* <TextView
          id={ActionKey.idPatientCode}
          onPress={handleOnPress}
          nameIconRight={"ic-arrow-down"}
          sizeIconRight={Dimension.sizeIcon20}
          styleIconRight={{ alignSelf: "flex-end", marginBottom: 4 }}
          style={[styles.stButtonSelectbox]}
          styleContainerText={styles.stContainButton}
          styleTitle={styles.stTitleButton}
          styleValue={styles.stValueButton}
          title={"M?? b???nh nh??n:"}
          value={dataMedicalFacility.name ? dataMedicalFacility.name : ""}
        /> */}

        <TextView
          id={ActionKey.ShowChooseNamePatient}
          onPress={handleOnPress}
          nameIconRight={"ic-arrow-down"}
          sizeIconRight={Dimension.sizeIcon20}
          styleIconRight={{ alignSelf: "flex-end", marginBottom: 4 }}
          style={[styles.stButtonSelectbox]}
          styleContainerText={styles.stContainButton}
          // title={"H??? t??n b???nh nh??n"}
          // value={dataNamePatient.name ? dataNamePatient.name : ''}
          children={
            <View style={{}}>
              <Text style={[styles.stTitleButton]}>{"H??? t??n b???nh nh??n"}</Text>
              <View
                style={{ flexDirection: "row", flex: 1, alignItems: "center" }}
              >
                <Image
                  source={dataNamePatient.image}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    marginTop: 4,
                  }}
                />
                <Text style={[styles.stValueButton, { marginLeft: 8 }]}>
                  {dataNamePatient.name ? dataNamePatient.name : ""}
                </Text>
              </View>
            </View>
          }
        />
      </View>
    </ScreensView>
  );
}
