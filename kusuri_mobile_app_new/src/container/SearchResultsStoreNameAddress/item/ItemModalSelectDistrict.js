import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  RefreshControl
} from "react-native";
import Modal from "react-native-modal";
import { DEVICE_WIDTH } from "../../../const/System";
import { COLOR_RED, APP_COLOR } from "../../../const/Color";
import AntDesign from "react-native-vector-icons/AntDesign";
import { CheckBoxNameService } from "../../SearchResultsStoreMoreOptions/until/service";
import { STRING } from "../until/string";
import { setValueAllItem } from "../../Store/until/service";
import { setNameCheck } from "../until/service";
import { Api } from "../until/api";
export default class ItemModalSelectDistrict extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isModalVisible: false,
      placehoder: STRING.placehoderDistrict,
      valueCities: "",
      loadingDistrict: false,
      dataDistricts: [],
      errDistricts: false,
      totalPagesDistrict: 1,
      isLoadingRefresh: false,
      pageDistrict: 1,
      loadNextPageDistrict: false,
      isLoadingRefreshDistrict: false
    };
  }
  componentDidMount() {
    setNameCheck.onChange("districtName", data => {
      if (data.data.type === "checkDistrictName" && data.data.ischeck) {
        let id = "";
        const { valueText } = this.props;
        if (valueText) {
          valueText(id);
        }
        const data = {
          district: ""
        };
        this.setState(
          {
            dataDistricts: [],
            placehoder: STRING.placehoderDistrict
          },
          () => CheckBoxNameService.set(data)
        );
      }
      if (data.data.type === "SetCheckCityDistrict" && data.data.checkCity) {
        this.closeOptions();
      }
    });
    setValueAllItem.onChange("SetIdCity", data => {
      if (data.data.type === "setIDCitySearchName") {
        this.setState(
          {
            pageDistrict: 1,
            valueCities: data.idCity,
            placehoder: STRING.placehoderDistrict
          },
          () => this.getListDistricts()
        );
      }
    });
  }

  getListDistricts = async refreshLoading => {
    try {
      if (refreshLoading) {
        this.setState({
          pageDistrict: 1,
          isLoadingRefreshDistrict: true
        });
      } else {
        this.setState({
          loadingDistrict: true
        });
      }

      const { valueCities } = this.state;
      const respones = await Api.getListDistricts(valueCities, 1, 10);
      if (respones.code === 200 && respones.res.status.code === 1000) {
        this.state.dataDistricts = respones.res.data.content;
        this.state.totalPagesDistrict = respones.res.data.totalPages;
        (this.state.loadingDistrict = false), (this.state.errDistricts = false);
      }
    } catch (err) {
      this.state.errDistricts = true;
    } finally {
      this.setState({
        isLoadingRefreshDistrict: false,
        loadingDistrict: false
      });
    }
  };

  getApiNextPageDistrict = async () => {
    try {
      this.setState({
        loadNextPageDistrict: true
      });
      const { valueCities } = this.state;
      const response = await Api.getListDistricts(
        valueCities,
        this.state.pageDistrict + 1,
        10
      );
      this.state.pageDistrict = this.state.pageDistrict + 1;
      if (response.code === 200 && response.res.status.code === 1000) {
        this.state.dataDistricts = [
          ...this.state.dataDistricts,
          ...response.res.data.content
        ];
        this.state.errDistricts = false;
      }
    } catch (err) {
      this.state.errDistricts = true;
    } finally {
      this.setState({ loadNextPageDistrict: false });
    }
  };
  componentWillUnmount() {
    setNameCheck.unChange("districtName");
    setValueAllItem.unChange("SetIdCity");
  }
  enableModal = () => {
    // const { data } = this.props;
    const { dataDistricts, errDistricts } = this.state;
    if (dataDistricts) {
      if (
        dataDistricts === undefined ||
        dataDistricts.length === 0 ||
        errDistricts
      ) {
        // this.setState({
        //     isModalVisible: false,
        // });
        Alert.alert("お住まいの県を選択してください。", "");
      } else {
        this.setState({
          isModalVisible: true
        });
      }
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
      district: item
    };
    const { valueText } = this.props;
    CheckBoxNameService.set(data);
    if (valueText) {
      valueText(item.id, item.name);
    }
    this.state.placehoder = item.name;
    this.state.id = item.id;
    this.setState({
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
        <Text style={{ marginTop: 16, marginBottom: 16 }}>{item.name}</Text>
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
      district: STRING.placehoderDistrict
    };

    CheckBoxNameService.set(data);
    this.setState({
      isModalVisible: false,
      placehoder: STRING.placehoderDistrict
    });
  };

  loaMoreDistrict = () => {
    const {
      loadNextPageDistrict,
      totalPagesDistrict,
      pageDistrict
    } = this.state;
    if (totalPagesDistrict > pageDistrict && !loadNextPageDistrict) {
      this.getApiNextPageDistrict();
    }
  };
  renderContainer = () => {
    const { dataDistricts, isLoadingRefreshDistrict } = this.state;
    return (
      <FlatList
        data={dataDistricts}
        renderItem={this.renderItem}
        keyExtractor={(item, index) => `${index}`}
        refreshControl={
          <RefreshControl
            refreshing={isLoadingRefreshDistrict}
            onRefresh={() => this.getListDistricts(true)}
          />
        }
        onEndReachedThreshold={0.5}
        onEndReached={this.loaMoreDistrict}
      />
    );
  };
  render() {
    const { placehoder } = this.state;
    return (
      <TouchableOpacity style={styles.container} onPress={this.enableModal}>
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
          swipeToClose={false}
          hideModalContentWhileAnimating={true}
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
