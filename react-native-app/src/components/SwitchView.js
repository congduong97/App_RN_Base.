import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Switch} from 'react-native';
import PropTypes from 'prop-types';

export default function SwitchView(props) {
  const {
    id,
    initialValue,
    label,
    onValueChange,
    style,
    styleLabel,
    styleSwich,
    disabled = false,
  } = props;
  const [valueSwich, setValueSwich] = useState(initialValue);
  const styleContain = [styles.styleContain, style];
  const stLabel = [styles.styleLabel, styleLabel];
  const stSwich = [styles.styleSwich, styleSwich];
  const handleValueChange = (data) => {
    onValueChange && onValueChange({id, data});
    setValueSwich(data);
  };
  return (
    <View style={styleContain}>
      <Text style={stLabel}>{label}</Text>
      <Switch
        style={stSwich}
        value={valueSwich}
        disabled={disabled}
        onValueChange={handleValueChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  styleContain: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  styleLabel: {
    fontSize: 16,
    color: '#5C6979',
    fontWeight: '700',
    marginRight: 10,
  },
  styleSwich: {},
});

SwitchView.propTypes = {
  label: PropTypes.string,
  initialValue: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  onValueChange: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleLabel: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleSwich: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};
