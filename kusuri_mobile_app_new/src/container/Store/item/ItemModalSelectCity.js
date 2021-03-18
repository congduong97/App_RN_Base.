import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl
} from "react-native";
import Modal from "react-native-modal";
import { DEVICE_WIDTH } from "../../../const/System";
import { Loading } from "../../../commons";
import { COLOR_RED, APP_COLOR, COLOR_WHITE } from "../../../const/Color";
import AntDesign from "react-native-vector-icons/AntDesign";
import { CheckBoxNameService } from "../../SearchResultsStoreMoreOptions/until/service";
import { NavigationEvents } from "react-navigation";
import { setValueAllItem } from "../until/service";
import { Api } from "../until/api";
import { STRING } from "../until/string";
export default class ItemModalSelect extends PureComponent {
  constructor(props) {
    super(props);
    const { placehoder } = this.props;
    this.state = {
      isModalVisible: false,
      placehoder: placehoder,
      loadingCity: false,
      errCity: false,
      dataListCities: [],
      totalPagesListCity: 1,
      isLoadingRefreshCity: false,
      page: 1,
      loadingNextPage: false,
      valueCity: ""
    };
  }
  componentDidMount() {
    this.getListCities();
  }

  getListCities = async load => {
    try {
      if (load) {
        this.setState({
          isLoadingRefreshCity: true,
          page: 1
        });
      } else {
        this.setState({
          loadingCity: true
        });
      }
      const respones = await Api.getListCities(1, 10);
      if (respones.code === 200 && respones.res.status.code === 1000) {
        this.state.dataListCities = respones.res.data.content;
        this.state.totalPagesListCity = respones.res.data.totalPages;
        this.state.loadingCity = false;
      } else {
        this.state.errCity = true;
      }
    } catch (err) {
      this.state.errCity = true;
    } finally {
      this.setState({
        isLoadingRefreshCity: false,
        loadingCity: false
      });
    }
  };

  getApiNextPageCity = async () => {
    try {
      this.setState({
        loadingNextPage: true
      });
      const response = await Api.getListCities(this.state.page + 1, 10);
      this.state.page = this.state.page + 1;
      if (response.code === 200 && response.res.status.code === 1000) {
        this.state.dataListCities = [
          ...this.state.dataListCities,
          ...response.res.data.content
        ];
        this.state.errCity = false;
      }
    } catch (err) {
      this.state.errCity = true;
    } finally {
      this.setState({ loadingNextPage: false });
    }
  };
  enableModal = () => {
    const { dataListCities, errCity } = this.state;
    if (dataListCities.length === 0 || errCity) {
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
  setColorTextValueSlect = (index, item) => {
    const { placehoder } = this.state;
    if (item.name === placehoder) {
      return COLOR_WHITE;
    }
  };

  setValueSelect = item => {
    const data = {
      city: item
    };
    const { valueText } = this.props;
    CheckBoxNameService.set(data);
    setValueAllItem.set({ type: "setIDCity", item });
    if (valueText) {
      valueText(item.id);
    }
    this.state.placehoder = item.name;
    this.setState({
      valueCity: item.id,
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
        <Text
          style={{
            marginTop: 16,
            marginBottom: 16,
            color: this.setColorTextValueSlect(index, item)
          }}
        >
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
      city: {
        name: STRING.placehoderCity
      }
    };
    CheckBoxNameService.set(data);
    this.setState({
      isModalVisible: false,
      placehoder: STRING.placehoderCity
    });
    setValueAllItem.set({ type: "checkDistrictStoreHome", idCheck: true });
  };
  callApiCity = () => {
    const { callApiCity } = this.props;
    if (callApiCity) {
      callApiCity(true);
    }
  };
  loaMore = () => {
    const { loaMore } = this.props;
    if (loaMore) {
      loaMore();
    }
  };

  loadNextPage = () => {
    const { totalPagesListCity, loadingNextPage, page } = this.state;
    if (totalPagesListCity > page && !loadingNextPage) {
      this.getApiNextPageCity();
    }
  };

  renderContainer = () => {
    const {
      dataListCities,
      isLoadingRefreshCity,
      loadingNextPage
    } = this.state;
    return (
      <FlatList
        data={dataListCities}
        refreshControl={
          <RefreshControl
            refreshing={isLoadingRefreshCity}
            onRefresh={() => this.getListCities(true)}
          />
        }
        renderItem={this.renderItem}
        keyExtractor={(item, index) => `${item.id}`}
        ListFooterComponent={loadingNextPage ? <Loading /> : null}
        onEndReached={this.loadNextPage}
        onEndReachedThreshold={0.5}
      />
    );
  };
  checkvalueNow = () => {
    const { placehoder, valueCity } = this.state;
    this.setState({
      placehoder: STRING.placehoderCity
    });
    let id = "";
    const { valueText } = this.props;
    if (valueText) {
      valueText(id);
    }
    // const data = {
    //   city: {
    //     name: placehoder,
    //     id: valueCity
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
              onPress={() => this.closeOptions()}
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
