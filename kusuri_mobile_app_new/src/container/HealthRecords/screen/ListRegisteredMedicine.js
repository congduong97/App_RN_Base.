//Library:
import React, { Component, Fragment } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import moment from "moment";
import Icon from "react-native-vector-icons/AntDesign";

//Setup:
import { Api } from "../util/api";
import { SIZE } from "../../../const/size";

//Component:
import { Loading, NetworkError } from "../../../commons";
import MaintainView from "../../../commons/MaintainView";
import NavigationService from "../../../service/NavigationService";
import Container from "../../../commons/Container";
import UserHeaderSelect from "../item/UserHeaderSelect";

//Services:
import { UserService } from "../util/UserService";
import { EVENT_CHANGE_CURRENT_USER } from "../util/constant";

class ItemRegisteredMedicine extends Component {
  renderTitle = () => {
    const { item } = this.props;
    const imageUrl =
      item.createFrom === "FROM_QR"
        ? require("../imgs/qr_code.png")
        : require("../imgs/manual.png");
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            backgroundColor: "#06B050",
            justifyContent: "center",
            alignItems: "center",
            width: SIZE.width(8),
            height: SIZE.width(8),
            borderRadius: SIZE.width(4),
          }}
        >
          <Image
            style={{
              width: SIZE.width(4.2),
              height: SIZE.width(4.2),
            }}
            resizeMode='contain'
            source={imageUrl}
          />
        </View>
        {/*  Tên bệnh viện */}
        <Text
          style={{
            flexShrink: 1,
            fontSize: SIZE.H4,
            paddingLeft: 10,
            color: "#06B050",
            fontWeight: "bold",
          }}
        >
          {item.p51Name}
        </Text>
      </View>
    );
  };

  renderImageMedicine = (urlImg) => {
    if (urlImg) {
      return (
        <Image
          resizeMode={"contain"}
          source={{ uri: urlImg }}
          style={{
            width: SIZE.width(12),
            height: SIZE.width(12),
          }}
        />
      );
    }
    return (
      <View
        style={{
          width: SIZE.width(12),
          height: SIZE.width(12),
          borderRadius: 6,
          backgroundColor: "#C6C6C6",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <Image
          resizeMode={"contain"}
          source={require("../imgs/medicine.png")}
          style={{
            width: SIZE.width(5.5),
            height: SIZE.width(5.5),
          }}
        />
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: SIZE.H5 / 2,
          }}
        >
          NO IMAGE
        </Text>
      </View>
    );
  };

  render() {
    const { item, index } = this.props;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          NavigationService.navigate("PRESCRIPTION_DETAILS", {
            navigationAction: "LIST_REGISTER_MEDICINE",
            medicateId: item.id,
          });
        }}
        style={{ marginTop: !!item.createdDate ? 26 : 0 }}
      >
        {!!item.createdDate && (
          <View
            style={{
              paddingLeft: 10,
              borderLeftColor: "#E41018",
              borderLeftWidth: 2,
            }}
          >
            <Text>{item.createdDate}</Text>
          </View>
        )}
        <View
          style={{
            padding: 18,
            backgroundColor: "#FFFFFF",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            elevation: 3,
            borderRadius: 5,
            marginTop: 20,
          }}
        >
          {this.renderTitle()}
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: "#00000029",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 16,
            }}
          >
            <View>
              {/* Hiệu thuốc kê đơn */}
              <Text style={itemStyles.text}>調剤薬局：{item.p11Name}</Text>
              <Text style={[itemStyles.text, { marginTop: 12 }]}>
                薬剤師：{item.p15Name}
              </Text>
            </View>
            <Icon name='right' size={SIZE.H4} color={"#06B050"} />
          </View>
          {/* p55 data start render*/}
          <View>
            {item.rpClusterDto &&
              item.rpClusterDto.map((p55Item, index) => {
                return (
                  <Fragment key={`${index}`}>
                    {/* {index === 0 && ( */}
                    <View
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: "#00000029",
                        paddingVertical: 16,
                      }}
                    >
                      {/* Khoa chữa bệnh */}
                      <Text style={itemStyles.text}>
                        診療科：{p55Item.p55_2_departmentMakeOutPresName}
                      </Text>
                      <Text style={[itemStyles.text, { marginTop: 12 }]}>
                        医師：{p55Item.p55_1_doctorMakeOutPresName}
                      </Text>
                    </View>
                    {/* )} */}
                    {/* Start render list drug */}
                    {p55Item.listDrug &&
                      p55Item.listDrug.map((drug, index) => {
                        return (
                          <View
                            key={`${index}`}
                            style={{
                              borderBottomWidth: 1,
                              borderBottomColor: "#00000029",
                              paddingVertical: 16,
                              flexDirection: "row",
                            }}
                          >
                            {this.renderImageMedicine(drug.p201DrugImageUrl)}
                            <View
                              style={{
                                paddingLeft: 16,
                                flexShrink: 1,
                              }}
                            >
                              {/* Tên thuốc */}
                              {!!drug.p201DrugName && (
                                <Text
                                  style={[
                                    itemStyles.text,
                                    {
                                      color: "#06B050",
                                      fontWeight: "bold",
                                      marginBottom: 8,
                                    },
                                  ]}
                                >
                                  {drug.p201DrugName}
                                </Text>
                              )}
                              {/* Liều dùng */}
                              {!!drug.p281Content && (
                                <Text style={itemStyles.text}>
                                  {drug.p281Content}
                                </Text>
                              )}
                              {/* Hướng dẫn */}
                              {!!drug.p301UsingInstruction && (
                                <Text
                                  style={[itemStyles.text, { marginTop: 4 }]}
                                >
                                  {drug.p301UsingInstruction}
                                </Text>
                              )}
                            </View>
                          </View>
                        );
                      })}
                  </Fragment>
                );
              })}
          </View>
          {/* p55 data end render*/}
        </View>
      </TouchableOpacity>
    );
  }
}
const itemStyles = StyleSheet.create({
  text: { fontSize: SIZE.H5, color: "#1F1F20", flexShrink: 1 },
});

class ListRegisteredMedicine extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      date: moment(Date.now()).format("YYYY/MM/DD"),
      data: null,
      page: 1,
      networkError: false,
      maintain: false,
      refresh: false,
      size: 5,
      last: false,
    };
    this.dayRender = [];
  }
  componentDidMount() {
    this.getData();

    UserService.onChange("RELOAD_LIST_REGISTER_MEDICINE", (listUser, event) => {
      if (event == EVENT_CHANGE_CURRENT_USER) {
        console.log("RELOAD_LIST_REGISTER_MEDICINE", listUser);
        this.onRefresh();
      }
    });
  }

  componentWillUnmount() {
    UserService.remove("RELOAD_LIST_REGISTER_MEDICINE");
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.date !== this.state.date) {
      this.state.page = 1;
      this.state.last = false;
      this.state.data = null;
      this.dayRender = [];
      this.getData();
    }
  }

  clearDuplicateDay = (data) => {
    if (data) {
      data.forEach((item) => {
        if (this.dayRender.includes(item.createdDate)) {
          item.createdDate = null;
        } else {
          this.dayRender.push(item.createdDate);
        }
      });
    }

    return data;
  };

  getData = async () => {
    try {
      this.setState({
        loading: true,
        networkError: false,
        maintain: false,
      });
      const { date, page, size } = this.state;
      const startOfMonth = moment(new Date(date))
        .clone()
        .startOf("month")
        .format("YYYY/MM/DD");
      const endOfMonth = moment(new Date(date))
        .clone()
        .endOf("month")
        .format("YYYY/MM/DD");
      const currentUser = UserService.getListUser().currentUser;
      const response = await Api.getListPrescription(
        currentUser?.id,
        startOfMonth,
        endOfMonth,
        page,
        size
      );
      if (response.code === 200 && response.res.status.code === 1000) {
        this.state.data = this.clearDuplicateDay(response.res.data.content);
        this.state.last = response.res.data.last;
        this.state.page = page + 1;
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

  renderTime = () => {
    const { date, loading, networkError, maintain } = this.state;
    const hideNext = date === moment(Date.now()).format("YYYY/MM/DD");
    if (networkError || maintain) {
      return null;
    }
    return (
      <View
        style={{
          height: SIZE.width(11),
          backgroundColor: "#E4E4E4",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,
          elevation: 3,
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: "#1F1F20",
            textAlign: "center",
            fontSize: SIZE.H4,
            fontWeight: "bold",
          }}
        >
          {moment(new Date(date)).format("YYYY/MM")}
        </Text>
        <TouchableOpacity
          hitSlop={{ top: 5, left: 5, bottom: 5, right: 5 }}
          disabled={loading}
          onPress={() => {
            const newDate = moment(new Date(date))
              .subtract(1, "months")
              .format("YYYY/MM/DD");
            this.setState({ date: newDate });
          }}
          style={{ position: "absolute", left: 16 }}
        >
          <Icon name='caretleft' size={SIZE.H4} color={"#1F1F20"} />
        </TouchableOpacity>
        {!hideNext && (
          <TouchableOpacity
            hitSlop={{ top: 5, left: 5, bottom: 5, right: 5 }}
            disabled={loading}
            onPress={() => {
              const newDate = moment(new Date(date))
                .add(1, "months")
                .format("YYYY/MM/DD");
              this.setState({ date: newDate });
            }}
            style={{ position: "absolute", right: 16 }}
          >
            <Icon name='caretright' size={SIZE.H4} color={"#1F1F20"} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  renderFooter = () => {
    const { loading, data } = this.state;
    if (loading && !!data) {
      return (
        <View style={{ paddingVertical: 5 }}>
          <Loading />
        </View>
      );
    }
    return null;
  };

  onLoadMore = async () => {
    const { size, page, last, loading, refresh, date } = this.state;

    if (loading || refresh || last) {
      return;
    }

    if (!loading) {
      this.setState({ loading: true });
    }

    const startOfMonth = moment(new Date(date))
      .clone()
      .startOf("month")
      .format("YYYY/MM/DD");
    const endOfMonth = moment(new Date(date))
      .clone()
      .endOf("month")
      .format("YYYY/MM/DD");
    try {
      const currentUser = UserService.getListUser().currentUser;
      const response = await Api.getListPrescription(
        currentUser?.id,
        startOfMonth,
        endOfMonth,
        page,
        size
      );
      if (response.code === 200 && response.res.status.code === 1000) {
        const dataMore = this.clearDuplicateDay(response.res.data.content);
        this.state.data = [...this.state.data, ...dataMore];
        this.state.last = response.res.data.last;
        this.state.page = page + 1;
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

  renderItem = ({ item, index }) => {
    return <ItemRegisteredMedicine item={item} />;
  };

  onRefresh = async () => {
    const { refresh } = this.state;
    if (!refresh) {
      this.setState({ refresh: true });
    }
    this.dayRender = [];
    this.state.data = null;
    this.state.last = false;
    this.state.page = 1;
    await this.getData();
    this.setState({ refresh: false });
  };

  renderContent = () => {
    const { loading, data, networkError, refresh } = this.state;
    if (loading && !data) {
      return <Loading />;
    }

    if (networkError) {
      return <NetworkError onPress={this.onRefresh} />;
    }

    if ((!data || data?.length == 0) && !loading) {
      return (
        <View style={{ flex: 1, backgroundColor: "#F6F6F6", padding: 30 }}>
          <Text
            style={{
              textAlign: "center",
              color: "#1F1F20",
              fontWeight: "bold",
              fontSize: SIZE.H5 + 2,
              lineHeight: SIZE.H5 * 1.8,
            }}
          >
            登録されているお薬がありません
            右下の＋ボタンで追加することができます
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        style={{
          backgroundColor: "#F6F6F6",
          padding: 18,
        }}
        contentContainerStyle={{ paddingBottom: SIZE.width(10) }}
        showsVerticalScrollIndicator={false}
        data={data}
        renderItem={this.renderItem}
        keyExtractor={(item) => `${item.id}`}
        refreshing={refresh}
        onRefresh={this.onRefresh}
        onEndReachedThreshold={0.2}
        onEndReached={this.onLoadMore}
        ListFooterComponent={this.renderFooter}
      />
    );
  };

  render() {
    const { navigation } = this.props;
    const { maintain, networkError } = this.state;

    if (maintain) {
      return <MaintainView onPress={this.getData} timeOut={10000} />;
    }
    return (
      <Container>
        <UserHeaderSelect navigation={this.props.navigation} />
        {this.renderTime()}
        {this.renderContent()}
        {!networkError && (
          <TouchableOpacity
            activeOpacity={0.65}
            onPress={() => {
              navigation.navigate("HOME_REGISTER_MEDICINE_RECORD");
            }}
            style={{
              width: SIZE.width(22),
              height: SIZE.width(22),
              backgroundColor: "#06B050",
              position: "absolute",
              borderRadius: SIZE.width(11),
              right: 20,
              bottom: 10,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: SIZE.H4,
                fontWeight: "bold",
              }}
            >
              登録
            </Text>
            <Image
              resizeMode={"contain"}
              style={{ width: SIZE.width(8.5), height: SIZE.width(8.5) }}
              source={require("../imgs/medicine_plus.png")}
            />
          </TouchableOpacity>
        )}
      </Container>
    );
  }
}

export default ListRegisteredMedicine;
