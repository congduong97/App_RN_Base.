import React, { Component } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { SIZE } from "../const/size";
class Empty extends Component {
  render() {
    const { title, description, urlImage, onRefresh, isRefresh } = this.props;

    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefresh}
            onRefresh={() => {
              onRefresh();
            }}
          />
        }
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: SIZE.width(5),
          }}
        >
          <Text
            style={[
              {
                marginTop: 10,
                marginBottom: 10,
                color: "gray",
                textAlign: "center",
                fontSize: 16,
              },
            ]}
          >
            {description}
          </Text>
        </View>
      </ScrollView>
    );
  }
}

export default Empty;
