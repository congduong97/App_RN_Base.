import React, { useEffect, useState, useRef } from "react";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import {
  Image,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useApp, useMergeState } from "../../../AppProvider";
import {
  Colors,
  Dimension,
  Fonts,
  fontsValue,
  SCREEN_HEIGHT,
  ImagesUrl,
  validateImageUri,
} from "../../../commons";
import {
  convertTimeServerToDateVN,
  FORMAT_TO_SERVER,
} from "../../../commons/utils/DateTime";
import { ButtonView, DateTimePicker, InputView } from "../../../components";
import IconView from "../../../components/IconView";
import ActionSheet, { ActionSheetType } from "../ActionSheet";
import { TextAvatar } from '../../components/TextAvatar';

export default function AvatarView(props) {
  const {
    id: idView,
    isCapture = true,
    onPress,
    pictureData,
    isEdit,
    avatarUrl,
    name
  } = props;
  const refActionSheet = useRef();
  const selectPhotoTapped = ({ id, data }) => {
    refActionSheet && refActionSheet.current.open();
  };
  const onReponsePicture = ({ data }) => {
    onPress && onPress({ id: idView, data });
  };

  const imageUrl = pictureData
    ? { uri: pictureData }
    : validateImageUri(avatarUrl);
  return (
    <View
      style={styles.styleViewAvatar}
      onStartShouldSetResponder={() => Keyboard.dismiss()}
    >
      {
        imageUrl ?
          <Image source={imageUrl} style={styles.styleAvatar} /> :
          <TextAvatar name={name || "User"} textColor={Colors.colorMain} size={100} borderRadius={50} backgroundColor={Colors.colorSecondary}></TextAvatar>
      }

      {isCapture && (
        <IconView
          id={idView}
          name={"ic-camera"}
          size={20}
          style={styles.styleIconCameara}
          onPress={selectPhotoTapped}
        />
      )}
      <ActionSheet
        id={idView}
        ref={refActionSheet}
        actionType={ActionSheetType.ChoosePicture}
        onReponse={onReponsePicture}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  styleViewAvatar: {
    position: "absolute",
    top: -45,
    alignSelf: "center",
    zIndex: 99,
  },
  styleAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  styleIconCameara: {
    position: "absolute",
    bottom: -4,
    right: -4,
    padding: 8,
    backgroundColor: "white",
    borderRadius: fontsValue(20),
    elevation: 3,
    shadowColor: "gray",
  },
});
