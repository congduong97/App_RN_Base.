import React, { useEffect, useRef, useCallback } from "react";
import { debounce } from "lodash";
import { StyleSheet, Text, View, TextInput, Alert, Image } from "react-native";
import { useDispatch } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import Toast from "react-native-simple-toast";
import {
  ScreensView,
  ButtonView,
  TextView,
  InputView,
} from "../../../components";
import IconView, { IconViewType } from "../../../components/IconView";
import { Dimension, Fonts, fontsValue, Colors } from "../../../commons";
import styles from "./styles";
import { useMergeState, useApp } from "../../../AppProvider";
import API from "../../../networking";
import actions from "../../../redux/actions";
import FeedbackKey from "./FeedbackKey";
import { scale } from "../../../commons/utils/Devices";
import {
  ActionSheet,
  ActionSheetType,
  PopupsChoiceView,
  PopupType,
} from "../../components";
import { useState } from "react";
import DocumentPicker from "react-native-document-picker";
import ModalConfirm from "./ModalConfirm";
import { isNullOrEmpty } from "../../../commons/utils/FunctionUtil";
import DropShadow from "react-native-drop-shadow";
import Video from 'react-native-video';

const MAX_SIZE_FILE = Math.pow(10, 6);

export default function CreateFeedbackScreen(props) {
  const { } = props;
  const route = useRoute();
  const sendBtn = useRef({
    isSending: false,
  });
  const callback = route?.params?.callback;
  const navigation = useNavigation();
  const [disabled, setDisabled] = useState(true);
  const { refDialog } = useApp();
  const dispatch = useDispatch();
  const refFeedback = useRef({});
  // console.log("check refFeedback", refFeedback);
  const refActionSheet = useRef({});
  const [modalVisible, setModalVisible] = useState(false);
  const [isFileSelected, setFile] = useState([]);
  const [image, setImage] = useState([]);
  const [comment, setComment] = useState("");
  const [stateScreen, setStateScreen] = useMergeState({
    reRender: false,
  });
  const { reRender } = stateScreen;
  useEffect(() => {
    return () => {
      dispatch(actions.responseHeathFaciProcessFeeback({}));
    };
  }, []);

  useEffect(() => { }, []);
  /////
  const handleOnPress = ({ id }) => {
    if (id === PopupType.ShowHealthFacilities) {
      showDialog(PopupType.ShowHealthFacilities, [
        FeedbackKey.FeedbackedUnitId,
      ]);
    } else if (id === PopupType.ShowHealthFacilitiesFeedback) {
      if (refFeedback.current[FeedbackKey.FeedbackedUnitId]) {
        showDialog(PopupType.ShowHealthFacilitiesFeedback, [
          FeedbackKey.ProcessingUnitId,
        ]);
      }
    } else if (id === PopupType.ShowTopic) {
      showDialog(PopupType.ShowTopic, [FeedbackKey.TopicId]);
    } else if (id === "SendFeedback") {
      sendFeedback();
    }
  };
  const onChangeText = ({ id, data }) => {
    if (id === PopupType.ShowHealthFacilities) {
      refFeedback.current[FeedbackKey.FeedbackedUnitId] = data.id;
      refFeedback.current[FeedbackKey.FeedbackedUnitName] = data.name;
      refFeedback.current[FeedbackKey.ProcessingUnitId] = "";
      refFeedback.current[FeedbackKey.ProcessingUnitName] = "";
      requestHeathFaciProccess();
    } else if (id === PopupType.ShowTopic) {
      refFeedback.current[FeedbackKey.TopicId] = data.id;
      refFeedback.current[FeedbackKey.TopicName] = data.name;
    } else if (id === PopupType.ShowHealthFacilitiesFeedback) {
      refFeedback.current[FeedbackKey.ProcessingUnitId] = data.id;
      refFeedback.current[FeedbackKey.ProcessingUnitName] = data.name;
    } else if (id === 'contentPhanAnh') {
      setComment(data)
      if (!validateInput(data)) {
        setDisabled(isNullOrEmpty(data));
        return false
      }
    } else if (id === FeedbackKey.Content) {
      refFeedback.current[id] = data;
    }
    setStateScreen({ reRender: !reRender });
    if (!validateInput()) {
      setDisabled(false);
    }
  };
  const requestHeathFaciProccess = async () => {
    API.getHeathFaciProcessFeedback(
      dispatch,
      refFeedback.current[FeedbackKey.FeedbackedUnitId]
    );
  };

  function validateInput(commentText = null) {
    return (
      isNullOrEmpty(commentText ? commentText : comment) ||
      isNullOrEmpty(refFeedback.current?.feedbackedUnitId) ||
      isNullOrEmpty(refFeedback.current?.processingUnitId) ||
      isNullOrEmpty(refFeedback.current?.topicId)
    );
  }
  const sendFeedback = async () => {
    if (!sendBtn.current.isSending) {
      let files = [];
      var size = 0;
      for (let i = 0; i < image.length; i++) {
        size = image[i]?.size + size;
        files.push(image[i]);
      }
      for (let j = 0; j < isFileSelected.length; j++) {
        size = isFileSelected[j]?.size + size;
        files.push(isFileSelected[j]);
      }
      console.log("size:    ", size)
      console.log("MAX_SIZE_FILE:    ", MAX_SIZE_FILE)

      if (size > MAX_SIZE_FILE) {
        Toast.showWithGravity(
          "Tổng dung lượng file không được vượt quá 10Mb",
          Toast.LONG,
          Toast.CENTER
        );
      } else {
        // if (image?.uri) files.push(image);
        const formData = {
          file: files,
          ...refFeedback.current,
          content: comment,
        };
        console.log("check formData", formData);
        const isDone = await API.sendFeedbackHeathFacilities(
          dispatch,
          formData
        );
        if (isDone) {
          sendBtn.current.isSending = false;
          showModal();
        } else {
          Alert.alert("Thông báo", "Thực hiện thất bại. Bạn hãy kiểm tra lại", [
            { text: "Đồng ý" },
          ]);
          sendBtn.current.isSending = false;
        }
      }
    } else {
      sendBtn.current.isSending = true;
    }
  };

  const showChoosePicture = () => {
    refActionSheet && refActionSheet.current.open();
  };

  const handleChooseFile = async () => {
    try {
      await DocumentPicker.pickMultiple({
        type: [
          // DocumentPicker.types.allFiles
          DocumentPicker.types.doc,
          DocumentPicker.types.images,
          DocumentPicker.types.xlsx,
          DocumentPicker.types.docx,
          DocumentPicker.types.video,
        ],
      }).then((result) => {
        const file = isFileSelected;
        file.push(result[0]);
        setFile(file);
        setStateScreen({ reRender: !reRender });
        console.log("isFileSelected:   ", isFileSelected);
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  };
  const onReponsePicture = ({ id, data }) => {
    if (data) {
      console.log("id", id);
      let image1 = image;
      if (id == 1) {
        image1.push({
          uri: data.uri,
          type: data.type,
          name: data.fileName,
          size: data.size
        });
      } else {
        console.log("data", data);
        for (let i = 0; i < data.length; i++) {
          image1.push({
            uri: data[i].path,
            type: data[i].mime,
            name: data[i].modificationDate + ".mp4",
            size: data[i].size,
          })
        }
      }

      console.log("image1", image1);

      setImage(image1);
      setStateScreen({ reRender: !reRender });
    }
  };
  /////////
  const showDialog = (typeDialog, keyCheck) => {
    refDialog?.current &&
      refDialog.current
        .configsDialog({
          // visibleClose: false,
          isScroll: true,
        })
        .drawContents(
          <PopupsChoiceView
            dataSelected={refFeedback.current}
            keyCheck={keyCheck}
            typeDialog={typeDialog}
            refDialog={refDialog.current}
            onPress={onChangeText}
          />
        )
        .visibleDialog();
  };

  const showModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    callback?.();
    setModalVisible(false);
    navigation.goBack();
  };

  return (
    <ScreensView
      titleScreen={"Tạo mới góp ý"}
      styleContent={styles.styleContent}
      renderFooter={
        <ButtonView
          id={"SendFeedback"}
          disabled={disabled}
          title={"Gửi góp ý"}
          onPress={debounce(handleOnPress, 300, {
            trailing: false,
            leading: true,
          })}
          style={{ marginBottom: 20, marginHorizontal: 15 }}
        />
      }
    >
      <Text style={styles.styleText}>{"Chọn cơ sở muốn phản ánh"}</Text>
      <ModalConfirm modalVisible={modalVisible} closeModal={closeModal} />
      <InputView
        onPress={handleOnPress}
        isShowLabel
        styleTextLabel={{ fontSize: Dimension.fontSize12 }}
        id={PopupType.ShowHealthFacilities}
        editable={false}
        isShowClean={false}
        iconRightName={"ic-arrow-down"}
        iconRighSize={Dimension.sizeIcon20}
        iconRightColor={Colors.colorMain}
        label={
          <Text>
            {"Chọn cơ sở muốn phản ảnh"} <Text style={{ color: "red" }}>*</Text>
            :
          </Text>
        }
        isLableTick={true}
        placeholder={"Chọn cơ sở muốn phản ảnh..."}
        placeholderTextColor={"gray"}
        style={styles.stInputRow}
        multiline
        styleInput={styles.stContentInput}
        textDisable={styles.textDisable}
        // onChangeText={onChangeText}
        value={refFeedback.current[FeedbackKey.FeedbackedUnitName]}
      />
      <InputView
        onPress={handleOnPress}
        isShowLabel
        styleTextLabel={{ fontSize: Dimension.fontSize12 }}
        id={PopupType.ShowTopic}
        editable={false}
        isShowClean={false}
        iconRightName={"ic-arrow-down"}
        iconRighSize={Dimension.sizeIcon20}
        iconRightColor={Colors.colorMain}
        label={
          <Text>
            {"Tiêu đề"} <Text style={{ color: "red" }}>*</Text>:
          </Text>
        }
        isLableTick={true}
        placeholder={"Chọn tiêu đề muốn phản ánh..."}
        placeholderTextColor={"gray"}
        style={styles.stInputRow}
        multiline
        styleInput={styles.stContentInput}
        textDisable={styles.textDisable}
        // onChangeText={onChangeText}
        value={refFeedback.current[FeedbackKey.TopicName]}
      />
      <InputView
        onPress={handleOnPress}
        isShowLabel
        id={PopupType.ShowHealthFacilitiesFeedback}
        editable={false}
        styleTextLabel={{ fontSize: Dimension.fontSize12 }}
        isShowClean={false}
        iconRightName={"ic-arrow-down"}
        iconRighSize={Dimension.sizeIcon20}
        iconRightColor={Colors.colorMain}
        label={
          <Text>
            {"Chọn nơi muốn tiếp nhận và xử lý ý kiến"}{" "}
            <Text style={{ color: "red" }}>*</Text>:
          </Text>
        }
        isLableTick={true}
        placeholder={"Chọn nơi muốn tiếp nhận và xử lý ý kiến..."}
        placeholderTextColor={"gray"}
        style={styles.stInputRow}
        multiline
        styleInput={styles.stContentInput}
        textDisable={styles.textDisable}
        // onChangeText={onChangeText}
        value={refFeedback.current[FeedbackKey.ProcessingUnitName]}
      />
      <View style={styleFeedBack.viewComment}>
        {/* <Text style={styleFeedBack.textComment}>
          Nhập nội dung phản ảnh
          <Text style={{ color: "red" }}> *</Text>:
        </Text>
        <TextInput
          id={"idComemnt"}
          style={styleFeedBack.textInput}
          value={comment}
          maxLength={1000}
          onChangeText={(text) => {
            setComment(text);
            if (!validateInput(text)) {
              setDisabled(isNullOrEmpty(text));
            }
          }}
          placeholder={"Hãy viết nhận xét của bạn ở đây"}
          multiline={true}
          underlineColorAndroid='transparent'
        /> */}

        <InputView
          maxLength={1000}
          id={'contentPhanAnh'}
          // isShowLabel={true}
          styleTextLabel={{ fontSize: Dimension.fontSize12 }}
          offsetLabel={-15}
          label={
            <Text>
              {" Nhập nội dung phản ảnh "} <Text style={{ color: "red" }}>*</Text>
            </Text>
          }
          isLableTick={true}
          placeholder={"Hãy viết nhận xét của bạn ở đây..."}
          placeholderTextColor={Colors.textLabel}
          style={[styles.stInputReason, { borderWidth: 0, marginTop: 0 }]}
          height={110}
          multiline
          value={comment}
          styleInput={[{ height: 90, borderWidth: 0 }]}
          onChangeText={onChangeText}
          onClearText={onChangeText}
        />
        <View style={styleFeedBack.viewMaxLength}>
          <Text style={{ paddingBottom: 4 }}>{comment.length}/1000</Text>
        </View>
      </View>

      {image && image.length > 0 && (
        <Text style={styleFeedBack.styleTextSelectFile}>{"Ảnh đã chọn"}</Text>
      )}
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {image.map((item, index) => {
          const handleDeleteImage = () => {
            var arr = [...image];
            arr.splice(index, 1);
            setImage(arr);
          };
          return (
            <View>
              {/* <Image
                source={{ uri: item.uri }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 12,
                  marginLeft: 12,
                  marginTop: 8,
                }}
              /> */}
              {item.uri.includes("mp4") ? <Video source={{ uri: item.uri }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 12,
                  marginLeft: 12,
                  marginTop: 8,
                }} /> : <Image
                source={{ uri: item.uri }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 12,
                  marginLeft: 12,
                  marginTop: 8,
                }}
              />}
              <View style={{ position: "absolute", right: 0, top: 6 }}>
                <IconView
                  onPress={handleDeleteImage}
                  type={IconViewType.AntDesign}
                  name={"closecircle"}
                  color={"#FF6F5B"}
                  size={14}
                />
              </View>
            </View>
          );
        })}
      </View>

      {isFileSelected && isFileSelected.length > 0 && (
        <Text style={styleFeedBack.styleTextSelectFile}>
          {"Tên file đã chọn"}
        </Text>
      )}
      {isFileSelected.map((item, index) => {
        const handleDeleteImage = () => {
          var arr = [...isFileSelected];
          arr.splice(index, 1);
          setFile(arr);
        };
        return (
          <View style={{ position: "relative" }}>
            <Text>{"  - " + item.name}</Text>
            <View
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                paddingTop: 6,
                paddingHorizontal: 6,
              }}
            >
              <IconView
                onPress={handleDeleteImage}
                type={IconViewType.AntDesign}
                name={"closecircle"}
                color={"#FF6F5B"}
                size={14}
              />
            </View>
          </View>
        );
      })}

      <View
        style={{
          flexDirection: "row",
          marginVertical: Dimension.margin3x,
          alignSelf: "center",
        }}
      >
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
          <TextView
            onPress={showChoosePicture}
            style={{
              ...styles.stContainButton,
              marginRight: Dimension.margin5,
            }}
            nameIconLeft={"ic-camera"}
            sizeIconLeft={fontsValue(20)}
            styleIconLeft={styles.stIcon}
            styleValue={styles.stTextButton}
            value={"Chụp ảnh"}
          />
        </DropShadow>
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
          <TextView
            onPress={handleChooseFile}
            style={{ ...styles.stContainButton, marginLeft: 18 }}
            nameIconLeft={"file-document-outline"}
            typeIconLeft={IconViewType.MaterialCommunityIcons}
            sizeIconLeft={fontsValue(20)}
            colorIconLeft={Colors.colorCancel}
            styleIconLeft={{
              ...styles.stIcon,
              backgroundColor: Colors.colorBtEdit,
            }}
            styleValue={styles.stTextButton}
            value={"Chọn file"}
          />
        </DropShadow>
      </View>

      <ActionSheet
        id={"file"}
        ref={refActionSheet}
        actionType={ActionSheetType.ChoosePictureMultiple}
        onReponse={onReponsePicture}
      />
    </ScreensView>
  );
}

const styleFeedBack = StyleSheet.create({
  viewComment: {
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E7E5FF",
  },
  textComment: {
    fontFamily: Fonts.SFProDisplayRegular,
    color: "#747F9E",
    fontSize: scale(12),
    paddingBottom: scale(12),
  },
  textInput: {
    textAlignVertical: "top",
    flex: 1,
    marginBottom: scale(8),
    padding: 0,
    height: scale(40),
  },
  viewMaxLength: {
    width: "100%",
    alignItems: "flex-end",
    marginRight: 12,
  },
  styleTextSelectFile: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.colorTextMenu,
    fontWeight: "bold",
  },
  styleIcon: {
    position: "absolute",
  },
});
