//Library:
import React, { Component } from "react";
import {
  SafeAreaView,
  StatusBar,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  BackHandler,
} from "react-native";

//Setup:
import { mapRpDtoDefault, STRING_VALIDATE, COLOR_TEXT } from "../util/constant";
import { SIZE } from "../../../const/size";
import { COLOR_GRAY_LIGHT, COLOR_WHITE } from "../../../const/Color";

//Component:
import ItemMedicine from "../item/ItemMedicine";
import { HeaderIconLeft } from "../../../commons";

//Serviecs:
import ServicesDataDto from "../util/ServicesDataDto";
import InputText from "../item/InputText";
import ButtonConfirm from "../item/ButtonConfirm";
let heightFormInputAndSelect = SIZE.height(6);
export default class RegisterOrUpdateMedicine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      p55_doctorMakeOutPrescription: [
        {
          id: 1,
          title: "診療科名",
          key: "departmentName",
        },
        {
          id: 2,
          title: "医師名",
          key: "doctorName",
        },
      ],
      listDrugImage: [],
      departmentOfClinical: {
        departmentName: "",
        doctorName: "",
        id: null,
        indexInQrRecord: null,
        medicateInfoId: null,
        recordCreator: "MEDICAL_PERSONNEL",
      },
      mapRpDto: {},
      rpNumberNext: 0,
    };
  }

  //Đăng kí thêm 1 RpDto mới = 1 thuốc gồm 201 + 301.
  componentDidMount() {
    try {
      const checkNavigate = this.props.navigation.state.params;
      //Trường hợp đăng kí thuốc mới từ màn hình QR code đến hoặc màn hình danh sách đơn thuốc:
      if (!checkNavigate) {
        this.registerMapRpDtoStart();
      } else {
        //Trường hợp update đơn thuốc đã tạo bằng tay:
        if (
          checkNavigate &&
          checkNavigate.action == "UPDATE_INFO_LIST_MEDICINE"
        ) {
          let dataDto = ServicesDataDto.get();
          let { indexRpClusterDtoUpdate } = checkNavigate;
          let mapRpDtoClone = JSON.parse(
            JSON.stringify(
              dataDto.medicateInfoDto.rpClusterDto[indexRpClusterDtoUpdate]
                .mapRpDto
            )
          );
          let departmentOfClinicalClone = JSON.parse(
            JSON.stringify(
              dataDto.medicateInfoDto.rpClusterDto[indexRpClusterDtoUpdate]
                .p55_doctorMakeOutPrescription
            )
          );
          this.setState({
            mapRpDto: mapRpDtoClone,
            departmentOfClinical: departmentOfClinicalClone,
          });
        } else {
          //Trường hợp tạo đơn thuốc bằng tay:
          if (
            checkNavigate &&
            checkNavigate.navigationAction == "REGISTER_MANUAL_PRESCRIPTION"
          ) {
            this.registerMapRpDtoManualStart();
          }
        }
      }
    } catch (error) {
      console.log("error", error);
    }
    BackHandler.addEventListener("hardwareBackPressROrU", this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPressOrU",
      this.handleBackPress
    );
  }
  handleBackPress = () => {
    this.props.navigation.goBack();
    return true;
  };
  //Đăng kí thuốc mới từ QR code hoặc cập nhật vào danh sách list:
  registerMapRpDtoStart = () => {
    const { mapRpDto } = this.state;
    let newRpNumber = this.checkKeyRpNumber();
    let mapRpDtoClone = JSON.parse(
      JSON.stringify(mapRpDtoDefault(`${newRpNumber + 1}`))
    );
    mapRpDto[`${newRpNumber + 1}`] = {
      ...mapRpDtoClone,
      rpNumber: `${newRpNumber + 1}`,
    };
    this.setState({ mapRpDto });
  };

  //Đăng kí đơn thuốc  bằng tay:
  registerMapRpDtoManualStart = () => {
    const { mapRpDto } = this.state;
    let mapRpDtoClone = JSON.parse(JSON.stringify(mapRpDtoDefault(`${1}`)));
    mapRpDto[`${1}`] = {
      ...mapRpDtoClone,
      rpNumber: `${1}`,
    };
    this.setState({ mapRpDto });
  };

  //Đánh số RpNumber cho nhóm thuốc mới được tạo:
  //Trường hợp bên màn hình chi tiết xóa hết danh sách rpClusterDto thì phải bắt đầu đánh số lại từ: 0
  checkKeyRpNumber = () => {
    const OjbScannerQR = ServicesDataDto.get();
    const { medicateInfoDto } = OjbScannerQR;
    const { rpClusterDto } = medicateInfoDto;
    let arrayKey = [];
    if (rpClusterDto) {
      let listKeyRpClusterDto = rpClusterDto.map((item) => {
        return Object.keys(item.mapRpDto).map(Number);
      });
      arrayKey = listKeyRpClusterDto.flat().sort();
      let rpNumberMax =
        arrayKey[arrayKey.length - 1] >= 0 ? arrayKey[arrayKey.length - 1] : 0;
      this.setState({ rpNumberNext: parseInt(rpNumberMax) });
      return parseInt(rpNumberMax);
    } else {
      return parseInt(0);
    }
  };

  //Đăng kí thêm 1 Rp mới:
  registerRp = () => {
    const { mapRpDto } = this.state;
    let arrayKeyMapRpDto = Object.keys(mapRpDto)
      .map((x) => parseInt(x))
      .sort(function(a, b) {
        return a - b;
      });
    let keyMax = arrayKeyMapRpDto[arrayKeyMapRpDto.length - 1];
    let mapRpDtoClone = JSON.parse(
      JSON.stringify(mapRpDtoDefault(`${keyMax + 1}`))
    );
    mapRpDto[`${keyMax + 1}`] = {
      ...mapRpDtoClone,
      rpNumber: `${keyMax + 1}`,
    };
    this.setState({ mapRpDto });
  };

  //Xóa 1 item thuốc mới:
  removeItemMedicine = (keyRpDto) => {
    const { mapRpDto } = this.state;
    const dataDto = ServicesDataDto.get();
    const {
      action,
      indexRpClusterDtoUpdate,
    } = this.props.navigation.state?.params;
    console.log("Xóa item medicine:", this.props.navigation.state?.params);
    let mapRpDtoLength = Object.keys(mapRpDto).map(Number).length;
    //Case ấn vào nút update:
    if (action == "UPDATE_INFO_LIST_MEDICINE") {
      let listDrug = dataDto.deleteRecordInfo?.listP201_drugInfoId || [];
      listDrug.push(
        dataDto.medicateInfoDto.rpClusterDto[indexRpClusterDtoUpdate].mapRpDto[
          keyRpDto
        ].p201_drugInfos[0].id
      );
      //Xóa 1 item thuốc trong cụm RP:
      const updateDeteleObj = {
        deleteMedicateInfo: null,
        listDeleteClusterInfoDto: null,
        listP201_drugInfoId: [...listDrug],
      };
      dataDto.deleteRecordInfo = updateDeteleObj;
      if (mapRpDtoLength > 1) {
        delete mapRpDto[keyRpDto];
        this.setState({ mapRpDto });
      } else {
        //Xóa hết thuốc trong case update => Xóa luông RP:
        this.setState({ mapRpDto: {} });
        dataDto.medicateInfoDto.rpClusterDto.splice(indexRpClusterDtoUpdate, 1);
        ServicesDataDto.set(dataDto);
        this.props.navigation.navigate("PRESCRIPTION_DETAILS");
      }
    } else {
      //Case đăng kí thuốc mới từ QR code, danh sách list.
      if (mapRpDtoLength > 1) {
        delete mapRpDto[keyRpDto];
        console.log("mapRpDto", mapRpDto);
        this.setState({ mapRpDto });
      } else {
        this.setState({ mapRpDto: {} });
        let mapRpDtoClone = JSON.parse(
          JSON.stringify(mapRpDtoDefault(`${keyRpDto}`))
        );
        mapRpDto[`${keyRpDto}`] = {
          ...mapRpDtoClone,
          rpNumber: `${keyRpDto}`,
        };
        console.log("mapRpDto", mapRpDto);
        this.setState({ mapRpDto });
      }
    }
  };

  //Nhập tên bác sĩ và phòng khám:
  onChangeTextDepartmentOfClinical = (key, text) => {
    const { departmentOfClinical } = this.state;
    switch (key) {
      case "departmentName":
        departmentOfClinical.departmentName = text;
        break;
      case "doctorName":
        departmentOfClinical.doctorName = text;
        break;
    }
  };

  //Thực hiện đăng kí thuốc mới vào OJB to:
  registerNewMedicine = () => {
    const checkNavigate = this.props.navigation.state.params;
    console.log("checkNavigate", checkNavigate);
    try {
      const { navigation } = this.props;
      const { mapRpDto, departmentOfClinical } = this.state;
      //them moi qr code
      if (!checkNavigate) {
        const checkValid = this.checkValidateFormRegister();
        let newRpNumberStart = `${this.checkKeyRpNumber() + 1}`;
        if (!checkValid) {
          let dataDto = ServicesDataDto.get();
          let arrayKey = Object.keys(mapRpDto).map(Number);
          let ojbConvert = {};
          let index = newRpNumberStart;
          for (let i = 0; i < arrayKey.length; i++) {
            ojbConvert[index] = mapRpDto[arrayKey[i]];
            index++;
          }
          let newRpClusterDto = {
            p55_doctorMakeOutPrescription: departmentOfClinical,
            mapRpDto: mapRpDto,
          };
          if (
            Array.isArray(dataDto.medicateInfoDto.rpClusterDto) &&
            dataDto.medicateInfoDto.rpClusterDto.length > 0
          ) {
            dataDto.medicateInfoDto.rpClusterDto = [
              ...dataDto.medicateInfoDto.rpClusterDto,
              newRpClusterDto,
            ];
          } else {
            dataDto.medicateInfoDto.rpClusterDto = [newRpClusterDto];
          }
          ServicesDataDto.set(dataDto);
          this.props.navigation.push("PRESCRIPTION_DETAILS", {
            navigationAction: "",
          });
        }
        return;
      }
      //Case update đơn thuốc:
      if (
        checkNavigate &&
        checkNavigate?.action == "UPDATE_INFO_LIST_MEDICINE"
      ) {
        const checkValid = this.checkValidateFormRegister();
        console.log("checkValidasdkaskdjaksdjaksjdas", checkValid);
        if (!checkValid) {
          console.log(">>>>>>>>>>>>>");
          let dataDto = ServicesDataDto.get();
          let indexRpClusterDtoUpdate = checkNavigate.indexRpClusterDtoUpdate;
          let newRpClusterDtoUpdate = {
            p55_doctorMakeOutPrescription: departmentOfClinical,
            mapRpDto: mapRpDto,
          };
          dataDto.medicateInfoDto.rpClusterDto[
            indexRpClusterDtoUpdate
          ] = newRpClusterDtoUpdate;
          ServicesDataDto.set(dataDto);
          navigation.goBack();
        }
      } else {
        //Đăng kí bằng tay từ ojb trống tự đánh số từ 1:
        if (
          checkNavigate &&
          checkNavigate?.navigationAction == "REGISTER_MANUAL_PRESCRIPTION"
        ) {
          const checkValid = this.checkValidateFormRegister();
          if (!checkValid) {
            let ojbConvert = {};
            let index = 1;
            let dataDto = ServicesDataDto.get();
            let arrayKey = Object.keys(mapRpDto).map(Number);
            for (let i = 0; i < arrayKey.length; i++) {
              ojbConvert[index] = mapRpDto[arrayKey[i]];
              index++;
            }
            let newRpClusterDto = {
              p55_doctorMakeOutPrescription: departmentOfClinical,
              mapRpDto: mapRpDto,
            };
            dataDto.medicateInfoDto.rpClusterDto = [newRpClusterDto];
            ServicesDataDto.set(dataDto);
            //Trường hợp đăng kí bằng tay.
            if (
              checkNavigate &&
              checkNavigate?.navigationAction == "REGISTER_MANUAL_PRESCRIPTION"
            ) {
              this.props.navigation.push("PRESCRIPTION_DETAILS", {
                navigationAction: "REGISTER_MANUAL_PRESCRIPTION",
              });
            }
            //Trường hợp đăng kí thuốc bằng QR hoặc từ màn danh sách đơn thuốc.
            else {
              this.props.navigation.push("PRESCRIPTION_DETAILS", {
                navigationAction: "",
              });
            }
          }
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  //Thay đổi form textInput:
  onChangeData = (keyRpDto, field, key) => (value) => {
    const { mapRpDto } = this.state;
    switch (field) {
      case "p201_drugInfos":
        //Mục 1.Nhập tên thuốc:
        if (key == "drugName") {
          mapRpDto[keyRpDto][field][0][key] = value;
        }
        //Mục 4.Nhập lưu ý sử dụng thuốc:
        if (key == "p281_additionalDrugs") {
          mapRpDto[keyRpDto][field][0].p281_additionalDrugs[0].content = value;
        }
        break;
      //Mục 7.Nhập cách dùng hoặc memo cách dùng.
      case "p301_usingInstruction":
        if (key == "p311_additionalUsingInstructions") {
          mapRpDto[keyRpDto][field][key][0].content = value;
        } else {
          mapRpDto[keyRpDto][field][key] = value;
        }
        console.log("keyRpDto, field, key", keyRpDto, field, key);

        break;
      //Mục 8.Nhập chú ý cách dùng.
      case "p391_noteWhenTakingDrugs":
        mapRpDto[keyRpDto][field][0][key] = value;
        break;
    }
  };

  //2.Thay đổi mã dạng bào chế 301_5:
  onChangeDosageFormCode = (keyRpDto, dataSelect) => {
    const { mapRpDto } = this.state;
    mapRpDto[keyRpDto].p301_usingInstruction.dosageFormCode =
      dataSelect.dosageFormCode;
    mapRpDto[keyRpDto].p301_usingInstruction.dosageFormCodeContent =
      dataSelect.dosageFormCodeContent;
    mapRpDto[keyRpDto].p301_usingInstruction.dosageFormCodeDescription =
      dataSelect.dosageFormCodeDescription;
  };

  //3.Thay đổi lượng sử dụng: (201-3 + 201-4)
  onChangeDoseAndUnitName = (keyRpDto, ojbDoseAndUnitName) => {
    const { mapRpDto } = this.state;
    mapRpDto[keyRpDto].p201_drugInfos[0].dosing = ojbDoseAndUnitName.dose;
    mapRpDto[keyRpDto].p201_drugInfos[0].unitName = ojbDoseAndUnitName.unitName;
  };

  //Thay đổi lượng được kê: (301-3 + 301-4)
  onChangeDrugVolumeAndUnitName = (keyRpDto, ojbDrugVolumeAndUnitName) => {
    const { mapRpDto } = this.state;
    mapRpDto[keyRpDto].p301_usingInstruction.drugVolume =
      ojbDrugVolumeAndUnitName.drugVolume;
    mapRpDto[keyRpDto].p301_usingInstruction.drugUnitName =
      ojbDrugVolumeAndUnitName.drugUnitName;
  };

  //8.Thay đổi ảnh của item đơn thuốc 201.imageUrl.
  onChangePictureMedicine = (keyRpDto, data) => {
    const { mapRpDto, listDrugImage } = this.state;
    let newOjbImgConvert = {
      ...data,
      keyRpDto: keyRpDto,
    };
    listDrugImage.push(newOjbImgConvert);
    mapRpDto[keyRpDto].p201_drugInfos[0].imageUrl = data.uri;
    mapRpDto[keyRpDto].p201_drugInfos[0].imageName = this.getNameFileImage(
      data.uri
    );
  };

  //Lấy tên ảnh:
  getNameFileImage = (uri) => {
    let newUri = uri.toString().substring(uri.lastIndexOf("/") + 1, uri.length);
    if (!!newUri) {
      return newUri;
    }
    return uri;
  };

  //Duyệt từng thuộc tính trong ojb check validate form đăng kí thuốc mới:
  checkValidateFormRegister = () => {
    const { mapRpDto } = this.state;
    let checkValidate = "";
    let countNumberKeyOjb = Object.keys(mapRpDto).map(Number);
    for (
      let indexKeyOjb = 0;
      indexKeyOjb < countNumberKeyOjb.length;
      indexKeyOjb++
    ) {
      //1.Tên thuốc (201-2):
      try {
        if (
          !mapRpDto[countNumberKeyOjb[indexKeyOjb]].p201_drugInfos[0].drugName
        ) {
          checkValidate = "drugName";
          Alert.alert(STRING_VALIDATE.Need_DrugName);
          break;
        }
        //2.Dạng bào chế (301-5):
        if (
          !mapRpDto[countNumberKeyOjb[indexKeyOjb]].p301_usingInstruction
            .dosageFormCode
        ) {
          checkValidate = "dosageFormCode";
          Alert.alert(STRING_VALIDATE.Need_DosageFormCode);
          break;
        }
        //3.Lượng sử dụng (201-3 + 201-4):
        if (
          !mapRpDto[countNumberKeyOjb[indexKeyOjb]].p201_drugInfos[0].dosing ||
          !mapRpDto[countNumberKeyOjb[indexKeyOjb]].p201_drugInfos[0].unitName
        ) {
          checkValidate = "dosingOrUnitName";
          Alert.alert(STRING_VALIDATE.Need_Dosing);
          break;
        }
        //5.Nhập lượng thuốc được kê (301-3 + 301-4):
        if (
          !mapRpDto[countNumberKeyOjb[indexKeyOjb]].p301_usingInstruction
            .drugVolume ||
          !mapRpDto[countNumberKeyOjb[indexKeyOjb]].p301_usingInstruction
            .drugUnitName
        ) {
          checkValidate = "drugVolumeOrdrugUnitName";
          Alert.alert(STRING_VALIDATE.Need_DrugVolume);
          break;
        }
        //6.Nhập cách dùng (301-2):
        if (
          !mapRpDto[countNumberKeyOjb[indexKeyOjb]].p301_usingInstruction
            .usingInstructionName
        ) {
          checkValidate = "usingInstructionName";
          Alert.alert(STRING_VALIDATE.Need_UsingInstruction);
          break;
        }
      } catch (error) {
        console.log("error", error);
      }
    }
    return checkValidate;
  };

  //Hiển thị chữ bên trái của form textInput * đỏ nhập thông tin bác sĩ và phòng khám:
  renderLeftTextInput = (title, compulsory = false) => {
    return (
      <View
        style={{
          width: SIZE.width(20),
        }}
      >
        <Text
          style={[
            {
              color: "black",
              fontSize: SIZE.H5 * 1.2,
              marginLeft: SIZE.width(0.5),
            },
          ]}
        >
          {title}{" "}
          {compulsory && (
            <Text
              style={{
                color: "red",
                fontWeight: "bold",
              }}
            >
              *
            </Text>
          )}
        </Text>
      </View>
    );
  };

  //Item thuốc:
  renderListItemMedicine = () => {
    const { mapRpDto } = this.state;
    console.log("mapRpDto", mapRpDto[0]);
    let countNumberKeyOjb = Object.keys(mapRpDto).map(Number);
    console.log("countNumberKeyOjb", countNumberKeyOjb);
    let listItemMedicine = countNumberKeyOjb.map((keyRpDto, index) => {
      return (
        <ItemMedicine
          key={`${keyRpDto}`}
          keyRpDto={keyRpDto}
          dataItemMedicine={mapRpDto[keyRpDto]}
          onChangeData={this.onChangeData}
          onChangeDosageFormCode={this.onChangeDosageFormCode}
          onChangeDoseAndUnitName={this.onChangeDoseAndUnitName}
          onChangeDrugVolumeAndUnitName={this.onChangeDrugVolumeAndUnitName}
          removeItemMedicine={this.removeItemMedicine}
          onChangePictureMedicine={this.onChangePictureMedicine}
        />
      );
    });
    return listItemMedicine;
  };

  render() {
    const checkNavigate = this.props.navigation.state.params;
    const { goBack } = this.props.navigation;
    const { p55_doctorMakeOutPrescription, departmentOfClinical } = this.state;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar backgroundColor={COLOR_GRAY_LIGHT} barStyle='dark-content' />
        <HeaderIconLeft goBack={goBack} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            backgroundColor: "#F2F2F2",
            paddingHorizontal: SIZE.width(5),
          }}
          bounces={false}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 25,
            }}
          >
            <View
              style={{
                width: 2,
                backgroundColor: "red",
                height: 20,
              }}
            />
            <Text style={styles.titleText}>診療科・お薬</Text>
          </View>
          {/* Tên bộ phận && Tên bác sĩ   */}
          {p55_doctorMakeOutPrescription.map((item, index) => {
            return (
              <View
                key={`${index}`}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 25,
                }}
              >
                <Text
                  style={{ flex: 1, fontSize: SIZE.H14, color: COLOR_TEXT }}
                >
                  {item.title}
                </Text>
                <InputText
                  defaultValue={departmentOfClinical[item.key]}
                  styleInput={{ flex: 3 }}
                  onChangeText={(text) => {
                    this.state.departmentOfClinical[item.key] = text;
                  }}
                />
              </View>
            );
          })}

          {/* Danh sách thuốc được bác sĩ + phòng ban kê đơn */}
          {this.renderListItemMedicine()}
          {/* Thêm thuốc mới */}
          {checkNavigate &&
          checkNavigate.action == "UPDATE_INFO_LIST_MEDICINE" ? null : (
            <TouchableOpacity
              onPress={this.registerRp}
              style={{
                backgroundColor: "white",
                borderRadius: 6,
                marginTop: 35,
                marginBottom: 15,
              }}
            >
              <View
                style={{
                  height: 50,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: "black",
                  margin: 15,
                  alignItems: "center",
                  justifyContent: "center",
                  borderStyle: "dashed",
                }}
              >
                <Text
                  style={{
                    color: "black",
                    fontWeight: "bold",
                    fontSize: SIZE.H14,
                  }}
                >
                  ＋お薬を追加する
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </ScrollView>
        <View
          style={{
            padding: SIZE.width(5),
            backgroundColor: "white",
          }}
        >
          <ButtonConfirm
            textButton={
              checkNavigate &&
              checkNavigate.action == "UPDATE_INFO_LIST_MEDICINE"
                ? "編集"
                : "次へ"
            }
            styleButton={{ margin: 0 }}
            onPress={this.registerNewMedicine}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: SIZE.H16,
    fontWeight: "bold",
    marginLeft: 10,
    color: "black",
  },
  containerInputFormDepartmentOfClinical: {
    width: SIZE.width(92),
    height: heightFormInputAndSelect,
    marginTop: SIZE.height(3),
    marginLeft: SIZE.width(4),
  },
  inputFormDepartmentOfClinical: {
    flex: 1,
    backgroundColor: COLOR_WHITE,
    borderRadius: SIZE.width(2),
  },
  buttonPushNewMedicine: {
    height: SIZE.height(7.5),
    width: SIZE.width(88),
    borderRadius: SIZE.width(2),
    borderStyle: "dotted",
    borderWidth: SIZE.width(0.5),
    marginLeft: SIZE.width(6),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SIZE.height(3),
  },
});
