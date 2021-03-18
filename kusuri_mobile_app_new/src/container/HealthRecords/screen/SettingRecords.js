//Library:
import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";

//Setup:
import { Api } from "../util/api";
import { COLOR_GREEN_RECORDS } from "../../../const/Color";
import { SIZE } from "../../../const/size";

//Component:
import { Loading, NetworkError } from "../../../commons";
import Container from "../../../commons/Container";
import MaintainView from "../../../commons/MaintainView";

export default class SettingRecords extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listMenu: [],
      loading: true,
      networkError: false,
      maintain: false,
      refresh: false,
    };
  }

  async componentDidMount() {
    this.getData();
  }

  getData = async () => {
    try {
      this.setState({
        loading: true,
        networkError: false,
        maintain: false,
      });
      const response = await Api.getListMenuSetting();
      if (response.code === 200 && response.res.status.code === 1000) {
        this.state.listMenu = response.res.data || [];
      } else if (response.code === 502 || response.res === "timeout") {
        this.state.maintain = true;
      } else {
        this.state.networkError = true;
      }
      this.setState({ loading: false });
    } catch (error) {
      this.setState({ loading: false, networkError: true });
    }
  };

  onRefresh = async () => {
    this.setState({ refresh: true });
    await this.getData();
    this.setState({ refresh: false });
  };

  onPress = (item) => () => {
    this.props.navigation.navigate(item.function);
  };
  renderContent = () => {
    const { loading, networkError, refresh, listMenu } = this.state;
    if (loading || refresh) {
      return <Loading />;
    }

    if (networkError) {
      return <NetworkError onPress={this.onRefresh} />;
    }
    return (
      <ScrollView
        style={{ backgroundColor: "#E4E4E4" }}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={this.onRefresh} />
        }
      >
        <View
          style={{
            marginLeft: SIZE.width(5),
            flexDirection: "row",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <View
            style={{
              height: "100%",
              width: 2,
              backgroundColor: "red",
            }}
          />
          <Text
            style={{
              marginLeft: SIZE.width(2),
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            設定
          </Text>
        </View>
        {listMenu.map((item, index) => {
          return (
            <TouchableOpacity
              key={`${index}`}
              onPress={this.onPress(item)}
              style={{
                backgroundColor: "white",
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: SIZE.width(5),
                paddingHorizontal: SIZE.width(5),
                paddingVertical: 20,
                alignItems: "center",
                marginTop: 20,
                borderRadius: 5,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.18,
                shadowRadius: 1.0,
                elevation: 2,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  resizeMode='contain'
                  source={{ uri: item.iconUrl }}
                  style={{
                    height: SIZE.width(11),
                    width: SIZE.width(11),
                    borderRadius: SIZE.width(6),
                  }}
                />
                <Text style={{ marginLeft: SIZE.width(4), fontSize: 18 }}>
                  {item.name}
                </Text>
              </View>

              <AntDesign name='right' size={16} color={COLOR_GREEN_RECORDS} />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  render() {
    const { maintain } = this.state;
    if (maintain) {
      return <MaintainView onPress={this.getData} timeOut={10000} />;
    }
    return <Container>{this.renderContent()}</Container>;
  }
}
