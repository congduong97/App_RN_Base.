//Library:
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

//Setup:
import { SIZE } from "../../../const/size";
let widthFormHaveTitle = SIZE.width(86);

//Component:
import { renderTextInfoUser } from "./RenderTextInfoUser";

//Services:
import ServicesDataDto from "../util/ServicesDataDto";
export default class FormPharmacyHospital extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ojbScannerDTO: {},
      showMore: false,
      listTitle: [
        { id: 1, name: "薬局・病院", key: "Pharmacy_hospital" },
        { id: 2, name: "病院詳細", key: "Hospital_details" },
        { id: 3, name: "調剤薬局詳細", key: "Dispensing_pharmacy_details" },
        { id: 4, name: "薬剤師", key: "Pharmacist" },
      ],
    };
  }

  componentDidMount() {
    this.onDidMount();
    ServicesDataDto.onChange("FormPharmacyHospital", () => {
      this.onDidMount();
    });
  }

  componentWillUnmount() {
    ServicesDataDto.remove("FormPharmacyHospital");
  }

  onDidMount = () => {
    let ojbPrescription = ServicesDataDto.get();
    this.setState({ ojbScannerDTO: ojbPrescription });
  };

  clickShowMoreForm = () => {
    const { showMore } = this.state;
    this.setState({ showMore: !showMore });
  };

  renderFormInfo = (key, item) => {
    let renderForm = null;
    const { showMore } = this.state;
    switch (key) {
      case "Pharmacy_hospital":
        renderForm = this.renderFormPharmacyAndHospital(item);
        break;
      case "Hospital_details":
        renderForm = showMore ? this.renderFormHospitalDetails(item) : null;
        break;
      case "Dispensing_pharmacy_details":
        renderForm = showMore
          ? this.renderFormDispensingPharmacyDetails(item)
          : null;
        break;
      case "Pharmacist":
        renderForm = showMore ? this.renderFormPharmacist(item) : null;
        break;
    }
    return renderForm;
  };

  //Form 1. Thông tin hiệu thuốc bv:
  renderFormPharmacyAndHospital = (item) => {
    const { showMore, ojbScannerDTO } = this.state;
    const medicateInfoDto = ojbScannerDTO?.medicateInfoDto;
    if (medicateInfoDto) {
      return (
        <>
          {this.renderTitleForm(item)}
          <View
            style={{
              minHeight: SIZE.height(12),
              width: widthFormHaveTitle,
            }}
          >
            {/* Ngày kê đơn 5-1  */}
            {renderTextInfoUser(
              "調剤日",
              medicateInfoDto?.p5_medicateInfo.medicateTime.slice(0, 10)
            )}
            {/* Tên bệnh viện 51-1 */}
            {renderTextInfoUser(
              "病院",
              medicateInfoDto?.p51_pharmacyMakeOutPrescription.name
            )}
            {/* Tên hiệu thuốc kê đơn 11-1 */}
            {renderTextInfoUser(
              "調剤薬局",
              medicateInfoDto?.p11_pharmacyMedicate.name
            )}
            {!showMore && (
              <Text
                onPress={this.clickShowMoreForm}
                style={{
                  color: "green",
                  fontSize: SIZE.H5 * 1.1,
                  marginBottom: showMore ? 0 : SIZE.height(3),
                }}
              >
                {`薬局・病院情報をもっと表示する  `}
                <FontAwesome name={"chevron-down"} size={16} color={"green"} />
              </Text>
            )}
          </View>
        </>
      );
    }
    return null;
  };

  //Form2. Thông tin chi tiết bv:
  renderFormHospitalDetails = (item) => {
    const { ojbScannerDTO } = this.state;
    const medicateInfoDto = ojbScannerDTO?.medicateInfoDto;
    if (medicateInfoDto) {
      return (
        <>
          {this.renderTitleForm(item)}
          <View
            style={{
              minHeight: SIZE.height(12),
              width: widthFormHaveTitle,
            }}
          >
            {/* Mã tỉnh 51-2 */}
            {renderTextInfoUser(
              "都道府県",
              medicateInfoDto?.p51_pharmacyMakeOutPrescription.prefecture
            )}
            {/* Loại bệnh viện 51-3*/}
            {renderTextInfoUser(
              "種別",
              medicateInfoDto?.p51_pharmacyMakeOutPrescription.scoreTable
            )}
            {/* Mã cs y tế 51-4 */}
            {renderTextInfoUser(
              "医療機関コード",
              medicateInfoDto?.p51_pharmacyMakeOutPrescription
                .medicalInstitutionCode
            )}
          </View>
        </>
      );
    }
    return null;
  };

  //Form3. Thông tin chi tiết hiệu thuốc:
  renderFormDispensingPharmacyDetails = (item) => {
    const { ojbScannerDTO } = this.state;
    const medicateInfoDto = ojbScannerDTO?.medicateInfoDto;
    if (medicateInfoDto) {
      return (
        <>
          {this.renderTitleForm(item)}
          <View
            style={{
              minHeight: SIZE.height(12),
              width: widthFormHaveTitle,
            }}
          >
            {/* Zip Code:p11-5  */}
            {renderTextInfoUser(
              "郵便番号",
              medicateInfoDto?.p11_pharmacyMedicate.postalCode
            )}

            {/* Đại chỉ : p11-2 + p11-6 */}
            {renderTextInfoUser(
              "住所",
              `${
                medicateInfoDto?.p11_pharmacyMedicate.prefecture
                  ? medicateInfoDto?.p11_pharmacyMedicate.prefecture
                  : ""
              }${" "}${
                medicateInfoDto?.p11_pharmacyMedicate.address
                  ? medicateInfoDto?.p11_pharmacyMedicate.address
                  : ""
              }`
            )}

            {/* Số điện thoại */}
            {renderTextInfoUser(
              "電話番号",
              medicateInfoDto?.p11_pharmacyMedicate.phoneNumber
            )}
            {/* loại bv */}
            {renderTextInfoUser(
              "種別",
              medicateInfoDto?.p11_pharmacyMedicate.scoreTable
            )}
            {/* mã cơ sở ý tế  */}
            {renderTextInfoUser(
              "医療機関コード",
              medicateInfoDto?.p11_pharmacyMedicate.medicalInstitutionCode
            )}
          </View>
        </>
      );
    }
    return null;
  };

  //Form 4. Thông tin bác sĩ:
  renderFormPharmacist = (item) => {
    const { ojbScannerDTO, showMore } = this.state;
    const medicateInfoDto = ojbScannerDTO?.medicateInfoDto;
    if (medicateInfoDto) {
      return (
        <>
          {this.renderTitleForm(item)}
          <View
            style={{
              width: widthFormHaveTitle,
            }}
          >
            {/* Tên bác sĩ */}
            {renderTextInfoUser(
              "薬剤師名",
              medicateInfoDto?.p15_doctorMedicate.name
            )}
            {/* Số điện thoại */}
            {renderTextInfoUser(
              "連絡先",
              medicateInfoDto?.p15_doctorMedicate.contact
            )}
          </View>
          <View
            style={{
              width: widthFormHaveTitle,
            }}
          >
            <Text
              onPress={this.clickShowMoreForm}
              style={{
                color: "green",
                fontSize: SIZE.H5 * 1.1,
                marginBottom: showMore ? 0 : SIZE.height(3),
                paddingBottom: SIZE.height(3),
              }}
            >
              {showMore ? "閉じる" : `薬局・病院情報をもっと表示する  `}
              <FontAwesome
                name={showMore ? "chevron-up" : "chevron-down"}
                size={16}
                color={"green"}
              />
            </Text>
          </View>
        </>
      );
    }
    return null;
  };

  //Nút update thông tin:
  renderTitleForm = (item) => {
    const { navigation } = this.props;
    return (
      <View
        style={{
          flexDirection: "row",
          width: SIZE.width(86),
          marginLeft: SIZE.width(2),
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
          <Text style={styles.titleText}>{item.name}</Text>
        </View>
        {item.id == 1 && (
          <Text
            onPress={() => {
              navigation.navigate("REGISTER_MANUAL_PRESCRIPTION", {
                action: "UPDATE",
              });
            }}
            style={{
              fontSize: SIZE.H5 * 1.1,
              fontWeight: "bold",
              color: "green",
            }}
          >
            編集
          </Text>
        )}
      </View>
    );
  };

  renderListTitle = () => {
    const { listTitle } = this.state;
    return listTitle.map((item, index) => {
      return (
        <View style={{ alignItems: "center" }} key={`${index}`}>
          {/* Hiển thị nội dung: */}
          {this.renderFormInfo(item.key, item)}
        </View>
      );
    });
  };
  render() {
    const { showMore } = this.state;
    return (
      <View
        style={{
          marginHorizontal: SIZE.width(4),
          alignItems: "center",
          borderRadius: SIZE.width(2),
          backgroundColor: "white",
        }}
      >
        {this.renderListTitle()}
      </View>
    );
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
