//Library:
import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";

//Setup:
import { SIZE } from "../../../const/size";

//Services:
import ServicesDataDto from "../util/ServicesDataDto";
import { COLOR_TEXT } from "../util/constant";

export default class FormInputCarefulMedicine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      medicateInfoDto: {},
      p4_healthRecordNote: {
        content: "",
        createdTime: null,
        id: null,
        inputDate: null,
        medicateInfoId: null,
        recordCreator: "PATIENT",
        updatedTime: null,
      },
    };
  }
  componentDidMount() {
    const { onRef } = this.props;
    onRef && onRef(this);
    this.onDidMount();

    //Cập nhật lại form:
    ServicesDataDto.onChange("FormInputCarefulMedicine", () => {
      this.onDidMount();
    });
  }

  componentWillUnmount() {
    ServicesDataDto.remove("FormInputCarefulMedicine");
  }

  onDidMount = () => {
    try {
      const { checkNavigate } = this.props;
      let getDataLocal = ServicesDataDto.get();
      console.log(
        "getDataLocalgetDataLocalgetDataLocalgetDataLocal >>>",
        getDataLocal
      );
      //Case register manual prescription:
      if (
        checkNavigate &&
        checkNavigate.navigationAction == "REGISTER_MANUAL_PRESCRIPTION"
      ) {
        console.log("Nhảy vào đâydkjaksdasd");
        getDataLocal.medicateInfoDto.p401_medicateUsingNotes = [
          {
            content: "",
            createdTime: null,
            id: null,
            medicateInfoId: null,
            recordCreator: "PATIENT",
            updatedTime: null,
          },
        ];
        getDataLocal.medicateInfoDto.p421_excessDrugs = [
          {
            content: "",
            createdTime: null,
            id: null,
            medicateInfoId: null,
            recordCreator: "PATIENT",
            updatedTime: null,
          },
        ];
        getDataLocal.medicateInfoDto.p601_datasFromPatient = [
          {
            content: "",
            createdTime: null,
            id: null,
            medicateInfoId: null,
            updatedTime: null,
            inputDate: null,
          },
        ];
        getDataLocal.medicateInfoDto.p4_healthRecordNote = {
          content: "",
          createdTime: null,
          id: null,
          inputDate: null,
          medicateInfoId: null,
          recordCreator: "PATIENT",
          updatedTime: null,
        };
        //Case scanner QR code or update form list register medicine :
      } else {
        if (
          getDataLocal &&
          Array.isArray(
            getDataLocal.medicateInfoDto?.p401_medicateUsingNotes
          ) &&
          getDataLocal.medicateInfoDto?.p401_medicateUsingNotes.length == 0
        ) {
          getDataLocal.medicateInfoDto.p401_medicateUsingNotes = [
            {
              content: "",
              createdTime: null,
              id: null,
              medicateInfoId: null,
              recordCreator: "PATIENT",
              updatedTime: null,
            },
          ];
        }
        if (
          getDataLocal &&
          Array.isArray(getDataLocal.medicateInfoDto?.p421_excessDrugs) &&
          getDataLocal.medicateInfoDto.p421_excessDrugs.length == 0
        ) {
          getDataLocal.medicateInfoDto.p421_excessDrugs = [
            {
              content: "",
              createdTime: null,
              id: null,
              medicateInfoId: null,
              recordCreator: "PATIENT",
              updatedTime: null,
            },
          ];
        }
        if (
          getDataLocal &&
          Array.isArray(getDataLocal.medicateInfoDto?.p601_datasFromPatient) &&
          getDataLocal.medicateInfoDto?.p601_datasFromPatient.length == 0
        ) {
          getDataLocal.medicateInfoDto.p601_datasFromPatient = [
            {
              content: "",
              createdTime: null,
              id: null,
              medicateInfoId: null,
              updatedTime: null,
              inputDate: null,
            },
          ];
        }
        if (
          getDataLocal &&
          !getDataLocal.medicateInfoDto?.p4_healthRecordNote
        ) {
          getDataLocal.medicateInfoDto.p4_healthRecordNote = {
            content: "",
            createdTime: null,
            id: null,
            inputDate: null,
            medicateInfoId: null,
            recordCreator: "PATIENT",
            updatedTime: null,
          };
          this.setState({ medicateInfoDto: getDataLocal.medicateInfoDto });
        } else {
          if (getDataLocal) {
            this.setState({
              medicateInfoDto: getDataLocal?.medicateInfoDto,
              p4_healthRecordNote: getDataLocal?.medicateInfoDto
                ?.p4_healthRecordNote
                ? getDataLocal?.medicateInfoDto?.p4_healthRecordNote
                : {
                    content: "",
                    createdTime: null,
                    id: null,
                    inputDate: null,
                    medicateInfoId: null,
                    recordCreator: "PATIENT",
                    updatedTime: null,
                  },
            });
          }
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  //Thay đổi input trong danh sách nhiều ô textInput:
  changeValueListOjbDTO = (keyListContentDTO, value) => {
    const { medicateInfoDto } = this.state;
    console.log("medicateInfoDto", medicateInfoDto);
    console.log("keyListContentDTO", keyListContentDTO);
    console.log("value", value);
    try {
      let newArrContentDTO = JSON.parse(
        JSON.stringify([medicateInfoDto[keyListContentDTO][0]])
      );
      newArrContentDTO[0].content = value;
      medicateInfoDto[keyListContentDTO] = [...newArrContentDTO];
      this.setState({ medicateInfoDto });
    } catch (error) {
      console.log("Error changeValueListOjbDTO", error);
    }
  };

  //Thay đổi input trong ô chỉ có 1 ô nhập TextInput:
  changeValueOjbDTO = (key, value) => {
    try {
      const { p4_healthRecordNote } = this.state;
      p4_healthRecordNote.content = value;
    } catch (error) {
      console.log("error", error);
    }
  };

  //Tiêu đề formInput:
  renderTitleForm = (title) => {
    return (
      <View
        style={{
          flexDirection: "row",
          marginLeft: SIZE.width(2),
          justifyContent: "space-between",
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
        <View
          style={{
            height: SIZE.height(2),
            width: SIZE.width(2),
          }}
        />
      </View>
    );
  };

  //Hiển thị textInput chú ý khi dùng:
  renderFormInputList = (
    keyListContentDTO,
    title,
    setEditText,
    listInputTextMap
  ) => {
    let renderTextContent = "";
    if (Array.isArray(listInputTextMap) && listInputTextMap.length > 0) {
      listInputTextMap.forEach((item) => {
        renderTextContent = renderTextContent + item.content;
      });
    }
    return (
      <View
        style={{
          minHeight: SIZE.height(15),
          width: SIZE.width(88),
          marginVertical: SIZE.width(3),
          borderRadius: SIZE.width(2),
          backgroundColor: "white",
        }}
      >
        <View
          style={{
            borderRadius: SIZE.width(2),
            marginTop: SIZE.height(3),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: SIZE.width(88),
              alignItems: "center",
              marginBottom: SIZE.height(2),
            }}
          >
            {this.renderTitleForm(title)}
            {setEditText ? null : (
              <Text
                style={[
                  styles.titleText,
                  { color: "grey", paddingRight: SIZE.width(3) },
                ]}
              >
                編集できません
              </Text>
            )}
          </View>
          <View
            style={{
              minHeight: SIZE.height(7),
              width: SIZE.width(78),
              marginLeft: SIZE.width(5),
              borderRadius: setEditText ? SIZE.width(2) : 0,
              borderWidth: setEditText ? SIZE.width(0.4) : 0,
              borderColor: setEditText ? "#C7C7C7" : null,
              fontSize: SIZE.H5,
              paddingHorizontal: SIZE.width(3),
              paddingVertical: SIZE.height(1),
              marginBottom: SIZE.height(2),
            }}
          >
            <TextInput
              onChangeText={(value) => {
                this.changeValueListOjbDTO(keyListContentDTO, value);
              }}
              scrollEnabled={false}
              editable={setEditText}
              showsVerticalScrollIndicator={false}
              multiline={true}
              style={{
                fontSize: SIZE.H5 * 1.1,
                color: COLOR_TEXT,
              }}
            >
              {renderTextContent}
            </TextInput>
          </View>
        </View>
      </View>
    );
  };

  renderFormInput = (keyContentDTO, title, setEditText, placeholder) => {
    return (
      <View
        style={{
          minHeight: SIZE.height(15),
          width: SIZE.width(88),
          marginVertical: SIZE.width(3),
          borderRadius: SIZE.width(2),
          backgroundColor: "white",
          paddingTop: SIZE.height(3),
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: SIZE.width(88),
            alignItems: "center",
            marginBottom: SIZE.height(2),
          }}
        >
          {this.renderTitleForm(title)}
          {setEditText ? null : (
            <Text
              style={[
                styles.titleText,
                { color: "grey", paddingRight: SIZE.width(3) },
              ]}
            >
              編集できません
            </Text>
          )}
        </View>
        <TextInput
          onChangeText={(text) => {
            this.changeValueOjbDTO(keyContentDTO, text);
          }}
          defaultValue={placeholder}
          scrollEnabled={false}
          multiline
          editable={setEditText}
          style={{
            minHeight: SIZE.height(7),
            width: SIZE.width(78),
            marginLeft: SIZE.width(5),
            borderRadius: setEditText ? SIZE.width(2) : 0,
            borderWidth: setEditText ? SIZE.width(0.4) : 0,
            borderColor: setEditText ? "#C7C7C7" : null,
            fontSize: SIZE.H5,
            paddingHorizontal: SIZE.width(3),
            paddingVertical: SIZE.height(3),
            marginBottom: SIZE.height(2),
          }}
        />
      </View>
    );
  };

  render() {
    const { medicateInfoDto } = this.state;
    if (medicateInfoDto) {
      return (
        <View
          style={{
            minHeight: SIZE.height(44),
            marginHorizontal: SIZE.width(4),
            alignItems: "center",
            backgroundColor: "#F2F2F2",
            borderRadius: SIZE.width(2),
          }}
        >
          {/* renderListFormInputCarefulMedicine */}
          {/* 1.Hiển thị 服用の注意: Chú ý khi dùng 401-1: */}
          {this.renderFormInputList(
            "p401_medicateUsingNotes",
            "服用の注意",
            true,
            medicateInfoDto?.p401_medicateUsingNotes
          )}
          {/* 2.Hiển thị 残薬確認情報: Thuốc tồn đọng 421-1: */}
          {this.renderFormInputList(
            "p421_excessDrugs",
            "残薬確認情報",
            true,
            medicateInfoDto?.p421_excessDrugs
          )}
          {/* 3.Hiển thị 医療機関等: Chia sẻ của cơ sở y tế 411-1. */}
          {this.renderFormInputList(
            "p411_medicalFacilityAdditionalInfos",
            "医療機関等提供情報",
            false,
            medicateInfoDto?.p411_medicalFacilityAdditionalInfos
          )}
          {/* 4.Hiển thị 備考: Lưu ý  501-1. */}
          {this.renderFormInputList(
            "p501_medicateNotes",
            "備考",
            false,
            medicateInfoDto?.p501_medicateNotes
          )}
          {/* 5.医師・薬剤師への: Lời nhắn nhủ đến bác sĩ 601-1 */}
          {this.renderFormInputList(
            "p601_datasFromPatient",
            "医師・薬剤師への相談",
            true,
            medicateInfoDto?.p601_datasFromPatient
          )}
          {/* 6.メモ: Memo 4.1 */}
          {this.renderFormInput(
            "p4_healthRecordNote",
            "メモ",
            true,
            medicateInfoDto?.p4_healthRecordNote?.content
              ? medicateInfoDto?.p4_healthRecordNote?.content
              : ""
          )}
        </View>
      );
    }
    return null;
  }
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: SIZE.H5 * 1.2,
    fontWeight: "bold",
    marginLeft: SIZE.width(3),
    color: "black",
  },
});
