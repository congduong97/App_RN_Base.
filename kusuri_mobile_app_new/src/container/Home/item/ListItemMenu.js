import React, { PureComponent } from "react";
import { StyleSheet, View } from "react-native";
import { DEVICE_WIDTH, menuInApp } from "../../../const/System";
import { COLOR_GRAY_LIGHT } from "../../../const/Color";
import Loading from "../../../commons/Loading";
import { ItemMenu } from "./ItemMenu";
import { CheckDataApp } from "../../Launcher/util/service";

export class ListItemMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      menu: [],
      columnMenu: 2,
      loading: true,
    };
    this.marginRightItem = 0.016 * DEVICE_WIDTH;
    this.marginTopItem = 0.0133 * DEVICE_WIDTH;
  }

  componentDidMount() {
    const { onRef } = this.props;
    onRef && onRef(this);

    if (this.timeOutMenu) {
      clearTimeout(this.timeOutMenu);
    }
    this.timeOutMenu = setTimeout(() => {
      this.setState({ loading: false });
    }, 500);
    CheckDataApp.onChange("LIST_MENU", () => {
      this.refresh();
    });
  }

  componentWillUnmount() {
    CheckDataApp.unChange("LIST_MENU");
  }

  refresh = () => {
    this.setState({ loading: true });
    if (this.timeOutMenu) {
      clearTimeout(this.timeOutMenu);
    }
    this.timeOutMenu = setTimeout(() => {
      this.setState({ loading: false });
    }, 500);
  };

  keyExtractor = (item, index) => `${index}a`;

  renderItem = (item, index, columnMenu, sizeItem) => {
    const { navigation } = this.props;
    return (
      <ItemMenu
        column={columnMenu}
        sizeItem={sizeItem}
        item={item}
        index={index}
        key={`${index}a`}
        navigation={navigation}
      />
    );
  };

  renderRow = (item, index) => {
    const column = item.length;
    const widthItem =
      (DEVICE_WIDTH -
        (column - 1) * this.marginTopItem -
        2 * 0.064 * DEVICE_WIDTH) /
      column;
    const heightItem = 1.1* widthItem;

    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: this.marginTopItem,
        }}
        key={`${index}`}
      >
        {item.map((items, index) =>
          this.renderItem(items, index, item.length, { widthItem, heightItem })
        )}
      </View>
    );
  };

  render() {
    const { loading } = this.state;
    if (loading) {
      return (
        <Loading
          style={{ width: "100%", height: 150, marginBottom: 25 }}
          spinkit
        />
      );
    }
    return (
      <View
        style={{
          flexDirection: "column",
          marginTop: 0.053 * DEVICE_WIDTH,
          marginHorizontal: 0.064 * DEVICE_WIDTH,
          marginBottom: 0.053 * DEVICE_WIDTH,
        }}
      >
        {menuInApp.mainMenu.map((item, index) => this.renderRow(item, index))}
      </View>
    );
  }
}
