import React from "react";
import { StyleSheet, Text, View, Platform, Modal } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import DateTimePickerIOS from "./DateTimePickerIOS";
import DateTimePickerAndroid from "./DateTimePickerAndroid";

export default function DateTimePickerView(props) {
  return Platform.OS === "android" ? (
    <DateTimePickerAndroid {...props} />
  ) : (
    <DateTimePickerIOS {...props} />
  );
}
