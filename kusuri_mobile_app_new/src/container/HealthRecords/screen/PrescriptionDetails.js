//Libabry:
import React, { Component } from "react";
import {
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  BackHandler,
  Alert,
} from "react-native";
import NavigationActions from "react-navigation/src/NavigationActions";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

//Setup:
import { Api } from "../util/api";
import { SIZE } from "../../../const/size";
import { STRING_VALIDATE, TYPE_MODAL } from "../util/constant";
import { COLOR_GRAY_LIGHT } from "../../../const/Color";

//Component:
import ModalConfirm from "../item/ModalConfirm";
import ButtonConfirm from "../item/ButtonConfirm";
import UserHeaderSelect from "../item/UserHeaderSelect";
import ModalScannerQRSuccess from "../item/ModalScannerQRSuccess";
import FormPharmacyHospital from "../item/FormPharmacyHospital";
import FormInputCarefulMedicine from "../item/FormInputCarefulMedicine";
import { HeaderIconLeft, Loading, NetworkError } from "../../../commons";
import FormClinicalSciencesDepartment from "../item/FormClinicalSciencesDepartment";

//Services:
import { UserService } from "../util/UserService";
import ServicesDataDto from "../util/ServicesDataDto";
import NavigationService from "../../../service/NavigationService";

export default class PrescriptionDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataScannerQRCode: {},
      hideButtonRemove: true,
      navigationAction: "",
      loading: "",
      error: "",
    };
  }

  componentDidMount() {
    const { params } = this.props.navigation.state;
    console.log("checkActionNavigateScreen>>>>>", params);
    this.checkActionNavigateScreen();
    BackHandler.addEventListener("hardwareBackPress", this.backAction);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.backAction);
  }

  backAction = () => {
    this.checkGoBackScreenRemovePrescriptionsDetail();
    return true;
  };

  //Check navigation navigate form QR_REGISTER or LIST_REGISTER_MEDICINE show modal ModalScannerQRSuccess.
  checkActionNavigateScreen = () => {
    const { params } = this.props.navigation.state;
    let navigationAction = params?.navigationAction;
    this.setState({ navigationAction: navigationAction });

    if (navigationAction && navigationAction == "QR_REGISTER") {
      this.ModalScannerQRSuccess && this.ModalScannerQRSuccess.openModal();
    }

    if (navigationAction && navigationAction == "LIST_REGISTER_MEDICINE") {
      this.getPrescriptionsDetailAPI();
    }
  };

  //Get detail Prescriptions API:
  getPrescriptionsDetailAPI = async () => {
    const { params } = this.props.navigation.state;
    this.state.loading = true;
    const currentUser = UserService.getListUser().currentUser;
    const response = await Api.getDetailMedicine(
      currentUser.id,
      params?.medicateId
    );
    console.log("%c Chi tiết đơn thuốc:", "color:red", response);
    if (response && response.code == 200 && response.res.status.code === 1000) {
      ServicesDataDto.set(response.res.data);
      this.setState({ hideButtonRemove: false, loading: false });
    } else {
      this.setState({ hideButtonRemove: true, loading: false, error: true });
    }
  };

  //Get list img:
  getListImage = (dataDto) => {
    let arrImage = [];
    let medicateInfoDto = dataDto?.medicateInfoDto;
    let rpClusterDto = medicateInfoDto?.rpClusterDto;
    if (Array.isArray(rpClusterDto) && rpClusterDto.length > 0) {
      rpClusterDto.forEach((item) => {
        let arrMapRpDto = Object.values(item.mapRpDto);
        if (Array.isArray(arrMapRpDto) && arrMapRpDto.length > 0) {
          arrMapRpDto.forEach((itemMapRpDto) => {
            let p201_drugInfos = itemMapRpDto.p201_drugInfos;
            p201_drugInfos.forEach((itemP201) => {
              if (!!itemP201.imageUrl && itemP201.imageUrl.length) {
                arrImage.push(itemP201.imageUrl);
              }
            });
          });
        }
      });
    }
    return arrImage;
  };

  //Call API save data:
  saveDataPrescriptionDetail = async () => {
    let dataDto = ServicesDataDto.get();
    console.log("%c DataDto Call API:", "color:green", dataDto);
    if (dataDto.deleteRecordInfo) {
      dataDto.deleteRecordInfo.medicateInfoId =
        dataDto.medicateInfoDto?.p5_medicateInfo?.id;
    }
    let arrImage = this.getListImage(dataDto);
    const currentUser = UserService.getListUser().currentUser;
    const patientId = currentUser.id;
    const response = await Api.saveFileCsvQrCodeAPI(
      dataDto,
      patientId,
      arrImage
    );
    if (response && response.code == 200 && response.res.status.code == 1000) {
      this.props.navigation.navigate("NOTIFICATION_SUCCESS");
    } else {
      Alert.alert(STRING_VALIDATE.Register_Prescription_Error);
    }
  };

  //Remove prescription in DB: (Case Prescription Register Success!)
  removePrescription = async () => {
    let dataDto = ServicesDataDto.get();
    const currentUser = UserService.getListUser().currentUser;
    const patientId = currentUser?.id;
    let medicateInfoId = dataDto?.medicateInfoDto?.p5_medicateInfo?.id;
    let deleteRecord = {
      medicateInfoId,
      deleteMedicateInfo: true,
    };
    dataDto = {
      deleteRecordInfo: deleteRecord,
      medicateInfoDto: null,
    };
    const response = await Api.saveFileCsvQrCodeAPI(dataDto, patientId, []);
    if (response && response.code == 200 && response.res.status.code == 1000) {
      let arrayScreen = [
        NavigationActions.navigate({ routeName: "HOME" }),
        NavigationActions.navigate({ routeName: "HEALTH_RECORD" }),
        NavigationActions.navigate({ routeName: "LIST_REGISTER_MEDICINE" }),
      ];
      NavigationService.reset(2, arrayScreen);
    } else {
      Alert.alert(STRING_VALIDATE.Register_Prescription_Error);
    }
  };

  renderButtonRemove = () => {
    const { hideButtonRemove } = this.state;
    return (
      <View
        style={{
          minHeight: !hideButtonRemove ? SIZE.height(5) : SIZE.height(3),
          width: SIZE.width(100),
          justifyContent: "center",
        }}
      >
        {!hideButtonRemove && (
          <TouchableOpacity
            onPress={() => {
              this.refModalConfirmDelete.handleVisible();
            }}
            style={{
              height: SIZE.height(5),
              width: 50,
              position: "absolute",
              right: SIZE.width(3),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: SIZE.H5 * 1.1,
                fontWeight: "bold",
                color: "red",
              }}
            >
              削除
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  renderContent = () => {
    const { navigation } = this.props;
    const checkNavigate = this.props.navigation.state.params;
    const { loading, navigationAction, error } = this.state;
    console.log("navigationAction ", navigationAction);

    if (loading) {
      return (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loading />
        </View>
      );
    }
    if (error) {
      return (
        <NetworkError
          onPress={() => {
            this.getPrescriptionsDetailAPI();
          }}
        />
      );
    }
    return (
      <>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps={"always"}
          extraHeight={6}
          extraScrollHeight={6}
          enableOnAndroid
          style={{ height: SIZE.height(50) }}
        >
          <ScrollView style={{ backgroundColor: "#F2F2F2" }}>
            {this.renderButtonRemove()}
            <FormPharmacyHospital navigation={navigation} />
            <FormClinicalSciencesDepartment
              navigationAction={navigationAction}
              navigation={navigation}
              checkNavigate={checkNavigate}
            />
            <View
              style={{
                height: SIZE.height(10),
                width: SIZE.width(92),
                marginLeft: SIZE.width(4),
                backgroundColor: "white",
                borderRadius: SIZE.width(2),
                alignItems: "center",
                justifyContent: "center",
                marginVertical: SIZE.height(2),
              }}
            >
              {!error && (
                <TouchableOpacity
                  onPress={() => {
                    navigation.push("REGISTER_MANUAL_MEDICINE");
                  }}
                  style={{
                    height: SIZE.height(7.5),
                    width: SIZE.width(88),
                    borderRadius: SIZE.width(2),
                    borderStyle: "dotted",
                    borderWidth: SIZE.width(0.5),
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "black",
                      fontWeight: "bold",
                      fontSize: SIZE.H4,
                    }}
                  >
                    ＋ 診療科・お薬を追加する
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <FormInputCarefulMedicine
              checkNavigate={checkNavigate}
              navigation={navigation}
              onRef={(ref) => {
                this.FormInputCarefulMedicine = ref;
              }}
            />
          </ScrollView>
        </KeyboardAwareScrollView>
      </>
    );
  };

  //Show popup remove current prescriptions when go back:
  checkGoBackScreenRemovePrescriptionsDetail = () => {
    const { navigationAction } = this.props.navigation.state.params;
    const { goBack } = this.props.navigation;
    this.refModalConfirm.handleVisible();
  };

  render() {
    const { navigation } = this.props;
    const { goBack } = navigation;
    const { error } = this.state;
    const checkNavigate = this.props.navigation.state.params;
    console.log(
      "this.props.navigation.state.params",
      this.props.navigation.state.params
    );

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar backgroundColor={COLOR_GRAY_LIGHT} barStyle="dark-content" />
        <HeaderIconLeft
          goBack={this.checkGoBackScreenRemovePrescriptionsDetail}
        />
        <UserHeaderSelect navigation={this.props.navigation} />
        {this.renderContent()}
        {!error && (
          <ButtonConfirm
            textButton={"更新する"}
            styleButton={{ marginHorizontal: 15, marginBottom: 15 }}
            onPress={this.saveDataPrescriptionDetail}
            timeOut={1000}
            styleTextButton={{ fontWeight: "bold" }}
          />
        )}
        <ModalScannerQRSuccess
          onRef={(ref) => {
            this.ModalScannerQRSuccess = ref;
          }}
        />
        <ModalConfirm
          onRef={(ref) => {
            this.refModalConfirmDelete = ref;
          }}
          type={TYPE_MODAL.DELETE}
          title={"お薬情報"}
          onPressConfirm={() => {
            this.removePrescription();
          }}
        />
        <ModalConfirm
          onRef={(ref) => {
            this.refModalConfirm = ref;
          }}
          type={TYPE_MODAL.CONFIRM}
          onPressConfirm={() => {
            // if(checkNavigate)
            let arrayScreen = [
              NavigationActions.navigate({ routeName: "HOME" }),
              NavigationActions.navigate({ routeName: "HEALTH_RECORD" }),
              NavigationActions.navigate({
                routeName: "LIST_REGISTER_MEDICINE",
              }),
            ];
            NavigationService.reset(2, arrayScreen);
          }}
        />
      </SafeAreaView>
    );
  }
}
