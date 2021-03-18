import React, { Component } from "react";

import { styleInApp } from "../../../const/System";
import { STRING } from "../../../const/String";
import {
  COLOR_GRAY,
  COLOR_GRAY_LIGHT,
  COLOR_WHITE,
  APP_COLOR,
  COLOR_GRAY_COUPON_USED
} from "../../../const/Color";

import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Platform,
  Image
} from "react-native";
import ItemTag from "./ItemTag";
import { AppImage } from "../../../component/AppImage";
import { getTimeFomartDDMMYY } from "../../../util";
import { TextTime } from "../../../component/TextTime/TextTime";

export class ItemCoupon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canUse: false,
      used: this.props.data.used
    };
  }
  upDate = used => {
    this.props.data.used = used;
    this.setState({ used });
  };
  goDetailCoupon = () => {
    const { history } = this.props;
    this.props.navigation.navigate("CouponDetail", {
      item: this.props.data,
      upDate: this.upDate,
      history
    });
  };

  render() {
    const { history, data } = this.props;

    const {
      imageUrl,
      usageScope,
      name,
      endTime,
      storeName,
      startTime,
      shortDescription,
      usagePolicy,
      timeReuse
    } = data;
    // console.log('data', data);
    const { used } = this.state;
    const usedCoupon = history ? true : used;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          if (!usedCoupon || history || (usagePolicy === 'COUNTLESS_TIME' && timeReuse == 0)) {
            this.goDetailCoupon();
          }
        }}
      >
        <View
          style={[
            styles.container,
            {
              backgroundColor: (usagePolicy === 'COUNTLESS_TIME' && timeReuse == 0)  || !usedCoupon
                ? APP_COLOR.BACKGROUND_COLOR
                : COLOR_GRAY_COUPON_USED
            }
          ]}
        >
          <View style={[styleInApp.smallImage, { margin: 16 }]}>
            <AppImage
              url={imageUrl}
              style={styleInApp.smallImage}
              resizeMode={"cover"}
              onPress={() => {
                if (!usedCoupon || history) {
                  this.goDetailCoupon();
                }
              }}
            />
          </View>
          <View style={styles.itemRight}>
            <Text style={styleInApp.title}>{name}</Text>

            <Text style={styleInApp.shortDescription}>{shortDescription}</Text>

            <TextTime
              time={`${STRING.time_use}  ${getTimeFomartDDMMYY(
                startTime
              )} - ${getTimeFomartDDMMYY(endTime)}`}
            />
          </View>
        </View>
        {!usedCoupon || (usagePolicy === 'COUNTLESS_TIME' && timeReuse == 0) ? null : (
          <Image
            style={{
              position: "absolute",
              width: 54,
              height: 46
            }}
            resizeMode={"contain"}
            source={require("../images/triangle.png")}
          />
        )}
        {!usedCoupon ||  (usagePolicy === 'COUNTLESS_TIME' && timeReuse == 0)  ? null : (
          <Text style={styles.textRotate}>{STRING.used}</Text>
        )}
      </TouchableOpacity>
    );
  }
}

const isIOS = Platform.OS === "ios";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: `${COLOR_GRAY}50`
  },
  textDescription: {
    fontFamily: "SegoeUI",
    fontSize: 12,
    marginLeft: 5,
    color: COLOR_GRAY
  },
  textTitle: {
    fontSize: 14
  },
  textRotate: {
    position: "absolute",
    fontSize: 9,
    transform: [{ rotate: "-43deg" }],
    color: COLOR_WHITE,
    marginTop: 12,
    marginLeft: 2
  },
  itemLeft: {
    alignItems: "center"
  },
  itemRight: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 15,
    flex: 7,
    justifyContent: "space-between",
    flexDirection: "column"
  },
  itemRightTop: {},
  itemRightBody: {
    justifyContent: "center"
  },
  itemRightBottom: {
    flexDirection: "row",
    alignItems: "center"
    // width: '60%'
  },
  containerItemRightBottom: {
    justifyContent: "space-between"
  },
  contentItemRightBottom: {
    // justifyContent: 'flex-end',
    flex: 1,
    justifyContent: "space-between",

    flexDirection: "row"
  },
  wrapperImage: {
    borderRadius: 5,
    height: 70,
    width: 70,
    marginLeft: 15,
    backgroundColor: COLOR_GRAY_LIGHT
  },
  image: {
    borderRadius: 5,
    height: 70,
    width: 70
  },

  shadow: isIOS
    ? {
      shadowColor: COLOR_GRAY,
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.5
    }
    : {
      elevation: 2
    },
  wrapperSpace: {
    height: 50
  }
});
