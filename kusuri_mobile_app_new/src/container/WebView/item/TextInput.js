import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Input, Item } from 'native-base';
import {
  APP_COLOR,
  COLOR_BROWN,
  COLOR_GRAY,
  COLOR_RED_LIGHT,
  COLOR_WHITE,
} from '../../../const/Color';
import { DEVICE_WIDTH, } from '../../../const/System';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export class TextInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      text: this.props.valueDefault || '',
      error: false,
      titleError: '',
      pass: '',
      email: '',
      loading: false,
      setDefault: false,
      placeholder: this.props.placeholder,
      showGuide: false
    };
  }

  changeText = async value => {
    const { placeholder2 } = this.props;
    const { error } = this.state;
    if (error) {
      await this.setState({ showGuide: true, error: false, titleError: placeholder2, text: value });
    } else {
      await this.setState({ text: value });
    }


    this.props.changeDataParent(value);
    // this.checkData(value);
  };
  setDefaut = () => {
    // console.log('setDefaut');
    const { changeDataParent, placeholder } = this.props;
    this.setState({ text: '', error: false, titleError: '', placeholder, showGuide: false });
    changeDataParent('');
  };

  componentWillReceiveProps(nextProps) {
    // alert('nextProps');
    if (nextProps.loading !== this.state.loading && nextProps.loading !== undefined) {
      // console.log('nextProps.loading!', nextProps.loading);
      this.state.loading = nextProps.loading;
      this.checkData();
    }
    if (
      nextProps.setDefault !== this.state.setDefault &&
      nextProps.setDefault !== undefined
    ) {
      this.state.setDefault = nextProps.setDefault;
      this.setDefaut();
    }
  }

  checkData = async () => {
    const { onStatusError } = this.props;
    const status = await this.props.validate();
    onStatusError(status.error);
    this.setState({ error: status.error, titleError: status.titleError });
  };

  render() {
    const { nameIcon, pass, placeholder2, placeholder, style } = this.props;
      
      const { error, titleError, text, showGuide } = this.state;

    return (
      <View style={{ width: '100%' }}>
        <Item
          style={[
            styles.marginLeftRight,
            {
              paddingHorizontal: 0,
              borderColor: error ? COLOR_RED_LIGHT : APP_COLOR.COLOR_TEXT
            }, style
          ]}
        >
          {nameIcon ? (
            <Icon
              name={nameIcon}
              color={APP_COLOR.COLOR_TEXT}
              size={15}
              style={{ marginRight: 10, marginLeft: -2 }}
            />
          ) : null}
          <Input
            {...this.props}
            onBlur={() => {
                if (placeholder2 && !error) {
                  this.setState({ showGuide: false, titleError: '' });
                }
            }}

            onFocus={() => {
              if (placeholder2 && !error) {
                this.setState({ showGuide: true, error: false, titleError: placeholder2 });
              }
            }}
            placeholderTextColor={COLOR_GRAY}
            onChangeText={value => {
              this.changeText(value);
            }}
            value={text}
            placeholder={placeholder}
            autoCapitalize="none"
            autoCorrect={false}
            style={[styles.textInput, { color: APP_COLOR.COLOR_TEXT }]}
            secureTextEntry={pass}
          />
        </Item>
        <View style={[styles.wrapperError, (error || showGuide) ? { display: 'flex' } : { display: 'none' }]}>
          <Text style={[styles.textError, { color: error ? COLOR_RED_LIGHT : COLOR_GRAY }]}>
            {titleError}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  marginLeftRight: {
    borderBottomWidth: 0.5
  },
  wrapperError: {
    marginTop: 5,
    width: '100%'
  },
  textError: {
    fontSize: 14,
    fontFamily: 'SegoeUI'
  },

  textInput: {
    marginLeft: -5,
    fontSize: 14,
    fontFamily: 'SegoeUI'
  },
  wrapperCenter: {
    alignItems: 'center',
    justifyContent: 'center'
  },

  wrapperBottomButton: {
    margin: 25,
    marginBottom: 10,
    backgroundColor: COLOR_BROWN,
    width: DEVICE_WIDTH - 50,
    height: 45,
    borderRadius: 5
  },
  textButton: {
    color: COLOR_WHITE,
    fontSize: 16,
    fontFamily: 'SegoeUI'
  }
});
