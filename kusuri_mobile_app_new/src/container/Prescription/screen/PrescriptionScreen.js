import React, { PureComponent } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  ScrollView,
} from "react-native";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import Modal from "react-native-modal";
import HTML from "react-native-render-html";

import { COLOR_WHITE, COLOR_GRAY_LIGHT } from "../../../const/Color";
import {
  DEVICE_WIDTH,
  DEVICE_HEIGHT,
  getHeightInCurrentDevice,
  getWidthInCurrentDevice,
} from "../../../const/System";
import { HeaderIconLeft, Loading, NetworkError } from "../../../commons";
import PrescriptionStatusView from "../item/PrescriptionStatusView";
import { Api } from "../util/api";
import {
  hasReloadPrescriptionScreen,
  setReloadPrescriptionScreen,
} from "../../../service/ReloadPrescriptionScreen";
import { chooseStoreService } from "../../ChooseStore/util/service";
import ReloadScreen from "../../../service/ReloadScreen";
import MaintainView from "../../../commons/MaintainView";

export default class PrescriptionScreen extends PureComponent {
  constructor() {
    super();
    this.state = {
      numberOfPrescription: 0,
      modalVisible: false,
      warningContent: "",
      listPrescription: [],
      isLoading: false,
      networkError: false,
      isMaintain: false,
    };
  }

  renderNoPrescription = () => {
    return (
      <>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#646464",
            width: 96,
            height: 31,
          }}
        >
          <Text
            style={{ fontSize: 14, color: COLOR_WHITE, fontWeight: "bold" }}
          >
            受付状況
          </Text>
        </View>
        <Text style={{ fontSize: 14, marginTop: 19, color: "#1C1C1C" }}>
          現在受付中の処方せんはありません
        </Text>
      </>
    );
  };

  showModal = () => {
    this.setState({
      modalVisible: true,
    });
  };

  closeModal = () => {
    this.setState({
      modalVisible: false,
    });
  };

  renderPrescription = (data) => {
    return (
      <ScrollView
        style={{ flex: 1 }}
        horizontal={false}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <View style={{ flexDirection: "row" }}>
            <View style={styles.receiveStatusView}>
              <Text
                style={{ fontSize: 14, color: COLOR_WHITE, fontWeight: "bold" }}
              >
                受付状況
              </Text>
            </View>
            <Text
              style={{
                alignSelf: "center",
                fontSize: 14,
                marginLeft: 9,
                color: "#1C1C1C",
                fontWeight: "bold",
              }}
            >
              {this.state.numberOfPrescription + 1}/
              {this.state.listPrescription.length}件
            </Text>
          </View>
          <TouchableOpacity style={styles.warningBtn} onPress={this.showModal}>
            <Text
              style={{ fontSize: 12, color: "#06B050", fontWeight: "bold" }}
            >
              来局時の注意事項
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{ flexDirection: "row", marginTop: 23, alignItems: "center" }}
        >
          <Text style={{ width: 100, fontSize: 14, color: "#1C1C1C" }}>
            【受付薬局】
          </Text>
          <Text style={{ marginLeft: 7, fontSize: 14, color: "#1C1C1C" }}>
            {data.storeName}
          </Text>
        </View>
        <View
          style={{ flexDirection: "row", marginTop: 13, alignItems: "center" }}
        >
          <Text style={{ width: 100, fontSize: 14, color: "#1C1C1C" }}>
            【受付日時】
          </Text>
          <Text style={{ marginLeft: 7, fontSize: 14, color: "#1C1C1C" }}>
            {data.createdTime}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            marginTop: 13,
            alignItems: "center",
            height: getHeightInCurrentDevice(20),
          }}
        >
          <Text style={{ width: 100, fontSize: 14, color: "#1C1C1C" }}>
            【受取希望日】
          </Text>
          <Text style={{ marginLeft: 7, fontSize: 14, color: "#1C1C1C" }}>
            {data.receptionDate == null ? "選択なし" : data.receptionDate}
          </Text>
        </View>
        <View style={styles.prescriptionStatusView}>
          <Text
            style={{ fontSize: 14, color: COLOR_WHITE, fontWeight: "bold" }}
          >
            お薬準備状況
          </Text>
        </View>
        <Text style={{ fontSize: 14, marginTop: 19, color: "#1C1C1C" }}>
          ステータス ：
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              color: data.prescriptionStatus.color
                ? data.prescriptionStatus.color
                : "#000000",
            }}
          >
            {data.prescriptionStatus.text}
          </Text>
        </Text>
        {data.prescriptionStatus.percent != null && (
          <PrescriptionStatusView
            containerStyle={styles.progressBar}
            percent={data.prescriptionStatus.percent}
          />
        )}
        <View style={{ marginTop: 20, marginBottom: 50 }}>
          {this.state.numberOfPrescription > 0 && (
            <TouchableOpacity
              style={{
                height: 31,
                width: 68,
                borderWidth: 1,
                borderColor: "#1C1C1C",
                borderRadius: 3,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                let numberOfPrescription = this.state.numberOfPrescription - 1;
                this.setState({ numberOfPrescription });
              }}
            >
              <Text style={{ fontSize: 12, color: "#1C1C1C" }}>前へ</Text>
            </TouchableOpacity>
          )}

          {this.state.numberOfPrescription <
            this.state.listPrescription.length - 1 && (
            <TouchableOpacity
              style={{
                height: 31,
                width: 68,
                borderWidth: 1,
                position: "absolute",
                alignSelf: "flex-end",
                borderColor: "#1C1C1C",
                borderRadius: 3,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                let numberOfPrescription = this.state.numberOfPrescription + 1;
                this.setState({ numberOfPrescription });
              }}
            >
              <Text style={{ fontSize: 12, color: "#1C1C1C" }}>次へ</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    );
  };

  navigateToOptionStore = () => {
    chooseStoreService.setStore({});
    this.props.navigation.navigate("OPTION_STORE");
  };

  getListPrescription = () => {
    this.setState(
      {
        isLoading: true,
        NetworkError: false,
      },
      () => {
        Api.getListPrescription()
          .then((result) => {
            //console.log("data Pres : ", result.res.data)
            if (result.code === 502) {
              this.setState({
                isMaintain: true,
                isLoading: false,
              });
              return;
            }
            let data = result.res.data;
            this.setState({
              warningContent: data.textConfig.value,
              listPrescription: data.listPrescription,
              isLoading: false,
              NetworkError: false,
              isMaintain: false,
            });
          })
          .catch((err) => {
            this.setState({
              isLoading: false,
              NetworkError: true,
              isMaintain: false,
            });
          });
      }
    );
  };

  navigateTermsOfUse = () => {
    this.props.navigation.navigate("TermsOfUseModal");
  };
  renderContent() {
    let data = this.state.listPrescription[this.state.numberOfPrescription];

    if (this.state.NetworkError) {
      return <NetworkError onPress={() => this.getListPrescription()} />;
    }
    if (this.state.isLoading) {
      return <Loading size={100} />;
    }
    return (
      <>
        <TouchableOpacity
          style={{
            width: "90%",
            height: "9.2%",
            backgroundColor: "#06B050",
            justifyContent: "center",
            marginTop: 27,
            borderRadius: 3,
          }}
          onPress={this.navigateToOptionStore}
        >
          <Text
            style={{
              fontSize: 18,
              color: COLOR_WHITE,
              fontWeight: "bold",
              marginLeft: 28,
            }}
          >
            処方せん受付を開始する
          </Text>
          <View
            style={{
              position: "absolute",
              alignSelf: "flex-end",
              paddingRight: 25,
            }}
          >
            <AntDesignIcon name="right" color={COLOR_WHITE} size={22} />
          </View>
        </TouchableOpacity>
        <View
          style={{
            marginTop: 25,
            width: "90%",
            flex: 1,
            borderWidth: 2,
            borderColor: "#E4E4E4",
            borderRadius: 3,
            paddingHorizontal: 17,
            paddingTop: 18,
            backgroundColor: "#F6F6F6",
          }}
        >
          {this.state.listPrescription.length == 0
            ? this.renderNoPrescription()
            : this.renderPrescription(data)}
        </View>
        <TouchableOpacity
          style={styles.termsBtn}
          onPress={this.navigateTermsOfUse}
        >
          <Text
            style={{
              fontSize: 14,
              color: "#1C1C1C",
              textDecorationLine: "underline",
            }}
          >
            利用規約
          </Text>
        </TouchableOpacity>
        <Modal
          isVisible={this.state.modalVisible}
          animationIn="fadeIn"
          animationOut="fadeOut"
          useNativeDriver={true}
          hideModalContentWhileAnimating={true}
        >
          <TouchableOpacity
            style={{ alignSelf: "flex-end", paddingRight: 15 }}
            onPress={this.closeModal}
          >
            <AntDesignIcon name="close" color={COLOR_WHITE} size={30} />
          </TouchableOpacity>
          <View
            style={{
              width: "90%",
              height: "61%",
              alignSelf: "center",
              backgroundColor: COLOR_WHITE,
              borderRadius: 3,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: "#1C1C1C",
                marginLeft: 17,
                marginTop: 20,
              }}
            >
              【来局時の注意事項】
            </Text>
            <ScrollView
              style={{
                flex: 1,
                marginHorizontal: 17,
                marginTop: 15,
                marginBottom: 15,
              }}
            >
              <HTML
                html={this.state.warningContent}
                baseFontStyle={{ fontSize: 16 }}
              />
            </ScrollView>
          </View>
        </Modal>
      </>
    );
  }
  render() {
    const { goBack } = this.props.navigation;
    if (this.state.isMaintain) {
      return (
        <MaintainView onPress={this.getListPrescription} timeOut={10000} />
      );
    }
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.wrapperContainer}>
          <StatusBar
            backgroundColor={COLOR_GRAY_LIGHT}
            barStyle="dark-content"
          />
          <HeaderIconLeft goBack={goBack} />
          {this.renderContent()}
        </View>
      </SafeAreaView>
    );
  }

  componentDidMount() {
    this.getListPrescription();
    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      const reload = hasReloadPrescriptionScreen();
      if (reload) {
        setReloadPrescriptionScreen(false);
        this.getListPrescription();
      }
    });
    const { routeName } = this.props.navigation.state;
    ReloadScreen.onChange(routeName, () => {
      this.getListPrescription();
    });
  }
  componentWillUnmount() {
    this.focusListener.remove();
    const { routeName } = this.props.navigation.state;
    ReloadScreen.unChange(routeName);
  }
}

const styles = StyleSheet.create({
  wrapperContainer: {
    flex: 1,
    backgroundColor: COLOR_WHITE,
    width: DEVICE_WIDTH,
    alignItems: "center",
  },
  progressBar: {
    height: getHeightInCurrentDevice(27),
    width: getWidthInCurrentDevice(292),
  },
  termsBtn: {
    marginTop: getHeightInCurrentDevice(10),
    alignSelf: "flex-start",
    marginLeft: getWidthInCurrentDevice(20),
    marginBottom: getHeightInCurrentDevice(15),
  },
  warningBtn: {
    width: getWidthInCurrentDevice(127),
    height: getHeightInCurrentDevice(31),
    marginRight: getWidthInCurrentDevice(17),
    position: "absolute",
    alignSelf: "flex-end",
    borderWidth: 1,
    borderColor: "#06B050",
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  receiveStatusView: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#646464",
    width: getWidthInCurrentDevice(96),
    height: getHeightInCurrentDevice(31),
  },
  prescriptionStatusView: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#646464",
    width: getWidthInCurrentDevice(120),
    height: getHeightInCurrentDevice(31),
    marginTop: getHeightInCurrentDevice(20),
  },
});
