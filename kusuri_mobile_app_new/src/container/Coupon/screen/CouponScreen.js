import React, { Component } from "react";
import { TouchableOpacity, View, Dimensions, Text } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import { NavigationEvents } from "react-navigation";
import DeviceInfo from "react-native-device-info";

import { couponService } from "../util/service";
import { HeaderIconLeft, ButtonTypeOne } from "../../../commons";
import ListCoupon from "../item/ListCoupon";
import ButtonSelectListCoupon from "../item/ButtonSelectListCoupon";
import { DEVICE_WIDTH, isIOS } from "../../../const/System";
import { Api } from "../util/api";
import Loading from "../../../commons/Loading";
import { SIZE } from "../../../const/size";
import MaintainView from "../../../commons/MaintainView";
import { COLOR_RED } from "../../../const/Color";
export default class CouponScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routeTabview: {
        index: 0,
        routes: [],
      },
      isLoading: true,
      haveUse: false, //have coupon is using
      isMaintain: false,
    };
    this.active = true;
  }

  componentDidMount() {
    this.onDidMount();
  }
  componentWillUnmount() {
    this.active = false;
    couponService.clearCouponSelected();
    couponService.clearListCoupon();
  }
  onDidMount = async () => {
    const allCoupon = couponService.getCoupon("all");
    if (
      !allCoupon ||
      allCoupon.length === 0 ||
      couponService.getIsAddPlusCoupon()
    ) {
      if (couponService.getIsAddPlusCoupon()) {
        couponService.setIsAddPlusCoupon(false);
      }
      couponService.registerReloadCouponScreen(() => {
        this.setState({ isLoading: false });
      });
      console.log("call api");
      await this.getCoupons(1);
    } else {
      console.log("k0 call api");
      this.setState({ isLoading: false, isMaintain: false });
    }

    try {
      let listCouponUse = this.checkListUsed();
      // console.log("listCouponUse", listCouponUse);
      if (
        listCouponUse &&
        Array.isArray(listCouponUse) &&
        listCouponUse.length > 0
      ) {
        this.setState({ haveUse: true });
      }
    } catch (error) {
      this.setState({ isLoading: false });
    }
  };
  getCoupons = async (time) => {
    let listCoupons = await Api.getCoupons();
    console.log("getCoupons", listCoupons);
    if (listCoupons.code === 502) {
      this.setState({
        isMaintain: true,
        isLoading: false,
      });
      return;
    }

    if (listCoupons.code === 200 && listCoupons.res.status.code === 1000) {
      this.setState({
        isMaintain: false,
      });
      const routeTabview = this.getCategory(
        listCoupons.res.data.categoryCouponEntities
      );
      this.state.routeTabview = routeTabview;
      let listFormatCoupons = [];
      let listPlusCoupon = [];
      let listLimitCoupon = [];
      let listSpecialCoupon = [];
      if (listCoupons.res.data) {
        //init data if couponSettingEntity = null
        if (!listCoupons.res.data.couponSettingEntity) {
          listCoupons.res.data.couponSettingEntity = {
            limitTime: 0,
          };
        }
        couponService.setConfig(listCoupons.res.data.couponSettingEntity);

        const limitTime = listCoupons.res.data.couponSettingEntity.limitTime; //minute
        // console.log(
        //   "listLimitedCoupon",
        //   listCoupons.res.data["listLimitedCoupon"]
        // );
        if (listCoupons.res.data["listPointPlusCoupon"]) {
          listPlusCoupon = listCoupons.res.data["listPointPlusCoupon"].map(
            (coupon) => {
              if (coupon.countDownStart) {
                coupon.countDownStart = `${coupon.countDownStart} GMT+0900`;
              }
              if (coupon.usedTime) {
                coupon.usedTime = `${coupon.usedTime} GMT+0900`;
              }

              let payload = {
                ...coupon,
                countDown: 0,
                countDownStart: coupon.usedTime,
                typeHeader: "normal",
              };
              if (coupon.usedTime) {
                const currentTime = new Date();
                const use = new Date(coupon.usedTime);
                //minisecond
                const timeOut = currentTime.getTime() - use.getTime();
                //using
                if (timeOut < limitTime * 60000) {
                  payload.used = false;
                }
              } else {
                payload = {
                  ...coupon,
                  countDown: 0,
                  countDownStart: null,
                  typeHeader: "normal",
                };
              }
              if (coupon.usagePolicy === "COUNTLESS_TIME") {
                payload.used = false;
              }
              if (coupon.specialCoupon) {
                payload.typeHeader = "special";
              }
              return payload;
            }
          );
          // console.log("listPlusCoupon", listPlusCoupon);
        }
        if (listCoupons.res.data["listSpecialCoupon"]) {
          listSpecialCoupon = listCoupons.res.data["listSpecialCoupon"].map(
            (coupon) => {
              if (coupon.countDownStart) {
                coupon.countDownStart = `${coupon.countDownStart} GMT+0900`;
              }
              if (coupon.usedTime) {
                coupon.usedTime = `${coupon.usedTime} GMT+0900`;
              }
              let payload = { ...coupon };
              if (coupon.usedTime) {
                const currentTime = new Date();
                const use = new Date(coupon.usedTime);
                const timeOut = currentTime.getTime() - use.getTime();
                //using
                if (timeOut < limitTime * 60000) {
                  coupon.used = false;
                }

                payload = {
                  ...coupon,
                  countDown: 0,
                  countDownStart: coupon.usedTime,
                  typeHeader: "video",
                };
              } else {
                payload = {
                  ...coupon,
                  countDown: 0,
                  countDownStart: null,
                  typeHeader: "video",
                };
              }
              if (coupon.usagePolicy === "COUNTLESS_TIME") {
                payload.used = false;
              }
              return payload;
            }
          );
        }
        if (listCoupons.res.data["listLimitedCoupon"]) {
          listLimitCoupon = listCoupons.res.data["listLimitedCoupon"].map(
            (coupon) => {
              if (coupon.countDownStart) {
                coupon.countDownStart = `${coupon.countDownStart} GMT+0900`;
              }
              if (coupon.usedTime) {
                coupon.usedTime = `${coupon.usedTime} GMT+0900`;
              }
              let payload = { ...coupon };
              if (coupon.usedTime) {
                const currentTime = new Date();
                const use = new Date(coupon.usedTime);
                const timeOut = currentTime.getTime() - use.getTime();
                //using
                if (timeOut < limitTime * 60000) {
                  coupon.used = false;
                }

                payload = {
                  ...coupon,
                  countDown: 0,
                  countDownStart: coupon.usedTime,
                  typeHeader: "limit",
                };
              } else {
                payload = {
                  ...coupon,
                  countDown: 0,
                  countDownStart: null,
                  typeHeader: "limit",
                };
              }
              if (coupon.usagePolicy === "COUNTLESS_TIME") {
                payload.used = false;
              }
              return payload;
            }
          );
        }
        if (listCoupons.res.data["listNormalCoupon"]) {
          let formatOtherCoupon = listCoupons.res.data["listNormalCoupon"].map(
            (coupon) => {
              let payload = {
                ...coupon,
              };
              if (coupon.countDownStart) {
                coupon.countDownStart = `${coupon.countDownStart} GMT+0900`;
              }
              if (coupon.usedTime) {
                coupon.usedTime = `${coupon.usedTime} GMT+0900`;
              }
              if (coupon.usedTime) {
                const currentTime = new Date();
                const use = new Date(coupon.usedTime);

                //minisecond
                const timeOut = currentTime.getTime() - use.getTime();
                //using
                if (timeOut < limitTime * 60000) {
                  coupon.used = false;
                }
                // console.log("timeout", coupon.usedTime, timeOut);
                payload = {
                  ...coupon,
                  countDown: 0,
                  countDownStart: coupon.usedTime,
                  typeHeader: "normal",
                };
              } else {
                payload = {
                  ...coupon,
                  countDown: 0,
                  countDownStart: null,
                  typeHeader: "normal",
                };
              }
              if (coupon.usagePolicy === "COUNTLESS_TIME") {
                payload.used = false;
              }
              return payload;
            }
          );
          listFormatCoupons.push(...formatOtherCoupon);
        }
      }
      console.log("listPlusCoupon", listPlusCoupon);
      console.log("listSpecialCoupon", listSpecialCoupon);
      console.log("listLimitCoupon", listLimitCoupon);
      console.log("listFormatCoupons", listFormatCoupons);
      listFormatCoupons = [
        ...listPlusCoupon,
        ...listSpecialCoupon,
        ...listLimitCoupon,
        ...listFormatCoupons,
      ];
      //sort by used value
      listFormatCoupons.sort((x, y) => {
        // false values first
        return x.used === y.used ? 0 : x.used ? 1 : -1;
      });
      // console.log("listFormatCoupons", time, listFormatCoupons);
      couponService.setCoupon(listFormatCoupons, time);
    } else {
      this.setState({
        isMaintain: false,
      });
      couponService.setCoupon([], time);
    }
  };

  refreshListCoupon = () => {
    this.getCoupons(2);
  };

  onUseCoupon = () => {
    const limitTime = couponService.getConfig().limitTime;
    // console.log("onUseCoupon");
    if (this.useTimeout) clearTimeout(this.useTimeout);
    this.useTimeout = setTimeout(() => {
      if (this.active) {
        this.setState({ haveUse: false });
      }
    }, limitTime * 60000 + 100);
  };

  getCategory = (listCategory = []) => {
    // console.log("listCategory", listCategory);
    let routes = listCategory.map((cate) => {
      return {
        key: cate.id,
        title: cate.name,
      };
    });
    const routeTabview = {
      index: 0,
      routes: [{ key: "all", title: "すべて" }, ...routes],
    };
    return routeTabview;
  };

  goBack = () => {
    this.props.navigation.goBack();
  };

  renderScene = ({ route }) => {
    if (this.state.isLoading) {
      return null;
    } else {
      if (route.key === "all") {
        return (
          <ListCoupon
            onRefresh={this.refreshListCoupon}
            type={"all"}
            onUseCoupon={this.onUseCoupon}
          />
        );
      } else {
        return (
          <ListCoupon
            onUseCoupon={this.onUseCoupon}
            onRefresh={this.refreshListCoupon}
            type={route.key}
          />
        );
      }
    }
  };

  renderTabBar = (props) => {
    const { routeTabview } = this.state;
    // console.log("routeTabview", routeTabview);
    if (!routeTabview.routes) return null;
    if (routeTabview.routes.length < 2) return null;
    return (
      <TabBar
        scrollEnabled
        {...props}
        indicatorStyle={{
          backgroundColor: "red",
          height: 1.5,
          position: "absolute",
          bottom: -1.5,
        }}
        style={{
          backgroundColor: "white",
          borderBottomColor: "#F4CCCC",
          borderBottomWidth: 1.5,
          position: "relative",
        }}
        tabStyle={{
          padding: 0,
          margin: 0,
          height: 40,
          width: DEVICE_WIDTH / 4,
        }}
        labelStyle={{ fontSize: 12 }}
        inactiveColor={"black"}
        activeColor={"black"}
      />
    );
  };
  /**
   * return list coupon is using
   */
  checkListUsed = () => {
    let listCoupon = couponService.getCoupon("all") || [];
    let listCouponUse = [];
    listCoupon.forEach((coupon) => {
      if (
        coupon.countDown &&
        !coupon.used &&
        coupon.usagePolicy !== "COUNTLESS_TIME"
      ) {
        listCouponUse.push(coupon);
      } else if (
        coupon.countDownStart &&
        !coupon.used &&
        coupon.usagePolicy !== "COUNTLESS_TIME"
      ) {
        // console.log("coupon", coupon);

        let formatDateStart = new Date(coupon.countDownStart);
        const now = new Date();
        if (
          now.getTime() - formatDateStart.getTime() <
          couponService.getConfig().limitTime * 60000
        )
          listCouponUse.push(coupon);
      }
    });
    //get countless time coupon
    if (listCouponUse.length > 0) {
      const listSelectedCoupon = couponService.getListCoupon();
      // console.log("listSelectedCoupon", listSelectedCoupon);
      if (
        listSelectedCoupon &&
        Array.isArray(listSelectedCoupon) &&
        listSelectedCoupon.length > 0
      ) {
        listSelectedCoupon.forEach((coupon) => {
          if (
            coupon.usagePolicy === "COUNTLESS_TIME" &&
            coupon.usedCountlessTime
          ) {
            listCouponUse.push(coupon);
          }
        });
      }
    }
    return listCouponUse;
  };

  checkListUsedToMove = () => {
    // console.log("checkListUsedToMove");
    let listCouponUse = this.checkListUsed();
    if (
      listCouponUse &&
      Array.isArray(listCouponUse) &&
      listCouponUse.length > 0
    ) {
      this.setState({ haveUse: true });
    } else {
      this.setState({ haveUse: false });
    }
  };

  moveAllDetail = () => {
    const listCoupon = this.checkListUsed();
    this.props.navigation.navigate("CouponsSelect", {
      coupon: [...listCoupon],
      onlyView: true,
    });
  };
  renderHeaderRight = () => {
    const { haveUse } = this.state;
    if (haveUse) {
      return (
        <View
          style={{
            marginRight: 15,
            backgroundColor: "red",
            borderRadius: 6,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              paddingHorizontal: 5,
              paddingVertical: 5,
              alignItems: "center",
              flexDirection: "row",
            }}
            onPress={this.moveAllDetail}
          >
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontWeight: "bold",
                fontSize: 11,
              }}
            >{`利用中\nｸｰﾎﾟﾝ表示`}</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };
  renderContent() {
    const { isLoading, isMaintain, routeTabview } = this.state;

    if (isLoading) {
      return <Loading />;
    }
    return (
      <View style={{ flex: 1 }}>
        <Text
          style={{
            margin: SIZE.width(2),
            fontSize: 15,
            fontWeight: "bold",
            color: COLOR_RED,
            lineHeight: 20,
          }}
        >
          クーポン対象商品のお買い上げと、アプリクーポンのご提示でAocaポイントを付与いたします。
        </Text>
        <TabView
          navigationState={routeTabview}
          renderScene={this.renderScene}
          onIndexChange={(index) =>
            this.setState({
              routeTabview: { ...this.state.routeTabview, index },
            })
          }
          renderTabBar={this.renderTabBar}
          style={{ flex: 1 }}
          scrollEnabled={true}
          initialLayout={{
            width: Dimensions.get("window").width,
          }}
        />
      </View>
    );
  }
  render() {
    const { haveUse, isMaintain } = this.state;
    console.log("isMaintain", isMaintain);
    if (isMaintain) {
      return <MaintainView onPress={this.onDidMount} />;
    }
    //same value in HeaderIconLeft
    const withHeader = isIOS ? 64 - 17 : 56 - 8.5;
    let logoStyle;
    const model = DeviceInfo.getModel();
    if (isIOS && haveUse && model === "iPhone SE") {
      logoStyle = {
        width: withHeader * 3,
        height: withHeader,
      };
    }

    // console.log("routeTabview", routeTabview);
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <NavigationEvents onDidFocus={this.checkListUsedToMove} />
        <HeaderIconLeft
          goBack={this.goBack}
          logoStyle={logoStyle}
          RightComponent={this.renderHeaderRight()}
        />

        {this.renderContent()}
        <ButtonSelectListCoupon
          navigation={this.props.navigation}
          onUseCoupon={this.onUseCoupon}
        />
      </View>
    );
  }
}
