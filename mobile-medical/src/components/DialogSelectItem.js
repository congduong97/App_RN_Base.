import React, { Component } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
} from "react-native";
import { Colors } from "../commons";
import { IconView } from "../components";
import BaseDialog from "../components/BaseDialogSelect";
const DEVICE_HEIGHT = Dimensions.get("window").height;
class DialogSelectItemFromList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reRender: false,
    };
    this.closedDialog = this.closedDialog.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.onClickChonItem = this.onClickChonItem.bind(this);
    this.dataDialog = this.props.dataDialog ? this.props.dataDialog : [];
    this.dataList = [];
    this.dataSelect = [];
    this.onData(this.props.dataDialog ? this.props.dataDialog.dataList : []);

    this.dataChon = [];
  }

  closedDialog = () => {
    this.props.showDialog(false);
  };

  onData(data, id, isRender = false) {
    let itemSelect = id ? id : this.dataDialog.itemSelect;
    this.dataList = [];
    if (data) {
      for (let i = 0; i < data.length; i++) {
        this.dataList.push({
          title: data[i].title,
          id: data[i].id,
          value: data[i].value,
          icon: data[i].icon,
          isSelect: data[i].id === itemSelect,
        });

        if (data[i].id === itemSelect) {
          this.dataSelect = {
            title: data[i].title,
            id: data[i].id,
            value: data[i].value,
            icon: data[i].icon,
            isSelect: data[i].id === itemSelect,
          };
        }
      }
    }

    if (isRender) {
      this.reRender();
    }
  }

  reRender = () => {
    this.setState((prevState) => ({
      reRender: (prevState.reRender = !this.state.reRender),
    }));
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.dataDialog) {
      if (this.props.dataDialog !== prevProps.dataDialog) {
        this.dataDialog = this.props.dataDialog ? this.props.dataDialog : {};
        this.onData(
          this.props.dataDialog ? this.props.dataDialog.dataList : []
        );
        this.reRender();
      }
    }
  }

  renderItem = ({ item, index }) => {
    let itemSelect = this.dataDialog.itemSelect;
    return (
      <TouchableOpacity
        onPress={() => {
          this.dataChon = item;
          this.onData(this.props.dataDialog.dataList, item.id, true);
        }}
        style={{
          flexDirection: "row",
          borderBottomWidth: 0.5,
          borderBottomColor: "#e6e6e6",
          borderTopColor: "#e6e6e6",
          borderTopWidth: index === 0 ? 0.5 : 0,
          paddingHorizontal: 12,
          fontFamily: "Lato-Regular",
          paddingVertical: 12,
        }}
      >
        <IconView
          name={item.icon}
          size={16}
          color={item.isSelect ? "black" : "#747F9E"}
        />
        <Text
          style={{
            flex: 1,
            marginLeft: 12,
            color: item.isSelect ? "black" : "#747F9E",
          }}
        >
          {item.title}
        </Text>

        {item.isSelect ? (
          <IconView
            name={"Icons---check"}
            size={16}
            color={item.isSelect ? "black" : "#747F9E"}
          />
        ) : (
          <View />
        )}
      </TouchableOpacity>
    );
  };

  onClickChonItem = (item) => {
    this.closedDialog();
    if (item) {
      this.props.onDataSelectItem(this.dataDialog.id, this.dataSelect, true);
    } else {
      this.props.onDataSelectItem(this.dataDialog.id, item, true);
    }
  };

  render() {
    let { isShowDialog } = this.props;
    return (
      <BaseDialog
        visibleModal={isShowDialog}
        titleDialog={this.dataDialog.title ? this.dataDialog.title : ""}
        isIconClosed={true}
        closedDialog={this.closedDialog}
      >
        <FlatList
          style={{ height: DEVICE_HEIGHT / 2 }}
          data={this.dataList}
          renderItem={this.renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={1}
        />

        <View
          style={{
            flexDirection: "row",
            marginTop: 12,
            backgroundColor: "#f2f2f2",
            paddingVertical: 12,
            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 15,
          }}
        >
          <TouchableOpacity
            style={[styles.styleButtonSuaToken]}
            onPress={this.closedDialog}
          >
            <Text style={[styles.styleText, { color: "white", fontSize: 16 }]}>
              {"Hủy"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.styleButtonSuaToken]}
            onPress={() => {
              this.onClickChonItem(this.dataChon);
            }}
          >
            <Text style={[styles.styleText, { color: "white", fontSize: 16 }]}>
              {"Đồng ý"}
            </Text>
          </TouchableOpacity>
        </View>
      </BaseDialog>
    );
  }
}

const styles = StyleSheet.create({
  styleText: {
    fontSize: 14,
    fontFamily: "Lato-Regular",
    color: "white",
  },

  styleTextInputElement: {
    flexDirection: "row",
    height: 40,
    borderColor: Colors.colorMain,
  },
  styleButtonSuaToken: {
    flex: 1,
    marginHorizontal: 12,
    backgroundColor: Colors.colorMain,
    borderRadius: 6,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default DialogSelectItemFromList;
