import React, { PureComponent } from "react";
import { debounce } from "lodash";

const withPreventDoubleClick = (WrappedComponent) => {
  class PreventDoubleClick extends PureComponent {
    debouncedOnPress = () => {
      this.props.onPress &&
        this.props.onPress({ id: this.props.id, data: this.props.data });
    };

    onPress = debounce(this.debouncedOnPress, this.props.waitTitme || 1000, {
      leading: true,
      trailing: false,
    });

    render() {
      return <WrappedComponent {...this.props} onPress={this.onPress} />;
    }
  }

  PreventDoubleClick.displayName = `withPreventDoubleClick(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;
  return PreventDoubleClick;
};

export default withPreventDoubleClick;
