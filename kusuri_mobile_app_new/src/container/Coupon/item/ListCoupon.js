import React, { Component } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  RefreshControl,
  Text,
} from "react-native";

import ItemListCoupon from "./ItemListCoupon";
import { couponService } from "../util/service";

export default class ListCoupon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listCoupon: [],
      refreshing: false,
    };
  }

  componentDidMount() {
    this.setState({ listCoupon: couponService.getCoupon(this.props.type) });
    couponService.registerReloadListCoupon(() => {
      this.setState({
        listCoupon: couponService.getCoupon(this.props.type),
        refreshing: false,
      });
    }, this.props.type);
  }

  renderCoupon = (coupon) => {
    const { onUseCoupon } = this.props;
    // console.log("coupon", coupon);
    return (
      <ItemListCoupon
        type={this.props.type}
        key={`${coupon.id}-${coupon.usedTime}`}
        coupon={coupon}
        onUseCoupon={onUseCoupon}
      />
    );
  };

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.props.onRefresh();
  };

  renderListCoupon = () => {
    const { listCoupon, refreshing } = this.state;
    if (listCoupon && Array.isArray(listCoupon) && listCoupon.length > 0) {
      return (
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.onRefresh}
            />
          }
        >
          {listCoupon.map((coupon) => this.renderCoupon(coupon))}
        </ScrollView>
      );
    }
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            padding: 16,
            fontSize: 18,
            textAlign: "center",
          }}
        >
          対象クーポンが見つかりませんでした。
        </Text>
      </View>
    );
  };
  render() {
    console.log("list coupon", this.state.listCoupon);
    return <View style={{ flex: 1 }}>{this.renderListCoupon()}</View>;
  }
}
