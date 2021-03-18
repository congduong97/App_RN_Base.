//Library:
import React, { Component } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

//Setup:
import { SIZE } from "../../../const/size";

//Component:
import { renderTextInfoUser } from "../item/RenderTextInfoUser";

//Services:
import ServicesDataDto from "../util/ServicesDataDto";
import { TYPE_MODAL } from "../util/constant";
import ModalConfirm from "./ModalConfirm";
export default class FormClinicalSciencesDepartment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      OjbScannerDTO: {},
      countItemListMedicatePrescriptionDto: 0,
      rpClusterDto: [],
      itemRpClusterDtoRemove: null,
      deleteRecordInfoConvert: {},
    };
  }

  componentDidMount() {
    this.onDidMount();
    //Lắng nghe cập nhật form:
    ServicesDataDto.onChange("FormClinicalSciencesDepartment", () => {
      this.onDidMount();
      console.log("ashdjashdjashdjashdjashdjashdasjd");
    });
    //Thêm đơn thuốc mới:
  }

  componentWillUnmount() {
    ServicesDataDto.remove("FormClinicalSciencesDepartment");
  }

  //Lấy ra danh sách rpClusterDto :
  onDidMount = () => {
    let dataDto = ServicesDataDto.get();
    let medicateInfoDto = dataDto?.medicateInfoDto;
    let rpClusterDto = medicateInfoDto?.rpClusterDto;
    if (
      rpClusterDto &&
      Array.isArray(rpClusterDto) &&
      rpClusterDto.length > 0
    ) {
      this.setState({
        countItemListMedicatePrescriptionDto: rpClusterDto.length,
        rpClusterDto: rpClusterDto,
      });
    }
    this.setState({
      rpClusterDto: rpClusterDto,
    });
  };

  //Xóa 1 form danh sách thuốc :
  onPressRemoveData = () => {
    let dataDto = ServicesDataDto.get();
    const {
      itemRpClusterDtoRemove,
      rpClusterDto,
      deleteRecordInfoConvert,
    } = this.state;
    let listDeleteClusterInfo = [];
    let ojbRemove = {
      p55_DoctorId: null,
      listRpInfoId: [],
    };
    let listKeyMapRpDto = Object.keys(
      dataDto.medicateInfoDto.rpClusterDto[itemRpClusterDtoRemove].mapRpDto
    ).map(Number);
    let listIdRemoveRpDto = listKeyMapRpDto.map((key) => {
      return dataDto.medicateInfoDto.rpClusterDto[itemRpClusterDtoRemove]
        ?.mapRpDto[key]?.id;
    });
    ojbRemove.p55_DoctorId =
      dataDto.medicateInfoDto.rpClusterDto[
        itemRpClusterDtoRemove
      ]?.p55_doctorMakeOutPrescription?.id;
    ojbRemove.listRpInfoId = listIdRemoveRpDto;

    if (
      Array.isArray(deleteRecordInfoConvert?.listDeleteClusterInfoDto) &&
      deleteRecordInfoConvert?.listDeleteClusterInfoDto.length > 0
    ) {
      deleteRecordInfoConvert.listDeleteClusterInfoDto = [
        ...deleteRecordInfoConvert.listDeleteClusterInfoDto,
        ojbRemove,
      ];
      listDeleteClusterInfo = deleteRecordInfoConvert.listDeleteClusterInfoDto;
    } else {
      listDeleteClusterInfo = [...listDeleteClusterInfo, ojbRemove];
    }
    rpClusterDto.splice(itemRpClusterDtoRemove, 1);
    let ojbDeleteRecordInfoConvert = {
      medicateInfoId: dataDto?.medicateInfoDto?.p5_medicateInfo?.id,
      deleteMedicateInfo: false,
      listDeleteClusterInfoDto: [...listDeleteClusterInfo],
      listP201_drugInfoId: null,
    };
    dataDto.medicateInfoDto.rpClusterDto = rpClusterDto;
    dataDto.deleteRecordInfo = ojbDeleteRecordInfoConvert;
    this.setState({
      rpClusterDto,
      countItemListMedicatePrescriptionDto: rpClusterDto.length,
      deleteRecordInfoConvert: ojbDeleteRecordInfoConvert,
    });
  };

  //Danh sách các toa thuốc:
  //1 Toa thuốc có 1 p55 và nhiều thuốc con p201.
  renderListMedicatePrescriptionDto = () => {
    const { rpClusterDto, countItemListMedicatePrescriptionDto } = this.state;
    if (Array.isArray(rpClusterDto) && rpClusterDto.length > 0) {
      return rpClusterDto.map((item, index) => {
        const { mapRpDto } = item;
        return (
          <View key={`${index}`}>
            {this.renderTitleForm(
              `診療科・お薬 (${index +
                1}/${countItemListMedicatePrescriptionDto})`,
              index
            )}
            {/* Khoa lâm sàng p55_2 */}
            {renderTextInfoUser(
              "診療科",
              item?.p55_doctorMakeOutPrescription?.departmentName
            )}
            {/* Bác sĩ kê đơn p55_1*/}
            {renderTextInfoUser(
              "医師",
              item?.p55_doctorMakeOutPrescription?.doctorName
            )}
            {/* Thông tin các đơn thuốc */}
            {this.renderSeparationGetListMedicine(mapRpDto)}
          </View>
        );
      });
    } else {
      return null;
    }
  };

  //Danh sách đơn thuốc:
  //Không quan tâm đến mapRpDto.
  //Tách tất cả đống thuốc mã 201 ra gom lại thành 1 mảng để hiển thị danh sách thuốc.
  //Mỗi mã 201 có đính kèm 1 mã 301:
  renderSeparationGetListMedicine = (mapRpDto) => {
    let listMedicine = [];
    Object.keys(mapRpDto).map(function(key) {
      let ojbPush = {};
      ojbPush.id = key;
      ojbPush.p201_drugInfos = mapRpDto[key].p201_drugInfos;
      ojbPush.p301_drugInfos = mapRpDto[key].p301_usingInstruction;
      ojbPush.p391_drugInfos = mapRpDto[key].p391_noteWhenTakingDrugs;
      listMedicine.push(ojbPush);
    });
    return listMedicine.map((itemListMedicine) => {
      if (itemListMedicine && itemListMedicine.p201_drugInfos) {
        return itemListMedicine.p201_drugInfos.map(
          (itemP201_drugInfos, index) => {
            let checkText = this.getTextContent291_2(
              itemP201_drugInfos?.p291_usingDrugNotes,
              itemListMedicine?.p391_drugInfos
            );
            return (
              <View
                key={`${index}`}
                style={{
                  minHeight: SIZE.height(25),
                  width: SIZE.width(86),
                  marginTop: SIZE.width(2),
                  borderRadius: SIZE.width(2),
                }}
              >
                <View style={{ width: "100%" }}>
                  <View style={{ flexDirection: "row" }}>
                    <Image
                      style={{
                        height: SIZE.height(8),
                        width: SIZE.height(8),
                        borderRadius: SIZE.width(2),
                      }}
                      source={
                        itemP201_drugInfos.imageUrl
                          ? {
                              uri: itemP201_drugInfos.imageUrl,
                            }
                          : require("../imgs/thuoc_icon.png")
                      }
                    />
                    <View
                      style={{
                        minHeight: SIZE.height(3),
                        width: SIZE.width(74),
                      }}
                    >
                      <Text
                        style={{
                          color: "#06B050",
                          fontSize: SIZE.H16,
                          fontWeight: "bold",
                          marginHorizontal: SIZE.width(3),
                        }}
                      >
                        {itemP201_drugInfos?.drugName}
                      </Text>
                    </View>
                  </View>
                  {/*1 Mã dạng bào chế: bên trên 301-5 bên trái + phải gồm: 201-3 + 201-4 bên trên và 281_2 bên dưới  */}
                  {itemListMedicine.p301_drugInfos?.dosageFormCodeDescription &&
                    renderTextInfoUser(
                      itemListMedicine.p301_drugInfos
                        ?.dosageFormCodeDescription,
                      this.getTextContent281_2(
                        itemP201_drugInfos,
                        itemP201_drugInfos?.p281_additionalDrugs
                      )
                    )}
                  {/*2 調剤量: Lượng thuốc được kê 301-3 + 301-4 */}
                  {renderTextInfoUser(
                    "調剤量",
                    itemListMedicine.p301_drugInfos?.drugVolume &&
                      itemListMedicine.p301_drugInfos?.drugUnitName
                      ? `${itemListMedicine.p301_drugInfos?.drugVolume}${
                          itemListMedicine.p301_drugInfos?.drugUnitName
                        }`
                      : ""
                  )}
                  {/*3 用法: Thông tin sử dụng bổ sung cách uống 301-2 + 311-2 */}
                  {renderTextInfoUser(
                    "用法",
                    this.getTextContent311_2(
                      itemListMedicine?.p301_drugInfos?.usingInstructionName,
                      itemListMedicine?.p301_drugInfos
                        ?.p311_additionalUsingInstructions
                    )
                  )}
                  {/*4 服用の注意: Chú ý khi sử dụng thuốc 291-2 + Chú ý khi uống thuốc  391_2*/}
                  {renderTextInfoUser("服用の注意", checkText)}
                </View>
              </View>
            );
          }
        );
      }
    });
  };

  //Hiển thị thông tin bổ xung thuốc :201-3 + 201-4 + 281-2
  getTextContent281_2 = (p201_drugInfos, p281_additionalDrugs) => {
    let getStringP201_drugInfos =
      p201_drugInfos?.dosing || p201_drugInfos?.unitName
        ? `${p201_drugInfos?.dosing}${p201_drugInfos?.unitName}`
        : "";
    if (
      Array.isArray(p281_additionalDrugs) &&
      p281_additionalDrugs.length > 0
    ) {
      let getStringContent281_2 = "";
      p281_additionalDrugs.forEach((element, index) => {
        if (!!element.content) {
          if (index == 0) {
            getStringContent281_2 = element.content;
          } else {
            getStringContent281_2 = `${getStringP201_drugInfos}\n${getStringContent281_2}\n${
              element.content
            }`;
          }
        }
      });
      return `${getStringP201_drugInfos}\n${getStringContent281_2}`;
    }
    return `${getStringP201_drugInfos}`;
  };

  //Cách sử dụng thuốc bổ sung :301-2 + 311-2  (Cách uống).
  getTextContent311_2 = (
    usingInstructionName,
    p311_additionalUsingInstructions
  ) => {
    if (
      Array.isArray(p311_additionalUsingInstructions) &&
      p311_additionalUsingInstructions.length > 0
    ) {
      let getStringContent311_2 = "";
      p311_additionalUsingInstructions.forEach((element, index) => {
        if (!!element.content) {
          if (index == 0) {
            getStringContent311_2 = element?.content;
          } else {
            getStringContent311_2 = `${
              getStringContent311_2 ? getStringContent311_2 : ""
            }\n${element?.content}`;
          }
        }
      });
      return `${
        usingInstructionName ? usingInstructionName : ""
      }\n${getStringContent311_2}`;
    }
    return `${usingInstructionName}`;
  };

  //Chú ý khi sử dụng thuốc:
  getTextContent291_2 = (p291_usingDrugNotes, p391_noteWhenTakingDrugs) => {
    let getText391_2 = this.getTextContent391_2(p391_noteWhenTakingDrugs);
    if (Array.isArray(p291_usingDrugNotes) && p291_usingDrugNotes.length > 0) {
      let getStringContent291_2 = "";
      p291_usingDrugNotes.forEach((element, index) => {
        if (!!element.content) {
          if (index == 0) {
            getStringContent291_2 = `${element.content}\n`;
          } else {
            getStringContent291_2 = `${getStringContent291_2}${
              element.content
            }\n`;
          }
        }
      });
      return `${getStringContent291_2}${getText391_2}`;
    } else {
      return `${getText391_2}`;
    }
  };

  //Chú ý khi uống thuốc:
  getTextContent391_2 = (p391_noteWhenTakingDrugs) => {
    if (
      Array.isArray(p391_noteWhenTakingDrugs) &&
      p391_noteWhenTakingDrugs.length > 0
    ) {
      let getStringContent391_2 = "";
      p391_noteWhenTakingDrugs.forEach((element, index) => {
        if (!!element.content) {
          if (index == 0) {
            getStringContent391_2 = `${element.content}`;
          } else {
            getStringContent391_2 = `${getStringContent391_2}\n${
              element.content
            }`;
          }
        }
      });
      return `${getStringContent391_2}`;
    }
    return "";
  };

  //Hiển thị tiêu đề và nút xóa + sửa đổi chi tiết đơn thuốc:
  renderTitleForm = (title, indexRpClusterDtoActive) => {
    const { checkNavigate } = this.props;
    const { rpClusterDto } = this.state;
    const { navigation, navigationAction } = this.props;
    let checkTypeRecordCreator =
      rpClusterDto[indexRpClusterDtoActive]?.mapRpDto[
        Object.keys(rpClusterDto[indexRpClusterDtoActive]?.mapRpDto).map(
          Number
        )[0]
      ]?.p301_usingInstruction?.recordCreator;

    return (
      <View
        style={{
          flexDirection: "row",
          width: SIZE.width(88),
          justifyContent: "space-between",
          marginTop: SIZE.height(3),
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              height: SIZE.height(3),
              width: SIZE.width(1.2),
              backgroundColor: "red",
            }}
          />
          <Text style={styles.titleText}>{title}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          {/* Nút xóa 診療科・お薬 */}
          {navigationAction == "LIST_REGISTER_MEDICINE" ? (
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  itemRpClusterDtoRemove: indexRpClusterDtoActive,
                });
                this.refModalConfirmDelete.handleVisible();
              }}
              style={{
                height: SIZE.height(4),
                width: SIZE.width(12),
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={[
                  styles.titleText,
                  { color: "red", marginLeft: 0, fontWeight: "bold" },
                ]}
              >
                削除
              </Text>
            </TouchableOpacity>
          ) : (
            <View
              style={{
                height: SIZE.height(4),
                width: SIZE.width(12),
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          )}

          {/* Nút sửa chi tiết */}
          {checkTypeRecordCreator == "PATIENT" && (
            <TouchableOpacity
              onPress={() => {
                //Case Update từ tạo = tay.
                if (
                  checkNavigate &&
                  checkNavigate.navigationAction ==
                    "REGISTER_MANUAL_PRESCRIPTION"
                ) {
                  navigation.push("REGISTER_MANUAL_MEDICINE", {
                    action: "UPDATE_INFO_LIST_MEDICINE",
                    indexRpClusterDtoUpdate: indexRpClusterDtoActive,
                  });
                }
                //Case update từ danh sách hoặc QR:
                else {
                  navigation.navigate("REGISTER_MANUAL_MEDICINE", {
                    action: "UPDATE_INFO_LIST_MEDICINE",
                    indexRpClusterDtoUpdate: indexRpClusterDtoActive,
                  });
                }
              }}
              style={{
                height: SIZE.height(4),
                width: SIZE.width(12),
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={[
                  styles.titleText,
                  { color: "green", marginLeft: 0, fontWeight: "bold" },
                ]}
              >
                編集
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  render() {
    const { rpClusterDto } = this.state;
    const { navigation } = this.props;
    if (
      rpClusterDto &&
      Array.isArray(rpClusterDto) &&
      rpClusterDto.length > 0
    ) {
      return (
        <View
          style={{
            minHeight: SIZE.height(40),
            marginTop: SIZE.height(2),
            marginHorizontal: SIZE.width(4),
            borderRadius: SIZE.width(2),
            backgroundColor: "white",
            alignItems: "center",
          }}
        >
          <View style={{ width: SIZE.width(86) }}>
            {this.renderListMedicatePrescriptionDto()}
          </View>
          <ModalConfirm
            onRef={(ref) => {
              this.refModalConfirmDelete = ref;
            }}
            type={TYPE_MODAL.DELETE}
            title={"診療科・お薬"}
            onPressConfirm={() => {
              this.onPressRemoveData();
            }}
          />
        </View>
      );
    }
    return null;
  }
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: SIZE.H5 * 1.1,
    fontWeight: "bold",
    marginLeft: SIZE.width(3),
    color: "black",
  },
});
