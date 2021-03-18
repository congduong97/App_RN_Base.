import React, { PureComponent } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { NavigationEvents } from "react-navigation";
import { DEVICE_WIDTH, managerAccount } from "../../../const/System";
import {
  CheckBoxSearchService,
  ServiceCheckTrueandFlaseCheckBox
} from "../../SearchResultsStoreMoreOptions/until/service";
import { Loading } from "../../../commons";
export default class ItemProduct extends PureComponent {
  constructor(props) {
    super(props);
    const dataTagStore = CheckBoxSearchService.get();
    this.state = {
      click: false,
      dataTagStore: dataTagStore,
      dataCheckName: []
    };
  }
  componentDidMount() {
    CheckBoxSearchService.onChange("setCheck", data => {
      if (data.length === 0) {
        this.setState({
          click: false
        });
      }
    });
    this.checkForcus();
  }
  componentWillUnmount() {
    CheckBoxSearchService.unChange("setCheck");
  }

  checkForcus = () => {
    const { dataTagStore } = this.state;
    const { data, id } = this.props;
    const { name } = data;
    if (dataTagStore) {
      for (let i = 0; i <= dataTagStore.length; i++) {
        if (dataTagStore[i] === id) {
          this.state.dataCheckName.push(name);
          ServiceCheckTrueandFlaseCheckBox.set({
            type: "SetNameCheckBox",
            id,
            name
          });
          this.setState({
            click: true,
            dataCheckName: this.state.dataCheckName
          });
        }
      }
    }
  };

  clickTag = () => {
    const { click } = this.state;
    const { clickTag, data } = this.props;
    const { name, id } = data;
    if (!click) {
      this.setState(
        {
          click: true
        },
        () =>
          ServiceCheckTrueandFlaseCheckBox.set({
            type: "checkedDelete",
            name,
            id,
            click
          })
      );
    } else {
      this.setState(
        {
          click: false
        },
        () =>
          ServiceCheckTrueandFlaseCheckBox.set({
            type: "checkedDelete",
            name,
            id,
            click
          })
      );
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
        <NavigationEvents />
        {loading ? (
          <Loading />
        ) : (
          <TouchableOpacity onPress={this.clickTag}>
            <Image
              source={{ uri: !click ? imageUrl : imageActiveUrl }}
              style={{
                width: DEVICE_WIDTH * 0.22,
                height: DEVICE_WIDTH * 0.22
              }}
              resizeMode={"contain"}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}
