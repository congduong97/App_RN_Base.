// import React, { useEffect, useImperativeHandle, useState } from "react";
// import { TouchableOpacity, Text } from "react-native";
// import { Loading } from ".";

// const DebounceButton = (props, ref) => {
//   const [disabled, setDisabled] = useState(false);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (loading) {
//       setDisabled(true);
//     }
//     if (!loading && disabled) {
//       setTimeout(() => {
//         setDisabled(false);
//       }, 500);
//     }
//     return () => {};
//   }, [loading]);

//   useImperativeHandle(ref, () => ({
//     setLoading,
//   }));

//   const onPress = () => {
//     if (props.onPress) {
//       props.onPress();
//     }
//   };

//   const renderTitle = () => {
//     if (loading) {
//       return <Loading color={props.loadingColor} />;
//     } else if (props.title) {
//       return <Text style={props.textStyle}>{props.title}</Text>;
//     } else {
//       return props.children;
//     }
//   };

//   const disableStyle = disabled && { backgroundColor: "grey" };

//   return (
//     <TouchableOpacity
//       style={[props.style, disableStyle]}
//       disabled={disabled}
//       onPress={onPress}
//     >
//       {renderTitle()}
//     </TouchableOpacity>
//   );
// };

import React, { Component } from "react";
import { Text, TouchableOpacity } from "react-native";
import { Loading } from ".";

export class DebounceButton extends Component {
  constructor(props) {
    super(props);
    this.state = { disabled: false, loading: false };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.loading !== this.state.loading) {
      if (this.state.loading) {
        this.setState({ disabled: true });
      }
      if (!this.state.loading && this.state.disabled) {
        setTimeout(() => {
          this.setState({ disabled: false });
        }, 500);
      }
    }
  }

  setLoading = (value) => {
    this.setState({ loading: value });
  };

  onPress = () => {
    if (this.props.onPress) {
      console.log("onpresss");
      this.props.onPress();
    }
  };

  renderTitle = () => {
    const { loading } = this.state;
    const { title, textStyle, children, loadingColor } = this.props;
    if (loading) {
      return <Loading color={loadingColor} />;
    } else if (title) {
      return <Text style={textStyle}>{title}</Text>;
    } else {
      return children;
    }
  };
  render() {
    const { disabled } = this.state;
    const { style } = this.props;
    return (
      <TouchableOpacity
        style={style}
        disabled={disabled}
        onPress={this.onPress}
        activeOpacity={0.8}
      >
        {this.renderTitle()}
      </TouchableOpacity>
    );
  }
}

// export default React.forwardRef(DebounceButton);
