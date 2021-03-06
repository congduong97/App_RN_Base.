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
  //     "Th??ng b??o",
  //     "B???n c?? th???c s??? mu???n ????ng xu???t?",
  //     [
  //       {
  //         text: "H???y b???",
  //         style: "cancel",
  //       },
  //       {
  //         text: "????ng xu???t",
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
            <Text style={styles.stTextTitleConfirm}>{"Th??ng b??o"}</Text>
            <Text style={styles.stTextConfirm}>
              {"B???n ch???c ch???n mu???n tho??t kh???i ???ng d???ng n??y?"}
            </Text>
            <View style={styles.stConfirmFooter}>
              <ButtonView
                id={"CancelLogout"}
                title={"Tho??t"}
                onPress={handleOnPress}
                bgColor={"#E8E8E8"}
                textColor={Colors.textLabel}
                style={{
                  ...styles.stButtonConfirm
                }}
              />
              <ButtonView
                id={"ConfirmLogout"}
                title={"?????ng ??"}
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
      titleScreen={"Th??ng tin chung"}
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
            value={"Nh???t k?? ho???t ?????ng"}
            nameIconLeft={"ic-history"}
            colorIconLeft={Colors.textLabel}
            sizeIconLeft={24}
          />
          <TextView
            id={ActionsKey.ShowPrivacyPolicy}
            onPress={handleOnPress}
            style={styles.stContainMenuRow}
            styleValue={styles.stTextMenu}
            value={"Ch??nh s??ch b???o m???t"}
            nameIconLeft={"ic-pay"}
            colorIconLeft={Colors.textLabel}
            sizeIconLeft={24}
          />
          <TextView
            id={ActionsKey.ShowFeedback}
            onPress={handleOnPress}
            style={styles.stContainMenuRow}
            styleValue={styles.stTextMenu}
            value={"?? ki???n ????ng g??p"}
            nameIconLeft={"ic-headset"}
            colorIconLeft={Colors.textLabel}
            sizeIconLeft={24}
          />
          <TextView
            id={ActionsKey.ShowContact}
            onPress={handleOnPress}
            style={styles.stContainMenuRow}
            styleValue={styles.stTextMenu}
            value={"Li??n h???"}
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
            value={"Khai b??o y t???"}
            nameIconLeft={"fever"}
            colorIconLeft={Colors.textLabel}
            sizeIconLeft={24}
          />
          <TextView
            id={ActionsKey.ShowAbout}
            onPress={handleOnPress}
            style={styles.stContainMenuRow}
            styleValue={styles.stTextMenu}
            value={"Gi???i thi???u"}
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
            value={"????ng xu???t"}
            nameIconLeft={"ic-exit"}
            colorIconLeft={Colors.colorCancel}
            sizeIconLeft={24}
          />
        </View>
      </DropShadow>
    </ScreensView>
  );
}
