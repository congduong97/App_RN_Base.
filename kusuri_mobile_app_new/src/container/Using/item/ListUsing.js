import React, { Component } from "react";
import { FlatList } from "react-native";

import { ItemUsing } from "./ItemUsing";

export class ListUsing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size: this.props.size || 55,
    };
  }
  _keyExtractor = (item, index) => `${item.id}`;

  _renderItem = ({ item, index }) => (
    <ItemUsing
      data={item}
      key={`${item.id}`}
      index={index}
      navigation={this.props.navigation}
    />
  );

  render() {
    return (
      <FlatList
        style={this.props.style}
        data={this.props.data}
        extraData={this.state}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
      />
    );
  }
}
