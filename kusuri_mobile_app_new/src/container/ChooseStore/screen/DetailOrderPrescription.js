import React, { Component, createRef } from "react";
import {
  Text,
  View,
  StatusBar,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  FlatList,
} from "react-native";
import {
  COLOR_GRAY_LIGHT,
  COLOR_GRAY,
  COLOR_WHITE,
  APP_COLOR,
  COLOR_BLACK,
} from "../../../const/Color";
import {
  DEVICE_WIDTH,
  menuInApp,
  sizePage,
  keyAsyncStorage,
  styleInApp,
  getWidthInCurrentDevice,
  getHeightInCurrentDevice,
} from "../../../const/System";
import {
  NetworkError,
  Loading,
  HeaderIconLeft,
  AppCheckBox,
  Empty,
  ModalDialog,
} from "../../../commons";
import { STRING } from "../util/string";
import { chooseStoreService } from "../util/service";
import Modal from "react-native-modal";
import AntDesign from "react-native-vector-icons/AntDesign";
import { SIZE } from "../../../const/size";
import { Api } from "../util/api";
import AsyncStorage from "@react-native-community/async-storage";
import CustomAlert from "../item/CustomAlert";
import MaintainView from "../../../commons/MaintainView";

const widthImage = (SIZE.device_width - 80 - 30) / 3;
const heightImage = (widthImage * 4) / 3;

export default class DetailOrderPrescription extends Component {
  currentImage = null;

  constructor(props) {
    super(props);
    this.state = {
      indexDate: chooseStoreService.getIndexDate(),
      isVisible: false,
      indexChooseDate: chooseStoreService.getIndexDate(),
      listDate: [],
      networkError: false,
      error: false,
      isLoading: false,
      isLoadingRefresh: false,
      phone: chooseStoreService.getPhone(),
      ischeck: chooseStoreService.getChecked(),
      detailImageModalVisible: false,
      listImage: chooseStoreService.getListImage(),
      textErrorPhone: null,
      resPhone: null,
      isMaintain: false,
    };
  }
  componentDidMount() {
    this.getListDayCanBeChosen();
    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      this.setState({
        listImage: chooseStoreService.getListImage(),
      });
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }
  getCurrentDate = () => {
    const currentDate = new Date();
    const getDay =
      currentDate.getDate().toString().length < 2
        ? "0" + currentDate.getDate().toString()
        : currentDate.getDate().toString();
    const getMonth =
      (currentDate.getMonth() + 1).toString().length < 2
        ? "0" + (currentDate.getMonth() + 1).toString()
        : (currentDate.getMonth() + 1).toString();
    const getYear = currentDate.getFullYear();
    return getYear + "/" + getMonth + "/" + getDay;
  };

  convertDate = (date) => {
    const getDay = date.substring(8, 10);
    const getMonth = date.substring(5, 7);
    const getYear = date.substring(0, 4);
    return getYear + "年" + getMonth + "月" + getDay + "日";
  };
  setSelect = async () => {
    // let phone = await AsyncStorage.getItem(keyAsyncStorage.managerAccount);
    // console.log("getAsync", phone);
    if (!this.state.ischeck) {
      this.setState({
        ischeck: true,
        phone: this.state.resPhone,
        textErrorPhone:null
      });
    } else {
      this.setState({
        ischeck: false,
      });
    }
  };
  setPhone = (text) => {
    const { status, content } = this.checkPhone(text);
    this.setState({
      phone: text,
    });
    if (!status) {
      this.setState({
        textErrorPhone: content,
      });
    } else {
      this.setState({
        textErrorPhone: null,
      });
    }
  };
  checkPhone = (phone) => {
    let status = false;
    let content = null;
    const re = /^([0-9]{10,11})$/;
    // console.log(phone[0] != 0, "kt 0 o dau");
    // console.log(!re.test(phone), "regexds");
    if (phone === null || phone.length === 0) {
      status = false;
      content = "本項目は必須です。";
    } else if (!re.test(phone) || phone[0] != 0) {
      status = false;
      content = "電話番号の形式が誤っています。";
    } else {
      status = true;
      content = null;
    }
    return { status, content };
  };
  createPrescription = async () => {
    // this.state.listDate[this.state.indexDate]
    const { listDate, indexDate, listImage } = this.state;
    const storeCode = chooseStoreService.getStore().code;

    const receptionDate = indexDate != -1 ? listDate[indexDate].date : null;
    const { status, content } = this.checkPhone(this.state.phone);
    //console.log(this.state.phone, "phone");
    //console.log(receptionDate, "receptionDate");
    //console.log("List Image ", listImage)

    if (!status) {
      this.setState({
        textErrorPhone: content,
      });
      // Alert.alert(content);
      return;
    }
    this.setState({
      ...this.state,
      isLoading: true,
    });
    try {
      const isValidDay = await chooseStoreService.validateDayCanChoose(
        storeCode
      );
      if (isValidDay == "noData") {
        //Alert.alert('お受け取り可能な営業日がありません。申し訳ありませんが、他の店舗をご選択ください。')
        this.alertRef.show(
          "お受け取り可能な営業日がありません。申し訳ありませんが、他の店舗をご選択ください。"
        );
        return;
      }
      if (isValidDay == "maintain") {
        this.setState({
          isMaintain: true,
        });
        return;
      }
      const response = await Api.creatPrescription(
        listImage,
        this.state.phone,
        storeCode,
        receptionDate
      );
      console.log(response, "response");
      if (response.code == 502) {
        if (!this.state.isMaintain) {
          this.setState({
            isMaintain: true,
            isLoading: false,
          });
        }
        return;
      }
      if (response.res.status.code == 1000) {
        this.props.navigation.navigate("SUCCESS_NOTIFICATION");
        chooseStoreService.setStore({});
        this.setState({
          ...this.state,
          isLoading: false,
        });
        return;
      } else if (response.res.status.code == 1046) {
        this.setState(
          {
            isLoading: false,
          },
          () => {
            this.alertRef.show(
              "ご選択の受け取り希望日が無効となりました。申し訳ありませんが、他の日をご選択ください。"
            );
          }
        );
        return;
      }

      this.setState({
        ...this.state,
        isLoading: false,
      });
    } catch (error) {
      console.log(error, "error create Presciption");
      this.setState({
        ...this.state,
        isLoading: false,
        networkError: true,
      });
    }
  };
  getListDayCanBeChosen = async () => {
    const store = chooseStoreService.getStore();
    try {
      this.setState({
        isLoading: true,
      });
      const response = await Api.getListDayCanBeChosen(store.code);
      const resPhone = await Api.getCurrentPhoneNumber();
      if (resPhone.code == 502 || response.code == 502) {
        this.setState({
          ...this.state,
          isLoading: false,
          isMaintain: true,
        });
        return;
      }

      let indexDate = chooseStoreService.getIndexDate();
      if (indexDate != -1 && response.res.data[indexDate].type != "VALID") {
        for (let i = 0; i < response.res.data.length; i++) {
          if (response.res.data[i].type == "VALID") {
            indexDate = i;
            break;
          }
        }
        chooseStoreService.setIndexDate(indexDate);
      }

      this.setState({
        ...this.state,
        listDate: response.res.data ? response.res.data : [],
        isLoading: false,
        resPhone: resPhone.res.data,
        indexDate: indexDate,
        indexChooseDate: indexDate,
        isMaintain: false,
      });
      console.log("dsadasd", this.state.isMaintain);
    } catch (error) {
      console.log("error", error);
      this.setState({
        ...this.state,
        isLoading: false,
        networkError: true,
        isMaintain: false,
      });
    }
  };
  handleVisibleChoseDate = () => {
    this.modalChoseDate.handleVisible();
  };

  renderModalChoseDate() {
    const { indexChooseDate } = this.state;
    //console.log("indexChooseDate render", indexChooseDate);
    return (
      <ModalDialog
        onRef={(ref) => {
          this.modalChoseDate = ref;
        }}
      >
        <View style={{ justifyContent: "center" }}>
          <TouchableOpacity
            style={{
              alignItems: "flex-end",
              marginRight: SIZE.width(5),
              // backgroundColor: "red",
            }}
            onPress={() => {
              this.handleVisibleChoseDate();
            }}
          >
            <AntDesign
              name={"close"}
              size={25}
              color={COLOR_WHITE}
              // style={{ position: "absolute", right: 0, bottom: 0 }}
            />
          </TouchableOpacity>
          <View style={styles.viewModal}>
            <Text style={[styleInApp.hkgpronw6_14, styles.textTitleModal]}>
              {STRING.title_choose_date}
            </Text>
            {this.state.listDate.length == 0 && (
              <Empty description={STRING.empty} />
            )}
            {this.state.listDate.length > 0 &&
              this.state.listDate.map((item, index) => {
                const isValid = item.type === "VALID" ? true : false;
                return (
                  <TouchableOpacity
                    key={`${index}`}
                    style={{
                      marginHorizontal: SIZE.width(8),
                      paddingVertical: 13,
                      alignItems: "center",
                      backgroundColor:
                        indexChooseDate == index ? "#46B156" : "white",
                      borderWidth: 1,
                      borderColor: isValid ? "#46B156" : "#B6B7B6",
                      borderRadius: 3,
                      marginVertical: 10,
                    }}
                    onPress={() => {
                      this.setState({
                        ...this.state,
                        indexChooseDate: index,
                      });
                    }}
                    disabled={!isValid}
                  >
                    <Text
                      style={[
                        styleInApp.hkgpronw6_14,
                        {
                          color: isValid
                            ? indexChooseDate == index
                              ? "white"
                              : "#46B156"
                            : "#B6B7B6",
                        },
                      ]}
                    >
                      {this.convertDate(item.date)}
                      {isValid
                        ? item.date.slice(0, 10) == this.getCurrentDate()
                          ? "（本日)"
                          : ""
                        : " " + item.message}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            <TouchableOpacity
              style={styles.btnChooseDate}
              onPress={() => {
                this.handleVisibleChoseDate();
                chooseStoreService.setIndexDate(this.state.indexChooseDate);
                //console.log(" indexChooseDate  1111: ", this.state.indexChooseDate);
                this.setState({
                  ...this.state,
                  indexDate: this.state.indexChooseDate,
                });
              }}
            >
              <Text style={[styleInApp.hkgpronw6_14, { color: "white" }]}>
                選択を完了する
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ModalDialog>
    );
  }
  renderChooseDate() {
    const {
      isLoading,
      networkError,
      listDate,
      indexDate,
      isMaintain,
    } = this.state;
    if (isLoading) {
      return <Loading />;
    }
    if (networkError) {
      return (
        <NetworkError
          onPress={() => {
            this.getListDayCanBeChosen();
          }}
        />
      );
    }
    return (
      <View style={styles.viewChooseDate}>
        <Text style={[styleInApp.hkgpronw6_14, styles.textDate]}>
          {indexDate != -1
            ? listDate[indexDate]
              ? this.convertDate(listDate[indexDate].date)
              : "未選択"
            : "未選択"}
        </Text>
        <Text style={[{ marginTop: 10 }, styleInApp.hkgpronw3_14]}>
          {STRING.first_note_choose_date}
          <Text style={[styleInApp.hkgpronw6_14, { color: "#FF7F7F" }]}>
            {STRING.first_note_special}
            {listDate.length}
            {STRING.last_note_special}
          </Text>
          {STRING.last_note_choose_date}
        </Text>
        <TouchableOpacity
          style={styles.btnChooseDate}
          onPress={async () => {
            try {
              const storeCode = chooseStoreService.getStore().code;
              const response = await Api.getListDayCanBeChosen(storeCode);
              if (response.code == 502) {
                this.setState({
                  isMaintain: true,
                });
                return;
              }
              const dateData = response.res.data;
              let isValidDay = false;
              for (let i = 0; i < dateData.length; i++) {
                if (dateData[i].type == "VALID") {
                  isValidDay = true;
                  break;
                }
              }
              if (isValidDay) {
                let indexChooseDate = chooseStoreService.getIndexDate();
                //console.log('indexChooseDate 2222 ', indexChooseDate, dateData[indexChooseDate].type);
                if (
                  indexChooseDate != -1 &&
                  dateData[indexChooseDate].type != "VALID"
                ) {
                  for (let i = 0; i < dateData.length; i++) {
                    if (dateData[i].type == "VALID") {
                      indexChooseDate = i;
                      break;
                    }
                  }
                  chooseStoreService.setIndexDate(indexChooseDate);
                }
                this.setState(
                  {
                    listDate: dateData ? dateData : [],
                    indexDate: indexChooseDate,
                    indexChooseDate: indexChooseDate,
                  },
                  () => {
                    //console.log("aaa ", this.state.indexChooseDate, indexChooseDate);
                    this.handleVisibleChoseDate();
                  }
                );
              } else {
                //Alert.alert('お受け取り可能な営業日がありません。申し訳ありませんが、他の店舗をご選択ください。');
                this.alertRef.show(
                  "お受け取り可能な営業日がありません。申し訳ありませんが、他の店舗をご選択ください。"
                );
                return;
              }
            } catch (error) {
              Alert.alert("インターネット接続が不安定です。");
            }
          }}
        >
          <Text style={[styleInApp.hkgpronw6_12, { color: "white" }]}>
            {STRING.choose_date}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  openDetailImageModal = (item) => {
    this.currentImage = item;
    this.setState({
      detailImageModalVisible: true,
    });
  };

  closeDetailImageModal = () => {
    this.setState({
      detailImageModalVisible: false,
    });
  };

  deleteCurrImage = async () => {
    await chooseStoreService.deleteImage(this.currentImage);
    this.setState({
      detailImageModalVisible: false,
      listImage: chooseStoreService.getListImage(),
    });
  };

  naivgateCameraScreen = async () => {
    const { phone, ischeck, indexDate } = this.state;
    await chooseStoreService.deleteImage(this.currentImage);
    this.setState(
      {
        detailImageModalVisible: false,
      },
      () => {
        chooseStoreService.setPhone(phone);
        chooseStoreService.setIndexDate(indexDate);
        chooseStoreService.setChecked(ischeck);
        this.props.navigation.push("CAMERA");
      }
    );
  };

  renderImageDetailModal = () => {
    return (
      <Modal
        isVisible={this.state.detailImageModalVisible}
        animationIn="fadeIn"
        animationOut="fadeOut"
        useNativeDriver={true}
        hideModalContentWhileAnimating={true}
      >
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            style={{ alignSelf: "flex-end" }}
            onPress={this.closeDetailImageModal}
          >
            <AntDesign name="close" color={COLOR_WHITE} size={30} />
          </TouchableOpacity>
          {this.currentImage != null && (
            <Image
              style={styles.imageInModal}
              source={{ uri: this.currentImage.uri }}
              resizeMode={"cover"}
            />
          )}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 25,
            }}
          >
            <TouchableOpacity
              style={{
                ...styles.buttonInModal,
                backgroundColor: "#646464",
                marginRight: 12,
              }}
              onPress={this.closeDetailImageModal}
            >
              <Text
                style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "bold" }}
              >
                閉じる
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                ...styles.buttonInModal,
                backgroundColor: "#FE041A",
                marginRight: 12,
              }}
              onPress={this.deleteCurrImage}
            >
              <Text
                style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "bold" }}
              >
                削除
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ ...styles.buttonInModal, backgroundColor: "#46B156" }}
              onPress={this.naivgateCameraScreen}
            >
              <Text
                style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "bold" }}
              >
                撮り直す
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  renderDateItem = ({ item }) => {
    return (
      <View style={{ flexDirection: "row" }}>
        <Text
          style={{ width: 70, fontSize: 14, color: "#1C1C1C" }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.day}
        </Text>
        <Text style={{ marginLeft: 10, fontSize: 14, color: "#1C1C1C" }}>
          {item.time}
        </Text>
      </View>
    );
  };

  renderContent() {
    const store = chooseStoreService.getStore();
    const { phone, ischeck, indexDate, listImage } = this.state;
    if (this.state.isLoading) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Loading />
        </View>
      );
    }
    if (this.state.networkError) {
      return <NetworkError />;
    }
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={[styleInApp.hkgpronw6_16, styles.textContent]}>
          {STRING.please_check_info_prescription}
        </Text>
        <View style={styles.viewPrescription}>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styleInApp.hkgpronw6_14, styles.textPrescription]}>
              {STRING.prescription_content}
            </Text>
          </View>
          {/* <Text style={[{ marginTop: 15 }, styleInApp.hkgpronw6_14]}>
            青木　太郎　様
          </Text> */}
          <Text style={[styleInApp.hkgpronw3_14, { marginTop: 10 }]}>
            {STRING.name_store_order}
            <Text style={styleInApp.hkgpronw6_14}>
              {chooseStoreService.getStore().name}
            </Text>
          </Text>
          <Text style={[styleInApp.hkgpronw3_14, { marginTop: 10 }]}>
            {STRING.number_prescription}
            <Text style={styleInApp.hkgpronw6_14}>{listImage.length}件</Text>
          </Text>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              marginVertical: 5,
              paddingVertical: 5,
              height: heightImage,
            }}
          >
            {listImage.map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    this.openDetailImageModal(item);
                  }}
                  key={`${index}`}
                >
                  <Image
                    style={{
                      height: heightImage,
                      width: widthImage,
                      marginHorizontal: SIZE.width(1),
                    }}
                    source={{ uri: item.uri }}
                    resizeMode={"cover"}
                  />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={styles.btn_add_prescription}
              onPress={() => {
                if (chooseStoreService.getListImage().length < 10) {
                  chooseStoreService.setPhone(phone);
                  chooseStoreService.setIndexDate(indexDate);
                  chooseStoreService.setChecked(ischeck);
                  this.props.navigation.push("CAMERA");
                } else {
                  Alert.alert("処方せんは10枚までとなります。");
                }
              }}
            >
              <Text style={[styleInApp.hkgpronw6_12, { color: COLOR_WHITE }]}>
                {STRING.add_prescription}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={[styleInApp.hkgpronw3_14, { marginTop: 33 }]}>
            【お受け取り薬局】
            <Text style={[styleInApp.hkgpronw3_14, { fontWeight: "bold" }]}>
              {" "}
              {store.name}
            </Text>
          </Text>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <Text style={[styleInApp.hkgpronw3_14, { width: 72 }]}>
              営業時間
            </Text>
            <FlatList
              data={store.listDayAndTimes}
              renderItem={this.renderDateItem}
              extraData={store.listDayAndTimes}
              keyExtractor={(item, index) => `${index}`}
            />
          </View>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <Text style={[styleInApp.hkgpronw3_14, { width: 72 }]}>休日</Text>
            <Text style={[styleInApp.hkgpronw3_14]}>{store.dayOff}</Text>
          </View>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <Text style={[styleInApp.hkgpronw3_14, { width: 72 }]}>TEL</Text>
            <Text style={[styleInApp.hkgpronw3_14]}>{store.phone}</Text>
          </View>
          <Text
            style={[
              styleInApp.hkgpronw3_14,
              { marginBottom: 10, marginTop: 32 },
            ]}
          >
            {STRING.title_choose_date}
          </Text>
          {this.renderChooseDate()}
        </View>
        <Text style={[styleInApp.hkgpronw6_16, styles.textContent]}>
          {STRING.content_input_phone}{" "}
          <Text style={{ color: "red", fontSize: 13 }}>* 必須</Text>
        </Text>
        <Text style={[styleInApp.hkgpronw3_13, styles.textGuide]}>
          {STRING.text_guide_input_phone}
        </Text>
        {this.state.textErrorPhone && (
          <Text
            style={[
              styleInApp.hkgpronw3_12,
              {
                color: "white",
                marginLeft: SIZE.width(5),
                marginTop: 10,
                backgroundColor: "red",
                padding: 3,
                alignSelf: "flex-start",
              },
            ]}
          >
            {this.state.textErrorPhone}
          </Text>
        )}
        <TextInput
          style={[styleInApp.hkgpronw3_14, styles.inpPhone]}
          value={this.state.phone}
          placeholder={"例）09011112222"}
          onChangeText={(text) => {
            this.setPhone(text);
          }}
          maxLength={11}
          keyboardType={"phone-pad"}
        />

        <TouchableOpacity
          style={{
            flexDirection: "row",
            marginHorizontal: SIZE.width(5),
            marginTop: 15,
            alignItems: "center",
            height: SIZE.width(8),
          }}
          onPress={this.setSelect}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <AppCheckBox
            size={20}
            status={this.state.ischeck}
            borderColor={"#B1B1B1"}
            onChangeData={this.setSelect}
          />
          <Text
            style={[{ marginLeft: SIZE.width(2) }, styleInApp.hkgpronw3_14]}
          >
            Aocaにご登録の携帯電話番号を入力する
          </Text>
        </TouchableOpacity>
        <Text
          style={[
            styleInApp.hkgpronw3_12,
            {
              marginHorizontal: SIZE.width(5),
              marginTop: 25,
              lineHeight: SIZE.width(4),
              color: "#646464",
            },
          ]}
        >
          {STRING.note_input_phone}
        </Text>
        <Text style={[{ margin: 20 }, styleInApp.hkgpronw3_16]}>
          {STRING.confirm_phone}
        </Text>
        {this.state.textErrorPhone && (
          <Text
            style={[
              styleInApp.hkgpronw3_12,
              {
                color: "red",
                // marginLeft: SIZE.width(5),
                marginTop: 10,
                // backgroundColor: "red",
                padding: 3,
                alignSelf: "center",
              },
            ]}
          >
            入力誤りのある項目があります。
          </Text>
        )}
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: SIZE.width(6),
            marginBottom: 20,
            marginTop: 10,
          }}
        >
          <TouchableOpacity
            style={styles.btnBack}
            onPress={() => {
              this.props.navigation.goBack();
            }}
          >
            <Text style={[styleInApp.hkgpronw6_14, { color: COLOR_WHITE }]}>
              戻る
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={listImage.length > 0 ? false : true}
            style={[
              styles.btnNext,
              {
                backgroundColor: listImage.length > 0 ? "#06B050" : "#55AB7A",
              },
            ]}
            onPress={() => {
              this.createPrescription();
            }}
          >
            <Text style={[styleInApp.hkgpronw6_14, { color: COLOR_WHITE }]}>
              送信する
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
  render() {
    const { goBack } = this.props.navigation;
    if (this.state.isMaintain) {
      return (
        <MaintainView
          timeOut={10000}
          onPress={() => {
            this.getListDayCanBeChosen();
            this.focusListener = this.props.navigation.addListener(
              "didFocus",
              () => {
                this.setState({
                  listImage: chooseStoreService.getListImage(),
                });
              }
            );
          }}
        />
      );
    }
    // console.log(currentDateConvert,"currentDateConvert")
    return (
      // <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View
        style={[
          styles.wrapperContainer,
          { backgroundColor: APP_COLOR.BACKGROUND_COLOR },
        ]}
      >
        <StatusBar backgroundColor={COLOR_GRAY_LIGHT} barStyle="dark-content" />
        <HeaderIconLeft
          // title={"fhdhdhdy"}
          goBack={goBack}
          imageUrl={menuInApp.iconNotification}
        />
        {this.renderModalChoseDate()}
        {this.renderContent()}
        {this.renderImageDetailModal()}
        <CustomAlert ref={(node) => (this.alertRef = node)} />
      </View>
      // </TouchableWithoutFeedback>
    );
  }
}
const styles = StyleSheet.create({
  wrapperContainer: {
    backgroundColor: COLOR_WHITE,
    width: DEVICE_WIDTH,
    flex: 1,
  },
  textContent: {
    marginTop: 30,
    marginLeft: SIZE.width(5),
  },
  viewPrescription: {
    marginHorizontal: SIZE.width(5),
    marginTop: SIZE.width(5),
    backgroundColor: "#F6F6F6",
    borderWidth: 2,
    borderColor: "#E4E4E4",
    borderRadius: 3,
    padding: SIZE.width(5),
  },
  textPrescription: {
    paddingVertical: SIZE.width(2),
    paddingHorizontal: SIZE.width(5),
    backgroundColor: "#646464",
    color: "white",
    alignItems: "flex-start",
  },
  viewChooseDate: {
    // backgroundColor: "#FDE4E4",
    // borderRadius: 3,
    paddingHorizontal: SIZE.width(5),
    // paddingTop: 15,
    // paddingBottom: 20,
  },
  btn_add_prescription: {
    marginTop: 20,
    paddingVertical: 10,
    backgroundColor: "#46B156",
    paddingHorizontal: SIZE.width(6),
    borderRadius: 3,
  },
  btnNext: {
    flex: 1,
    // backgroundColor: "#06B050",
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 3,
    marginLeft: 7,
  },
  btnBack: {
    flex: 1,
    backgroundColor: "#646464",
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 3,
    marginRight: SIZE.width(2),
  },
  viewModal: {
    backgroundColor: "white",
    marginHorizontal: SIZE.width(5),
    borderRadius: 3,
    // borderWidth: 2,
    // borderColor: "#FF7F7F",
    paddingBottom: 20,
  },
  textTitleModal: {
    marginTop: 25,
    marginLeft: SIZE.width(5),
    marginBottom: 15,
  },
  btnChooseDate: {
    backgroundColor: "#06B050",
    marginTop: 15,
    paddingVertical: 13,
    borderRadius: 3,
    alignSelf: "center",
    paddingHorizontal: SIZE.width(10),
  },
  textGuide: {
    marginTop: 10,
    marginHorizontal: SIZE.width(5),
    lineHeight: 20,
  },
  inpPhone: {
    marginHorizontal: SIZE.width(5),
    borderRadius: 3,
    borderWidth: 2,
    borderColor: "#E4E4E4",
    marginTop: 10,
    padding: SIZE.width(2),
  },
  btnCamera: {
    flex: 1,
    backgroundColor: "#06B050",
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 3,
    marginLeft: SIZE.width(2),
  },
  btnBack: {
    flex: 1,
    backgroundColor: "#646464",
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 3,
    marginRight: SIZE.width(2),
  },
  imageInModal: {
    width: getWidthInCurrentDevice(254),
    aspectRatio: 0.67,
  },
  buttonInModal: {
    width: getWidthInCurrentDevice(99),
    height: getHeightInCurrentDevice(44),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
  },
});
