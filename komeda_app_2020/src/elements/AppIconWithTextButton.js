import React, { PureComponent, Fragment } from 'react';
import { View } from 'react-native';

import { TouchableCo, Loading, AppIcon } from '../elements';
import { COLOR, SIZE } from '../utils/resources';
import { AppText } from './AppText';

class AppIconWithTextButton extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { loading: false };
  }
  componentDidMount() {
    const { onRef } = this.props;
    if (onRef) {
      onRef(this);
    }
  }
  onPress = () => {
    const { onPress } = this.props;
    const { loading } = this.state;
    if (loading) {
      return;
    }
    if (onPress) {
      onPress();
    }
  };
  setLoadingValue = (loading) => {
    this.setState({ loading });
  };
  getLoadingValue = () => this.state.loading;

  renderContent = () => {
    const { icon, title, style, textStyle, iconRight } = this.props;
    const { loading } = this.state;
    let textColor = COLOR.grey_700;
    if (icon && icon.iconColor) {
      textColor = icon.iconColor;
    }
    if (textStyle && textStyle.color) {
      textColor = textStyle.color;
    }
    if (loading) {
      return (
        <Loading
          sizeSpinner={SIZE.header_font_size}
          style={[{ width: undefined }, style]}
          color={textColor}
        />
      );
    }
    if (iconRight) {
      return (
        <Fragment>
          {
            <AppText
              style={{
                paddingRight: SIZE.padding / 4,
                fontSize: SIZE.H6,
                color: textColor,
                ...textStyle,
              }}
              placeholder="123"
              placeholderTextColor="red"
            >
              {title}
            </AppText>
          }
          {!!icon && (
            <AppIcon
              type={icon.iconType}
              icon={icon.iconName}
              iconColor={icon.iconColor || COLOR.grey_700}
              iconSize={icon.iconSize || SIZE.H4}
            />
          )}
        </Fragment>
      );
    }
    return (
      <Fragment>
        {!!icon && (
          <AppIcon
            type={icon.iconType}
            icon={icon.iconName}
            iconColor={icon.iconColor || COLOR.grey_700}
            iconSize={icon.iconSize || SIZE.H4}
          />
        )}
        {!!title && (
          <AppText
            style={{
              // paddingLeft: SIZE.padding,
              fontSize: SIZE.H6,
              color: textColor,
              ...textStyle,
            }}
          >
            {title}
          </AppText>
        )}
      </Fragment>
    );
  };
  render() {
    const { style, hitSlop } = this.props;
    const { loading } = this.state;
    return (
      <TouchableCo onPress={this.onPress} disabled={loading} hitSlop={hitSlop}>
        <View
          style={[
            {
              // padding: SIZE.padding,
              alignItems: 'center',
              justifyContent: 'center',
              // flexDirection: 'row',
              // borderBottomWidth: StyleSheet.hairlineWidth,
            },
            style,
          ]}
        >
          {this.renderContent()}
        </View>
      </TouchableCo>
    );
  }
}

export { AppIconWithTextButton };
