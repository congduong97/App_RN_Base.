import React, { useEffect, useState } from "react";
import { Text, View, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AppNavigate from "../../../navigations/AppNavigate";
import { useApp, useMergeState } from "../../../AppProvider";
import {
  ScreensView,
  ButtonView,
  TextView,
  InputView,
  Checkbox
} from "../../../components";
import {
  Colors,
  Dimension,
} from "../../../commons";
// import { ChoiceValueView } from "../components";
import {
  convertTimeDateVN,
  FORMAT_DD_MM_YYYY,
} from "../../../commons/utils/DateTime";
import styles from "./styles";
import { IconViewType } from "../../../components/IconView";
import API from "../../../networking";
import { useDispatch } from "react-redux";
import Toast from "react-native-simple-toast";
import ChoiceValueView from './component/ChoiceValueView'

const QUESTION_TYPE = {
  BOOLEAN: 'boolean',
  TEXT: 'text'
}

export default function HealthDeclarationScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { refDialog } = useApp();
  const [stateScreen, setStateScreen] = useMergeState({
    patientRecord: {},
    medicalDeclarationInfo: { patientRecordId: 0, details: [] },
    isChecked: false, keySearch: ''
  });
  const [questionsState, setQuestionsState] = useState([]);
  const { patientRecord, isChecked, medicalDeclarationInfo, keySearch } = stateScreen;

  useEffect(() => {
    requestGetHealthQuestionList();

  }, []);

  const onCausedError = ({ id, data }) => {
    if (!data || data == '') {
      return false
    }
    return true
  }

  const requestGetHealthQuestionList = async () => {
    let dataResponses = await API.requestGetHealthQuestionList(
      dispatch
    );
    dataResponses.forEach(q => {
      if (q.type == QUESTION_TYPE.BOOLEAN) {
        q.answer = JSON.parse(q.value);
        q.answer.forEach(a => {
          a.questionId = q.id;
          a.id = a.id.toString();
        });
      }
    });
    console.log("item:     ", JSON.stringify(dataResponses))
    setQuestionsState(dataResponses);
  };

  const handleSendDocument = async () => {
    let resVal = true;
    questionsState.forEach(q => {
      let answer;
      if (q.type === QUESTION_TYPE.BOOLEAN) {
        answer = JSON.stringify(q.answer);
      } else {
        if (!q.answer || q.answer === '' || q.answer.trim() === '') {
          Toast.showWithGravity("Bạn cần khai báo đầy đủ thông tin",
            Toast.LONG,
            Toast.CENTER);
          resVal = false;
          return;
        } else {
          answer = q.answer;
        }
      }

      const detail = {
        questionId: q.id,
        answer
      }
      medicalDeclarationInfo.details.push(detail);
    });
    if (resVal) {
      let isDone = await API.requestSendHealthDeclaration(dispatch, medicalDeclarationInfo);
      if (isDone) {
        Toast.showWithGravity(
          "Khai báo y tế thành công",
          Toast.LONG,
          Toast.CENTER
        );
        navigation.goBack();
      } else {
        Toast.showWithGravity(
          "Khai báo y tế không thành công",
          Toast.SHORT,
          Toast.CENTER
        );
      }
    }
  };

  const handleOnPress = ({ id }) => {
    if (id === "TypePatientCode") {
      // AppNavigate.navigateToPatientRecords(navigation.dispatch, {
      //   typeScreen: 2,
      //   onResponseResult: onChangePatientRecord,
      // });
      showDialog();
    }
  };
  const onChangePatientRecord = ( data ) => {
    let dataRes = data;
    const birthday = convertTimeDateVN(data?.dob, FORMAT_DD_MM_YYYY);
    dataRes.birthday = birthday;
    medicalDeclarationInfo.patientRecordId = dataRes.id;
    setStateScreen({ patientRecord: dataRes, medicalDeclarationInfo });
  };

  const onChangeText = ({ id, data }) => {
    const question = questionsState.find(q => q.id === id);
    if (question) {
      question.answer = data;
    }
  };

  const onCheckRole = ({ isChecked }) => {
    setStateScreen({ isChecked });
  }

  const onCheckRadioBtn = ({ data }) => {
    questionsState.forEach(q => {
      if (q.type === QUESTION_TYPE.BOOLEAN && q.id === data.questionId) {
        const rs = q.answer.find(v => v.id === data.id);
        if (rs) {
          rs.value = rs.value === 1 ? 0 : 1;
        }
      }
    });

    setStateScreen({ questionsState: questionsState });
  };

  const navigateToVerifyPhoneScreen = ({ data }) => {
    console.log("Dataa    " , data)
    AppNavigate.navigateToVerifyPhoneScreen(navigation.dispatch, { data: data, phone: data.phone, onRequestData: onChangePatientRecord });
  }

  const showDialog = (data) => {
    refDialog?.current &&
      refDialog.current
        .configsDialog({
          isScroll: true,
        })
        .drawContents(
          <ChoiceValueView
            refDialog={refDialog.current}
            // onPress={onChangePatientRecord}
            onPress={navigateToVerifyPhoneScreen}
            itemSelect={patientRecord}
            data={data}
          />
        )
        .visibleDialog();
  };

  const handleSearch = async () => {
    let data = await API.searchDataPatientsRecords(dispatch, {
      keyword: keySearch
    })
    // if (data && data.length == 1) {
    //   onChangePatientRecord({ data: data[0] })
    // } else 
    if (data && data.length > 0) {
      showDialog(data)
    } else {
      Toast.showWithGravity("Không có dữ liệu hồ sơ bệnh nhân",
        Toast.LONG,
        Toast.CENTER);
    }

  }

  const onChangeSearchValue = ({ id, data }) => {
    setStateScreen({
      keySearch: data
    })
  };

  const renderValueItem = ({ item }) => (
    <View style={styles.stRowSelectbox}>
      <Text style={styles.stTitleButton}>{item.content}</Text>
      <TextView
        data={item}
        onPress={onCheckRadioBtn}
        nameIconLeft={item.value === 1 ? "radiobox-marked" : "radiobox-blank"}
        typeIconLeft={IconViewType.MaterialCommunityIcons}
        sizeIconLeft={Dimension.sizeIcon}
        colorIconLeft={Colors.colorMain}
        style={{ paddingLeft: Dimension.padding }}
        styleContainerText={styles.stContainCheckbox}
        styleValue={styles.stValueButton}
        value={"Có"}
      />
      <TextView
        data={item}
        onPress={onCheckRadioBtn}
        nameIconLeft={item.value === 0 ? "radiobox-marked" : "radiobox-blank"}
        typeIconLeft={IconViewType.MaterialCommunityIcons}
        sizeIconLeft={Dimension.sizeIcon}
        colorIconLeft={Colors.colorMain}
        style={{ paddingLeft: Dimension.padding }}
        styleContainerText={styles.stContainCheckbox}
        styleValue={styles.stValueButton}
        value={"Không"}
      />
    </View>
  );

  const renderQuestionItem = ({ item }) => (
    <View>
      <Text style={styles.stylesTextContent}>
        {item.content}
      </Text>
      {item.type === 'text' ?
        <InputView
          // isShowLabel
          id={item.id}
          label={
            <Text>
              {"Nội dung"}
            </Text>
          }
          // isLableTick={true}
          placeholder={"Nhập nội dung..."}
          placeholderTextColor={"gray"}
          style={styles.stInputTime}
          styleInput={styles.stInput}
          // value={item.answer || ""}
          textDisable={styles.textDisable}
          onChangeText={onChangeText}
          // labelError={"Bạn cần nhập nội dung..."}
          // onCausedError={onCausedError}
        />
        :
        <FlatList
          data={item.answer}
          renderItem={renderValueItem}
          keyExtractor={item => item.id}
        />
      }
    </View>
  );

  ///
  return (
    <ScreensView
      titleScreen={"Khai báo y tế"}
      styleContent={styles.styleContent}
      renderFooter={
        <ButtonView
          disabled={!isChecked}
          title={"Gửi tờ khai y tế"}
          onPress={handleSendDocument}
          style={{ marginBottom: 20, marginHorizontal: 15 }}
        />
      }
    >
      <Text style={styles.stylesText}>
        {
          "Khuyến cáo Khai báo thông tin sai vi phạm pháp luật Việt Nam có thể bị xử lý hình sự!"
        }
      </Text>
      {/* <InputView
        id={"TypePatientCode"}
        onPress={handleOnPress}
        isShowLabel={true}
        editable={false}
        isShowClean={false}
        iconRightName={"ic-arrow-down"}
        iconRighSize={Dimension.sizeIcon20}
        iconRightColor={Colors.colorMain}
        label={
          <Text>
            {"Mã bệnh nhân"} <Text style={{ color: "red" }}>*</Text>
          </Text>
        }
        placeholder={"Chọn mã bệnh nhân..."}
        placeholderTextColor={"gray"}
        style={styles.stInputTime}
        // multiline
        styleInput={styles.stInput}
        textDisable={styles.textDisable}
        onChangeText={onChangeText}
        value={patientRecord?.patientRecordCode}
      /> */}
      <InputView
        // isShowLabel={true}
        // editable={false}
        multiline
        numberOfLines={1}
        label={"Tìm kiếm hồ sơ bệnh nhân:"}
        placeholder={"Sđt/Hồ sơ bệnh nhân..."}
        placeholderTextColor={"gray"}
        iconRightName={"ic-search"}
        iconRighSize={24}
        onPressIconRight={handleSearch}
        iconRightStyle={styles.stIconSearch}
        offsetLabel={Platform.OS === "ios" ? -1 : -3}
        styleViewLabel={{ backgroundColor: "white", paddingHorizontal: 3 }}
        iconRightColor={Colors.colorMain}
        style={styles.stInputTime}
        value={keySearch}
        styleInput={styles.stInput}
        onChangeText={onChangeSearchValue}
      />

      <InputView
        isShowLabel={true}
        editable={false}
        isShowClean={false}
        label={"Họ và tên"}
        placeholder={"Họ và tên"}
        placeholderTextColor={"gray"}
        style={styles.stInputTime}
        // multiline
        styleInput={styles.stInput}
        textDisable={styles.textDisable}
        // onChangeText={onChangeText}
        value={patientRecord?.name}
      />
      <InputView
        // id={"TypePatientCode"}
        onPress={handleOnPress}
        isShowLabel={true}
        editable={false}
        isShowClean={false}
        label={"Ngày sinh"}
        placeholder={"Ngày sinh"}
        placeholderTextColor={"gray"}
        style={styles.stInputTime}
        // multiline
        styleInput={styles.stInput}
        textDisable={styles.textDisable}
        // onChangeText={onChangeText}
        value={patientRecord?.birthday}
      />
      <InputView
        onPress={handleOnPress}
        isShowLabel={true}
        editable={false}
        isShowClean={false}
        label={"Địa chỉ"}
        placeholder="Địa chỉ"
        placeholderTextColor={"gray"}
        style={styles.stInputTime}
        styleInput={styles.stInput}
        textDisable={styles.textDisable}
        // onChangeText={onChangeText}
        value={patientRecord?.address}
      />
      <FlatList
        data={questionsState}
        renderItem={renderQuestionItem}
        keyExtractor={item => item.id.toString()}
      />
      <Checkbox
        onToggle={(data) => onCheckRole(data)}
        isCheck={isChecked}
        style={{ paddingVertical: Dimension.padding }}
        styleLabel={{flex: 1}}
        label={`Tôi Xin cam đoan thông tin trên là đúng sự thật.\nTôi sẽ chịu trách nhiệm hoàn toàn về thông tin đã cung cấp.`}
      />
    </ScreensView>
  );
}
