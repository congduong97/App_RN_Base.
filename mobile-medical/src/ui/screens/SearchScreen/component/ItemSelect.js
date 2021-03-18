import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Image,
  FlatList,
} from "react-native";
import { IconView } from "../../../../components";
const colorNgayDangKiKham = "#00C6AD";

function MyComponent(props) {
  const [reRender, setReRender] = React.useState(false);
  const DATA = props.data;

  const selectItem = (itemData) => {
    DATA.map((item) => {
      item.isSelect = false;
      if (item.id === itemData.id) {
        item.isSelect = true;
      }
    });

    setReRender(!reRender);
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          selectItem(item);
        }}
        style={{
          backgroundColor: "white",
          margin: 8,
          flex: 0.5,
          elevation: 3,
          borderRadius: 12,
          shadowColor: "gray",
        }}
      >
        <View
          style={{
            padding: 4,
            backgroundColor: item.isSelect ? colorNgayDangKiKham : "white",
            flexDirection: "row",
            borderRadius: 12,
            alignItems: "center",
            minHeight: 45,
          }}
        >
          {item.image ? (
            <View
              style={{
                padding: 10,
                backgroundColor: item.colorBgImage,
                borderRadius: 8,
              }}
            >
              <IconView name={item.image} size={20} color={item.colorImage} />
            </View>
          ) : (
            <View />
          )}

          <Text
            style={{
              color: item.isSelect ? "white" : "#747F9E",
              marginLeft: 12,
            }}
          >
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flexDirection: "row" }}>
      {Array.isArray(DATA) && (
        <FlatList
          style={{}}
          data={DATA}
          numColumns={2}
          keyExtractor={(item, index) => item.id}
          renderItem={(item) => renderItem(item)}
        />
      )}
    </View>
  );
}

export default MyComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#009387'
  },
  styleButtonFace: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    borderRadius: 8,
    elevation: 3,
    shadowColor: "gray",
    marginHorizontal: 12,
    flex: 1,
  },
});
