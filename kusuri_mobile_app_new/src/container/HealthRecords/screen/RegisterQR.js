//Library:
import React, { Component } from "react";
import { SafeAreaView, StatusBar, Text, View } from "react-native";
import RNFS from "react-native-fs";

//Setup:
import { Api } from "../util/api";
import { SIZE } from "../../../const/size";
import { removeFile } from "../util/RemoveFileByRNFS";
import { COLOR_GRAY_LIGHT } from "../../../const/Color";

//Component:
import { HeaderIconLeft } from "../../../commons";
import QRCodeScanner from "../item/QRScanner";

//Services:
import ServicesDataDto from "../util/ServicesDataDto";
import ScanningCameraArea from "../item/ScanningCameraArea";

export default class RegisterQR extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numberQRCodeScannerSuccess: 0,
      startScannerQRCode: false,
      errorScannerQRCode: false,
    };
  }

  onSuccess = async (dataQRCode) => {};

  //Lấy danh sách QR được quét ra:
  getArrayQRCodeScannerSuccess = (
    listQRCodeScannerSuccess,
    numberQRSuccess
  ) => {
    let dataSaveCSV = listQRCodeScannerSuccess.join("");
    let count = dataSaveCSV.split("\n").length - 1;
    this.setState({ numberQRCodeScannerSuccess: numberQRSuccess });
    if (numberQRSuccess > 0) {
      this.setState({ startScannerQRCode: true });
    }
    if (numberQRSuccess == 1 && count > 10) {
      this.handleDataFileCSV(`${dataSaveCSV}`);
    }
    if (numberQRSuccess == 4) {
      let dataSaveCSV = listQRCodeScannerSuccess.join("");
      this.handleDataFileCSV(`${dataSaveCSV}`);
    }
  };

  //Xử lý file CSV call API lấy dataDto:
  callApiUploadFileCSV = async (ojbFileCSV) => {
    const { navigation } = this.props;
    let response = await Api.handleFileCsvQRCodeAPI(ojbFileCSV);
    if (response && response.code == 200 && response.res.data) {
      ServicesDataDto.set(response.res.data);
      removeFile(ojbFileCSV.uri);
      navigation.replace("PRESCRIPTION_DETAILS", {
        navigationAction: "QR_REGISTER",
      });
    } else {
      this.setState({ errorScannerQRCode: true });
    }
  };

  //Lưu lại file CSV:
  handleDataFileCSV = async (dataSaveCSV) => {
    let path = RNFS.DocumentDirectoryPath + "/dataScannerQRCode.csv";
    await RNFS.writeFile(path, dataSaveCSV, "utf8")
      .then((success) => {})
      .catch((err) => {
        console.log(err.message);
      });
    let ojbFileCSV = {
      uri: `${path}`,
      type: "multipart/form-data",
      name: "dataScannerQRCode.csv",
    };
    this.callApiUploadFileCSV(ojbFileCSV);
  };

  //Mess báo lỗi khi quét QR:
  renderMessScanner = () => {
    const {
      numberQRCodeScannerSuccess,
      startScannerQRCode,
      errorScannerQRCode,
    } = this.state;
    if (startScannerQRCode && !errorScannerQRCode) {
      return (
        <View
          style={{
            backgroundColor: "green",
            minHeight: SIZE.height(6.35),
            width: SIZE.width(100),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: SIZE.H4 * 0.8,
              fontWeight: "bold",
            }}
          >
            残りのQRコードを読み込んでください(
            {numberQRCodeScannerSuccess}) QR
          </Text>
        </View>
      );
    } else if (startScannerQRCode && errorScannerQRCode) {
      return (
        <View
          style={{
            backgroundColor: "red",
            minHeight: SIZE.height(6.35),
            width: SIZE.width(100),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: SIZE.H4 * 0.8,
              fontWeight: "bold",
            }}
          >
            エラー系のアラート表示（読取不可など）
          </Text>
        </View>
      );
    }
    return null;
  };

  render() {
    const { goBack } = this.props.navigation;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar backgroundColor={COLOR_GRAY_LIGHT} barStyle='dark-content' />
        <HeaderIconLeft goBack={goBack} />
        <View style={{ flex: 1, backgroundColor: "transparent" }}>
          <QRCodeScanner
            getArrayQRCodeScannerSuccess={this.getArrayQRCodeScannerSuccess}
            cameraStyle={{ height: SIZE.height(90), width: SIZE.width(100) }}
            style={{ backgroundColor: "white", height: SIZE.height(80) }}
            onRead={(dataQRCode) => {
              this.onSuccess(dataQRCode);
            }}
            onDenyPermission={() => goBack()}
          />
          <View
            style={{
              position: "absolute",
              flex: 1,
            }}
          >
            <View
              style={{
                height: SIZE.height(15.2),
                width: SIZE.width(100),
                backgroundColor: "rgba(52, 52, 52, 0.8)",
              }}
            >
              {this.renderMessScanner()}
            </View>
            <View
              style={{
                height: SIZE.height(41),
                width: SIZE.width(100),
              }}
            >
              <ScanningCameraArea />
            </View>
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "rgba(52, 52, 52, 0.8)",
              }}
            >
              <View
                style={{
                  width: SIZE.width(10),
                }}
              />
              <View>
                <View style={{ width: SIZE.width(80), marginTop: 10 }}>
                  <Text
                    style={{
                      color: "white",
                      fontSize: SIZE.H5 * 1.3,
                      marginTop: 12,
                    }}
                  >
                    薬局からもらったQRコードを枠内に収まるよ
                    うにして読み込んでください。
                  </Text>
                  <Text style={{ color: "white", fontSize: SIZE.H5 * 1.3 }}>
                    うまくいかない場合は平らだでるる。
                  </Text>
                </View>
              </View>
              <View
                style={{
                  width: SIZE.width(10),
                }}
              />
            </View>
            <View
              style={{
                height: SIZE.height(20),
                width: SIZE.width(100),
                backgroundColor: "rgba(52, 52, 52, 0.8)",
              }}
            />
          </View>
          <View />
        </View>
      </SafeAreaView>
    );
  }
}
