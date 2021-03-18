import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, } from 'react-native';
import { Item, Icon, } from 'native-base';
import {
  APP_COLOR,
  COLOR_GRAY,
  COLOR_WHITE,
} from '../../../../const/Color';

// import console = require('console');

export class TextInputConfirm extends PureComponent {
  render() {
    const { nameIcon, name, style, typeIcon, valueDefault } = this.props;
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
              style={{ marginLeft: -2, color: APP_COLOR.COLOR_TEXT }}
            />
          ) : null}
          <Text style={{ color: COLOR_GRAY }}>{name}</Text>
        </View>
     
      </View>
 
        <Text style={{ color: APP_COLOR.COLOR_TEXT, marginVertical: 5 }}>{valueDefault}</Text>
       
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
