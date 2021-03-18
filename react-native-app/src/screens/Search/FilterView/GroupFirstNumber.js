import React, {useEffect, useState} from 'react';
import {Keyboard, StyleSheet, Text, TextInput, View} from 'react-native';
import {Color, Dimension} from '../../../commons/constants';
import {TextView} from '../../../components';

const ItemNumberView = (props) => {
  const {typeGroup, data, onPress, isSelected} = props;
  const handleOnPress = ({id, data}) => {
    onPress && onPress(data);
  };
  const style = isSelected
    ? styles.containerUtilitiesTagSelect
    : styles.containerUtilitiesTag;
  const styleText = isSelected ? styles.textTagSelected : styles.textTag;
  return (
    <TextView
      nameIconLeft={isSelected && 'tick-inside-circle'}
      sizeIconLeft={14}
      colorIconLeft={Color.Indigo}
      styleIconLeft={styles.styleIconCheck}
      id={typeGroup}
      data={data}
      onPress={handleOnPress}
      style={style}
      styleContainerText={styles.styleContainerTextUtilitiesTag}
      styleText={styleText}>
      {`${data}`}
    </TextView>
  );
};

export default function GroupFirstNumber(props) {
  const {
    listValue,
    initialValue = [],
    titleGroup,
    typeGroup,
    onPressSelected,
    style,
    styleContainerGroup,
    isOption,
  } = props;
  const [listSelected, setListSelected] = useState([]);

  useEffect(() => {
    if (initialValue) {
      setListSelected(initialValue);
    }
  }, [props]);
  const onChangeText = (data) => {
    let listValueSelected = [...listSelected];
    let index = listValueSelected.indexOf(data);
    if (index > -1) {
      listValueSelected.splice(index, 1);
    } else {
      listValueSelected.push(data);
    }
    onPressSelected &&
      onPressSelected({id: typeGroup, data: listValueSelected});
    setListSelected(listValueSelected);
  };
  const isCheck = (item) => {
    return !listSelected ? false : listSelected.includes(item);
  };
  return (
    <View
      style={[styles.styleGroup, style]}
      onStartShouldSetResponder={() => Keyboard.dismiss()}>
      <Text style={styles.styleTitleCompartment}>{titleGroup}</Text>
      <View style={[styles.styleContainerGroup, styleContainerGroup]}>
        {listValue &&
          listValue.map((item, index) => {
            return (
              <ItemNumberView
                key={index}
                typeGroup={typeGroup}
                data={item}
                onPress={onChangeText}
                isSelected={isCheck(item)}
              />
            );
          })}
        {isOption ? (
          <TextInput
            key="landArea"
            keyboardType="numeric"
            style={styles.styleInput}
            // value={valueSelected ? valueSelected + '' : ''}
            onChangeText={onChangeText}
            placeholder={'Nhập số khác'}
            placeholderTextColor= {Color.colorText}
          />
        ) : null}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  styleGroup: {
    marginTop: Dimension.margin15,
    marginBottom: Dimension.margin10,
  },

  styleTitleCompartment: {
    color: Color.colorHeaderEstate,
    // marginLeft: Dimension.margin5,
    fontSize: Dimension.fontSize15,
    fontWeight: 'bold',
  },
  styleContainerGroup: {
    flexWrap: 'wrap',
    justifyContent: 'center',
    flexDirection: 'row',
    marginRight: Dimension.margin5,
    alignSelf: 'center',
  },

  styleInput: {
    fontSize: Dimension.fontSize12,
    fontWeight: '700',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: Dimension.borderRadius4,
    borderColor: Color.MayaBlue,
    borderWidth: 0.5,
    alignSelf: 'center',
    minWidth: 50,
    maxWidth: 120,
    height: 30,
    margin: 3,
    paddingVertical: 3,
    paddingHorizontal: Dimension.padding,
    width: 88,
    height: 35,
  },
  styleContainerTextUtilitiesTag: {
    justifyContent: 'center',
    alignItems: 'baseline',
  },
  textTag: {
    textAlign: 'center',
    paddingLeft: 3,
    fontSize: Dimension.fontSizeHeader,
    color: Color.colorText,
  },

  textTagSelected: {
    textAlign: 'center',
    paddingLeft: 3,
    fontSize: Dimension.fontSizeHeader,
    fontWeight: 'bold',
    color: Color.Indigo,
  },

  containerUtilitiesTag: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    margin: 3,
    borderColor: Color.light_gray,
    borderWidth: 0.5,
    borderRadius: 2,
    backgroundColor: Color.border,
    shadowOpacity: 0.25,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowColor: '#000000',
    elevation: 3,
  },

  containerUtilitiesTagSelect: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    margin: 3,
    borderColor: Color.Indigo,
    borderWidth: 1,
    borderRadius: 2,

    backgroundColor: 'white',
    shadowOpacity: 0.25,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowColor: '#000000',
    elevation: 3,

  },
  styleIconCheck: {
    position: 'absolute',
    top: 2,
    left: 2,
  },
});
