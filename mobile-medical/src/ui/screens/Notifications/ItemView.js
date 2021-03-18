import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import {
  Colors,
  Dimension,
  Fonts,
} from "../../../commons";
import { TextView } from "../../../components";
import HTML from "react-native-render-html";
import DropShadow from "react-native-drop-shadow";

export default function ItemView(props) {
  const { dataItem, onPress } = props;
  const { title, friendlyFormat, body, status } = dataItem;

  return (
    <DropShadow
      style={{
        shadowColor: "#000",
        shadowOffset: {
          width: 2,
          height: 2,
        },
        shadowOpacity: 0.025,
        shadowRadius: 10,
        elevation: 3,
      }}
    >
      <TouchableOpacity style={{
        // shadowOpacity: 0.25,
        // shadowRadius: 2,
        // shadowOffset: {
        //   width: 0,
        //   height: 2,
        // },
        // shadowColor: "#000000",
        // elevation: 3,
 
        borderRadius: 12,
      }} onPress={() => onPress(dataItem)}>
        <View style={[styles.stContain, {
          backgroundColor: status === 3 ? 'white' : '#e5e5e5'
        }]} >
          <TextView
            styleText={styles.stTextTitle}
          //  numberOfLines={1}
          //  nameIconLeft={"ic-medical"}
          >
            {title}
          </TextView>
          <View style={styles.stContainRow}>
            <HTML tagsStyles={{ p: styles.stHtml }} source={{ html: body }}
              renderers={{
                p: (_, children, convertedCSSStyles, passProp) => <Text key={passProp.key} numberOfLines={2}>{children}</Text>
              }} />
          </View>
          {/* {(type === NotificationType.RefuseAppointment ||
          type === NotificationType.SuccessfulAppointmentByDate ||
          type === NotificationType.SuccessfulAppointmentByDoctor ||
          type === NotificationType.RemindAppointment ||
          type === NotificationType.ChangeAppointment ||
          type === NotificationType.RemindAppointment) ?
          <TextView
            style={styles.stContainRow}
            styleContainerText={styles.stContainText}
            styleTitle={styles.stTextTitleRow}
            styleValue={styles.stTextValueRow}
            title={"Mã lịch khám:"}
            value={dataObject.bookingCode}
          />
          : <View />
        } */}
          <Text style={styles.stTextTimeNoti}>{friendlyFormat}</Text>
        </View>
      </TouchableOpacity >
    </DropShadow>
  );
}

const styles = StyleSheet.create({
  stContain: {
    paddingTop: Dimension.padding2x,
    paddingBottom: Dimension.padding,
    paddingHorizontal: Dimension.padding2x,
    marginHorizontal: 2,
    marginVertical: 0.5,
    borderRadius: Dimension.radius,
    // shadowOpacity: 0.25,
    // shadowRadius:  Dimension.radius,
    // shadowOffset: {
    //   width: 0,
    //   height: 3,
    // },
    // shadowColor: "#000000",
    // elevation: 6,
  },
  stTextTitle: {
    color: Colors.colorTextMenu,
    //  marginLeft: Dimension.margin5,
    fontSize: Dimension.fontSize16,
    fontFamily: Fonts.SFProDisplayRegular,
  },
  stContainRow: {
    marginTop: Dimension.margin5,
  },
  stContainText: {
    flexDirection: "row",
  },
  stTextTitleRow: {
    color: Colors.colorTitleScreen,
    marginLeft: Dimension.margin5,
    fontSize: Dimension.fontSize14,
    fontFamily: Fonts.SFProDisplayRegular,
  },
  stTextValueRow: {
    color: Colors.colorMain,
    marginLeft: Dimension.margin5,
    fontSize: Dimension.fontSize14,
    fontFamily: Fonts.SFProDisplayRegular,
  },
  stTextTimeNoti: {
    marginTop: Dimension.margin,
    alignSelf: "flex-end",
    marginLeft: Dimension.margin5,
    fontSize: Dimension.fontSize12,
    fontFamily: Fonts.SFProDisplayRegular,
    color: "#2AD3E7"
  },
  stHtml: {
    fontSize: 14,
    color: Colors.colorTitleScreen,
    paddingLeft: Dimension.padding5
  }
});
