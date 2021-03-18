//Library:
import React, { Component } from "react";
import { Text, View, StyleSheet, TextInput } from "react-native";
import Modal from "react-native-modal";
import { WheelPicker } from "react-native-wheel-picker-android";
import { Picker } from "@react-native-picker/picker";

//Setup:
import { SIZE } from "../../../const/size";
import { DEVICE_VERSION, isIOS } from "../../../const/System";
import ButtonConfirm from "./ButtonConfirm";

export default class ModalInputSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      dataModal: {
        textFormInput: "",
        itemSelect: "",
      },
    };
  }

  componentDidMount() {
    const { onRef } = this.props;
    onRef && onRef(this);
  }

  openModal = (paramsModal) => {
    console.log("paramsModal openModal", paramsModal);
    this.setState({
      isVisible: true,
      dataModal: {
        textFormInput: paramsModal.textFormInput,
        itemSelect: paramsModal.itemSelect,
      },
    });
  };

  closeModal = () => {
    this.setState({
      isVisible: false,
    });
  };

  onChangeText = (text) => {
    const { dataModal } = this.state;
    this.setState({
      dataModal: {
        textFormInput: text,
        itemSelect: dataModal.itemSelect
      },
    });
    dataModal.textFormInput = text;
  };

  onChangItemSelect = (value) => {
    const { dataModal } = this.state;
    if (isIOS) {
      this.setState({ dataModal: { ...dataModal, itemSelect: value } });
    } else {
      console.log("value", value);
    }
  };

  //Đẩy dữ liệu ra bên ngoài khi ấn nút OK.
  successInputModal = () => {
    const { getDataModalSelect, dataModalInputSelect } = this.props;
    const { dataModal } = this.state;
    if (dataModal.textFormInput) {
      if (!dataModal.itemSelect) {
        //Nếu không chọn itemSelect thì giá trị mặc định của nó là phần tử đầu tiên trong mẳng.
        dataModal.itemSelect = dataModalInputSelect[0];
      }
      getDataModalSelect(dataModal);
      this.closeModal();
    } else {
      alert("Please check text input");
    }
  };

  onItemSelected = (indexItemSelect) => {
    const { dataModalInputSelect } = this.props;
    const { dataModal } = this.state;
    console.log("indexItemSelect", indexItemSelect);
    this.setState({
      dataModal: {
        ...dataModal,
        itemSelect: dataModalInputSelect[indexItemSelect],
      },
    });
  };
  getIndexItemWheelPiker = () => {
    const { dataModalInputSelect } = this.props;
    const { dataModal } = this.state;
    let index = dataModalInputSelect.indexOf(dataModal.itemSelect);
    if (index > -1) {
      return index;
    }
    return 0;
  };
  renderPicker = () => {
    const { dataModal } = this.state;
    const { dataModalInputSelect } = this.props;
    if (isIOS) {
      return (
        <Picker
          selectedValue={dataModal.itemSelect}
          onValueChange={this.onChangItemSelect}
        >
          {dataModalInputSelect.map((item, index) => {
            return <Picker.Item key={`${index}`} label={item} value={item} />;
          })}
        </Picker>
      );
    } else {
      return (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            marginTop: SIZE.height(5),
          }}
        >
          <WheelPicker
            selectedItem={this.getIndexItemWheelPiker()}
            data={dataModalInputSelect}
            onItemSelected={this.onItemSelected}
          />
        </View>
      );
    }
  };

  render() {
    const { titleModalInputSelect } = this.props;
    const { isVisible, dataModal } = this.state;
    return (
      <Modal
        hasBackdrop
        isVisible={isVisible}
        animationIn="fadeIn"
        animationOut="fadeOut"
        onRequestClose={this.handleVisible}
        onBackdropPress={this.handleVisible}
        animationInTiming={600}
        backdropTransitionInTiming={600}
        backdropOpacity={0.4}
        style={{
          margin: 0,
          justifyContent: "center",
        }}
        useNativeDriver={true}
        hideModalContentWhileAnimating={true}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            borderRadius: 3,
          }}
        >
          <View
            style={{
              height: 60,
              backgroundColor: "red",
              width: SIZE.width(100),
              marginTop: SIZE.height(4),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={styles.textTitleAndOK}>{titleModalInputSelect}</Text>
            <ButtonConfirm
              textButton={"OK"}
              styleTextButton={{
                fontSize: SIZE.H4,
                color: "white",
                fontWeight: "bold",
              }}
              onPress={this.successInputModal}
              styleButton={{
                height: 60,
                width: 60,
                position: "absolute",
                alignItems: "center",
                justifyContent: "center",
                right: SIZE.width(3),
                backgroundColor: "red",
                borderWidth: SIZE.width(1),
                borderColor: "red",
                paddingVertical: 0,
              }}
            />
          </View>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                height: SIZE.height(35),
                width: SIZE.width(100),
                alignItems: "center",
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: SIZE.width(54),
                  justifyContent: "center",
                }}
              >
                <TextInput
                  value={dataModal.textFormInput}
                  keyboardType={"numeric"}
                  onChangeText={this.onChangeText}
                  style={{
                    height: 40,
                    width: SIZE.width(48),
                    borderWidth: SIZE.width(0.3),
                    borderRadius: SIZE.width(2),
                    marginLeft: SIZE.width(2),
                    textAlign: "center",
                  }}
                />
              </View>

              <View
                style={{
                  width: SIZE.width(51),
                }}
              >
                {this.renderPicker()}
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  textTitleAndOK: {
    color: "white",
    fontSize: SIZE.H4,
    fontWeight: "bold",
  },
});
