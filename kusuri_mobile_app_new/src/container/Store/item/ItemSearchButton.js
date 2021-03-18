import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { from } from 'rxjs';
import { COLOR_WHITE, APP_COLOR } from '../../../const/Color';
export default class ItemSearchButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {
    const { onRef } = this.props;
    onRef && onRef(this);
  }

  gotoSeach = () => {
    const { gotoSearch } = this.props
    if(gotoSearch){
      gotoSearch()
    }
  }

  render() {
    const { map, style,hideIcon} = this.props
    
    return (
      <TouchableOpacity style={[styles.container, { backgroundColor: APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1, borderColor: APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1 }, style]}
        onPress={this.gotoSeach}
      >
        <Text style={[styles.titleSearch, { color: COLOR_WHITE }]}>{map}</Text>
       {hideIcon? null: <AntDesign name='down' size={25} color={COLOR_WHITE} />}
      </TouchableOpacity>

    );
  }
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    width: '94%',
    borderRadius: 4,
  },
  titleSearch: {
    paddingTop: 5,
    paddingBottom: 5,
    fontWeight: 'bold',
    fontSize: 16
  }
})