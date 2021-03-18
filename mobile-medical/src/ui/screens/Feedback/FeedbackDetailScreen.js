import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useDispatch } from "react-redux";
import { useRoute } from "@react-navigation/native";
import { ScreensView, TextView } from "../../../components";
import { Colors, Dimension, scale, ImagesUrl, validateImageUri } from "../../../commons";
import styles from "./styles";
import Toast from "react-native-simple-toast";
import SlideBannerView from "../Home/SlideBannerView";
import {
  convertTimeServerToDateVN,
  FORMAT_TO_CLIENT,
} from "../../../commons/utils/DateTime";
import API from "../../../networking";
import moment from "moment";
import models from "../../../models";
import DropShadow from "react-native-drop-shadow";
import actions from "../../../redux/actions";

const ItemView = (props) => {
  const { item, index, feedbackDetail } = props;


  const avatar =
    item?.type === "USER"
      ? validateImageUri(feedbackDetail?.userAvatar, ImagesUrl.iconDefaultUser)
      : validateImageUri(feedbackDetail?.feedbackedUnitAvatar, ImagesUrl.iconDefaultUser)

  const commenterName =
    item?.type === "USER"
      ? feedbackDetail?.createdBy
      : feedbackDetail?.processingUnitName;
  return (
    <DropShadow
      style={{
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.08,
        shadowRadius: 10,
      }}
    >
      <View style={[styles.stContainBlock, { flexDirection: "row" }]}>
        <Image
          source={avatar}
          style={{
            height: scale(35),
            width: scale(35),
            borderRadius: scale(35 / 2),
            marginRight: 8,
          }}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.styleTextTitle}>{commenterName}</Text>
          <Text style={styles.styleTextContent}>{item?.comment}</Text>
          <TextView
            style={{ marginTop: scale(12) }}
            styleValue={[
              styles.styleText,
              {
                color: Colors.colorMain,
                fontSize: Dimension.fontSize12,
                marginLeft: 4,
              },
            ]}
            value={moment(item?.createdDate).fromNow()}
            styleIconLeft={{}}
            nameIconLeft={"ic-time-clock"}
            colorIconLeft={Colors.colorMain}
            sizeIconLeft={12}
          />
        </View>
      </View>
    </DropShadow>
  );
};

export default function FeedbackDetailScreen(props) {
  const { } = props;
  const route = useRoute();
  const [comment, setComment] = useState("");
  const [isShowBoxTextInput, setIsShowBox] = useState(false);
  const [isShowDoubleBtn, setIsShowDoubleBtn] = useState(true);
  const dataItem = route?.params?.dataItem;
  console.log("data", dataItem)


  const [feedbackDetail, setFeedbackDetail] = useState(dataItem);
  const dispatch = useDispatch();

  useEffect(() => {
    getDataFeedbackDetail();
  }, []);

  const getDataFeedbackDetail = async () => {
    if (dataItem?.id) {
      dispatch(actions.showLoading());
      let data = await API.requestHeathFacilities(
        dispatch,
        {
          "appointmentOption": 1
        }
      );
      let dataCSYT = data.filter((item) => item.id === dataItem?.feedbackedUnitId)

      let responses = await API.getFeedbackDetail(dispatch, dataItem?.id);
      responses = {
        ...responses,
        ...{ imageCSYT: dataCSYT && dataCSYT[0] && dataCSYT[0].imgPath || null }
      }
      console.log("responses:     ", responses)
      setFeedbackDetail(responses);

      dispatch(actions.hideLoading());
      // let dataHSBN = models.getPatientRecordsInfo(responses.userId);
      // console.log("dataHSBN:    ", dataHSBN)
    }
  };
  const renderItem = ({ item, index }) => {
    return (
      <ItemView item={item} index={index} feedbackDetail={feedbackDetail} />
    );
  };

  const onPressDisagree = () => {
    setIsShowBox(true);
  };

  const onPressSentComment = () => {
    if (comment.length === 0) {
      Toast.showWithGravity("Vui lòng nhập đánh giá", Toast.LONG, Toast.CENTER);
    } else {
      sendConfirm(1);
    }
  };

  const onPressAgree = () => {
    sendConfirm(3);
  };

  const sendConfirm = async (status) => {
    let params = {
      id: feedbackDetail.id,
      status,
    };
    if (status === 1) {
      params = {
        id: feedbackDetail.id,
        status,
        content: comment,
      };
    }
    const responses = await API.confirmFeedback(dispatch, params);
    console.log('send responses', responses);
    if (responses?.status) {
      Toast.showWithGravity(
        "Gửi đánh giá thành công",
        Toast.LONG,
        Toast.CENTER
      );
      setComment("");
      setIsShowBox(false);
      setIsShowDoubleBtn(false);
      setTimeout(() => {
        getDataFeedbackDetail()
      }, 700);
    } else {
      Toast.showWithGravity("Gửi đánh giá thất bại", Toast.LONG, Toast.CENTER);
    }
  };

  return (
    <ScreensView
      // isScroll={false}
      titleScreen={"Chi tiết góp ý"}
      styleContent={styles.styleContentDetail}
    >
      <View>
        <SlideBannerView />
        <View style={{ position: 'absolute', bottom: 30, alignSelf: 'center' }}>
          <Text style={{ ...styles.styleTextTopic, color: 'white', fontSize: Dimension.fontSize20, }}>{feedbackDetail?.feedbackedUnitName}</Text>
        </View>
      </View>


      <View style={styles.stContainHeader}>
        <Text style={styles.styleTextTopic}>{feedbackDetail?.topicName}</Text>
        <Text style={styles.styleTextContent}>{feedbackDetail?.content}</Text>
      </View>
      <DropShadow
        style={{
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.08,
          shadowRadius: 10,
        }}
      >
        <View style={styles.stFeedback}>
          <Text style={styles.styleTextTopic}>
            {feedbackDetail?.processingUnitName}
          </Text>
          <Text style={styles.styleTextContent}>
            Chào bạn ý kiến của bạn đang được chúng tôi giải quyết, cám ơn bạn góp
            ý
        </Text>
          <TextView
            style={{ marginTop: scale(12), marginBottom: 12 }}
            styleValue={[
              styles.styleText,
              {
                color: "black",
                fontSize: Dimension.fontSize12,
                marginLeft: 4,
              },
            ]}
            value={moment(feedbackDetail.createdDate).format("L")}
            styleIconLeft={{}}
            nameIconLeft={"ic-time-clock"}
            colorIconLeft={'black'}
            sizeIconLeft={12}
          />
          {feedbackDetail?.status == 2 && <View style={{ flexDirection: 'row', borderTopWidth: 1, marginHorizontal: 16, borderColor: "#D4FAFF" }}>
            <TouchableOpacity onPress={onPressDisagree} style={styles.styleButtonSadAdd}>
              <Image source={ImagesUrl.iconSad} />
              <Text style={styles.styleTextButtonSadAdd}>{" Không đồng ý"}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onPressAgree} style={styles.styleButtonSadAdd}>
              <Image source={ImagesUrl.iconAdd} />
              <Text style={{ ...styles.styleTextButtonSadAdd, color: '#00C6AD' }}>{" Đồng ý"}</Text>
            </TouchableOpacity>
          </View>}


          {/* <View style={{ flexDirection: "row", margin: Dimension.margin2x }}>
          <TextView
            style={{
              ...styles.stButtonConfirm,
              marginRight: Dimension.margin5,
              justifyContent: "center",
            }}
            styleValue={[
              styles.styleText,
              {
                color: Colors.colorCancel,
                fontSize: 14,
                marginLeft: 4,
              },
            ]}
            onPress={onPressDisagree}
            value={"Không đồng ý"}
            styleIconLeft={{}}
            nameIconLeft={"ic-time-clock"}
            colorIconLeft={Colors.colorCancel}
            sizeIconLeft={14}
          />

          <TextView
            style={{
              ...styles.stButtonConfirm,
              marginRight: Dimension.margin5,
              justifyContent: "center",
            }}
            styleValue={[
              styles.styleText,
              { color: Colors.colorMain, fontSize: 14, marginLeft: 4 },
            ]}
            onPress={onPressAgree}
            value={"Đồng ý"}
            styleIconLeft={{}}
            nameIconLeft={"ic-time-clock"}
            colorIconLeft={Colors.colorMain}
            sizeIconLeft={14}
          />
        </View> */}
        </View>
      </DropShadow>
      <FlatList
        data={feedbackDetail.feedbackContentDTOList}
        // data={[
        //   {
        //     comment: '12312312 ádasdas dá dá dá ư ư adsadasdasdas ád adsa dá dá dsa sad sadas',
        //     createdDate: '2021-02-01T22:10:06+07:00'
        //   }
        // ]}
        keyboardShouldPersistTaps="never"
        extraData={feedbackDetail}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => `${item.id}${index}`}
        onEndReachedThreshold={0.2}
        removeClippedSubviews
        style={{ flexGrow: 0, paddingBottom: 5 }}
      />
      {isShowBoxTextInput && (
        <View style={styleFeedBack.viewInput}>
          <View style={{ flex: 1 }}>
            <TextInput
              style={styles.textInput}
              value={comment}
              maxLength={1000}
              onChangeText={(text) => setComment(text)}
              placeholder={"Hãy viết nhận xét của bạn ở đây"}
              multiline={true}
              underlineColorAndroid="transparent"
            />
          </View>

          <View style={styles.viewCameraAndSend}>
            <TouchableOpacity
              onPress={onPressSentComment}
              style={{ alignItems: "flex-end" }}
            >
              <Image
                style={{ width: 24, height: 24, marginBottom: 16 }}
                source={require("../../../../assets/icons/iconSend.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScreensView>
  );
}

const styleFeedBack = StyleSheet.create({
  viewInput: {
    height: scale(180),
    paddingHorizontal: 16,
    paddingTop: 8,
    marginBottom: 50,
    marginHorizontal: Dimension.margin2x,
    borderRadius: Dimension.radiusButton,
    backgroundColor: "white",
    shadowOpacity: 0.25,
    shadowRadius: 3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowColor: "#000000",
    elevation: 3,
  },
  textInput: {
    textAlignVertical: "top",
  },
  viewCameraAndSend: {
    backgroundColor: "#F8F8F8",
    marginHorizontal: 12,
    height: scale(44),
    marginTop: scale(18),
    borderRadius: 16,
    alignItems: "center",
    flexDirection: "row",
  },
});
