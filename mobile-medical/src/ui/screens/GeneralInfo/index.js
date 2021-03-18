import CookieManager from '@react-native-community/cookies';
import {
  useNavigation
} from "@react-navigation/native";
import React from "react";
import { Text, View } from "react-native";
import DropShadow from "react-native-drop-shadow";
import { useDispatch } from "react-redux";
import { useApp } from "../../../AppProvider";
import { Colors } from "../../../commons";
import { ButtonView, ScreensView, TextView } from "../../../components";
import { IconViewType } from "../../../components/IconView";
import AppNavigate from "../../../navigations/AppNavigate";
import API from "../../../networking";
import ActionsKey from "./ActionsKey";
import styles from "./styles";
import UserInfoView from "./UserInfoView";

export default function GeneralInfoScreen(props) {
  const { refDialog } = useApp();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const handleOnPress = ({ id, data }) => {
    if (id === ActionsKey.ShowHistoryActivity) {
      AppNavigate.navigateToHistoryActivity(navigation.dispatch);
    } else if (id === ActionsKey.ShowPrivacyPolicy) {
      AppNavigate.navigateToPrivacyPolicy(navigation.dispatch);
    } else if (id === ActionsKey.ShowContributeComments) {
      AppNavigate.navigateToFeedbackScreen(navigation.dispatch);
    } else if (id === ActionsKey.ShowFeedback) {
      AppNavigate.navigateToFeedback(navigation.dispatch);
    } else if (id === ActionsKey.ShowContact) {
      AppNavigate.navigateToContact(navigation.dispatch);
    } else if (id === ActionsKey.ShowAbout) {
      AppNavigate.navigateToAbout(navigation.dispatch);
    } else if (id === ActionsKey.ShowLogOut) {
      handleSignOut();
    } else if (id === ActionsKey.ShowHealthDeclaration) {
      AppNavigate.navigateToHealthDeclarationList(navigation.dispatch);
    } else if (id === ActionsKey.CancelLogout) {
      refDialog.current.hideDialog();
    } else if (id === "UpdateInfoUser") {
      AppNavigate.navigateToEditAccount(navigation.dispatch);
    } else if (id === ActionsKey.ConfirmLogout) {
      refDialog.current.hideDialog();
      signOut();
    }
  };
  // const handleSignOut = () => {

  //   Alert.alert(
  //     "Thông báo",
  //     "Bạn có thực sự muốn đăng xuất?",
  //     [
  //       {
  //         text: "Hủy bỏ",
  //         style: "cancel",
  //       },
  //       {
  //         text: "Đăng xuất",
  //         onPress: () => {
  //           API.requestSingOut(dispatch);
  //           CookieManager.clearAll()
  //             .then((success) => {
  //               console.log('CookieManager.clearAll =>', success);
  //             });
  //           AppNavigate.navigateWhenAppStart(navigation.dispatch);
  //         },
  //       },
  //     ],
  //     {
  //       cancelable: false,
  //     }
  //   );
  // };

  const signOut = () => {
    API.requestSingOut(dispatch);
    CookieManager.clearAll()
      .then((success) => {
        console.log('CookieManager.clearAll =>', success);
      });
    AppNavigate.navigateWhenAppStart(navigation.dispatch);
  }

  const handleSignOut = () => {
    refDialog?.current &&
      refDialog.current
        .configsDialog({
          visibleClose: false,
          isScroll: true,
        })
        .drawContents(
          <>
            <Text style={styles.stTextTitleConfirm}>{"Thông báo"}</Text>
            <Text style={styles.stTextConfirm}>
              {"Bạn chắc chắn muốn thoát khỏi ứng dụng này?"}
            </Text>
            <View style={styles.stConfirmFooter}>
              <ButtonView
                id={"CancelLogout"}
                title={"Thoát"}
                onPress={handleOnPress}
                bgColor={"#E8E8E8"}
                textColor={Colors.textLabel}
                style={{
                  ...styles.stButtonConfirm
                }}
              />
              <ButtonView
                id={"ConfirmLogout"}
                title={"Đồng ý"}
                onPress={handleOnPress}
                bgColor={Colors.colorMain}
                style={styles.stButtonConfirm}
              />
            </View>
          </>
        )
        .visibleDialog();
  };
  /////
  const showDialog = (typeDialog) => {
    refDialog?.current &&
      refDialog.current
        .configsDialog({
          visibleClose: false,
          isScroll: true,
        })
        .drawContents(
          <ChoiceValueView
            typeDialog={typeDialog}
            refDialog={refDialog.current}
            onPress={handleSelected}
            itemSelect={itemSelect}
          />
        )
        .visibleDialog();
  };

  ////
  return (
    <ScreensView
      titleScreen={"Thông tin chung"}
      isShowBack={false}
      styleContent={styles.styleContent}
    >
      <UserInfoView
        id={"UpdateInfoUser"}
        onPress={handleOnPress}
      />
      <DropShadow
        style={{
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.05,
          shadowRadius: 10,
        }}
      >
        <View style={styles.stContain}>
          <TextView
            id={ActionsKey.ShowHistoryActivity}
            onPress={handleOnPress}
            style={styles.stContainMenuRow}
            styleValue={styles.stTextMenu}
            value={"Nhật ký hoạt động"}
            nameIconLeft={"ic-history"}
            colorIconLeft={Colors.textLabel}
            sizeIconLeft={24}
          />
          <TextView
            id={ActionsKey.ShowPrivacyPolicy}
            onPress={handleOnPress}
            style={styles.stContainMenuRow}
            styleValue={styles.stTextMenu}
            value={"Chính sách bảo mật"}
            nameIconLeft={"ic-pay"}
            colorIconLeft={Colors.textLabel}
            sizeIconLeft={24}
          />
          <TextView
            id={ActionsKey.ShowFeedback}
            onPress={handleOnPress}
            style={styles.stContainMenuRow}
            styleValue={styles.stTextMenu}
            value={"Ý kiến đóng góp"}
            nameIconLeft={"ic-headset"}
            colorIconLeft={Colors.textLabel}
            sizeIconLeft={24}
          />
          <TextView
            id={ActionsKey.ShowContact}
            onPress={handleOnPress}
            style={styles.stContainMenuRow}
            styleValue={styles.stTextMenu}
            value={"Liên hệ"}
            nameIconLeft={"smartphone"}
            typeIconLeft={IconViewType.Feather}
            colorIconLeft={Colors.textLabel}
            sizeIconLeft={24}
          />
          <TextView
            id={ActionsKey.ShowHealthDeclaration}
            onPress={handleOnPress}
            style={styles.stContainMenuRow}
            styleValue={styles.stTextMenu}
            value={"Khai báo y tế"}
            nameIconLeft={"fever"}
            colorIconLeft={Colors.textLabel}
            sizeIconLeft={24}
          />
          <TextView
            id={ActionsKey.ShowAbout}
            onPress={handleOnPress}
            style={styles.stContainMenuRow}
            styleValue={styles.stTextMenu}
            value={"Giới thiệu"}
            nameIconLeft={"info"}
            typeIconLeft={IconViewType.Feather}
            colorIconLeft={Colors.textLabel}
            sizeIconLeft={24}
          />
          <TextView
            id={ActionsKey.ShowLogOut}
            onPress={handleOnPress}
            style={styles.stContainMenuRow}
            styleValue={{ ...styles.stTextMenu, color: Colors.colorCancel }}
            value={"Đăng xuất"}
            nameIconLeft={"ic-exit"}
            colorIconLeft={Colors.colorCancel}
            sizeIconLeft={24}
          />
        </View>
      </DropShadow>
    </ScreensView>
  );
}
