import React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import initials from 'initials';
import { Dimension } from '../../../commons';

const getContainerStyle = (size, src, borderRadius) => {
    return {
        borderRadius: borderRadius ? borderRadius : (size * 0.5),
        borderWidth: src ? 0 : 1,
        borderColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        //   marginVertical: Dimension.margin
    };
};

const abbr = (name) => {
    let abbr = initials(name);
    if (name.startsWith('+')) {
        abbr = `+${abbr}`;
    }
    if (!abbr) {
        console.warn('Could not get abbr from name');
        abbr = name;
    }
    if (abbr.length >= 2) {
        return abbr.substring(abbr.length - 2, abbr.length).toUpperCase();
    }
    return abbr;
};

const TextAvatar = (props) => {
    const {
        name,
        size,
        textColor,
        backgroundColor,
        borderRadius,
        src,
        style = {},
        containStyle = {}
    } = props;

    const textContainerStyle = {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: size-2,
        width: size-2
    };

    return (
        <View style={[
            { backgroundColor: backgroundColor, ...containStyle },
            getContainerStyle(size, src, borderRadius)]}
        >
            <View style={textContainerStyle}>
                {!!name && <Text
                    style={{
                        color: textColor,
                        fontSize: size / 2.5,
                        ...style,
                    }}
                    adjustsFontSizeToFit={true}
                >
                    {abbr(name)}
                </Text>}
            </View>
        </View>
    );
};

TextAvatar.propTypes = {
    name: PropTypes.string,
    size: PropTypes.number,
    textColor: PropTypes.string,
    style: PropTypes.object,
};

export default TextAvatar;