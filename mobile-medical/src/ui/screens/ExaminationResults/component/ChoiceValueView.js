import React, { useState } from "react";
import { StyleSheet, Text, View, FlatList, Image, Dimensions, TouchableOpacity } from "react-native";
import {
  Colors,
  Dimension,
  Fonts,
  convertTimeDateVN,
  ImagesUrl,
  validateImageUri,
  fontsValue
} from "../../../../commons";
import { TextView, ButtonView, IconView, Checkbox, RadioButton, InputView } from "../../../../components";
import models from "../../../../models";
import ActionKey from "../ActionKey";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import PushNotification from "react-native-push-notification";
import schedule from "node-schedule";
import NotificationsPopup from "../../../../ui/screens/Notifications/popup";
import NotificationType from "../../../../ui/screens/Notifications/NotificationType";
import { IconViewType } from "../../../../components/IconView";
import { eraseCharacterVietnameseToLowerCase } from "../../../../commons/utils/Validate";

export default function ChoiceValueView(props) {
  const { typeDialog, refDialog, onPress } = props;
  const [isShowPickerDate, setIsShowPickerDate] = useState(false)
  const [checkButton, setCheckButton] = useState(false)
  let titleDialog = "";
  let dataChoice = [];
  if (typeDialog === ActionKey.ShowChooseAMedicalFacility) {

    titleDialog = "Chọn cơ sở y tế khám";
    dataChoice = props.data ? props.data : []

  } else if (typeDialog === ActionKey.ShowChooseNamePatient) {
    titleDialog = "Chọn họ tên bệnh nhân";
    dataChoice = models.getListPatientRecords()
    dataChoice.map((item) => {
      item.avatar = validateImageUri(item.avatar, ImagesUrl.LogoApp)
      item.code = item.patientRecordCode
    })
  } else if (typeDialog === ActionKey.ShowChooseTakeMedicines) {
    titleDialog = "Tạo nhắc uống thuốc";
    dataChoice = models.getMedicalReminders() || [];
    dataChoice.map(
      (item) => (item.status === 1 ? item.isSelected = true : item.isSelected = false)
    );
  }

  dataChoice.forEach(
    (item) => (item.isChecked = item.id === props.itemSelect?.id ? true : false)
  );
  const [itemSelected] = useState(props.itemSelect);
  const [dataDialog, setDataDialog] = useState(dataChoice);
  const [itemEditChoice, setItemEditChoice] = useState({});
  const [dataList, setDataList] = useState(dataChoice)
  const [keySearch, setKeySearch] = useState('')

  const onPressCancel = () => {
    refDialog.hideDialog();
  };

  const showPickerDate = (isShow = true, data) => {
    if (data) {
      setItemEditChoice(data)
    }
    setIsShowPickerDate(isShow)
  }

  const handleSelectedPickerDate = (date) => {
    if (!itemEditChoice?.id) {
      const time = {
        id: date.toJSON(),
        time: date,
        name: convertTimeDateVN(date, "HH:mm"),
        status: 0
      }
      dataChoice.push(time);
    } else {
      dataChoice.map((item) => {
        if (item.id === itemEditChoice.id) {
          item.name = convertTimeDateVN(date, "HH:mm");
          item.time = date;
        }
      })
    }
    console.log("itemEditChoice:    ", itemEditChoice);
    models.saveMedicalRemindersData(dataChoice);
    setIsShowPickerDate(false);
    setDataDialog(dataChoice);

  }

  const removeTime = ({ id }) => {
    models.deleteRecord(id);
    dataChoice = models.getMedicalReminders();
    setDataDialog(dataChoice);
  }

  const onCheck = ({ id, isChecked }) => {
    console.log(isChecked);
    dataChoice.map((item) => {
      if (item.id === id) {
        item.status = isChecked ? 1 : 0;
      }
    })
    setDataDialog(dataChoice);
  }

  var renderItem = ({ item, index }) => {
    const colorText = item?.isChecked
      ? Colors.colorTextMenu
      : Colors.colorTitleScreen;
    const handleOnPress = () => {
      onSelectedItem({ index: index, data: item });
    };
    if (typeDialog === ActionKey.ShowChooseTakeMedicines) {
      return (
        <View style={{ flexDirection: 'row', paddingVertical: 8, alignItems: 'center', flex: 1, paddingHorizontal: Dimension.padding2x }}>
          <IconView
            name={"ic-pin"}
          // style={{ marginLeft: Dimension.margin3x }}
          />
          <Text onPress={handleOnPress} style={[styles.stTextItem, { color: colorText, marginLeft: 12, flex: 1 }]}>{item.name}</Text>
          <IconView
            id={item.id}
            name={"trash-2"}
            type={IconViewType.Feather}
            color={Colors.colorMain}
            size={Dimension.sizeIcon20}
            style={{ paddingRight: 8 }}
            onPress={removeTime} />
          <IconView
            id={item.id}
            onPress={() => showPickerDate(true, item)}
            name={'ic-edit'}
            color={Colors.colorMain}
            size={Dimension.sizeIcon20}
          />
          <RadioButton
            id={item.id}
            onToggle={onCheck}
            isCheck={item.isSelected}
          />
          {/* <IconView
            name={"ic-check"}
            color={Colors.colorMain}
            size={20}
            style={{ width: 40, alignItems: 'center', height: 30, justifyContent: 'center' }}
          />
          {/* <IconView
            name={item?.isChecked && "ic-check"}
            color={Colors.colorMain}
            size={20}
            style={{ width: 40, alignItems: 'center', height: 30, justifyContent: 'center' }}
          /> */}
        </View>
      )
    } else {
      return (
        <View style={[typeDialog === ActionKey.ShowChooseNamePatient ? { flexDirection: 'row', flex: 1, paddingHorizontal: 12, marginBottom: 8, alignItems: 'center' } : {}]}>
          {typeDialog === ActionKey.ShowChooseNamePatient && <Image
            source={{ uri: item?.image }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20
            }}
          />}

          <TextView
            onPress={handleOnPress}
            // nameIconLeft={typeDialog !== ActionKey.ShowChooseNamePatient ? "ic-pin" : null}
            // colorIconLeft={colorText}
            // sizeIconLeft={Dimension.sizeIcon}
            nameIconRight={item?.isChecked ? "ic-check" : null}
            // typeIconRight={IconViewType.MaterialCommunityIcons}
            sizeIconRight={22}
            colorIconRight={Colors.colorMain}
            style={[styles.stContainsItem, { flex: 1, marginLeft: 4 }]}
            value={item?.name}
            styleContainerText={styles.styContainText}
            styleValue={[styles.stTextItem, { color: colorText }]}
          />
        </View>
      );
    }

  };

  const onPressAccept = () => {
    onPress && onPress({ id: typeDialog, data: itemSelected });
    console.log('onPressAccept', dataChoice);
    models.saveMedicalRemindersData(dataChoice);
    PushNotification.cancelAllLocalNotifications();
    dataChoice.forEach(rs => {
      if (rs.status === 1) {
        PushNotification.localNotificationSchedule({
          //... You can use all the options from localNotifications
          title: "Thông báo lịch uống thuốc",
          message: "Đã đến giờ uống thuốc. Bạn đừng quên uống thuốc nhé", // (required)
          date: new Date(rs.time), // in 60 secs
          allowWhileIdle: true, // (optional) set notification to work while on doze, default: false
          repeatType: 'day'
        });
        schedule.scheduleJob(rs.time, function () {
          refDialog &&
            refDialog
              .configsDialog({
                // visibleClose: false,
                isScroll: true,
              })
              .drawContents(
                <NotificationsPopup
                  notifiData={{ type: NotificationType.MedicalReminder }}
                  refDialog={refDialog}
                  // onPress={handleSelected}
                  navigation={null}
                />
              )
              .visibleDialog();
        });
      }
    })
    refDialog.hideDialog();
  };

  const handleSearch = () => {
    let data = dataDialog.filter((item) => eraseCharacterVietnameseToLowerCase(item.name).includes(eraseCharacterVietnameseToLowerCase(keySearch)))
    setDataList(data)
  }

  const onChangeSearchValue = ({ id, data }) => {
    setKeySearch(data)
  }

  const onSelectedItem = ({ data }) => {
    onPress && onPress({ id: typeDialog, data: data });
    refDialog.hideDialog();

    // dataDialog.forEach(
    //   (item) => (item.isChecked = item.id === data.id ? true : false)
    // );
    // setDataDialog(dataDialog)
    // setItemSelected(data);
    // setRefresh(!refresh)
  };

  const onAddTime = () => {
    setIsShowPickerDate(true);
    setItemEditChoice({});
  }

  // const renderItemCall = useCallback(({ item, index }) =>
  //   renderItem({
  //     item,
  //     index,
  //     onPress: onSelectedItem,
  //   })
  // );

  return (
    <>
      <Text style={styles.stTextTitleDialog}>{titleDialog}</Text>

      {typeDialog === ActionKey.ShowChooseAMedicalFacility && <InputView
        id={"idSearch"}
        // label={titleKeySearch}
        placeholder={"Tìm kiếm cơ sở y tế"}
        placeholderTextColor={Colors.textLabel}
        iconRightName={"ic-search"}
        iconRighSize={24}
        onPressIconRight={handleSearch}
        // iconRightStyle={styles.stIconSearch}
        // offsetLabel={Platform.OS === "ios" ? -1 : -3}
        styleViewLabel={{ backgroundColor: "white", paddingHorizontal: 3 }}
        iconRightColor={"black"}
        style={styles.stInput1}
        value={keySearch}
        styleInput={styles.styleContainInput}
        onChangeText={onChangeSearchValue}
      />}

      <FlatList
        style={{ maxHeight: Dimensions.get('window').height / 2 }}
        data={typeDialog === ActionKey.ShowChooseAMedicalFacility ? dataList : dataDialog}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={1}
      />

      {typeDialog === ActionKey.ShowChooseTakeMedicines && <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 32, flexDirection: 'row' }}>
        <TouchableOpacity onPress={onAddTime}><Text style={{ color: "#00C6AD", fontSize: 16 }} >Thêm mới thời gian</Text></TouchableOpacity>
      </View>}
      {typeDialog !== ActionKey.ShowChooseAMedicalFacility && <View style={[styles.stFooterBotton, {}]}>
        <ButtonView
          title={"Huỷ Bỏ"}
          style={styles.stBottonCancel}
          textColor={Colors.colorMain}
          onPress={onPressCancel}
        />
        <ButtonView
          title={"Lựa chọn"}
          style={styles.stBottonChoose}
          onPress={onPressAccept}
        />
      </View>}


      <DateTimePickerModal
        isVisible={isShowPickerDate}
        mode={'time'}
        locale={'vi'}
        date={itemEditChoice.time ? new Date(itemEditChoice.time) : new Date()}
        confirmTextIOS='Thay Đổi'
        cancelTextIOS='Hủy'
        titleIOS={"Chọn ngày"}
        onConfirm={handleSelectedPickerDate}
        onCancel={() => setIsShowPickerDate(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  stContainsItem: {
    paddingHorizontal: 16,
    flexDirection: "row",
    paddingVertical: 12,
    alignItems: "center",
  },

  stTextTitleDialog: {
    marginBottom: 16,
    color: Colors.colorTextenu,
    fontSize: Dimension.fontSizeHeader,
    fontFamily: Fonts.SFProDisplayRegular,
    // fontWeight: "bold",
    textAlign: "center",
    letterSpacing: -0.3,
    marginTop: 20,
  },

  styContainText: {
    marginLeft: 5,
    flex: 1,
  },

  stTextItem: {
    color: Colors.colorTitleScreen,
    fontSize: Dimension.fontSizeMenu,
    fontFamily: Fonts.SFProDisplayRegular,
    fontFamily: Fonts.SFProDisplayRegular,
  },

  stBottonCancel: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.colorMain,
    backgroundColor: "white",
    marginRight: 8,
  },

  stBottonChoose: {
    flex: 1,
    marginLeft: 8,
  },

  stFooterBotton: {
    flexDirection: "row",
    marginBottom: 16,
    paddingHorizontal: 16,
  },

  stInput: {
    borderColor: Colors.colorBg2,
    borderWidth: 0,
  },
  textDisable: {
    color: Colors.colorText,
    fontSize: Dimension.fontSize16,
    fontFamily: Fonts.SFProDisplaySemibold,
    marginHorizontal: Dimension.margin5,
  },
  stInputTime: {
    flex: 1,
    // marginTop: 40,
    borderWidth: 0,
    // borderBottomColor: Colors.colorBg2,
    // borderBottomWidth: 1,
    position: "relative",
  },

  stInput1: {
    marginVertical: 12,
    marginHorizontal: Dimension.margin,
    // backgroundColor: "#3456",
    borderRadius: Dimension.radiusButton,
    // borderBottomWidth: 1,
    // borderBottomColor: Colors.colorBg2,
  },

  styleContainInput: {
    height: fontsValue(46),
    borderRadius: fontsValue(16),
    backgroundColor: '#F8F8F8',
    borderColor: 'white',
  },
});
