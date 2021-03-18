import React, { useCallback, useEffect, useRef, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  RefreshControl,
  Keyboard,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ScreensView, ButtonView } from "../../../components";
import IconView, { IconViewType } from "../../../components/IconView";
import { useMergeState } from "../../../AppProvider";
import ItemPatientView from "./ItemPatientView";
import {
  useNavigation,
  useRoute,
  useIsFocused,
} from "@react-navigation/native";
import AppNavigate from "../../../navigations/AppNavigate";
import { ImagesUrl, Dimension, Colors, fontsValue, NavigationKey } from "../../../commons";
import API from "../../../networking";
import actions from "../../../redux/actions";
import { BookAppointmentKey } from "../../../models";
import models from "../../../models";
import styles from "./styles";

const renderItem = ({ index, item, onPress, typeScreen }) => {
  return (
    <ItemPatientView
      index={index}
      dataItem={item}
      onPress={onPress}
      typeScreen={typeScreen}
    />
  );
};

function array_move(arr, old_index, new_index) {
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr; // for testing
};


const EmptyView = (props) => {
  const navigation = useNavigation();
  const handleOnPress = () => {
    AppNavigate.navigateToCreateRecord(navigation.dispatch);
  };
  return (
    <>
      <View style={styles.stContentEmpty}>
        <Image
          source={ImagesUrl.imEmptyPatient}
          style={styles.stImageEmpty}
          resizeMode="contain"
        />
        <Text style={styles.stTextTitleEmpty}>
          {"Bạn chưa có hồ sơ sức khỏe nào"}
        </Text>
        <Text style={styles.stTextContentEmpty}>{"Tạo một hồ sơ sức khỏe."}</Text>

      </View>
      <ButtonView
        title={"Tạo hồ sơ sức khỏe"}
        onPress={handleOnPress}
        style={{ width: '90%', marginTop: 20, alignSelf: 'center' }}
      />
    </>
  );
};

function HeaderRightView(props) {
  const navigation = useNavigation();
  const handleOnPress = ({ id }) => {
    if (id === 1) {
      AppNavigate.navigateToNotifications(navigation.dispatch);
    } else if (id === 2) {
      AppNavigate.navigateToSearchAll(navigation.dispatch);
    }
  };
  return (
    <>
      <IconView
        id={1}
        onPress={handleOnPress}
        style={styles.styleIconMenu}
        name={"ic-search"}
        // type={IconViewType.MaterialCommunityIcons}
        size={Dimension.sizeIcon}
        color={Colors.colorMain}
      />
      <IconView
        id={2}
        onPress={handleOnPress}
        style={styles.styleIconMenu}
        name={"ic-user-add"}
        // type={IconViewType.EVIcon}
        size={Dimension.sizeIconToolbar}
        color={Colors.colorMain}
      />
    </>
  );
}

export default function PatientRecordsScreen(props) {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const route = useRoute();
  const typeScreen = route?.params?.typeScreen || 1;
  const onResponseResult = route?.params?.onResponseResult || null;
  const dispatch = useDispatch();
  const patientRecordsData = useRef(models.getListPatientRecords());
  const { actionBookType } = useSelector((state) => state.CommonsReducer);
  const { makeAppointData } = useSelector((state) => state.MakeAppointmentReducer);
  // console.log("makeAppointData:    ", makeAppointData)

  const [stateScreen, setStateScreen] = useMergeState({
    itemSelected: "",
    reRender: null,
  });
  const { itemSelected, reRender } = stateScreen;

  useEffect(() => {
    if (isFocused) {
      let data = models.getListPatientRecords();
      let dataItemMe = data.filter(item => item.relationship == "me");
      if (data && dataItemMe && data.length > 0) {
        patientRecordsData.current = array_move(data, data.indexOf(dataItemMe[0]), 0)
      } else {
        patientRecordsData.current = []
      }

      if (makeAppointData[BookAppointmentKey.PatientRecordId]) {
        data.forEach(
          (item) => {
            if (item.id === makeAppointData[BookAppointmentKey.PatientRecordId]) {
              item.isChecked = true
              setStateScreen({ itemSelected: item });
              return true
            } else {
              return false
            }
          }
        );
      }

      setStateScreen({ reRender: !reRender });
    }
  }, [isFocused]);

  const handleAgree = async () => {
    if (onResponseResult) {
      onResponseResult({ data: itemSelected });
      navigation.goBack();
    } else {
      let paramPatient = {
        [BookAppointmentKey.PatientRecordId]: itemSelected?.id,
        [BookAppointmentKey.PatientRecordName]: itemSelected?.name,
        [BookAppointmentKey.PatientRecordCode]: itemSelected?.patientRecordCode,
        [BookAppointmentKey.PatientRecordBirthday]: itemSelected?.dob,
        [BookAppointmentKey.HealthInsuranceCode]:
          itemSelected?.healthInsuranceCode,
      };
      dispatch(actions.saveMakeAppointData(paramPatient));

      //luồng cũ
      // AppNavigate.navigateToChooseHealthFacilities(navigation.dispatch);
      if (makeAppointData) {
        if (actionBookType === NavigationKey.NextToBookByDay) {
          AppNavigate.navigateToChooseBookTime(navigation.dispatch);
        } else if (actionBookType === NavigationKey.NextToBookByDoctor) {
          AppNavigate.navigateToDoctorSearch(navigation.dispatch, {
            typeScreen: 2,
            //nhiem vu khong kill class chon bac sy
            isNotKillClass: true
          });
        }
      }
    }
  };

  const onSelectedItem = ({ data }) => {
    patientRecordsData.current.forEach(
      (item) => (item.isChecked = item.id === data.id ? true : false)
    );
    setStateScreen({ itemSelected: data });
  };

  const handleSearchOrAddNew = () => {
    // if (typeScreen === 1) {
    AppNavigate.navigateToCreateRecord(navigation.dispatch);
    // }
  };

  ////////////

  const viewSeparator = () => {
    return <View style={styles.lineSeparator} />;
  };

  const renderItemCall = useCallback(({ item, index }) =>
    renderItem({
      item,
      index,
      onPress: onSelectedItem,
      typeScreen,
    })
  );
  return (
    <ScreensView
      isShowBack={typeScreen === 1 ? false : true}
      isScroll={false}
      //  isBackAvatar={false}
      isShowBack={typeScreen !== 1}
      titleScreen={typeScreen === 1 ? "Hồ sơ sức khỏe" : "Chọn bệnh nhân khám"}
      nameIconRight={"ic-user-add"}
      colorIconRight={Colors.colorTitleScreen}
      styleContent={styles.styleContent}
      onPressRight={handleSearchOrAddNew}
      renderFooter={
        typeScreen === 2 ? (
          <ButtonView
            disabled={!itemSelected?.id}
            title={"Chọn bệnh nhân"}
            onPress={handleAgree}
            style={{
              marginBottom: 20,
              marginHorizontal: 15,
            }}
          />
        ) : null
      }
    >

      <FlatList
       // style={{ pad: Dimension.margin }}
        keyboardShouldPersistTaps="never"
        data={patientRecordsData.current}
        // data={[]}
        extraData={patientRecordsData.current}
        renderItem={renderItemCall}
        keyExtractor={(item, index) => item?.id + ""}
        onEndReachedThreshold={0.2}
        removeClippedSubviews
      //  ItemSeparatorComponent={viewSeparator}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyView onPress={handleSearchOrAddNew} />}
      />
    </ScreensView>
  );
}
