import React, { Component } from "react";
import { StyleSheet, View } from "react-native";

import { ButtonTypeOne } from "../../../commons";
import { couponService } from "../util/service";

export default class ButtonSelectListCoupon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listCouponSelect: []
    };
  }

  componentDidMount() {
    couponService.regisButtonCouponScreen(() => {
      this.setState({ listCouponSelect: couponService.getListCoupon() || [] });
    });
  }

  moveToList = () => {
    const { listCouponSelect } = this.state;
    const { onUseCoupon } = this.props;
    this.props.navigation.navigate("CouponsSelect", {
      onUseCoupon
    });
  };

  render() {
    const { listCouponSelect } = this.state;
  
    if (!listCouponSelect) return null;
    if (listCouponSelect.length === 0) return null;
    return (
      <View
        style={{
          padding: 10,
          marginBottom: 10
        }}
      >
        <ButtonTypeOne
          name="クーポンをまとめて利用する"
          style={{
            marginTop: 0,
            marginBottom: 0,
            backgroundColor: "rgb(252,13,27)"
          }}
          onPress={this.moveToList}
        />
      </View>
    );
  }
}
