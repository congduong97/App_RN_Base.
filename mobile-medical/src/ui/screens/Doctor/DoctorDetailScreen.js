import React, { useCallback, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Pressable,
  Alert,
  TextInput,
  Modal,
  ScrollView,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ScreensView, ButtonView, InputView } from "../../../components";
import IconView, { IconViewType } from "../../../components/IconView";
import { useNavigation, useRoute } from "@react-navigation/native";
import AppNavigate from "../../../navigations/AppNavigate";
import {
  Dimension,
  Colors,
  Fonts,
  fontsValue,
  ImagesUrl,
  NavigationKey,
} from "../../../commons";
import API from "../../../networking";
import DoctorInfoView from "./DoctorInfoView";
import { useState } from "react";
import { scale } from "../../../commons/utils/Devices";
import StarRating from "react-native-star-rating";
import { CommentItem } from "./CommentItem";
import { debounce } from "lodash";
import Toast from "react-native-simple-toast";
import actions from "../../../redux/actions";
import { BookAppointmentKey } from "../../../models";
import DropShadow from "react-native-drop-shadow";

// import Modal from 'react-native-modal';
export default function DoctorDetailScreen(props) {
  // const infoRef = useRef({
  //   page: 0,
  //   size: 2,
  // });
  const route = useRoute();
  const dispatch = useDispatch();
  const doctorInfo = route?.params?.doctorInfo;
  console.log(

    doctorInfo
  );

  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [textValue, setTextValue] = useState(null);
  const [comments, setComments] = useState([]);
  const [checkShowComment, setCheckShowComment] = useState(false);
  const [isShowTextStudy, setIsShowTextStudy] = useState(false);
  const [isCheckBlockedUser, setIsCheck] = useState(false);
  const [numberComments, setNumberComments] = useState(
    doctorInfo?.totalFeedback ?? 0
  );
  const [numberText, setNumberText] = useState(0);
  const [rating, setRating] = useState(4);
  const onChangeText = ({ id, data }) => {
    setTextValue(data);
    setNumberText(data.length);
  };
  const handleBookAppointment = async () => {
    dispatch(actions.showLoading());
    // AppNavigate.navigateToRegulationsBook(navigation.dispatch, {})

    let isCheckWorking = await API.getDoctorCalendar(dispatch, doctorInfo?.id);
    if (isCheckWorking) {
      dispatch(actions.resetMakeAppointData());
      dispatch(actions.actionBookType(NavigationKey.NextToBookByDoctor)); // luu loai hanh dong book lich kham

      let dataApiHeathFacilities = await API.requestDataHeathFacilities(
        dispatch,
        {
          // "appointmentOption": appointmentOption
        }
      );
      let dataHeathFacilities = dataApiHeathFacilities.filter(
        (item) => item?.id === doctorInfo?.healthFacilityId
      );
      dataHeathFacilities = dataHeathFacilities[0] || {};

      let paramHeathFacilities = {
        [BookAppointmentKey.TypeBook]: 2,
        //co so y te
        [BookAppointmentKey.HealthFacilityId]: dataHeathFacilities.id,
        [BookAppointmentKey.HealthFacilityName]: dataHeathFacilities?.name,
        [BookAppointmentKey.HealthFacilityAddress]:
          dataHeathFacilities?.address,
        [BookAppointmentKey.connectWithHis]:
          dataHeathFacilities?.config?.connectWithHis,
        //1 cho ph??p thanh to??n online, 2 l?? k
        [BookAppointmentKey.prepaymentMedicalService]:
          dataHeathFacilities?.config?.prepaymentMedicalService,

        //bs
        [BookAppointmentKey.DoctorId]: doctorInfo?.id,
        [BookAppointmentKey.DoctorName]: doctorInfo?.name,
        [BookAppointmentKey.medicalSpecialityId]:
          doctorInfo?.medicalSpecialityId,
        [BookAppointmentKey.MedicalSpecialtyName]:
          doctorInfo?.medicalSpecialityName,
        [BookAppointmentKey.DoctorGender]: doctorInfo?.gender,
        [BookAppointmentKey.AcademicName]: doctorInfo?.academicCode,
        // //????? kiem tra ca l??m viec cua bac sy
        // [BookAppointmentKey.workingTime]: doctorInfo?.workingTime,
      };
      console.log("paramHeathFacilities:    ", paramHeathFacilities);
      dispatch(actions.saveMakeAppointData(paramHeathFacilities));

      AppNavigate.navigateToPatientRecords(navigation.dispatch, {
        typeScreen: 2,
      });
    } else {
      Alert.alert(
        "?????t l???ch kh??m",
        "Ng??y l??m vi???c c???a b??c s??? " +
        doctorInfo?.name +
        " tr???ng. Vui l??ng ch???n b??c s??? kh??c."
      );
    }

    dispatch(actions.hideLoading());
  };
  const onHandleComment = () => {
    // AppNavigate.navigateToDoctorFeedback(navigation.dispatch, {
    //   doctorInfo,
    //   getFeedbacks,
    //   addNumberComment
    // });
    setModalVisible(true);
  };
  const handleCloseModal = () => {
    setModalVisible(false);
  };
  useEffect(() => {
    getFeedbacks();
  }, []);

  // const addNumberComment = () => {
  //   setNumberComments((prev) => prev + 1);
  // };
  const onPressSent = async () => {
    if (textValue && textValue.length > 0) {
      const params = {
        rate: rating,
        content: textValue,
        doctorId: doctorInfo.id,
      };
      const response = await API.sentFeedbackDoctor(dispatch, params);
      if (response.status) {
        setModalVisible(false);
        setTimeout(() => {
          Toast.showWithGravity(
            "Th??ng b??o: \n C???m ??n b???n ???? g???i nh???n x??t cho ch??ng t??i",
            Toast.LONG,
            Toast.CENTER
          );
          getFeedbacks();
        }, 700);
        // addNumberComment();
        setTextValue(null);
        // navigation.goBack();
      }
    } else {
      Toast.showWithGravity(
        "Vui l??ng nh???p nh???n x??t c???a b???n!!",
        Toast.LONG,
        Toast.CENTER
      );
    }

    // console.log("check response", response);
  };
  const getFeedbacks = async () => {
    // const { page, size } = infoRef.current;
    const params = {
      doctorId: doctorInfo.id,
    };
    let feedbacksResponse = await API.getDoctorFeedbacks(dispatch, params);

    let isCheck = await API.requestCheckUserBlocked(dispatch);
    if (isCheck) setIsCheck(true)

    setComments(feedbacksResponse);
  };

  const onPressSeeAllComment = () => {
    AppNavigate.navigateToListFeedback(navigation.dispatch, {
      doctorId: doctorInfo.id,
    });
  };
  let experienceNew = doctorInfo?.experience ? doctorInfo?.experience.slice(0, 5) : null

  const renderItem = ({ item, index }) => {
    return <CommentItem item={item} />;
  };
  const handleShowComment = () => {
    if (checkShowComment) {
      setCheckShowComment(false);
    } else {
      setCheckShowComment(true);
    }
  };

  const handleShowTextStudy = () => {
    if (isShowTextStudy) {
      setIsShowTextStudy(false);
    } else {
      setIsShowTextStudy(true);
    }
  }
  return (
    <ScreensView
      styleContent={styles.styleContent}
      titleScreen={"Th??ng tin b??c s???"}
      isScroll={false}
      renderFooter={
        <ButtonView
          title={"?????t l???ch kh??m"}
          disabled={isCheckBlockedUser}
          onPress={handleBookAppointment}
          style={{ marginBottom: 20, marginHorizontal: 15 }}
        />
      }
    >
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
        onBackButtonPress={() => setModalVisible(false)}
        onSwipeComplete={() => setModalVisible(false)}
        swipeDirection={"down"}
      >
        <View style={styles.centeredView}>
          {/* <View
            style={{
              backgroundColor: "#00000048",
              position: "absolute",
              width: "100%",
              height: "100%",
              opacity: 0.6,
            }}
          ></View> */}

          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            <Text style={{ ...styles.textHeader, flex: 1 }}>
              ????nh gi?? c???a b???n
              </Text>
            <IconView
              onPress={handleCloseModal}
              type={IconViewType.Feather}
              name={"x"}
              color={"black"}
              size={22}
            />
          </View>
          <View style={styles.viewStar}>
            <Text style={{ ...styles.textTitle, marginRight: 30 }}>
              B??nh ch???n
              </Text>

            <View style={{ width: scale(102) }}>
              <StarRating
                disabled={false}
                maxStars={5}
                rating={rating}
                fullStarColor={"#FEC12D"}
                emptyStarColor={"#747F9E"}
                starSize={scale(14)}
                selectedStar={(rating) => setRating(rating)}
              />
            </View>
          </View>
          {/* <View style={styles.viewComment}> */}
          {/* <View style={styles.viewRateText}>
              <Text style={styles.textTitle}>Vi???t b??nh lu???n c???a b???n</Text>
            </View> */}
          <View style={[styles.viewNumberText, {
            alignSelf: 'flex-end',
            marginTop: 8
          }]}>
            <Text>{numberText}/1000</Text>
          </View>
          {/* </View> */}
          {/* <TextInput
            style={styles.input}
            value={textValue}
            onChangeText={onChangeText}
            multiline={true}
            maxLength={1000}
            placeholder={"H??y vi???t nh???n x??t c???a b???n ??? ????y"}
            underlineColorAndroid='transparent'
            blurOnSubmit
          /> */}


          <InputView
            maxLength={1000}
            id={'contentComment'}
            // isShowLabel={true}
            styleTextLabel={{ fontSize: Dimension.fontSize14 }}
            offsetLabel={-15}
            label={
              <Text>
                {" Vi???t b??nh lu???n c???a b???n "}
              </Text>
            }
            placeholder={"H??y vi???t nh???n x??t c???a b???n ??? ????y..."}
            placeholderTextColor={Colors.textLabel}
            style={[{ borderWidth: 0, marginTop: 0 }]}
            height={110}
            multiline
            value={textValue}
            styleInput={[{ height: 90, borderWidth: 0 }]}
            onChangeText={onChangeText}
            onClearText={onChangeText}
          />
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <ButtonView
              title={"G???i nh???n x??t"}
              onPress={debounce(onPressSent, 300, {
                trailing: false,
                leading: true,
              })}
              textColor={Colors.colorMain}
              bgColor={"#DBFFFA"}
              style={styles.stButtonEdit}
            />
          </View>

        </View>
      </Modal>

      <DoctorInfoView doctorInfo={doctorInfo} />
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
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
          <View style={styles.styleBorderThongtin}>
            <Text style={styles.styleTextTitle}>{"Th??ng tin b??c s???"}</Text>
            <DetailedInformation
              titleLeft={"Chuy??n khoa"}
              titleRight={doctorInfo.medicalSpecialityName}
            />
            <DetailedInformation
              titleLeft={"C?? s??? y t???"}
              titleRight={doctorInfo.healthFacilityName}
            />
            <DetailedInformation titleLeft={'S??? n??m kinh nghi???m'} titleRight={(experienceNew ? experienceNew + ' n??m' : '')} />
            <DetailedInformation
              titleLeft={"Qu?? tr??nh h???c t???p"}
              titleRight={doctorInfo.education}
              styleTitleRight={{}}
              numberOfLines={!isShowTextStudy ? 2 : null}
            // titleRight={"S???a ?????i, b??? sung m???t s??? ??i???u c???a Quy???t ?????nh s??? 38/2017/Q??-TTg ng??y 18 th??ng 8 n??m 2017 c???a Th??? t?????ng Ch??nh ph??? quy ?????nh vi???c chuy???n c???a kh???u ?????i v???i h??ng nh???p kh???u v??? l??m th??? t???c h???i quan t???i c???ng c???n ICD M??? ????nh, th??nh ph??? H?? N???i"}
            />

            <TouchableOpacity onPress={handleShowTextStudy} style={styles.styleBorderSeeMore}><Text style={styles.styleTextButtonSeeMore}>{!isShowTextStudy ? "Xem th??m" : "R??t g???n"}</Text></TouchableOpacity>


            {/* <IconView
              onPress={handleShowComment}
              style={{ alignSelf: "center", marginTop: 9 }}
              type={IconViewType.FontAwesome}
              name={checkShowComment ? "angle-up" : "angle-down"}
              color={"#00C6AD"}
              size={20}
            /> */}
          </View>
        </DropShadow>
        <DropShadow
          style={{
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.025,
            shadowRadius: 10,
          }}
        >
          <View style={styles.styleBorderThongtin}>
            <Text style={{ ...styles.styleTextTitle, marginBottom: 9 }}>
              {"????nh gi?? c???a b???n"}
            </Text>
            <Text style={styles.styleTextDanhgia}>
              {"H??y vi???t nh???n x??t c???a b???n v??? B??c s??? n??y !"}
            </Text>
            <TouchableOpacity
              onPress={onHandleComment}
              style={styles.styleViewImage}
            >
              <Image source={ImagesUrl.iconAvatar} />
              <Text style={styles.styleTextNhanxet}>
                {"Vi???t nh???n x??t c???a b???n"}
              </Text>
            </TouchableOpacity>
          </View>
        </DropShadow>

        {/* <View style={styles.stContainLabel}>

        {numberComments > 2 && (
          <Text style={styles.stTextViewAll} onPress={onPressSeeAllComment}>
            {"Xem to??n b???"}
          </Text>
        )}
      </View> */}
        {/* {checkShowComment && ( */}
        <DropShadow
          style={{
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.025,
            shadowRadius: 10,
          }}
        >
          <View style={styles.styleBorderThongtin}>
            <Text style={{ ...styles.styleTextTitle, marginBottom: 9 }}>
              {"????nh gi?? kh??c"}
            </Text>

            <FlatList
              data={comments}
              renderItem={renderItem}
              extraData={comments}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </DropShadow>
        {/* )} */}
      </ScrollView>
    </ScreensView>
  );
}

const styles = StyleSheet.create({
  styleContent: {
    paddingVertical: Dimension.padding2x,
    backgroundColor: "white",
    // paddingHorizontal: Dimension.padding2x,
    paddingBottom: 20,
  },
  styleIconMenu: {
    marginLeft: Dimension.margin2x,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    width: Dimension.sizeIconHeader,
    height: Dimension.sizeIconHeader,
    alignContent: "center",
    borderRadius: 10,
    backgroundColor: "transparent",
  },

  stInput: {
    margin: Dimension.margin,
    marginTop: Dimension.margin2x,
    borderRadius: Dimension.radiusButton,
    borderBottomWidth: 1,
    borderBottomColor: Colors.colorBg2,
  },
  styleContainInput: {
    height: fontsValue(46),
    borderColor: Colors.colorBorder,
  },
  stIconSearch: {
    backgroundColor: Colors.colorBtBack,
    height: "100%",
    width: Platform.OS === "ios" ? 56 : 40,
  },
  ///
  stButtonComment: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: fontsValue(16),
    marginBottom: fontsValue(5),
    padding: Dimension.margin2x,
    backgroundColor: "white",
    borderRadius: fontsValue(16),
    shadowOpacity: 0.25,
    shadowRadius: 3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowColor: "#000000",
    elevation: 3,
    alignItems: "center",
  },
  styleBgMenu: {
    left: Dimension.margin2x,
    position: "absolute",
    justifyContent: "flex-start",
  },
  stIconArrow: {
    alignSelf: "center",
  },
  styleTextComment: {
    flex: 1,
    textAlign: "center",
    alignSelf: "center",
    paddingHorizontal: 16,
    fontWeight: "600",
    fontSize: Dimension.fontSizeMenu,
    color: Colors.colorTextMenu,
    fontFamily: "SFProText-Regular",
    // backgroundColor: "#345",
  },
  stContainLabel: {
    marginVertical: Dimension.margin2x,
    alignSelf: "flex-end",
  },
  stTextLabel: {
    flex: 1,
    fontSize: Dimension.fontSize18,
    color: Colors.colorTextMenu,
    fontFamily: Fonts.SFProDisplayRegular,
  },
  stTextViewAll: {
    fontSize: Dimension.fontSize14,
    color: "#00C6AD",
    fontFamily: Fonts.SFProDisplayRegular,
  },
  centeredView: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: Dimension.padding2x,
    // justifyContent: "center",
    // alignItems: "center",
    marginTop: Platform.OS === 'ios' ? 30 : 0
  },
  modalView: {
    width: scale(327),
    padding: Dimension.padding,
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
  textHeader: {
    color: "#262C3D",

    textAlign: "center",
    fontSize: Dimension.fontSize18,
    fontFamily: Fonts.SFProDisplayRegular,
  },
  textTitle: {
    color: "#747F9E",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 13,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  viewStar: {
    // width: "100%",
    paddingBottom: Dimension.margin3x,
    alignItems: "center",
    flexDirection: "row",
    marginTop: scale(24),
    marginHorizontal: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: "#70707016",
  },
  viewRateText: {
    paddingRight: 48,
  },
  input: {
    marginHorizontal: scale(16),
    marginTop: scale(8),
    height: scale(113),
    textAlignVertical: "top",
    padding: 0,
    borderBottomColor: '#70707016',
    borderBottomWidth: 1,
    marginBottom: Dimension.margin2x
  },
  viewComment: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    marginTop: scale(8),
    justifyContent: "space-between",
    paddingHorizontal: scale(16),
  },
  stButtonEdit: {
    marginBottom: Dimension.margin2x,
    marginTop: Dimension.margin,
    marginHorizontal: Dimension.margin,
    width: 140,
    height: 38,
  },
  styleBorderThongtin: {
    marginTop: 19,
    padding: Dimension.padding,
    borderRadius: Dimension.radiusButton,
    marginHorizontal: 16,
    marginBottom: 5,
    backgroundColor: "white",
    // shadowOpacity: 0.25,
    // shadowRadius: 3,
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowColor: "#000000",
    // elevation: 3,
  },
  styleTextTitle: {
    fontSize: Dimension.fontSize18,
    fontFamily: Fonts.SFProDisplayRegular,

    marginBottom: 8,
  },
  styleTextDanhgia: {
    fontFamily: Fonts.SFProDisplayRegular,
    fontSize: Dimension.fontSize14,
    // textAlign: "center",
    color: "#747F9E",
  },
  styleViewImage: {
    flexDirection: "row",
    // justifyContent: "center",
    // alignItems: "center",
    marginTop: 9,
    marginBottom: 25,
  },
  styleTextNhanxet: {
    color: "#00C6AD",
    fontSize: Dimension.fontSize16,
    fontFamily: Fonts.SFProDisplayRegular,
    marginLeft: 5,
  },
  styleBorderXemToanBo: {
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
  styleBorderSeeMore: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Dimension.padding2x,
    borderTopColor: '#70707016',
    borderTopWidth: 1,
    marginTop: Dimension.margin2x,
    marginHorizontal: Dimension.margin2x
  },
  styleTextButtonSeeMore: {
    color: "#00C6AD",
    fontSize: Dimension.fontSize16,
    fontFamily: Fonts.SFProDisplayRegular
  }
});
const DetailedInformation = (props) => {
  const { titleLeft, titleRight } = props;
  return (
    <View style={{ flexDirection: "row", marginTop: 10 }}>
      <Text
        style={{
          flex: 1,
          fontFamily: Fonts.SFProDisplayRegular,
          fontSize: Dimension.fontSize14,
          color: "#747F9E",
        }}
      >
        {titleLeft}
      </Text>
      <Text style={[{
        fontFamily: Fonts.SFProDisplayRegular,
        fontSize: Dimension.fontSize14,
        flex: 1
      }, props.styleTitleRight]} numberOfLines={props.numberOfLines}>{titleRight}</Text>
    </View>
  );
};
