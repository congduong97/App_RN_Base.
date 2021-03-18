import React, {PureComponent} from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import {APP_COLOR, COLOR_BLACK, COLOR_WHITE} from '../../../const/Color';
import {DEVICE_WIDTH} from '../../../const/System';
import {useDarkMode} from 'react-native-dark-mode';

export class TextInputLogin extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      deleteText: 0,
      text: '',
    };
  }
  componentDidMount() {
    const {onRef} = this.props;
    onRef(this);
  }
  changeText = value => {
    const {changeDataParent, changeFocus} = this.props;
    if (!isNaN(value)) {
      // console.log('ok');
      if (value === '') {
        changeFocus(false);
      }
      if (value.length === 4) {
        changeFocus(true);
      }

      changeDataParent(value);
      this.setState({text: value});
    } else if (value === '') {
      changeDataParent(value);

      changeFocus(false);
      this.setState({text: value});
    }
  };
  render() {
    const {autoFocus, loading} = this.props;
    const {text} = this.state;
    const isDarkMode = useDarkMode;
    return (
      <View style={{width: DEVICE_WIDTH / 6}}>
        <TextInput
          ref={ref => {
            this.textInput = ref;
          }}
          autoFocus={autoFocus}
          onChangeText={text => {
            if (!loading) {
              this.changeText(text);
            }
          }}
          value={`${text}`}
          maxLength={4}
          style={[
            styles.textInput,
            {
              borderColor: APP_COLOR.COLOR_TEXT,
              color: isDarkMode ? COLOR_BLACK : '',
            },
          ]}
          keyboardType={'numeric'}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  marginLeftRight: {
    borderBottomWidth: 0.5,
  },
  wrapperError: {
    marginTop: 5,
    width: '100%',
  },
  textError: {
    fontSize: 14,
    fontFamily: 'SegoeUI',
  },

  textInput: {
    textAlign: 'center',
    marginTop: 0,
    paddingTop: 0,
    marginBottom: 0,
    paddingBottom: 0,
    fontSize: DEVICE_WIDTH / 18,
    fontFamily: 'SegoeUI',
    height: 40,
    width: '100%',
    borderRadius: 2,
    borderWidth: 2,
    borderColor: 'green',
  },
});
