import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl
} from "react-native";
import Modal from "react-native-modal";
import { DEVICE_WIDTH } from "../../../const/System";
import { COLOR_RED, APP_COLOR } from "../../../const/Color";
import AntDesign from "react-native-vector-icons/AntDesign";
import { NavigationEvents } from "react-navigation";
import { CheckBoxNameService } from "../../SearchResultsStoreMoreOptions/until/service";
import { STRING } from "../until/string";
import { Api } from "../until/api";
export default class ItemModalSelectTimeOpentime extends PureComponent {
  constructor(props) {
    super(props);
    const { placehoder } = this.props;
    this.state = {
      isModalVisible: false,
      placehoder: placehoder,
      loadingTimeOpen: false,
      dataOpenTime: [],
      errTimeOpne: false,
      value: "",
      isLoadingRefreshOptime: false
    };
  }
  componentDidMount() {
    this.getListOpenTime();
  }
  getListOpenTime = async refeshLoading => {
    try {
      if (refeshLoading) {
        this.setState({
          isLoadingRefreshOptime: true
        });
      } else {
        this.setState({
          loadingTimeOpen: true
        });
      }

      const response = await Api.getListOpenTime();
      if (response.code === 200 && response.res.status.code === 1000) {
        this.state.dataOpenTime = response.res.data;
        this.state.loadingTimeOpen = false;
        this.state.errTimeOpne = false;
      } else {
        this.state.errTimeOpne = true;
      }
    } catch (err) {
      this.state.errTimeOpne = true;
    } finally {
      this.setState({
        isLoadingRefreshOptime: false,
        loadingTimeOpen: false
      });
    }
  };
  enableModal = () => {
    const { dataOpenTime, errTimeOpne } = this.state;
    if (dataOpenTime.length === 0 || errTimeOpne) {
      this.setState({
        isModalVisible: false
      });
    } else {
      this.setState({
        isModalVisible: true
      });
    }
  };
  setColorValueSlect = (index, item) => {
    const { placehoder } = this.state;
    if (item.name === placehoder) {
      return APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1;
    }
  };
  setValueSelect = item => {
    const data = {
      startTime: item
    };
    CheckBoxNameService.set(data);
    const { valueText } = this.props;
    if (valueText) {
      valueText(item.value);
    }
    this.state.placehoder = item.name;
    this.setState({
      value: item.value,
      isModalVisible: false
    });
  };
  renderItem = ({ index, item }) => {
    return (
      <TouchableOpacity
        onPress={() => this.setValueSelect(item)}
        style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: this.setColorValueSlect(index, item)
        }}
      >
        <Text style={{ marginTop: 16, marginBottom: 16, fontSize: 18 }}>
          {item.name}
        </Text>
        <View
          style={{
            width: "100%",
            borderBottomWidth: 1,
            borderColor: APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1
          }}
        ></View>
      </TouchableOpacity>
    );
  };
  closeOptions = () => {
    let id = "";
    const { valueText } = this.props;
    if (valueText) {
      valueText(id);
    }
    const data = {
      startTime: {
        name: STRING.placehoderOpentime
      }
    };
    CheckBoxNameService.set(data);
    this.setState({
      isModalVisible: false,
      placehoder: STRING.placehoderOpentime
    });
  };
  renderContainer = () => {
    const { dataOpenTime, isLoadingRefreshOptime } = this.state;
    return (
      <FlatList
        data={dataOpenTime}
        renderItem={this.renderItem}
        keyExtractor={(item, index) => `${index}`}
        refreshControl={
          <RefreshControl
            refreshing={isLoadingRefreshOptime}
            onRefresh={() => this.getListOpenTime(true)}
          />
        }
        onEndReachedThreshold={0.2}
      />
    );
  };
  checkvalueNow = () => {
    const { placehoder, value } = this.state;
    this.setState({
      placehoder: STRING.placehoderOpentime
    });
    let id = "";
    const { valueText } = this.props;
    if (valueText) {
      valueText(id);
    }
    // const data = {
    //   startTime: {
    //     value: value,
    //     name: placehoder
    //   }
    // };
    // CheckBoxNameService.set(data);
  };
  render() {
    const { placehoder } = this.state;
    return (
      <TouchableOpacity style={styles.container} onPress={this.enableModal}>
        <NavigationEvents onDidFocus={this.checkvalueNow} />
        <View style={{ flex: 1 }}>
          <Text style={{ paddingLeft: 10 }}>{placehoder}</Text>
        </View>
        <View>
          <AntDesign
            name="caretdown"
            size={15}
            style={{ alignItems: "flex-end", right: 5 }}
            color={"#525354"}
          />
        </View>
        <Modal
          isVisible={this.state.isModalVisible}
          useNativeDriver={true}
          onBackdropPress={this.closeOptions}
          duration={0}
          animationInTiming={500}
          animationOutTiming={500}
          backdropTransitionInTiming={800}
          backdropTransitionOutTiming={800}
          backdropOpacity={0.8}
          hideModalContentWhileAnimating={true}
          swipeToClose={false}
          style={styles.modalStyle}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center",
                borderBottomWidth: 1,
                borderColor: COLOR_RED
              }}
              onPress={this.closeOptions}
            >
              <Text
                style={{
                  color: COLOR_RED,
                  marginTop: 16,
                  fontWeight: "bold",
                  marginBottom: 16
                }}
              >
                空欄
              </Text>
            </TouchableOpacity>
            {this.renderContainer()}
          </View>
        </Modal>
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    width: "92%",
    borderWidth: 1,
    borderColor: "#A3A4A5",
    height: 45,
    borderRadius: 4,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center"
  },
  modalStyle: {
    alignItems: "center"
  },
  modalContent: {
    backgroundColor: "white",
    width: DEVICE_WIDTH - 100,
    borderRadius: 4,
    height: DEVICE_WIDTH
  }
});
