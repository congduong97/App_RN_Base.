import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Image,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { IconView, TextView1 } from "../../../components/index";
import { Colors } from "../../../commons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import styles from "./styles";
import { ScrollView } from "react-native-gesture-handler";

const colorMain = "#00C6AD";
const { width, height } = Dimensions.get("window");
const avatar = require("../../../../assets/images/avatar.jpg");

const MyComponent = () => {
  const [isReSend, setIsReSend] = React.useState(false);
  const [resetTimeSend, setResetTimeSend] = React.useState(false);
  return (
    <ScrollView>
      <View style={{ flex: 1, alignItems: "center" }}>
        <LinearGradient
          colors={["#63cfbb", "#43c6ad", "#36b099"]}
          style={[styles.styleLinearGra]}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 12,
              justifyContent: "center",
              position: "relative",
            }}
          >
            <IconView
              name={"ic-arrow-left"}
              size={24}
              style={{
                padding: 8,
                backgroundColor: "white",
                borderRadius: 12,
                position: "absolute",
                left: 24,
              }}
            />

            <Text
              style={[
                styles.styleText,
                {
                  padding: 12,
                  fontSize: 16,
                  color: "white",
                  fontWeight: "700",
                  flex: 1,
                  textAlign: "center",
                },
              ]}
            >
              {"Thông tin lịch khám"}
            </Text>
          </View>
        </LinearGradient>

        <View
          style={{
            elevation: 3,
            shadowColor: "gray",
            borderRadius: 12,
            backgroundColor: "white",
            marginHorizontal: 12,
            marginTop: "23%",
            width: "90%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              maxHeight: 120,
            }}
          >
            <Image
              source={avatar}
              style={{
                width: 90,
                height: 90,
                borderRadius: 45,
                margin: 12,
              }}
            />

            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text
                style={[styles.styleText, { fontSize: 18, color: "black" }]}
              >
                {"Nguyễn Thị Mai"}
              </Text>
              <TextViewT
                style={styles.styleContainerDate}
                styleValue={{ fontWeight: "500", fontSize: 14 }}
                value={"Tôi"}
                stylesIconLeft={styles.stylesIconLeft}
                iconLeft={"ic-user-dot"}
                iconColor={Colors.colorMain}
                iconSize={14}
              />
              <TextViewT
                style={styles.styleContainerDate}
                styleValue={{ fontWeight: "500", fontSize: 14 }}
                value={"21/09/1999"}
                stylesIconLeft={styles.stylesIconLeft}
                iconLeft={"ic-calendar"}
                iconColor={Colors.colorCancel}
                iconSize={14}
              />
            </View>

            <IconView
              name={"ic-edit"}
              size={20}
              color={Colors.colorCancel}
              style={{
                height: 57,
                width: 57,
                borderTopRightRadius: 12,
                borderBottomLeftRadius: 12,
                backgroundColor: "#FFE2DE",
                justifyContent: "center",
                alignItems: "center",
              }}
            />

            {/* <View/> */}
          </View>

          <View style={{ height: 30, justifyContent: "center" }}>
            <View
              style={{
                height: 30,
                width: 30,
                borderRadius: 15,
                position: "absolute",
                left: -15,
                backgroundColor: "#f2f2f2",
              }}
            />
            <View
              style={{
                borderWidth: 0.5,
                borderColor: "#f2f2f2",
                borderStyle: "dashed",
                zIndex: 0,
              }}
            />
            <View
              style={{
                height: 30,
                width: 30,
                borderRadius: 15,
                position: "absolute",
                right: -15,
                backgroundColor: "#f2f2f2",
              }}
            />
          </View>

          <View style={{ paddingVertical: 12, paddingHorizontal: 24 }}>
            <Text
              style={[
                styles.styleText,
                { alignSelf: "stretch", textAlign: "center", fontSize: 18 },
              ]}
            >
              {"Thông tin khám bệnh"}
            </Text>

            <TextViewT
              style={styles.styleContainerDate}
              styleValue={{ fontWeight: "500", fontSize: 15, marginLeft: 4 }}
              value={"21/09/1999"}
              stylesIconLeft={styles.stylesIconLeft}
              iconLeft={"ic-calendar"}
              iconColor={Colors.colorMain}
              iconSize={15}
            />

            <TextViewT
              style={styles.styleContainerDate}
              styleValue={{ fontWeight: "500", fontSize: 15, marginLeft: 4 }}
              value={"09:00 - 10:00"}
              stylesIconLeft={styles.stylesIconLeft}
              iconLeft={"ic-time-clock"}
              iconColor={Colors.colorCancel}
              iconSize={15}
            />

            <TextViewT
              style={styles.styleContainerDate}
              styleValue={{ fontWeight: "500", fontSize: 15, marginLeft: 4 }}
              value={"Phòng khám 01 - Khoa tim mạch BV Yên Bái"}
              stylesIconLeft={styles.stylesIconLeft}
              iconLeft={"ic-pin"}
              iconColor={Colors.colorMain}
              iconSize={15}
            />

            <TextViewT
              style={styles.styleContainerDate}
              styleValue={{ fontWeight: "500", fontSize: 15, marginLeft: 4 }}
              value={
                "Đau bụng ăn khó tiêu, đau về chiều và tối sau khi ăn, khó thở…."
              }
              stylesIconLeft={styles.stylesIconLeft}
              iconLeft={"ic-report"}
              iconColor={Colors.colorMain}
              iconSize={15}
            />
          </View>
        </View>

        <Text style={[styles.styleText, { fontSize: 18, marginTop: 12 }]}>
          {"Bác sỹ khám và tư vấn"}
        </Text>

        <View
          style={{
            elevation: 3,
            shadowColor: "gray",
            borderRadius: 12,
            backgroundColor: "white",
            marginHorizontal: 12,
            marginTop: 12,
            width: "90%",
            flexDirection: "row",
            maxHeight: 120,
            alignItems: "center",
          }}
        >
          <Image
            source={avatar}
            style={{
              width: 90,
              height: 90,
              borderRadius: 12,
              margin: 12,
            }}
          />

          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text style={[styles.styleText, { fontSize: 18, color: "black" }]}>
              {"BS. Phạm Ngọc Nam"}
            </Text>
            <TextViewT
              style={styles.styleContainerDate}
              styleValue={{ fontWeight: "500", fontSize: 14 }}
              value={"Tiêu hóa"}
              stylesIconLeft={styles.stylesIconLeft}
              iconLeft={"ic-stomach"}
              iconColor={Colors.colorMain}
              iconSize={14}
            />
            <TextViewT
              style={styles.styleContainerDate}
              styleValue={{ fontWeight: "500", fontSize: 14 }}
              value={"Nam"}
              stylesIconLeft={styles.stylesIconLeft}
              iconLeft={"ic-gender"}
              iconColor={Colors.colorCancel}
              iconSize={14}
            />
          </View>

          <IconView
            name={"ic-arrow-right"}
            size={24}
            color={Colors.colorCancel}
            style={{
              marginRight: 12,
            }}
          />
        </View>

        <TouchableOpacity style={[styles.stylesButton, { marginVertical: 24 }]}>
          <Text style={[styles.styleText, { fontSize: 16, color: "white" }]}>
            {"Tiếp tục"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default MyComponent;
