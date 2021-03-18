import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ModalDropdown from './ModalDropdown';
import {useMergeState} from "../AppProvider"

function renderItem(rowData, rowID, highlighted) {
  return <View />;
}
function renderLabelSelect(rowData) {
  return <View />;
}

function renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
  if (rowID == categoriesArray.length - 1) return;
  let key = `spr_${rowID}`;
  return <View style={styles.stSeparator} key={key} />;
}

export default function DropDownView(props) {
  const {data} = props;

  const [stateScreen, setStateScreen] = useMergeState({
    dataOptions: true,
  });

  const {dataOptions,} = stateScreen;


  useEffect(() => {
    setDataOptions(data)
  }, [data])

  return (
    <View>
      <ModalDropdown
        options={dataOptions}
        textStyle={styles.dropdownText}
        dropdownStyle={styles.dropdownStyle}
        renderRow={renderItem}
        renderButtonText={renderLabelSelect}
        renderSeparator={renderSeparator}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  dropdownStyle: {},

  dropdownText: {},

  stSeparator: {
    height: 1,
    backgroundColor: 'cornflowerblue',
  },
});
