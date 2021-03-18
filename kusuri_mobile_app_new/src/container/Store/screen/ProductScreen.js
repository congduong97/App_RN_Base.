import React, { Component } from "react";
import { View, FlatList } from "react-native";
import { NavigationEvents } from "react-navigation";
import ItemProduct from "../item/ItemProduct";
import { CheckBoxSearchService } from "../../SearchResultsStoreMoreOptions/until/service";
import { Api } from "../until/api";
import { Loading, NetworkError } from "../../../commons";
export default class ProductScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataCheck: [],
      dataTag: [],
      loading: true,
      err: false,
    };
  }
  componentDidMount() {
    this.onDidMount();
  }
  onDidMount = async () => {
    const { loading } = this.state;
    this.state.err = false;
    if (!loading) {
      this.setState({
        loading: false,
      });
    }
    await this.getListTag();
    this.setState({
      loading: false,
    });
  };

  getListTag = async () => {
    // alert("oke");
    try {
      const response = await Api.getListTag();
      if (response.code === 200 && response.res.status.code === 1000) {
        this.state.dataTag = response.res.data;
      } else {
        this.state.err = true;
      }
    } catch (err) {
      this.state.err = true;
    }
  };
  clickTag = (click, id) => {
    if (click) {
      CheckBoxSearchService.set({ type: "delete", iDCheck: id });
      const data = this.state.dataCheck;
      for (let i = 0; i <= data.length; i++) {
        if (parseInt(data[i]) === parseInt(id)) {
          data.splice(i, 1);
        }
      }
    } else {
      CheckBoxSearchService.set({ type: "addData", iDCheck: id });
      this.state.dataCheck.push(id);
      this.setState({
        dataCheck: this.state.dataCheck,
      });
    }
  };
  renderItemProduct = ({ item, index }) => {
    const { loading } = this.state;
    return (
      <ItemProduct
        click={this.state.click}
        clickTag={this.clickTag}
        data={item}
        index={index}
        loading={loading}
        id={item.id}
      />
    );
  };
  renderContainer = () => {
    const { dataTag, loading, err } = this.state;
    if (loading) {
      return <Loading />;
    }
    if (err) {
      return <NetworkError onPress={() => this.onDidMount()} disablePopup />;
    }
    if (dataTag && dataTag.length === 0) {
      return null;
    }
    return (
      <FlatList
        numColumns={4}
        data={dataTag}
        extraData={this.state}
        keyExtractor={(item, index) => `${item.id}`}
        renderItem={this.renderItemProduct}
        onEndReachedThreshold={0.2}
      />
    );
  };
  setFalseCheck = () => {
    this.setState({
      dataCheck: [],
    });
  };
  render() {
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <NavigationEvents onDidFocus={(item) => this.setFalseCheck()} />
        {this.renderContainer()}
      </View>
    );
  }
}
