import React, { Component } from "react";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import Modal from "react-native-modal";
import { SIZE } from "../../../const/size";
import { isIOS } from "../../../const/System";
export default class ModalDropdown extends Component {
  constructor(props) {
    super(props);
    const { defaultLabel, defaultId } = props;
    this.state = {
      isShow: false,
      currentLabel: !!defaultLabel ? defaultLabel : "",
      currentId: !!defaultId ? defaultId : 0,
      dataSourceCords: [],
    };
  }
  componentDidMount() {
    const { onRef } = this.props;
    onRef && onRef(this);
  }
  componentWillUnmount() {
    !!this.timeout && clearTimeout(this.timeout);
  }
  changeShow = (isVisible) => {
    if (isVisible) {
      const { data } = this.props;
      const getIndexItem = () => {
        for (let index = 0; index < data.length; index++) {
          if (this.state.currentId == data[index].id) {
            return index > 0 ? index - 1 : index;
          }
        }
        return 1;
      };
      let indexScroll =
        getIndexItem() > 2 ? getIndexItem() - 2 : getIndexItem() - 1;
      this.timeout = setTimeout(() => {
        if (!!this.scrollViewRef) {
          this.scrollViewRef.scrollResponderScrollTo({
            x: 0,
            y: this.state.dataSourceCords[indexScroll],
            animated: true,
          });
        }
      }, 500);
    }
    this.setState({
      isShow: isVisible,
    });
  };

  onPressItem = (item, index) => {
    !!this.props.onPressItem && this.props.onPressItem(item, index);
    this.setState({
      currentId: item.id,
      currentLabel: item.name,
    });
    this.changeShow(false);
  };

  render() {
    const { data, title } = this.props;
    const { currentId, currentLabel } = this.state;
    return (
      <Modal
        isVisible={this.state.isShow}
        backdropOpacity={0.3}
        onBackdropPress={() => {
          this.changeShow(false);
        }}
        animationOutTiming={200}
        animationInTiming={200}
        style={{ flex: 1, justifyContent: "flex-end" }}
      >
        <View
          style={{
            backgroundColor: "white",
            maxHeight: SIZE.height(41),
            borderRadius: 10,
            marginBottom: isIOS ? 0 : 80,
          }}
        >
          {!!title && (
            <Text
              style={{ marginVertical: 15, fontSize: 18, alignSelf: "center" }}
            >
              {title}
            </Text>
          )}
          <View
            style={{ backgroundColor: "#C6C6C6", height: 0.5, width: "100%" }}
          />
          <ScrollView
            ref={(ref) => {
              this.scrollViewRef = ref;
            }}
            bounces={false}
            style={{
              //   maxHeight: SIZE.height(30),
              marginHorizontal: 10,
            }}
            contentContainerStyle={{ paddingVertical: 12 }}
            showsVerticalScrollIndicator={false}
          >
            {!!data &&
              data.length > 0 &&
              data.map((item, index) => (
                <TouchableOpacity
                  style={{
                    backgroundColor: currentId == item.id ? "#C6C6C6" : "white",
                    height: SIZE.height(5),
                    justifyContent: "center",
                    alignItems: "center",
                    borderTopWidth: index != 0 ? 0.5 : 0,
                    borderColor: "#C6C6C6",
                    borderRadius: 5,
                  }}
                  key={`${index}`}
                  onPress={() => this.onPressItem(item, index)}
                  onLayout={(event) => {
                    const layout = event.nativeEvent.layout;
                    this.state.dataSourceCords[index] = layout.y;
                  }}
                  activeOpacity={1}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: currentId == item.id ? "black" : "gray",
                    }}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      </Modal>
    );
  }
}
