import PropTypes from 'prop-types';
import React from 'react';
import {Platform} from 'react-native';
import PickerAndroidView from './PickerAndroidView';
import PickerIOSView from './PickerIOSView';
export default function SelectBox(props) {
  return Platform.OS === 'ios' ? (
    <PickerIOSView {...props} />
  ) : (
    <PickerAndroidView {...props} />
  );
}

SelectBox.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  data: PropTypes.array,
  displayKey: PropTypes.string,
  valueKey: PropTypes.any,
  initialValue: PropTypes.any,
  onValueChange: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  stylePicker: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};
