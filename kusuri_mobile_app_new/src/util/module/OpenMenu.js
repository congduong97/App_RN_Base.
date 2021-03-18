import { Linking, Alert } from "react-native";
import React, { Component } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import { isIOS, keyAsyncStorage, managerAccount } from "../../const/System";
import NotificationCount from "../../service/NotificationCount";
import { STRING } from "../../const/String";
import { Loading } from "../../commons";
import ReloadScreen from "../../service/ReloadScreen";
import { NumberNewNofitification } from "../../container/Home/util/service";
import CurrentScreen from "../../service/CurrentScreen";

export const OpenMenu = async (item, navigation, notReload) => {
  if (item.typeDisplay === "NONE") {
    return;
  }
  // if (!item.active) {
  //   Alert.alert(STRING.notification, STRING.menu_is_un_active);
  //   return;
  // }

  if (
    item.function === "MY_PAGE" ||
    item.function == "COUPON" ||
    item.function == "NEW_COUPON" ||
    item.function == "HISTORY_COUPON"||
    item.function == "HEALTH_RECORD"
  ) {
    if (managerAccount.userId) {
      if (!notReload) {
        ReloadScreen.set(item.function);
      }
      if (
        managerAccount.enablePasswordMyPage &&
        CurrentScreen.get() !== "MY_PAGE" &&
        managerAccount.usingSms &&
        item.function === "MY_PAGE"
      ) {
        navigation.navigate("EnterPasswordApp", { nameFunction: "MY_PAGE" });
      } else {
        navigation.navigate(item.function);
      }
    } else {
      Alert.alert(
        STRING.notification,
        STRING.please_login_to_use,
        [
          {
            text: STRING.cancel,
            style: "cancel"
          },
          {
            text: STRING.ok,
            onPress: () => {
              navigation.navigate("EnterMemberCodeScreen");
            }
          }
        ],
        { cancelable: false }
      );
    }
    return;
  }

  switch (item.function) {
    case "WEB_VIEW":
      if (item.url) {
        const url = item.url;
        const { typeOpen } = item;
        if (typeOpen == "WEBVIEW") {
          if (url.includes(".pdf")) {
            navigation.navigate("PDF", { linkPDF: url });
          } else {
            navigation.navigate(item.function, { url });
          }
        } else {
          Linking.openURL(item.url);
        }
      }
      break;

    case "LINK_APP":
      // alert('ok');
      const urlLink = isIOS ? item.urlIOS : item.urlAndroid;
      const urlLinkAppStore = isIOS ? item.urlAppstore : item.urlCHPlay;
      Linking.canOpenURL(urlLink).then(supported => {
        if (!supported) {
          Linking.openURL(urlLinkAppStore).catch(error => {
            // alert(error.message || error);
          });
        } else {
          Linking.openURL(urlLink).catch(error => {
            // alert(error.message || error);
          });
        }
      });

      break;

    default:
      if (item.function == "PUSH_NOTIFICATION") {
        NumberNewNofitification.set(0);
        AsyncStorage.setItem(
          keyAsyncStorage.timeUpdateNotification,
          new Date().getTime().toString()
        );
        if (!notReload) {
          ReloadScreen.set(item.function);
        }
        navigation.navigate(item.function);
      } else if (item.function === "STORE_BOOKMARKED") {
        if (!notReload) {
          ReloadScreen.set("STORE");
        }

        navigation.navigate("STORE", { initIndex: 1 });
      } else if (item.function === "SECURITY") {
        if (!notReload) {
          ReloadScreen.set("SECURITY_SETTING");
        }

        navigation.navigate("SECURITY_SETTING");
      } else if (item.function === "PRESCRIPTION") {
        if (managerAccount.userId) {
          let firstTimeOpenPrescription = await AsyncStorage.getItem(keyAsyncStorage.firstTimeOpenPrescription)
          if (firstTimeOpenPrescription) {
            navigation.navigate("PRESCRIPTION")
          } else {
            navigation.navigate("TermsOfUser");
          }
        } else {
          Alert.alert(
            STRING.notification,
            STRING.please_login_to_use,
            [
              {
                text: STRING.cancel,
                style: "cancel"
              },
              {
                text: STRING.ok,
                onPress: () => {
                  navigation.navigate("EnterMemberCodeScreen");
                }
              }
            ],
            { cancelable: false }
          );
        }

      } else if (item.function) {
        console.log("item.function", item.function);

        if (item.function) {
          if (!notReload) {
            ReloadScreen.set(item.function);
          }

          navigation.navigate(item.function);
        }
      }
  }
};
