import React, { useState, useRef, useEffect, useCallback } from "react";
import { StyleSheet, Text, View, Image, Alert, Linking, FlatList, Dimensions, TouchableOpacity } from "react-native";
import {
  useNavigation,
  useRoute,
  useIsFocused,

} from "@react-navigation/native";
import { Dimension, Colors, ImagesUrl, Fonts } from "../../../commons";
import { useDispatch, useSelector } from "react-redux";
import {
  BaseView,
  IconView,
  TextView,
  InputView,
  ButtonView,
  ScreensView,
} from "../../../components";
import ChoicePaymentsType from "./ChoicePaymentsType";
import AppNavigate from "../../../navigations/AppNavigate";
import API from "../../../networking";
import actions from "../../../redux/actions";
import { WebView } from 'react-native-webview';
const renderItem = ({ index, item, onPress }) => {
  return (
    <View style={styles.Category}>
      <TouchableOpacity onPress={onPress}>
        <Image
          resizeMode="contain"
          style={styles.tinyLogo}
          source={{ uri: item.imgURL }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default function ConfirmBankCard(props) {
  const navigation = useNavigation();
  const route = useRoute();
  const refWebview = useRef("webview")
  const dispatch = useDispatch();
  const [valueUrl, setValueUrl] = useState("");
  const [listBankInfo, setlistBankInfo] = useState([]);
  const [showWebView, setShowWebView] = useState(false);
  const makeAppointData = useSelector(
    (state) => state.MakeAppointmentReducer.makeAppointData
  );
  const getBankInfo = async () => {
    let listBank = await API.getListBank(dispatch, {});
    console.log("savePayment:", listBank)
    setlistBankInfo(listBank)
  }
  useEffect(() => {
    getBankInfo()
  }, []);
  const handleOnPress = async ({ id }) => {
    console.log(makeAppointData);
    let dataPayment = null
    if (makeAppointData?.id) {
      dataPayment = await API.doPaymentUpdate(dispatch, {
        ...makeAppointData, ...{
          "amount": makeAppointData.medicalServicePrice,
          "bankCode": "NCB",
          "paymentMethod": "ATM"
        }
      });
    } else {
      dataPayment = await API.doPayment(dispatch, {
        ...makeAppointData, ...{
          "amount": makeAppointData.medicalServicePrice,
          "bankCode": "NCB",
          "paymentMethod": "ATM"
        }
      });
    }

    // console.log("dataPayment:", makeAppointData)
    console.log("dataPayment:", dataPayment)
    if (dataPayment && !dataPayment.errorKey) {
      setValueUrl(dataPayment.data)
      setShowWebView(true)
    } else if (dataPayment && dataPayment.errorKey === 'healthFacility_deactivate') {
      Alert.alert("?????t l???ch kh??m", "C?? s??? y t??? hi???n kh??ng ho???t ?????ng", [{ text: "?????ng ??" }]);
    } else {
      Alert.alert("?????t l???ch kh??m", "X??c th???c th???t b???i. Vui l??ng ki???m tra l???i", [{ text: "?????ng ??" }]);
    }

    // Linking.openURL(dataPayment.data);

  }
  // const renderItem = ({ index, item, onPress }) => {
  //   return (
  //     <View style={styles.Category}>
  //       <TouchableOpacity onPress={onPress}>
  //         <Image
  //           resizeMode="contain"
  //           style={styles.tinyLogo}
  //           source={{ uri: item.imgURL }}
  //         />
  //       </TouchableOpacity>
  //     </View>
  //   );
  // };
  const renderItemCall = useCallback(({ item, index }) => {
    return (
      <View style={styles.Category}>
        <TouchableOpacity onPress={(item) => handleOnPress(item)}>
          <Image
            resizeMode="contain"
            style={styles.tinyLogo}
            source={{ uri: item.imgURL }}
          />
        </TouchableOpacity>
      </View>
    );
  }


  );
  // const onSelectedItem = ({ item }) => {
  //   console.log(item)
  // };
  onNavigationStateChangeAction = async (webViewState) => {
    let checkUrl = false
    console.log(webViewState.url)
    if (webViewState.url.includes("ResponseCode=24")) {
      setShowWebView(false)
      Alert.alert("?????t l???ch kh??m", "?????t l???ch kh??m th???t b???i", [{ text: "?????ng ??" }]);
      // AppNavigate.navigateToTabHome(navigation.dispatch);
      navigation.goBack(navigation.dispatch);
    }
    if (webViewState.url.includes("ResponseCode=00")) {
      console.log(webViewState.url)
      checkUrl = true
      let link = webViewState.url.substr(webViewState.url.indexOf('?') + 1)
      console.log(link)
      let savePayment = await API.savePaymentStatus(dispatch, {}, link);
      console.log("savePayment:", savePayment)
      const urlReturn = webViewState.url
      let orderCode = urlReturn.split('&')[4].split('=')[1]
      console.log(orderCode)
      let getReturnPayment = await API.getReturnPaymentStatus(dispatch, {}, orderCode);
      console.log(getReturnPayment)
      setShowWebView(false)
      if (getReturnPayment.id) {
        // alert("?????t l???ch kh??m th??nh c??ng");
        let message = ''
        if (makeAppointData.connectWithHis == 3 || makeAppointData.connectWithHis == 1) {
          message = "C???m ??n b???n ???? ????ng k?? l???ch kh??m, l???ch kh??m c???a b???n ??ang ???????c " + makeAppointData.healthFacilityName + " x??? l??, ch??ng t??i s??? th??ng b??o k???t qu??? cho b???n trong th???i gian s???m nh???t"
        } else if (getReturnPayment.type === 1) {
          message = "Ch??c m???ng b???n ???? ?????t l???ch kh??m ng??y " + getReturnPayment.appointmentDate + " th??nh c??ng"
        } else if (getReturnPayment.type === 2) {
          message = "Ch??c m???ng b???n ???? ?????t l???ch kh??m " + makeAppointData.AcademicCode + '.' + getReturnPayment.doctorName + " th??nh c??ng"
        }
        Alert.alert("?????t l???ch kh??m", message, [{ text: "?????ng ??" }]);
        dispatch(actions.resetMakeAppointData({}));
        AppNavigate.navigateToExaminationCard(navigation.dispatch, {
          idCard: getReturnPayment?.id,
          isDatLichKham: true
        });
      } else {
        Alert.alert("?????t l???ch kh??m", "?????t l???ch kh??m th???t b???i", [{ text: "?????ng ??" }]);
      }

      // AppNavigate.navigateToExaminationCard(navigation.dispatch, {
      //   idCard: getReturnPayment?.id,
      //   isDatLichKham: true
      // });

      // if (checkUrl && savePayment.message==="Success") {
      //   console.log(makeAppointData);
      //   let dataResponse = await API.requestBookByDay(dispatch, makeAppointData);
      //   console.log("dataResponse:    ", dataResponse)
      //   if (dataResponse.id) {
      //     // alert("?????t l???ch kh??m th??nh c??ng");
      //     let message = ''
      //     if (makeAppointData.connectWithHis == 3) {
      //       message = "C???m ??n b???n ???? ????ng k?? l???ch kh??m, l???ch kh??m c???a b???n ??ang ???????c " + makeAppointData.healthFacilityName + " x??? l??, ch??ng t??i s??? th??ng b??o k???t qu??? cho b???n trong th???i gian s???m nh???t"
      //     } else if (dataResponse.type === 1) {
      //       message = "Ch??c m???ng b???n ???? ?????t l???ch kh??m ng??y " + dataResponse.appointmentDate + " th??nh c??ng"
      //     } else if (dataResponse.type === 2) {
      //       message = "Ch??c m???ng b???n ???? ?????t l???ch kh??m " + makeAppointData.AcademicName + '.' + dataResponse.doctorName + " th??nh c??ng"
      //     }
      //     Alert.alert("?????t l???ch kh??m", message, [{ text: "?????ng ??" }]);
      //     dispatch(actions.resetMakeAppointData({}));
      //     AppNavigate.navigateToExaminationCard(navigation.dispatch, {
      //       idCard: dataResponse?.id,
      //       isDatLichKham: true
      //     });
      //   } else {
      //     Alert.alert("?????t l???ch kh??m", "?????t l???ch kh??m th???t b???i", [{ text: "?????ng ??" }]);
      //   }
      // }
    }

  };

  return (
    <ScreensView
      titleScreen={"X??c th???c thanh to??n"}
      styleContent={styles.styleContainContent}
      renderFooter={
        !showWebView ? null
          //  <ButtonView
          //   title={"X??c nh???n"}
          //   onPress={handleOnPress}
          //   style={{ marginBottom: 20, marginHorizontal: 15 }}
          // /> 
          : null
      }
    >
      {showWebView ? <WebView
        ref={refWebview}
        onNavigationStateChange={onNavigationStateChangeAction}
        source={{
          uri: valueUrl
        }}
        style={{ marginTop: 20 }}
      /> : <View>
        <FlatList
          // style={{ ma: Dimension.margin }}
          keyboardShouldPersistTaps="never"
          data={listBankInfo}
          // data={[]}
          // horizontal
          numColumns={3}
          extraData={listBankInfo}
          renderItem={renderItemCall}
          keyExtractor={(item, index) => item?.id + ""}
          onEndReachedThreshold={0.2}
          removeClippedSubviews
          showsVerticalScrollIndicator={false}
        />
        {/* <FlatList
            data={listBankInfo}
            renderItem={(item,index)=>{
              <View>
                <Image style={styles.stImageBankCard} source={{uri :"https://www.google.com/imgres?imgurl=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2Fb%2Fb6%2FImage_created_with_a_mobile_phone.png%2F1200px-Image_created_with_a_mobile_phone.png&imgrefurl=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FImage&tbnid=gxFxsvFBmxeZ9M&vet=12ahUKEwil5IaJr83uAhWXELcAHbcuBDEQMygAegUIARDQAQ..i&docid=0JWe7yDOKrVFAM&w=1200&h=900&q=image&ved=2ahUKEwil5IaJr83uAhWXELcAHbcuBDEQMygAegUIARDQAQ"}} />
              </View>
            }}
            keyExtractor={item => item.id}
          /> */}

        {/* <Image style={styles.stImageBankCard} source={ImagesUrl.imBankCard} />
          <Image style={styles.stImageBankCard} source={ImagesUrl.imBankCard} />
          <Image
            style={styles.stImageBankCard}
            source={{
               uri: 'https://reactnative.dev/img/tiny_logo.png',
            }}
          /> */}
        {/*<View style={styles.stContent}>
            <InputView
              isShowLabel={true}
              editable={false}
              isShowClean={false}
              label={<Text>{"S??? th???"}</Text>}
              placeholderTextColor={"gray"}
              style={styles.stInputTime}
              multiline
              styleInput={styles.stInput}
              textDisable={styles.textDisable}
              value={"4756 -0982 -5529 - 9018"}
            // onChangeText={onChangeText}
            // value={refDataBook.current[BookAppointmentKey.DateChoose]}
            />
            <InputView
              isShowLabel={true}
              editable={false}
              isShowClean={false}
              label={<Text>{"T??n ch??? th???"}</Text>}
              placeholderTextColor={"gray"}
              style={styles.stInputTime}
              multiline
              styleInput={styles.stInput}
              textDisable={styles.textDisable}
              value={"NGUYEN ANH TUAN"}
            // onChangeText={onChangeText}
            // value={refDataBook.current[BookAppointmentKey.DateChoose]}
            />
            <View style={{ flexDirection: "row" }}>
              <InputView
                isShowLabel={true}
                editable={false}
                isShowClean={false}
                label={<Text>{"Ng??y hi???u l???c"}</Text>}
                placeholderTextColor={"gray"}
                style={{ ...styles.stInputTime, flex: 1 }}
                multiline
                styleInput={styles.stInput}
                textDisable={styles.textDisable}
                value={"10/2023"}
              // onChangeText={onChangeText}
              // value={refDataBook.current[BookAppointmentKey.DateChoose]}
              />
              <InputView
                isShowLabel={true}
                editable={false}
                isShowClean={false}
                label={<Text>{"CVV"}</Text>}
                placeholderTextColor={"gray"}
                style={{ ...styles.stInputTime, flex: 1 }}
                multiline
                styleInput={styles.stInput}
                textDisable={styles.textDisable}
                value={"192"}
              // onChangeText={onChangeText}
              // value={refDataBook.current[BookAppointmentKey.DateChoose]}
              />
            </View>
          </View> */}
      </View>}
    </ScreensView>
  );
}

const styles = StyleSheet.create({
  styleContainContent: { padding: Dimension.margin2x },
  stImageBankCard: {
    alignItems: "center",
    alignSelf: "center",
  },
  stContent: {
    paddingTop: Dimension.margin3x,
    padding: Dimension.padding2x,
    marginVertical: Dimension.margin2x,
    borderRadius: Dimension.radius,
    backgroundColor: "white",
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowColor: "black",
    elevation: 3,
  },
  stInputTime: {
    marginTop: Dimension.margin4x,
    borderWidth: 0,
    borderBottomColor: Colors.colorBg2,
    borderBottomWidth: 2,
    position: "relative",
  },
  stInputReason: {
    marginTop: 40,
    position: "relative",
    borderColor: Colors.colorBg2,
    borderWidth: 0.5,
  },
  textDisable: {
    color: Colors.colorText,
    fontSize: Dimension.fontSize16,
    fontFamily: Fonts.SFProDisplaySemibold,
    marginHorizontal: Dimension.margin5,
  },
  stInput: {
    borderColor: Colors.colorBg2,
    borderWidth: 0,
  },
  tinyLogo: {
    width: 80,
    height: 80,
  },
  Category: {
    flex: 1,
    maxWidth: Dimensions.get('window').width / 3 - 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 5
  },
});
