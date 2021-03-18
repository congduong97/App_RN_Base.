import React from "react";
import { Image, View, Text, StyleSheet } from "react-native";
import { scale } from "../../../commons/utils/Devices";
import StarRating from "react-native-star-rating";
import moment from "moment";
import { Dimension, Colors, validateImageUri, ImagesUrl } from "../../../commons";

import Svg, { Path } from "react-native-svg";
const IconTime = (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width="11"
    height="11"
    viewBox="0 0 11 11"
  >
    <Path
      id="Path"
      d="M9.389,1.611A5.5,5.5,0,0,0,1.611,9.389a5.5,5.5,0,0,0,6.735.818A.43.43,0,1,0,7.9,9.472a4.682,4.682,0,1,1,1.453-1.4.43.43,0,1,0,.714.478,5.486,5.486,0,0,0-.679-6.942Z"
      fill="#2ad3e7"
    />
  </Svg>
);

const CommentItem = (props) => {
  const { item } = props;
  console.log(item)
  // const userAvatar = item.userAvatar? {uri: item.userAvatar}: ImagesUrl.iconDefaultUser
  return (
    <View style={styles.viewItem}>
      <Image style={styles.viewAvatar}
        source={validateImageUri(item?.userAvatar, ImagesUrl.iconDefaultUser)}
      />
      <View style={styles.viewContent}>
        <Text style={styles.textName}>{item.userName}</Text>
        <View style={{ flexDirection: "row" }}>
          <StarRating
            disabled={false}
            maxStars={1}
            rating={1}
            fullStarColor={"#FEC12D"}
            starSize={scale(14)}
          // selectedStar={(rating) => this.onStarRatingPress(rating)}
          />
          <Text style={styles.textRate}>{item.rate + ".0"}</Text>
        </View>

        <Text style={styles.textContent}>{item.content}</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {IconTime}
          <Text style={{ color: "#2AD3E7", marginLeft: 6 }}>
            {console.log('check item createDate', item.createdDate)}
            {moment(item.createdDate).subtract(10, 'seconds').fromNow()}
          </Text>
        </View>
      </View>
    </View>
  );
};

export { CommentItem };

const styles = StyleSheet.create({
  viewItem: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
    margin: 4,
    // backgroundColor: "white",s
    borderBottomWidth: 1,
    borderBottomColor: '#97979730'
    // borderRadius: 8,
    // shadowOpacity: 0.25,
    // shadowRadius: 3,
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowColor: "#000000",
    // elevation: 3,
  },
  viewAvatar: {
    height: scale(35),
    width: scale(35),
    borderRadius: scale(35 / 2),
  },
  viewContent: { flex: 1, paddingLeft: 8 },
  textName: {
    fontWeight: "600",
    fontSize: Dimension.fontSizeHeaderPopup,
    color: Colors.colorTextMenu,
    fontFamily: "SFProText-Regular",
  },
  textContent: {
    fontWeight: "600",
    fontSize: Dimension.fontSizeButton16,
    color: "#707070",
    fontFamily: "SFProText-Regular",
  },
  textRate: {
    fontWeight: "600",
    fontSize: Dimension.fontSize12,
    color: "#707070",
    fontFamily: "SFProText-Regular",
    marginLeft: 4,
  },
});
