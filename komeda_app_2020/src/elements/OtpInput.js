import React, {useContext, useRef, useState, useImperativeHandle} from 'react';
import {
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import {ContextContainer} from '../contexts/AppContext';
import {SIZE} from '../utils';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const OtpInput = (
  {style, styleWrapInput, styleInput, numberInput, maxLength, onChangeValue},
  ref,
) => {
  const {colorApp} = useContext(ContextContainer);
  const [dataInput, setDataInput] = useState(Array(numberInput).fill(''));
  const inputRef = [];
  dataInput.forEach((item, index) => {
    inputRef[index] = useRef(null);
  });

  useImperativeHandle(ref, () => ({resetValue}), []);

  const onChangeText = (index) => (text) => {
    dataInput[index] = text;
    setDataInput([...dataInput]);
    const otp = dataInput.join('');
    onChangeValue(otp);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (!!text && index < numberInput - 1) {
      inputRef[index + 1].current.focus();
    }
    if (index === numberInput - 1) {
      inputRef[index].current.blur();
    }
  };

  const onBackSpace = (index) => (event) => {
    if (
      index !== 0 &&
      event.nativeEvent.key === 'Backspace' &&
      dataInput[index].length === 0
    ) {
      inputRef[index - 1].current.focus();
    }
  };

  const onPressItem = (index) => () => {
    inputRef[index].current.focus();
  };

  const resetValue = () => {
    for (let i = 0; i < numberInput; i++) {
      const data = Array(numberInput).fill('');
      setDataInput([...data]);
    }

    inputRef[0].current.focus();
  };

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        style,
      ]}>
      {dataInput.map((item, index) => {
        return (
          <TouchableOpacity
            key={index + ''}
            activeOpacity={1}
            onPress={onPressItem(index)}
            style={[
              {
                width: SIZE.width(15),
                borderWidth: 1,
                borderColor: colorApp.backgroundColorButton,
                borderRadius: SIZE.border_radius,
              },
              styleWrapInput,
            ]}>
            <TextInput
              keyboardType='number-pad'
              ref={inputRef[index]}
              value={dataInput[index]}
              maxLength={maxLength}
              onKeyPress={onBackSpace(index)}
              onChangeText={onChangeText(index)}
              autoFocus={index === 0}
              style={[
                {
                  fontSize: SIZE.H1,
                  padding: 6,
                  alignSelf: 'center',
                  margin: 6,
                },
                styleInput,
              ]}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default React.forwardRef(OtpInput);
