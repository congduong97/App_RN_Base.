//Library:
import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SIZE } from "../../../const/size";
import { COLOR_BORDER } from "../../../const/Color";
import {
  DOSAGE_FORM_CODE_DATA,
  DATA_DOSE_AND_UNIT_NAME,
  DATA_DRUG_VOLUME_AND_UNIT_NAME,
  COLOR_TEXT,
  TYPE_MODAL,
} from "../util/constant";

//Component:
import ModalConfirm from "./ModalConfirm";
import ButtonDropdown from "../item/ButtonDropdown";
import ModalInputSelect from "../item/ModalInputSelect";
import PicturePicker from "../../../commons/PicturePicker";
import InputText from "./InputText";

class ItemMedicine extends Component {
  constructor(props) {
    super(props);
    const { dataItemMedicine } = this.props;
    const imageUrl = dataItemMedicine?.p201_drugInfos[0]?.imageUrl;
    let cutTextDose = "１日";
    let textDosageFormCodeDescription =
      dataItemMedicine?.p301_usingInstruction?.dosageFormCodeDescription;
    if (dataItemMedicine && textDosageFormCodeDescription) {
      cutTextDose = textDosageFormCodeDescription.slice(
        textDosageFormCodeDescription.length - 3,
        textDosageFormCodeDescription.length - 1
      );
    }
    this.state = {
      textDose: cutTextDose,
      fieldParamsFormInput: {
        // Tên thuốc (お薬名) mapRpDto.p201_drugInfos[index].drugName (201.2).
        drugName: { field: "p201_drugInfos", key: "drugName" },
        //使用量メモ: Lưu ý về lượng sử dụng 281-2 (content).
        amountUsed: { field: "p201_drugInfos", key: "p281_additionalDrugs" },
        //Tên cách dùng 用法  301.2 UsageName. (Theo .doc của Nhật là UsageName nhưng server lưu lại là usingInstructionName )
        usageName: {
          field: "p301_usingInstruction",
          key: "usingInstructionName",
        },
        //Memo cách dùng.
        usageMemo: {
          field: "p301_usingInstruction",
          key: "p311_additionalUsingInstructions",
        },
        //服用の注意  Chú ý khi dùng 291-2, 391-2
        precautionsForTaking: {
          field: "p391_noteWhenTakingDrugs",
          key: "content",
        },
      },
      dosageDosageFormsSelect: {},
      getImg: {
        imgDefault: !imageUrl,
        link: !!imageUrl
          ? imageUrl
          : "https://icons-for-free.com/iconfiles/png/512/32px+Free+Set+Camera-1320568209414231422.png", //     imgDefault: !imageUrl,
      },
      listDosageForms: DOSAGE_FORM_CODE_DATA,
      paramsModal: {},
      dataModalInputSelect: [],
      titleModalInputSelect: "",
      keyActiveModalButtonSelect: "",
      //Form nhập liều lượng dùng (201-3) + (201-4) Dose + Unit name :
      ojbDoseAndUnitName: {
        dose: "",
        unitName: "錠",
      },
      //Lượng được kê 調剤量 (301-3 + 301-4) Drug Volume + Drug Unit name.
      ojbDrugVolumeDrugUnitName: {
        drugVolume: "",
        drugUnitName: "日分",
      },
    };
  }

  //Chọn modal có textInput và phần dánh sách chọn :
  showModalInputSelect = (keyActive, valueText, valueSelect) => () => {
    let paramsModalConvert = {
      textFormInput: valueText,
      itemSelect: valueSelect,
    };
    switch (keyActive) {
      //Liều lượng sử dụng:
      case "key_doseAndUnitName":
        this.setState({
          titleModalInputSelect: "１日量を入力してください",
          dataModalInputSelect: DATA_DOSE_AND_UNIT_NAME,
          keyActiveModalButtonSelect: "key_doseAndUnitName",
          paramsModal: paramsModalConvert,
        });
        this.ModalInputSelectRef.openModal(paramsModalConvert);
        break;
      //Lượng được kê:
      case "key_drugVolumeAndDrugUnitName":
        this.setState({
          titleModalInputSelect: "１日量を入力してください",
          dataModalInputSelect: DATA_DRUG_VOLUME_AND_UNIT_NAME,
          keyActiveModalButtonSelect: "key_drugVolumeAndDrugUnitName",
          paramsModal: paramsModalConvert,
        });
        this.ModalInputSelectRef.openModal(paramsModalConvert);
        break;
    }
  };

  //Chọn dạng bào chế: 301-5
  chooseDosageForms = (dataSelect) => {
    console.log("dataSelect", dataSelect);
    const { onChangeDosageFormCode, keyRpDto } = this.props;
    let cutTextDose = dataSelect?.dosageFormCodeDescription.slice(
      dataSelect?.dosageFormCodeDescription.length - 3,
      dataSelect?.dosageFormCodeDescription.length - 1
    );
    console.log("cutTextDose", cutTextDose);
    onChangeDosageFormCode(keyRpDto, dataSelect);
    this.setState({
      dosageDosageFormsSelect: dataSelect,
      textDose: cutTextDose,
    });
  };

  //Xóa item thuốc hiện tại:
  removeItemMedicine = () => {
    const { removeItemMedicine, keyRpDto } = this.props;
    removeItemMedicine(keyRpDto);
  };

  //Lấy dữ liệu được chọn trong modal ra:
  pressOkGetDataModalSelect = (dataSelectModal) => {
    console.log("dataSelectModal", dataSelectModal);
    const { keyActiveModalButtonSelect } = this.state;
    const {
      onChangeDoseAndUnitName,
      onChangeDrugVolumeAndUnitName,
      keyRpDto,
    } = this.props;

    //Lượng sử dụng:
    if (keyActiveModalButtonSelect == "key_doseAndUnitName") {
      let ojbDoseUnitNameCustom = {
        dose: dataSelectModal.textFormInput,
        unitName: dataSelectModal.itemSelect,
      };
      onChangeDoseAndUnitName(keyRpDto, ojbDoseUnitNameCustom);
      this.setState({ ojbDoseAndUnitName: ojbDoseUnitNameCustom });
    }

    //Lượng được kê:
    if (keyActiveModalButtonSelect == "key_drugVolumeAndDrugUnitName") {
      let ojbDrugVolumeAndDrugUnitNameCustom = {
        drugVolume: dataSelectModal.textFormInput,
        drugUnitName: dataSelectModal.itemSelect,
      };
      onChangeDrugVolumeAndUnitName(
        keyRpDto,
        ojbDrugVolumeAndDrugUnitNameCustom
      );
      this.setState({
        ojbDrugVolumeDrugUnitName: ojbDrugVolumeAndDrugUnitNameCustom,
      });
    }
  };

  //Thay đổi ảnh đại diện thuốc:
  onChangeImage = (data) => {
    const { keyRpDto, onChangePictureMedicine } = this.props;
    onChangePictureMedicine(keyRpDto, data);
    if (!data.didCancel) {
      this.setState({
        getImg: {
          boolean: false,
          link: data.uri,
        },
      });
    }
  };

  //Tiêu đề bên trái:
  renderLeftTextInput = (title, compulsory = false) => {
    return (
      <View
        style={{
          width: SIZE.width(20),
        }}
      >
        <Text
          style={{
            color: "black",
            fontSize: SIZE.H5 * 1.2,
            marginLeft: SIZE.width(0.5),
          }}
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

  //Tiêu đề form của item thuốc:
  renderTitleForm = (title) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 40,
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
              height: 20,
              width: 2,
              backgroundColor: "red",
            }}
          />
          <Text
            style={{
              fontSize: SIZE.H16,
              fontWeight: "bold",
              marginLeft: 10,
              color: "black",
            }}
          >
            お薬
          </Text>
        </View>
        <Text
          onPress={() => {
            this.refModalConfirmDelete.handleVisible();
          }}
          style={{
            fontSize: SIZE.H16,
            fontWeight: "bold",
            color: "red",
          }}
        >
          編集
        </Text>
      </View>
    );
  };
  renderNote = (title, value, onchangeText) => {
    return (
      <View style={{ marginTop: 25 }}>
        <Text style={{ fontSize: SIZE.H14, color: COLOR_TEXT }}>{title}</Text>
        <InputText
          styleInput={{
            height: 72,
            paddingVertical: 10,
            textAlignVertical: "top",
            marginTop: 5,
          }}
          multiline
          defaultValue={value}
          onChangeText={onchangeText}
        />
      </View>
    );
  };
  renderChoseMount = (title, onPress, value, unit) => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 25,
        }}
      >
        <View style={{ flexDirection: "row", flex: 1 }}>
          <Text
            style={{
              fontSize: SIZE.H14,
              color: COLOR_TEXT,
            }}
          >
            {title}
          </Text>
          <Text style={{ color: "red", fontWeight: "bold" }}>*</Text>
        </View>
        <TouchableOpacity onPress={onPress} style={styles.textDose}>
          <Text
            style={{
              marginLeft: SIZE.width(4),
              fontSize: SIZE.H14,
              color: !!value ? COLOR_TEXT : "#C6C6C6",
            }}
          >
            {value}
          </Text>
          <Text
            style={{
              fontSize: SIZE.H14,
              color: COLOR_TEXT,
              marginRight: SIZE.width(4),
            }}
          >
            {unit}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  //Hiển thị dữ liệu chi tiế thuốc:
  renderFormDetailMedicine = () => {
    const { onChangeData, keyRpDto, dataItemMedicine } = this.props;
    const {
      listDosageForms,
      dosageDosageFormsSelect,
      getImg,
      fieldParamsFormInput,
      dataModalInputSelect,
      titleModalInputSelect,
      ojbDoseAndUnitName,
      ojbDrugVolumeDrugUnitName,
      textDose,
    } = this.state;
    let dose = dataItemMedicine.p201_drugInfos[0].dosing;
    let unitName = dataItemMedicine?.p201_drugInfos[0]?.unitName
      ? `${dataItemMedicine?.p201_drugInfos[0]?.unitName}`
      : ojbDoseAndUnitName.unitName;

    let drugVolume = dataItemMedicine.p301_usingInstruction.drugVolume;
    let drugUnitName = dataItemMedicine?.p301_usingInstruction?.drugUnitName
      ? `${dataItemMedicine?.p301_usingInstruction?.drugUnitName}`
      : ojbDrugVolumeDrugUnitName.drugUnitName;

    console.log("ojbDoseAndUnitName", ojbDoseAndUnitName);
    console.log("dataItemMedicine", dataItemMedicine);
    console.log("dose", dose);

    return (
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 6,
          paddingHorizontal: 15,
        }}
      >
        {this.renderTitleForm()}
        {/*1. Tên thuốc  - お薬名 - Drug name - nameMedicine 201-2 */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 30,
          }}
        >
          <Text
            style={{
              flex: 1,
              fontSize: SIZE.H14,
              color: COLOR_TEXT,
            }}
          >
            お薬名 <Text style={{ color: "red" }}>*</Text>
          </Text>
          <View style={{ flex: 3 }}>
            <InputText
              defaultValue={
                dataItemMedicine?.p201_drugInfos[0]?.drugName
                  ? `${dataItemMedicine?.p201_drugInfos[0]?.drugName}`
                  : ""
              }
              onChangeText={onChangeData(
                keyRpDto,
                fieldParamsFormInput.drugName.field,
                fieldParamsFormInput.drugName.key
              )}
            />
          </View>
        </View>

        {/*2. Dạng bào chế chọn - dropdown - 剤形 - 301.5 */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 25,
          }}
        >
          <Text
            style={{
              flex: 1,
              fontSize: SIZE.H14,
              color: COLOR_TEXT,
            }}
          >
            剤形 <Text style={{ color: "red", fontWeight: "bold" }}>*</Text>
          </Text>
          <View style={{ flex: 3 }}>
            <ButtonDropdown
              data={listDosageForms}
              dropdown
              width={SIZE.width(26)}
              placeholder={"内服"}
              defaultLabel={
                dataItemMedicine?.p301_usingInstruction?.dosageFormCodeContent
              }
              onPressChose={this.chooseDosageForms}
              defaultId={dosageDosageFormsSelect.id}
              title={"Chọn dạng bào chế thuốc"}
            />
          </View>
        </View>

        {/* 3.Liều lượng dùng  (使用量) 201-3 + 201-4 (Dose + UnitName)*/}
        {this.renderChoseMount(
          `使用量 \n (${textDose})`,
          this.showModalInputSelect("key_doseAndUnitName", dose, unitName),
          dose,
          unitName
        )}

        {/* 4.使用量メモ: Lưu ý về lượng sử dụng 281-2 (content) - input dọc */}
        {this.renderNote(
          "使用量メモ",
          dataItemMedicine?.p201_drugInfos[0]?.p281_additionalDrugs[0]?.content
            ? `${
                dataItemMedicine?.p201_drugInfos[0]?.p281_additionalDrugs[0]
                  ?.content
              }`
            : "",
          onChangeData(
            keyRpDto,
            fieldParamsFormInput.amountUsed.field,
            fieldParamsFormInput.amountUsed.key
          )
        )}

        {/*5. Lượng được kê 調剤量 (301-3 + 301-4) Drug Volume + Drug Unit name. */}
        {this.renderChoseMount(
          "調剂量",
          this.showModalInputSelect(
            "key_drugVolumeAndDrugUnitName",
            drugVolume,
            drugUnitName
          ),
          drugVolume,
          drugUnitName
        )}

        {/*6.Tên cách dùng 用法  301.2 Usage name. */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 25,
          }}
        >
          <Text
            style={{
              flex: 1,
              fontSize: SIZE.H14,
              color: COLOR_TEXT,
            }}
          >
            用法 <Text style={{ color: "red" }}>*</Text>
          </Text>
          <View style={{ flex: 3 }}>
            <InputText
              defaultValue={
                dataItemMedicine?.p301_usingInstruction?.usingInstructionName
                  ? dataItemMedicine?.p301_usingInstruction
                      ?.usingInstructionName
                  : ""
              }
              onChangeText={onChangeData(
                keyRpDto,
                fieldParamsFormInput.usageName.field,
                fieldParamsFormInput.usageName.key
              )}
            />
          </View>
        </View>

        {/*7.用法メモ  Memo cách dùng 311-2. */}
        {this.renderNote(
          "用法メモ",
          dataItemMedicine?.p301_usingInstruction
            ?.p311_additionalUsingInstructions[0]?.content
            ? `${
                dataItemMedicine?.p301_usingInstruction
                  ?.p311_additionalUsingInstructions[0]?.content
              }`
            : "",
          onChangeData(
            keyRpDto,
            fieldParamsFormInput.usageMemo.field,
            fieldParamsFormInput.usageMemo.key
          )
        )}

        {/*8. 服用の注意  Chú ý khi dùng  291-2, 391-2 - input dọc: */}
        {this.renderNote(
          "服用の注意",
          dataItemMedicine?.p391_noteWhenTakingDrugs[0]?.content
            ? `${dataItemMedicine?.p391_noteWhenTakingDrugs[0]?.content}`
            : "",
          onChangeData(
            keyRpDto,
            fieldParamsFormInput.precautionsForTaking.field,
            fieldParamsFormInput.precautionsForTaking.key
          )
        )}

        {/*9. Chọn ảnh trong album */}
        <View
          style={{
            flexDirection: "row",
            marginBottom: 40,
            marginTop: 25,
          }}
        >
          <Text style={{ fontSize: SIZE.H14, color: COLOR_TEXT, flex: 1 }}>
            お薬画像
          </Text>
          <View style={{ flex: 3 }}>
            <TouchableOpacity
              onPress={() => {
                this.picturePickerRef.showRBSheet();
              }}
              style={{
                backgroundColor: "white",
                width: SIZE.width(35),
                height: SIZE.width(35),
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 5,
                borderWidth: getImg.imgDefault ? 0.5 : 0,
                borderColor: COLOR_BORDER,
              }}
              activeOpacity={0.8}
            >
              <Image
                source={
                  getImg.imgDefault
                    ? require("../imgs/icon_camera.png")
                    : {
                        uri: getImg.link,
                      }
                }
                style={{
                  width: getImg.imgDefault ? SIZE.width(16) : SIZE.width(35),
                  height: getImg.imgDefault ? SIZE.width(12) : SIZE.width(35),
                  borderRadius: getImg.imgDefault ? 0 : 3,
                }}
                resizeMode={"stretch"}
              />
              {getImg.imgDefault && (
                <Text
                  style={{ fontSize: 10, color: COLOR_BORDER, marginTop: 14 }}
                >
                  登録する
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
        <ModalInputSelect
          getDataModalSelect={this.pressOkGetDataModalSelect}
          dataModalInputSelect={dataModalInputSelect}
          titleModalInputSelect={titleModalInputSelect}
          ref={(ref) => {
            this.ModalInputSelectRef = ref;
          }}
        />
      </View>
    );
  };

  render() {
    return (
      <View
        style={{
          backgroundColor: "#F2F2F2",
          marginTop: 20,
        }}
      >
        {this.renderFormDetailMedicine()}
        <PicturePicker
          ref={(ref) => (this.picturePickerRef = ref)}
          onChangeValue={this.onChangeImage}
        />
        <ModalConfirm
          onRef={(ref) => {
            this.refModalConfirmDelete = ref;
          }}
          type={TYPE_MODAL.DELETE}
          title={"REMOVE_ITEM_MEDICINE"}
          onPressConfirm={() => {
            this.removeItemMedicine();
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textDose: {
    flex: 3,
    height: 35,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: COLOR_BORDER,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // paddingHorizontal: SIZE.width(4),
  },
});

export default ItemMedicine;
