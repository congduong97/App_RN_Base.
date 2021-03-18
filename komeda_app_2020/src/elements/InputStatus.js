import React, { PureComponent } from 'react';

import { COLOR } from '../utils/resources';
import { AppText } from './AppText';

export default class InputStatus extends PureComponent {
  constructor(props) {
    super(props);
    const { timeContent, timeStatus } = this.props;

    this.state = {
      timeContent,
      timeStatus,
    };
  }
  componentDidMount() {
    const { onRef } = this.props;
    if (onRef) {
      onRef(this);
    }
  }
  reRender = (status, content) => {
    this.setState({ timeStatus: !status, timeContent: content });
  };
  render() {
    const { dark, style, status, content } = this.props;
    const { timeStatus, timeContent } = this.state;
    if (status) {
      return (
        <AppText
          style={[
            {
              //TODO: convert to function
              color:
                status || timeStatus
                  ? COLOR.red
                  : dark
                  ? COLOR.grey_800
                  : COLOR.grey_500,
              marginLeft: 5,
              fontSize: 12,
              marginTop: 5,
            },
            style,
          ]}
        >
          {content || timeContent}
        </AppText>
      );
    }
    return null;
  }
}
