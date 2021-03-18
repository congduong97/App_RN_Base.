import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Colors, Dimension, Fonts } from "../../../commons";
import { TextView, IconView } from "../../../components";
import styles from "./styles";
import DropShadow from "react-native-drop-shadow";

import {
  convertTimeDate1,
  FORMAT_DD_MM_YYYY,
  FORMAT_HH_MM,
} from "../../../commons/utils/DateTime";

export default function ItemView(props) {
  const { dataItem, onPress } = props;
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
    <TouchableOpacity onPress={() => { onPress(dataItem) }} style={styles.styleViewItemResultPatient}>
      <View style={{ flex: 1,padding:9}}>
        <TextView
          style={[]}
          styleContainerText={[{ flexDirection: 'row', alignItems: 'center' }]}
          // styleTitle={[styles.stTitleButton, { marginTop: 0, fontSize: Dimension.fontSize16, color: Colors.colorText }]}
          styleValue={[styles.stTitleButton, { fontSize: Dimension.fontSize18, marginTop: 0, color: 'black' }]}
          // title={"Mã lần khám :"}
          value={dataItem.clinicName}
        />

        {dataItem.isReExamination == 1 ? <Text style={[styles.stTitleButton]}>{'Lịch tái khám'}</Text> : <View />}

        <TextView
          nameIconLeft={'ic-calendar'}
          colorIconLeft={'#747F9E'}
          style={[{ marginTop: 12 }]}
          styleContainerText={[{ flexDirection: 'row', alignItems: 'center' }]}
          styleTitle={[styles.stTitleButton, { marginLeft: 8, marginTop: 0, color: Colors.textLabel }]}
          title={(dataItem.startTime && convertTimeDate1(dataItem.startTime, FORMAT_DD_MM_YYYY))}
        />

        <TextView
          nameIconLeft={'ic-time-clock'}
          colorIconLeft={'#747F9E'}
          style={[{ marginTop: 8 }]}
          styleContainerText={[{ flexDirection: 'row', alignItems: 'center' }]}
          styleTitle={[styles.stTitleButton, { marginLeft: 8, marginTop: 0, color: Colors.textLabel }]}
          title={(dataItem.startTime && (convertTimeDate1(dataItem.startTime, FORMAT_HH_MM) + ' - ')) + (dataItem.endTime && convertTimeDate1(dataItem.endTime, FORMAT_HH_MM))}
        />
      </View>

      <IconView
        name={'ic-arrow-right'}
      />
    </TouchableOpacity>
    </DropShadow>
  );
}