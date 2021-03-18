import React, {useState} from 'react';
import {Image, View, TextInput, Text} from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';

export default function KeyBoardCustom() {
  const [text, setStateText] = useState('');
  const onChange = (textInput) => {
    setStateText(textInput);
  };
  return (
    <View style={[{flex: 1}]}>
      {/* Some random image to show scaling */}
      <Image
        source={{
          uri:
            'http://img11.deviantart.net/072b/i/2011/206/7/0/the_ocean_cherry_tree_by_tomcadogan-d41nzsz.png',
          static: true,
        }}
        style={{flex: 1}}
      />
      <View style={{backgroundColor: 'red'}}>
        <Text>{text}</Text>
      </View>
      {/* The text input to put on top of the keyboard */}
      <TextInput
        onChangeText={onChange}
        style={{left: 0, right: 0, height: 45}}
        placeholder={'Enter your text!'}
      />

      {/* The view that will animate to match the keyboards height */}
      <KeyboardSpacer />
    </View>
  );
}
