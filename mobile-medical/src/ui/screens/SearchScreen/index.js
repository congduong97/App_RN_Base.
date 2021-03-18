import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
  TextInput,
} from "react-native";
import { BaseView, IconView, TextView } from "../../../components";
import { Colors } from "../../../commons";
import styles from "./styles";
import ItemSelect from "./component/ItemSelect";

const DATA = [
  {
    id: 1,
    title: "Xương khớp",
    image: "ic-skeleton",
    colorBgImage: "#D4FAFF",
    colorImage: Colors.colorMain,
  },
  {
    id: 2,
    title: "Răng hàm mặt",
    image: "ic-teeth",
    colorBgImage: "#D4FAFF",
    colorImage: Colors.colorMain,
  },
  {
    id: 3,
    title: "Tim mạch",
    image: "ic-heartbeat",
    colorBgImage: "#ffe2de",
    colorImage: "#ff6f5b",
  },
  {
    id: 4,
    title: "Tiêu hóa",
    image: "ic-stomach",
    colorBgImage: "#D4FAFF",
    colorImage: Colors.colorMain,
  },
  {
    id: 5,
    title: "Nội tiết",
    image: "ic-skeleton",
    colorBgImage: "#D4FAFF",
    colorImage: Colors.colorMain,
  },
];

const DATAHocHam = [
  {
    id: 1,
    title: "PGS - TS",
    // image: "Bố",
  },
  {
    id: 2,
    title: "Bác sỹ",
    // image: "Con",
  },
  {
    id: 3,
    title: "Thạc sỹ",
    // image: "Con",
  },
];

const DATASex = [
  {
    id: 1,
    title: "Nam",
    image: "ic-gender",
    colorBgImage: "#D4FAFF",
    colorImage: Colors.colorMain,
  },
  {
    id: 2,
    title: "Nữ",
    image: "ic-gender",
    colorBgImage: "#ffe2de",
    colorImage: "#ff6f5b",
  },
];

const MyComponent = () => {
  const [reRender, setReRender] = React.useState(false);
  const [textSearch, setTextSearch] = React.useState("");

  return (
    <BaseView
      stylesView={{ flex: 1, backgroundColor: "white" }}
      titleScreen={"Tìm kiếm"}
      // isShowIconRight={true}
      styleToolbar={{ height: 45 }}
      styleTitle={[styles.styleTitle]}
    >
      <View style={styles.styleViewSearch}>
        <TextInput
          style={{ flex: 1, paddingVertical: 12 }}
          onChangeText={(text) => setTextSearch(text)}
          value={textSearch}
          placeholder={"Tìm kiếm"}
        />

        <IconView name={"ic-search"} />
      </View>

      <ScrollView style={{ marginBottom: 8 }}>
        <View style={{ marginBottom: 20, padding: 12 }}>
          <Text style={{ fontSize: 18, marginVertical: 12 }}>
            {"Chuyên khoa"}
          </Text>
          <ItemSelect data={DATA} />

          <Text style={{ fontSize: 18, marginVertical: 12 }}>
            {"Học hàm học vị"}
          </Text>
          <ItemSelect data={DATAHocHam} />

          <Text style={{ fontSize: 18, marginVertical: 12 }}>
            {"Giới tính"}
          </Text>
          <ItemSelect data={DATASex} />
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.styleButton}>
        <Text
          style={{
            color: "white",
            fontSize: 14,
          }}
        >
          {"Lọc tìm kiếm"}
        </Text>
      </TouchableOpacity>
    </BaseView>
  );
};

export default MyComponent;
