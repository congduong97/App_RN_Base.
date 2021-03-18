import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, } from 'react-native';
import { Item, Icon, Input } from 'native-base';
import {
  APP_COLOR,
  COLOR_GRAY,
  COLOR_RED_LIGHT,
  COLOR_WHITE,
  COLOR_RED,
} from '../../../../const/Color';

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
      placeholder: this.props.name,
      showGuide: false
    };
  }
  componentDidMount() {
    const { onRef } = this.props;
    onRef(this);
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
  setData=(text) => {
     this.setState({ text, error: false, titleError: '' });
  }
  setDefaut = () => {
    const { changeDataParent, placeholder } = this.props;
    this.setState({ text: '', error: false, titleError: '', placeholder, showGuide: false });
    changeDataParent('');
  };


  checkData = async () => {
    const { onStatusError } = this.props;
    const status = await this.props.validate();
    onStatusError(status.error);
    this.setState({ error: status.error, titleError: status.titleError });
  };
  setErrorr=() => {
    this.setState({ error: true, titleError: '' });
  }    
getColor=() => {
  const { error } = this.state;
  return error ? COLOR_RED_LIGHT : APP_COLOR.COLOR_TEXT;
}
  render() {
    const { nameIcon, pass, placeholder2, name, style, typeIcon, nobyEmpty } = this.props;

    const { error, titleError, text, showGuide } = this.state;

    return (
      <View style={{ width: '100%' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 30, alignItems: 'center', marginTop: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {nameIcon ? (
            <Icon
            type={typeIcon || 'Ionicons'}
              name={nameIcon}

              // color={APP_COLOR.COLOR_TEXT}
              size={15}
              style={{ marginLeft: -2, color: this.getColor() }}
            />
          ) : null}
          <Text style={{ color: COLOR_GRAY }}>{name}</Text>
        </View>
        {nobyEmpty ? <Text style={{ color: COLOR_RED_LIGHT }}>{'必須'}</Text> : null}
     
      </View>
       
        <Item
        regular
          style={[
            styles.marginLeftRight,
            {
              marginTop: 5,
              paddingHorizontal: 6,
              borderRadius: 4,
              borderBottomWidth: 0.5,
              borderColor: this.getColor()
            }, style
          ]}
        >
        
          <Input
            {...this.props}
            // onBlur={() => {
            //   if (placeholder2 && !error) {
            //     this.setState({ showGuide: false, titleError: '' });
            //   }
            // }}
            ref={(ref) => {
              this.textInput = ref;
            }}

        
            onChangeText={value => {
              this.changeText(value);
            }}
            value={text}
            autoCapitalize="none"
            autoCorrect={false}
            style={[styles.textInput, { color: this.getColor() }]}
            secureTextEntry={pass}
          />
        </Item>
        <View style={[styles.wrapperError, (error || showGuide) ? { display: 'flex' } : { display: 'none' }]}>
          <Text style={[styles.textError, { color: this.getColor() }]}>
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


  textButton: {
    color: COLOR_WHITE,
    fontSize: 16,
    fontFamily: 'SegoeUI'
  }
});
