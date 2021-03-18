import React, { PureComponent } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { NavigationEvents } from "react-navigation";
import { CheckBoxSearchService } from "../../SearchResultsStoreMoreOptions/until/service";
import { Loading } from "../../../commons";
import { DEVICE_WIDTH, managerAccount } from "../../../const/System";
export default class ItemProduct extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      click: false
    };
  }

  clickTag = () => {
    const { click } = this.state;
    const { clickTag, id } = this.props;
    if (!click) {
      this.setState({
        click: true
      });
    } else {
      this.setState({
        click: false
      });
    }
    if (clickTag) {
      clickTag(click, id);
    }
  };
  setFalseCheck = () => {
    this.setState(
      {
        click: false
      },
      () =>
        CheckBoxSearchService.set({
          type: "checkLoadBox",
          click: this.state.click
        })
    );
  };
  render() {
    const { click } = this.state;
    const { data, loading } = this.props;
    const { imageUrl, imageActiveUrl } = data;
    return (
      <View>
        <NavigationEvents onDidFocus={item => this.setFalseCheck()} />
        {loading ? (
          <Loading />
        ) : (
          <TouchableOpacity onPress={this.clickTag}>
            <Image
              source={{ uri: !click ? imageUrl : imageActiveUrl }}
              style={{
                width: DEVICE_WIDTH * 0.24,
                height: DEVICE_WIDTH * 0.24
              }}
              resizeMode={"contain"}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}
