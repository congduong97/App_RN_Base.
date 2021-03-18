import React from "react";
import { StyleSheet, View } from "react-native";
import {
  Colors,
  Dimension,
  Fonts,
} from "../../../commons";
import { FORMAT_DD_MM_YYYY, convertTimeDateVN } from "../../../commons/utils/DateTime";
import { TextView } from "../../../components";
import IconView, { IconViewType } from "../../../../src/components/IconView";
import { useNavigation } from "@react-navigation/native";
import AppNavigate from "../../../navigations/AppNavigate";
import DropShadow from "react-native-drop-shadow";

export default function ItemView(props) {
  const { dataItem, index } = props;
  const { patientRecordName, createdDate } = dataItem;
  const navigation = useNavigation();
  const date = convertTimeDateVN(createdDate, FORMAT_DD_MM_YYYY);

  const handleSelected = () => {
    AppNavigate.navigateToHealthDeclarationDetail(navigation.dispatch, { id: dataItem.id, createdDate: dataItem.createdDate });
  };

  return (
    <DropShadow
    style={{
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.025,
      shadowRadius: 10,
    }}
  >
    <View style={[styles.stylesContain, { marginTop: index === 0 ? 16 : 0 }]}>
      <View style={{
        justifyContent: "space-evenly",
        marginLeft: 12,
        paddingVertical: Dimension.padding2x,
        flex: 1,
        // height: "100%",
      }} >
        <TextView
          styleText={styles.stTextTitle}>
          {`Phiếu khai báo y tế ${index + 1}`}
        </TextView>
        <TextView
          style={styles.stContainRow}
          styleContainerText={styles.stContainText}
          styleTitle={styles.stTextTitleRow}
          styleValue={styles.stTextValueRow}
          title={"Họ tên người khai báo:"}
          value={patientRecordName}
        />
        <TextView
          style={styles.stContainRow}
          styleContainerText={styles.stContainText}
          styleTitle={styles.stTextTitleRow}
          styleValue={{ color: Colors.textLabel }}
          title={"Ngày khai báo: "}
          value={date}
        />
      </View>
      <IconView
        style={styles.stIconCheck}
        onPress={handleSelected}
        name={"chevron-right"}
        type={IconViewType.MaterialCommunityIcons}
      />
    </ View>
    </DropShadow>
  );
}

const styles = StyleSheet.create({
  stContainRow: {
    marginTop: Dimension.margin5,
  },
  stContainText: {
    flexDirection: "row",
  },
  stTextTitleRow: {
    color: Colors.textLabel,
  
    // marginLeft: Dimension.margin5,
    fontSize: Dimension.fontSize14,
    fontFamily: Fonts.SFProDisplayRegular,
  },
  stTextValueRow: {
    color: Colors.colorMain,
    marginLeft: Dimension.margin5,
    fontSize: Dimension.fontSize14,
    fontFamily: Fonts.SFProDisplayRegular,
  },
  stIconCheck: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  stylesContain: {
    padding: Dimension.padding,
    flex: 1,
    marginHorizontal: 16,
    marginBottom: Dimension.margin2x,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: Dimension.radiusButton,
    // shadowOpacity: 0.25,
    // shadowRadius: 3,
    // shadowOffset: {
    //   width: 0,
    //   height: 3,
    // },
    // shadowColor: "#000000",
    // elevation: 3,
  },
  stTextTitle:{
    fontFamily:Fonts.SFProDisplayRegular,
    fontSize:Dimension.fontSize16
  }
});

