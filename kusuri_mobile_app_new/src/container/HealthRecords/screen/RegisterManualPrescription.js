//Library:
import React, { Component } from "react";
import moment from "moment";
import DatePicker from "react-native-datepicker";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Icon from "react-native-vector-icons/AntDesign";

//Setup:
import { Api } from "../util/api";
import { SIZE } from "../../../const/size";

//Component:
import { NetworkError } from "../../../commons";
import Container from "../../../commons/Container";
import { DebounceButton } from "../../../commons/DebounceButton";
import { isIOS } from "../../../const/System";
import ButtonDropdown from "../item/ButtonDropdown";

//Services:
import ServicesDataDto from "../util/ServicesDataDto";
import { STRING_VALIDATE } from "../util/constant";

export class RegisterManualPrescription extends Component {
  constructor(props) {
    super(props);

    this.state = {
      maintain: false,
      networkError: false,
      loading: false,
      isDatePickerVisible: false,
      listCity: null,
      p5_1_compoundingDate: null,
      p51_1_hospital: null,
      p11_1_pharmacy: null,
      p51_2_cityName: null,
      p51_2_cityId: null,
      p51_3_hospitalTypeValueId: null,
      p51_3_hospitalTypeValue: null,
      p51_4_institutionCode: null,
      p11_5_postalCode: null,
      p11_2_pharCityName: null,
      p11_2_pharCityId: null,
      p11_6_address: null,
      p11_7_phone: null,
      p11_3_pharTypeValueId: null,
      p11_3_pharTypeValue: null,
      p11_4_institutionPharCode: null,
      p15_1_doctorName: null,
      p15_2_doctorPhone: null,
    };

    this.inputHeight = SIZE.width(11);
    this.btnSubmit = React.createRef();
    this.hospitalType = [{ id: 1, name: "医科" }, { id: 3, name: "歯科" }];
    this.pharType = [
      { id: 1, name: "医科、" },
      { id: 3, name: "歯科、" },
      { id: 4, name: "調剤    " },
    ];
  }

  componentDidMount() {
    this.getListCity();
    const { medicateInfoDto } = ServicesDataDto.get();
    const { action } = this.props.navigation.state?.params;

    if (medicateInfoDto && action === "UPDATE") {
      this.setState({
        p5_1_compoundingDate: moment(
          new Date(medicateInfoDto.p5_medicateInfo.medicateTime)
        ).format("YYYY/MM/DD HH:mm"),
        p51_1_hospital: medicateInfoDto.p51_pharmacyMakeOutPrescription.name,
        p11_1_pharmacy: medicateInfoDto.p11_pharmacyMedicate.name,
        p51_2_cityName:
          medicateInfoDto.p51_pharmacyMakeOutPrescription.prefecture,
        p51_2_cityId: null,
        p51_3_hospitalTypeValueId: null,
        p51_3_hospitalTypeValue:
          medicateInfoDto.p51_pharmacyMakeOutPrescription.scoreTable,
        p51_4_institutionCode:
          medicateInfoDto.p51_pharmacyMakeOutPrescription
            .medicalInstitutionCode,
        p11_5_postalCode: medicateInfoDto.p11_pharmacyMedicate.postalCode,
        p11_2_pharCityName: medicateInfoDto.p11_pharmacyMedicate.prefecture,
        p11_2_pharCityId: null,
        p11_6_address: medicateInfoDto.p11_pharmacyMedicate.address,
        p11_7_phone: medicateInfoDto.p11_pharmacyMedicate.phoneNumber,
        p11_3_pharTypeValueId: null,
        p11_3_pharTypeValue: medicateInfoDto.p11_pharmacyMedicate.scoreTable,
        p11_4_institutionPharCode:
          medicateInfoDto.p11_pharmacyMedicate.medicalInstitutionCode,
        p15_1_doctorName: medicateInfoDto.p15_doctorMedicate.name,
        p15_2_doctorPhone: medicateInfoDto.p15_doctorMedicate.contact,
      });
    }
  }

  componentWillUnmount() {}

  renderLabel = (text, required) => {
    return (
      <View
        style={{
          alignSelf: "flex-start",
        }}
      >
        <Text style={styles.label}>{text} </Text>
        {required && (
          <Text
            style={{
              color: "#E41018",
              fontSize: SIZE.H3,
              position: "absolute",
              top: -8,
              right: -5,
            }}
          >
            *
          </Text>
        )}
      </View>
    );
  };

  renderHospitalInfo = () => {
    const { p5_1_compoundingDate } = this.state;
    return (
      <>
        <View
          style={{
            flex: 1,
            paddingLeft: 10,
            borderLeftColor: "#E41018",
            borderLeftWidth: 2,
            marginBottom: 20,
          }}
        >
          <Text style={styles.title}>薬局・病院</Text>
        </View>
        {/* Date picker */}
        <View
          style={{
            flexDirection: "row",
            marginBottom: 25,
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <View style={styles.labelWrapper}>
            {this.renderLabel("調剤日", true)}
          </View>
          <TouchableOpacity
            onPress={this.showDatePicker}
            activeOpacity={0.8}
            style={{
              borderColor: "#E4E4E4",
              borderWidth: 1,
              borderRadius: 5,
              flexDirection: "row",
              width: "60%",
            }}
          >
            <View
              style={{
                backgroundColor: "#FFFFFF",
                height: this.inputHeight,
                flex: 8,
                borderTopLeftRadius: 5,
                borderBottomLeftRadius: 5,
                justifyContent: "center",
                paddingHorizontal: 10,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: p5_1_compoundingDate ? "#1D1D1D" : "#C6C6C6",
                  fontSize: SIZE.H5,
                }}
              >
                {(p5_1_compoundingDate && p5_1_compoundingDate.slice(0, 11)) ||
                  moment(Date.now()).format("YYYY/MM/DD")}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: "#06B050",
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 3,
                borderTopRightRadius: 5,
                borderBottomRightRadius: 5,
              }}
            >
              <Icon
                name="down"
                size={12}
                color={"white"}
                style={{ fontWeight: "bold" }}
              />
            </View>
            {this.renderTimePickerModal()}
          </TouchableOpacity>
        </View>
        {/* TextInput */}
        <View
          style={{
            flexDirection: "row",
            marginBottom: 25,
            alignItems: "center",
          }}
        >
          <View style={styles.labelWrapper}>
            {this.renderLabel("病院名", true)}
          </View>
          <TextInput
            onChangeText={this.onChangeTextInput("p51_1_hospital")}
            value={this.state.p51_1_hospital}
            style={{
              borderWidth: 1,
              borderColor: "#E4E4E4",
              flex: 7,
              height: this.inputHeight,
              backgroundColor: "#FFFFFF",
              borderRadius: 5,
              padding: 6,
              fontSize: SIZE.H5,
            }}
          />
        </View>
        {/* TextInput */}
        <View
          style={{
            flexDirection: "row",
            marginBottom: 25,
            alignItems: "center",
          }}
        >
          <View style={styles.labelWrapper}>
            {this.renderLabel("調剤薬局", true)}
          </View>
          <TextInput
            onChangeText={this.onChangeTextInput("p11_1_pharmacy")}
            value={this.state.p11_1_pharmacy}
            style={{
              borderWidth: 1,
              borderColor: "#E4E4E4",
              flex: 7,
              height: this.inputHeight,
              backgroundColor: "#FFFFFF",
              borderRadius: 5,
              padding: 6,
              fontSize: SIZE.H5,
            }}
          />
        </View>
      </>
    );
  };
  renderHospitalDetail = () => {
    const {
      listCity,
      p51_2_cityName,
      p51_2_cityId,
      p51_3_hospitalTypeValueId,
      p51_3_hospitalTypeValue,
    } = this.state;
    return (
      <>
        {/* Title */}
        <View
          style={{
            flex: 1,
            paddingLeft: 10,
            borderLeftColor: "#E41018",
            borderLeftWidth: 2,
            marginVertical: 20,
          }}
        >
          <Text style={styles.title}>病院詳細</Text>
        </View>
        {/* choose city */}
        <View
          style={{
            flexDirection: "row",
            marginBottom: 25,
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <View style={styles.labelWrapper}>
            {this.renderLabel("都道府県")}
          </View>

          <ButtonDropdown
            styleContainer={{
              borderColor: "#E4E4E4",
              borderWidth: 1,
              borderRadius: 5,
              flexDirection: "row",
              width: "60%",
              backgroundColor: "#FFFFFF",
              height: this.inputHeight,
            }}
            labelStyle={{ textAlign: "center" }}
            placeholder={" 県を選択"}
            dropdown
            onPressChose={this.onChooseCity}
            data={listCity}
            defaultLabel={p51_2_cityName}
            defaultId={p51_2_cityId}
            title={"県を選択してください"}
          />
        </View>
        {/* Input */}
        <View
          style={{
            flexDirection: "row",
            marginBottom: 25,
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <View style={styles.labelWrapper}>{this.renderLabel("種別")}</View>
          <ButtonDropdown
            styleContainer={{
              borderColor: "#E4E4E4",
              borderWidth: 1,
              borderRadius: 5,
              flexDirection: "row",
              width: "35%",
              backgroundColor: "#FFFFFF",
              height: this.inputHeight,
            }}
            labelStyle={{ textAlign: "center" }}
            placeholder={"———"}
            dropdown
            onPressChose={this.onChooseHospitalType}
            data={this.hospitalType}
            defaultLabel={p51_3_hospitalTypeValue}
            defaultId={p51_3_hospitalTypeValueId}
            title={""}
          />
        </View>
        {/* Textinput */}
        <View
          style={{
            flexDirection: "row",
            marginBottom: 25,
            alignItems: "center",
          }}
        >
          <View style={styles.labelWrapper}>
            {this.renderLabel("医療機関 コード")}
          </View>
          <TextInput
            maxLength={7}
            onChangeText={this.onChangeTextInput("p51_4_institutionCode")}
            value={this.state.p51_4_institutionCode}
            keyboardType="number-pad"
            style={{
              borderWidth: 1,
              borderColor: "#E4E4E4",
              flex: 7,
              height: this.inputHeight,
              backgroundColor: "#FFFFFF",
              borderRadius: 5,
              padding: 6,
              fontSize: SIZE.H5,
            }}
            keyboardType="numeric"
          />
        </View>
      </>
    );
  };
  renderPharmacyInfor = () => {
    const {
      listCity,
      p11_2_pharCityName,
      p11_2_pharCityId,
      p11_3_pharTypeValueId,
      p11_3_pharTypeValue,
    } = this.state;
    return (
      <>
        <View
          style={{
            flex: 1,
            paddingLeft: 10,
            borderLeftColor: "#E41018",
            borderLeftWidth: 2,
            marginVertical: 20,
          }}
        >
          <Text style={styles.title}>調剤薬局詳細</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            marginBottom: 25,
            alignItems: "center",
          }}
        >
          <View style={styles.labelWrapper}>
            {this.renderLabel("郵便番号")}
          </View>
          <TextInput
            onChangeText={this.onChangeTextInput("p11_5_postalCode")}
            keyboardType="number-pad"
            maxLength={7}
            value={this.state.p11_5_postalCode}
            style={{
              borderWidth: 1,
              borderColor: "#E4E4E4",
              flex: 7,
              height: this.inputHeight,
              backgroundColor: "#FFFFFF",
              borderRadius: 5,
              padding: 6,
              fontSize: SIZE.H5,
            }}
          />
        </View>
        {/* Textinput */}
        <View
          style={{
            flexDirection: "row",
            marginBottom: 25,
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <View style={styles.labelWrapper}>
            {this.renderLabel("都道府県")}
          </View>

          <ButtonDropdown
            styleContainer={{
              borderColor: "#E4E4E4",
              borderWidth: 1,
              borderRadius: 5,
              flexDirection: "row",
              width: "60%",
              backgroundColor: "#FFFFFF",
              height: this.inputHeight,
            }}
            labelStyle={{ textAlign: "center" }}
            placeholder={" 県を選択"}
            dropdown
            onPressChose={this.onChoosePharCity}
            data={listCity}
            defaultLabel={p11_2_pharCityName}
            defaultId={p11_2_pharCityId}
            title={"県を選択してください"}
          />
        </View>
        {/* Textinput */}
        <View
          style={{
            flexDirection: "row",
            marginBottom: 25,
            alignItems: "center",
          }}
        >
          <View style={styles.labelWrapper}>{this.renderLabel("住所")}</View>
          <TextInput
            onChangeText={this.onChangeTextInput("p11_6_address")}
            value={this.state.p11_6_address}
            multiline={true}
            style={{
              borderWidth: 1,
              borderColor: "#E4E4E4",
              flex: 7,
              height: this.inputHeight * 2,
              backgroundColor: "#FFFFFF",
              borderRadius: 5,
              padding: 10,
              fontSize: SIZE.H5,
              textAlignVertical: "top",
            }}
          />
        </View>
        {/* Textinput */}
        <View
          style={{
            flexDirection: "row",
            marginBottom: 25,
            alignItems: "center",
          }}
        >
          <View style={styles.labelWrapper}>
            {this.renderLabel("電話番号")}
          </View>
          <TextInput
            onChangeText={this.onChangeTextInput("p11_7_phone")}
            value={this.p11_7_phone}
            keyboardType="number-pad"
            maxLength={11}
            style={{
              borderWidth: 1,
              borderColor: "#E4E4E4",
              flex: 7,
              height: this.inputHeight,
              backgroundColor: "#FFFFFF",
              borderRadius: 5,
              fontSize: SIZE.H5,
              padding: 6,
            }}
          />
        </View>
        {/* Input */}
        <View
          style={{
            flexDirection: "row",
            marginBottom: 25,
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <View style={styles.labelWrapper}>{this.renderLabel("種別")}</View>

          <ButtonDropdown
            styleContainer={{
              borderColor: "#E4E4E4",
              borderWidth: 1,
              borderRadius: 5,
              flexDirection: "row",
              width: "35%",
              backgroundColor: "#FFFFFF",
              height: this.inputHeight,
            }}
            labelStyle={{ textAlign: "center" }}
            placeholder={"———"}
            dropdown
            onPressChose={this.onChoosePharType}
            data={this.pharType}
            defaultLabel={p11_3_pharTypeValue}
            defaultId={p11_3_pharTypeValueId}
            title={""}
          />
        </View>
        {/* Textinput */}
        <View
          style={{
            flexDirection: "row",
            marginBottom: 25,
            alignItems: "center",
          }}
        >
          <View style={styles.labelWrapper}>
            {this.renderLabel("医療機関 コード")}
          </View>
          <TextInput
            onChangeText={this.onChangeTextInput("p11_4_institutionPharCode")}
            value={this.state.p11_4_institutionPharCode}
            maxLength={7}
            style={{
              borderWidth: 1,
              borderColor: "#E4E4E4",
              flex: 7,
              height: this.inputHeight,
              backgroundColor: "#FFFFFF",
              borderRadius: 5,
              padding: 6,
              fontSize: SIZE.H5,
            }}
          />
        </View>
      </>
    );
  };
  renderDoctorInfor = () => {
    return (
      <>
        {/* Title */}
        <View
          style={{
            flex: 1,
            paddingLeft: 10,
            borderLeftColor: "#E41018",
            borderLeftWidth: 2,
            marginVertical: 20,
          }}
        >
          <Text style={styles.title}>薬剤師</Text>
        </View>
        {/* Textinput */}
        <View
          style={{
            flexDirection: "row",
            marginBottom: 25,
            alignItems: "center",
          }}
        >
          <View style={styles.labelWrapper}>
            {this.renderLabel("薬剤師名", true)}
          </View>
          <TextInput
            onChangeText={this.onChangeTextInput("p15_1_doctorName")}
            value={this.state.p15_1_doctorName}
            style={{
              borderWidth: 1,
              borderColor: "#E4E4E4",
              flex: 7,
              height: this.inputHeight,
              backgroundColor: "#FFFFFF",
              borderRadius: 5,
              padding: 6,
              fontSize: SIZE.H5,
            }}
          />
        </View>
        {/* Textinput */}
        <View
          style={{
            flexDirection: "row",
            marginBottom: 25,
            alignItems: "center",
          }}
        >
          <View style={styles.labelWrapper}>{this.renderLabel("連絡先")}</View>
          <TextInput
            onChangeText={this.onChangeTextInput("p15_2_doctorPhone")}
            value={this.state.p15_2_doctorPhone}
            keyboardType="number-pad"
            maxLength={11}
            style={{
              borderWidth: 1,
              borderColor: "#E4E4E4",
              flex: 7,
              height: this.inputHeight,
              backgroundColor: "#FFFFFF",
              borderRadius: 5,
              fontSize: SIZE.H5,
              padding: 6,
            }}
          />
        </View>
      </>
    );
  };

  renderTimePickerModal = () => {
    const { isDatePickerVisible, p5_1_compoundingDate } = this.state;
    const dateProp = !!p5_1_compoundingDate
      ? new Date(p5_1_compoundingDate)
      : new Date();

    if (isIOS) {
      return (
        <DateTimePickerModal
          display="spinner"
          date={dateProp}
          isVisible={isDatePickerVisible}
          headerTextIOS={"生年月日をご選択"}
          confirmTextIOS={"選択"}
          cancelTextIOS={"キャンセル"}
          mode="date"
          onCancel={this.hideDatePicker}
          onConfirm={this.onChangeData}
          maximumDate={new Date()}
        />
      );
    }
    return (
      <DatePicker
        disabled={false}
        style={{
          position: "absolute",
          width: "100%",
          height: 56,
        }}
        date={dateProp}
        mode={"date"}
        androidMode={"spinner"}
        maxDate={new Date()}
        format={"YYYY/MM/DD"}
        showIcon={false}
        confirmBtnText="選択"
        cancelBtnText="キャンセル"
        customStyles={{
          btnTextConfirm: {
            color: "gray",
            height: 40,
            lineHeight: 40,
          },
          btnTextCancel: {
            color: "gray",
            height: 40,
            lineHeight: 40,
          },
        }}
        hideText
        onDateChange={this.onChangeData}
      />
    );
  };

  getListCity = async () => {
    this.setState({ loading: true, networkError: false, maintain: false });
    try {
      const response = await Api.getListCity();
      console.log("[res-city]", response);
      if (response.code === 200 && response.res.status.code === 1000) {
        this.state.listCity = response.res.data;
      } else if (response.code === 502 || response.res === "timeout") {
        this.state.maintain = true;
      } else {
        this.state.networkError = true;
      }
      this.setState({ loading: false });
    } catch (error) {
      this.setState({ loading: false, networkError: true });
    }
  };

  onChooseCity = (item) => {
    this.setState({
      p51_2_cityName: item.name,
      p51_2_cityId: item.id,
    });
  };

  onChoosePharCity = (item) => {
    this.setState({
      p11_2_pharCityName: item.name,
      p11_2_pharCityId: item.id,
    });
  };
  onChooseHospitalType = (item) => {
    this.setState({
      p51_3_hospitalTypeValue: item.name,
      p51_3_hospitalTypeValueId: item.id,
    });
  };

  onChoosePharType = (item) => {
    this.setState({
      p11_3_pharTypeValue: item.name,
      p11_3_pharTypeValueId: item.id,
    });
  };

  onChangeTextInput = (field) => (text) => {
    this.setState({ [field]: text });
  };

  onValidate = () => {
    const reZipCode = /^([0-9]{7})$/;
    const rePhone = /^([0-9]{10,11})$/;

    if (
      this.state.p11_5_postalCode &&
      !reZipCode.test(this.state.p11_5_postalCode)
    ) {
      Alert.alert("郵便番号が正しくありません。");
      return false;
    }
    if (
      this.state.p11_7_phone &&
      (!rePhone.test(this.state.p11_7_phone) || this.state.p11_7_phone[0] != 0)
    ) {
      Alert.alert("電話番号の形式が誤っています。");
      return false;
    }
    if (
      this.state.p15_2_doctorPhone &&
      (!rePhone.test(this.state.p15_2_doctorPhone) ||
        this.state.p15_2_doctorPhone[0] != 0)
    ) {
      Alert.alert("電話番号の形式が誤っています。");
      return false;
    }

    return true;
  };

  onSubmit = () => {
    const { action } = this.props.navigation.state?.params;
    this.btnSubmit.current.setLoading(true);

    if (
      !this.state.p5_1_compoundingDate ||
      !this.state.p51_1_hospital ||
      !this.state.p11_1_pharmacy ||
      !this.state.p15_1_doctorName
    ) {
      Alert.alert(STRING_VALIDATE.Please_Check_Validate_Info_Input);
      setTimeout(() => {
        this.btnSubmit.current.setLoading(false);
      }, 100);
      return;
    }
    if (!this.onValidate()) {
      setTimeout(() => {
        this.btnSubmit.current.setLoading(false);
      }, 100);
      return;
    }
    const data = ServicesDataDto.get();
    let dataUpdate = JSON.parse(JSON.stringify(data));
    if (action === "UPDATE") {
      if (!data) {
        // data = empty
        setTimeout(() => {
          this.btnSubmit.current.setLoading(false);
        }, 100);
        return;
      }
      dataUpdate.medicateInfoDto.p5_medicateInfo.medicateTime = this.state.p5_1_compoundingDate;
      dataUpdate.medicateInfoDto.p51_pharmacyMakeOutPrescription.name = this.state.p51_1_hospital;
      dataUpdate.medicateInfoDto.p11_pharmacyMedicate.name = this.state.p11_1_pharmacy;
      dataUpdate.medicateInfoDto.p51_pharmacyMakeOutPrescription.prefecture = this.state.p51_2_cityName;
      dataUpdate.medicateInfoDto.p51_pharmacyMakeOutPrescription.scoreTable = this.state.p51_3_hospitalTypeValue;
      dataUpdate.medicateInfoDto.p11_pharmacyMedicate.postalCode = this.state.p11_5_postalCode;
      dataUpdate.medicateInfoDto.p11_pharmacyMedicate.prefecture = this.state.p11_2_pharCityName;
      dataUpdate.medicateInfoDto.p11_pharmacyMedicate.address = this.state.p11_6_address;
      dataUpdate.medicateInfoDto.p11_pharmacyMedicate.phoneNumber = this.state.p11_7_phone;
      dataUpdate.medicateInfoDto.p11_pharmacyMedicate.scoreTable = this.state.p11_3_pharTypeValue;
      dataUpdate.medicateInfoDto.p11_pharmacyMedicate.medicalInstitutionCode = this.state.p11_4_institutionPharCode;
      dataUpdate.medicateInfoDto.p15_doctorMedicate.name = this.state.p15_1_doctorName;
      dataUpdate.medicateInfoDto.p15_doctorMedicate.contact = this.state.p15_2_doctorPhone;
    } else {
      dataUpdate = {
        medicateInfoDto: {
          p5_medicateInfo: {
            medicateTime: this.state.p5_1_compoundingDate,
            recordCreator: "PATIENT",
            createFrom: "FROM_CLIENT_INPUT",
          },
          p51_pharmacyMakeOutPrescription: {
            name: this.state.p51_1_hospital,
            prefecture: this.state.p51_2_cityName,
            scoreTable: this.state.p51_3_hospitalTypeValue,
          },
          p11_pharmacyMedicate: {
            name: this.state.p11_1_pharmacy,
            postalCode: this.state.p11_5_postalCode,
            prefecture: this.state.p11_2_pharCityName,
            address: this.state.p11_6_address,
            phoneNumber: this.state.p11_7_phone,
            scoreTable: this.state.p11_3_pharTypeValue,
            medicalInstitutionCode: this.state.p11_4_institutionPharCode,
          },
          p15_doctorMedicate: {
            name: this.state.p15_1_doctorName,
            contact: this.state.p15_2_doctorPhone,
          },
        },
      };
    }

    ServicesDataDto.set(JSON.parse(JSON.stringify(dataUpdate)));
    setTimeout(() => {
      this.btnSubmit.current.setLoading(false);
      if (action == "UPDATE") {
        this.props.navigation.navigate("PRESCRIPTION_DETAILS", {
          navigationAction: "",
        });
      } else {
        this.props.navigation.navigate("REGISTER_MANUAL_MEDICINE", {
          navigationAction: "REGISTER_MANUAL_PRESCRIPTION",
        });
      }
    }, 50);
  };

  showDatePicker = () => {
    console.log("abcd");
    this.setState({ isDatePickerVisible: true });
  };
  hideDatePicker = () => {
    this.setState({ isDatePickerVisible: false });
  };
  //Thay đổi lựa chọn ngày tháng năm:
  onChangeData = (value) => {
    const valueFormat = moment(new Date(value)).format("YYYY/MM/DD HH:mm");
    this.setState({
      p5_1_compoundingDate: valueFormat,
      isDatePickerVisible: false,
    });
  };

  render() {
    const { action } = this.props.navigation.state?.params;
    const { networkError, maintain } = this.state;
    if (maintain) {
      return <MaintainView onPress={this.getListCity} timeOut={10000} />;
    }
    return (
      <Container>
        {networkError ? (
          <NetworkError onPress={this.getListCity} />
        ) : (
          <>
            <KeyboardAwareScrollView
              showsVerticalScrollIndicator={false}
              style={{ backgroundColor: "#F2F2F2" }}
              contentContainerStyle={{
                padding: SIZE.width(8),
              }}
            >
              {this.renderHospitalInfo()}
              {this.renderHospitalDetail()}
              {this.renderPharmacyInfor()}
              {this.renderDoctorInfor()}
            </KeyboardAwareScrollView>
            <View style={{ padding: 16 }}>
              <DebounceButton
                onPress={this.onSubmit}
                loadingColor="#FFFFFF"
                ref={this.btnSubmit}
                title={action === "UPDATE" ? "更新" : "次へ"}
                textStyle={{
                  color: "#FFFFFF",
                  fontSize: SIZE.H5 * 1.2,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
                style={{
                  backgroundColor: "#06B050",
                  height: 50,
                  borderRadius: 3,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
            </View>
          </>
        )}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
    fontSize: SIZE.H5 * 1.2,
    color: "#1D1D1D",
  },
  label: {
    color: "#1D1D1D",
    fontSize: SIZE.H5,
  },
  labelWrapper: {
    width: "30%",
    paddingRight: 20,
  },
});

export default RegisterManualPrescription;
