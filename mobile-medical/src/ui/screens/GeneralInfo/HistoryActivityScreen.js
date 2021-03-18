import React from "react";
import { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import {
  useNavigation,
  useRoute,
  useIsFocused,
} from "@react-navigation/native";
import AppNavigate from "../../../navigations/AppNavigate";
import { Colors, Dimension, Fonts, ImagesUrl } from "../../../commons";
import {
  convertGetDateTime,
  convertToDay,
  FORMAT_DD_MM_YYYY,
  FORMAT_HH_MM,
  FORMAT_TO_SERVER,
  convertTimeDate,
} from "../../../commons/utils/DateTime";
import { ScreensView, ButtonView, TextView } from "../../../components";
import API from "../../../networking";
import actions from "../../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import models from "../../../models";
import { TextAvatar } from "../../components/TextAvatar";
import { validateImageUri } from "../../../../src/commons/utils";

export default function HistoryActivityScreen(props) {
  const navigation = useNavigation();
  const [dataList, setDataList] = useState({});
  const dispatch = useDispatch();
  const [dataListKey, setDataListKey] = useState([]);
  const userInfo = models.getUserInfo();
  const { name, avatar } = userInfo;
  const imageUrl = validateImageUri(avatar);
  useEffect(() => {
    getDataServer();
  }, []);

  const getDataServer = async () => {
    dispatch(actions.showLoading());
    let data = await API.getDataHistoryActivity(dispatch);
    if (data) {
      data = data.sort(
        (a, b) =>
          new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
      );
    }
    var dataHistory = [];
    for (let i = 0; i < data.length; i++) {
      let date = convertGetDateTime(data[i].createdDate, FORMAT_DD_MM_YYYY);
      let dataTime =
        convertToDay(
          convertGetDateTime(data[i].createdDate, FORMAT_TO_SERVER)
        ) +
        ", Ngày " +
        date;
      if (dataHistory[dataTime]) {
        let dataAdd = dataHistory[dataTime].push(data[i]);
        dataHistory = {
          ...{
            [dataTime]: dataAdd,
          },
          ...dataHistory,
        };
      } else {
        dataHistory = {
          ...{
            [dataTime]: [data[i]],
          },
          ...dataHistory,
        };
      }
    }
    setDataList(dataHistory);
    setDataListKey(Object.keys(dataHistory));
    dispatch(actions.hideLoading());
  };

  const renderContentItem = (item, index) => {
    if (item) {
      return (
        <View style={[styles.styleContentItem, {}]}>
          {imageUrl ? (
            <Image
              source={imageUrl}
              style={{
                width: 35,
                height: 35,
                borderRadius: 35,
                // marginBottom: 13,
              }}
            />
          ) : (
            <TextAvatar
              containStyle={{ marginBottom: 13 }}
              name={name || "User"}
              textColor={Colors.colorMain}
              size={35}
              borderRadius={17}
              backgroundColor={Colors.colorSecondary}
            ></TextAvatar>
          )}
          {/* <Image
            source={ImagesUrl.LogoApp}
            style={{
              width: 50,
              height: 50,
              borderRadius: 25
            }} /> */}
          <View
            style={{
              flex: 1,
              marginLeft: 8,
            }}
          >
            <Text style={[styles.stTextTitle]}>
              {"Bạn đã: "}{" "}
              <Text
                style={{
                  color: item.actionTypeValue !== 7 ? Colors.colorMain : "red",
                }}
              >
                {item?.actionType}
              </Text>
            </Text>
            <Text
              numberOfLines={2}
              style={[styles.stTextTitle, { color: "#000000", width: "80%" }]}
            >
              {item?.contentFormatter}
            </Text>
          </View>
        </View>
      );
    }
    return null;
  };

  const renderInnerCircle = () => {
    let dotSize = 12;
    let dotColor = "red";
    let styleOutline = {
      height: 12,
      width: 12,
      padding: 1,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: dotColor,
      backgroundColor: "transparent",
      justifyContent: "center",
      alignContent: "center",
    };
    let dotStyle = {
      height: 8,
      width: 8,
      borderRadius: 4,
      backgroundColor: dotColor,
      justifyContent: "center",
      alignContent: "center",
    };
    return (
      <View style={[styleOutline]}>
        <View style={[dotStyle]} />
      </View>
    );
  };

  const renderInnerCircleCurrent = () => {
    let dotSize = 12;
    let color = Colors.colorMain;
    let styleOutline = {
      height: 12,
      width: 12,
      //  padding: 1,
      borderRadius: 6,
      //  borderWidth: 1,
      //  borderColor: color,
      backgroundColor: "transparent",
      justifyContent: "center",
      alignContent: "center",
    };
    let dotStyle = {
      height: 12,
      width: 12,
      borderRadius: 6,
      backgroundColor: color,
      justifyContent: "center",
      alignContent: "center",
    };
    return (
      <View style={[styleOutline]}>
        <View style={[dotStyle]} />
      </View>
    );
  };

  const renderLineCircle = (item, index) => {
    let renderTopLine;
    let renderBottomLine;
    if (index === 0) {
      renderTopLine = (
        <View
          style={{ width: 0, height: 25, backgroundColor: "transparent" }}
        />
      );
    } else {
      renderTopLine = (
        <View style={{ width: 1, height: 25, backgroundColor: "#DCDCDC" }} />
      );
    }
    renderBottomLine = (
      <View style={{ width: 1, flex: 1, backgroundColor: "#DCDCDC" }} />
    );
    let innerCircle =
      item.actionTypeValue !== 7
        ? renderInnerCircleCurrent()
        : renderInnerCircle();
    return (
      <View style={{ alignItems: "center" }}>
        {renderTopLine}
        {innerCircle}
        {renderBottomLine}
      </View>
    );
  };

  const renderCell = (item, index) => {
    let color = item.actionTypeValue !== 7 ? Colors.colorMain : "red";
    return (
      <View style={{ flexDirection: "row" }}>
        <Text
          style={[
            styles.stTextTitle,
            {
              marginTop: 20,
              alignContent: "center",
              justifyContent: "center",
              color: "#747F9E",
              width: 50,
              fontSize: 14,
            },
          ]}
        >
          {convertTimeDate(item.createdDate, FORMAT_HH_MM)}
        </Text>
        {renderLineCircle(item, index)}
        {/* <Text style={{
          marginTop: 20,
          color: color, alignContent: 'center',
          justifyContent: 'center',
        }}>{" >> "}</Text> */}
        {renderContentItem(item, index)}
      </View>
    );
  };

  const renderTimeLine = (title, item) => {
    item = item.reverse();
    return (
      <View style={{ flex: 1 }}>
        <Text
          style={[
            styles.stTextTitle,
            {
              marginTop: 15,
              alignContent: "center",
              justifyContent: "center",
              fontSize: 18,
              color: "#000000",
            },
          ]}
        >
          {title}
        </Text>

        {item.map((item1, index1) => renderCell(item1, index1))}
      </View>
    );
  };

  return (
    <ScreensView
      titleScreen={"Nhật ký hoạt động"}
      styleContent={styles.styleContent}
    >
      {dataListKey.map((item, index) =>
        renderTimeLine(item, dataList[item], index)
      )}
    </ScreensView>
  );
}

const styles = StyleSheet.create({
  styleContentItem: {
    // flex: 1,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    // marginHorizontal:16,
    // justifyContent:'center',
    marginBottom: 30,
    marginTop: 8,
    marginLeft: 8,
  },
  styleContent: {
    paddingHorizontal: Dimension.margin3x,
  },
  stTextTitle: {
    fontSize: Dimension.fontSize16,
    fontFamily: Fonts.SFProDisplayRegular,
    color: Colors.colorTextMenu,
  },
});
