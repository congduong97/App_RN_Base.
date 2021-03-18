import React, { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { useApp, useMergeState } from "../../../../AppProvider";
import {
  useNavigation,
  useRoute,
  useIsFocused,
} from "@react-navigation/native";
import {
  Colors,
  Dimension,
  fontsValue,
  SCREEN_HEIGHT,
} from "../../../../commons";
import { ScreensView } from "../../../../components";
import ActionSheet from "../../../components/ActionSheet";
import FormCreateView from "./FormCreateView";
import ObjectData, { handleArea } from "./ObjectData";

export default function CreateRecordScreen() {
  const route = useRoute();
  const patientData = route?.params?.dataInfo || {};
  const isDisableRelationship = patientData.relationship == "me" || false
  const isEdit = route?.params?.isEdit || false;
  const isFocusBHYT = route?.params?.isFocusBHYT || false;
  const [stateScreen, setStateScreen] = useMergeState({
    reRender: false,
  });
  const { reRender, sheetType } = stateScreen;
  const refRecordData = useRef(new ObjectData(patientData));
  const recordData = useMemo(() => refRecordData.current, [reRender]);
  const refBottomSheet = useRef();
  const handleOnPress = ({ id }) => {
    setStateScreen({ sheetType: id });
    // showBottomSheet();
  };

  useEffect(() => {
    sheetType && showBottomSheet();
  }, [sheetType]);

  const showBottomSheet = () => {
    refBottomSheet.current.open();
  };

  const onCloseSheet = ({ data }) => {
    refBottomSheet.current.close();
  };
  ////
  return (
    <ScreensView
      styleBackground={{ backgroundColor: "white" }}
      titleScreen={isEdit ? "Cập nhật hồ sơ sức khoẻ" : "Tạo hồ sơ sức khoẻ"}
      bgColorStatusBar="transparent"
      styleContent={styles.styleContent}
      //  styleTitle={{ color: "white" }}
      // styleToolbar={styles.styleToolbar}
      end={{ x: 0.5, y: -1 }}
      start={{ x: 0, y: 1 }}
      colorsLinearGradient={Colors.colorsLinearGradient}
      //  styleHeader={styles.styleHeader}
      headerBottomView={
        <FormCreateView
          isEdit={isEdit}
          isDisableRelationship={isDisableRelationship}
          isFocusBHYT={isFocusBHYT}
          objectData={recordData}
          onPress={handleOnPress}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  styleContent: {
    backgroundColor: "white",
    paddingHorizontal: Dimension.padding4x,
    marginTop: fontsValue(40),
  },

  styleHeader: {
    height: fontsValue(300),
    borderBottomLeftRadius: fontsValue(60),
    borderBottomRightRadius: fontsValue(60),
    elevation: fontsValue(3),
    shadowOpacity: fontsValue(1),
    justifyContent: "flex-start",
  },
  styleToolbar: {
    paddingHorizontal: Dimension.padding2x,
  },
  stButton: {
    marginBottom: fontsValue(20),
    marginHorizontal: fontsValue(15),
    shadowOpacity: 0.25,
    shadowRadius: 13,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowColor: "#000000",
    elevation: 5,
    zIndex: 9999,
  },
});
