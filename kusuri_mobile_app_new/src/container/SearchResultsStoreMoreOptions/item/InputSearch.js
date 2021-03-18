import React, { Component } from 'react';
import { View, TextInput } from 'react-native';
import { WIDTHDEVICES } from "../../../const/System"
import { COLOR_GRAY_LIGHT } from '../../../const/Color';
export default class InputSearch extends Component {
  constructor(props) {
    super(props);
    const { placeholder } = this.props;
    this.state = {
      placeholder: placeholder,
      loading: false
    };
  }
  componentDidMount() {
    const { onRef } = this.props;
    onRef && onRef(this);
  }
  onChangeText = (text) => {
    this.setState({
      placeholder: text
    })
    this.props.changeDataValue(text)
  }
  focusTextInput = () => {
    this.refs.focus()
  }
  gotoSearch = () => {
    const { submit } = this.props;
    if (submit) {
      submit();
    }
  }
  render() {
    const { placeholder } = this.state;
    const { onLayOut } = this.props;
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 16 }}>
        <View style={{
          width: "92%",

          borderBottomColor: COLOR_GRAY_LIGHT,
          borderBottomWidth: 0.5
        }} onLayout={onLayOut} >
          <View style={{
            height: WIDTHDEVICES(45),
            width: '100%',
            borderRadius: 4,
            borderColor: '#A3A4A5',
            borderWidth: 1,
            alignItems: "center",
            flexDirection: "row",
            justifyContent:'center'
          }}>

            <TextInput
              ref={ref => this.ref = ref}
              placeholder={'店名・住所などキーワード'}
              value={placeholder}
              placeholderTextColor={"#464646"}
              style={{
                flex: 1,
              justifyContent:'center',
              alignItems:'center',
              paddingLeft:5,
              }}
              onChangeText={(text) => { this.onChangeText(text) }}
            >
            </TextInput>
          </View>

        </View>
      </View>

    );
  }
}
