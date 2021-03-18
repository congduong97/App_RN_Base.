import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import { COLOR, SIZE } from '../utils/resources';
import { TouchableCo } from '../elements';
import { AppText } from './AppText';

class SegmentControl extends PureComponent {
  state = {
    selected: 0,
    badge: { index: 1, status: false },
  };
  componentDidMount() {
    const { onRef } = this.props;
    if (onRef) {
      onRef(this);
    }
  }
  /**
   * change tab selected
   */
  setTab(index) {
    const { onChangeTab } = this.props;
    this.setState({ selected: index });
    if (onChangeTab) {
      onChangeTab(index);
    }
  }

  setHaveBadge = (badge) => {
    this.setState({ badge });
  };

  refreshTab = (index) => {
    this.setState({ selected: index });
  };

  render() {
    const { data, containerItem, container, orange } = this.props;
    const { badge } = this.state;
    const borderColor = orange ? COLOR.ORGANGE_700 : COLOR.HEADER_NORMAL;
    return (
      <View
        style={{
          borderBottomColor: COLOR.GREY_300,
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
      >
        <View style={[seg.container, container, { borderColor }]}>
          {data.map((item, index) => {
            const { selected } = this.state;
            const active = orange ? seg.activeOrange : seg.active;
            const borderSeg = orange ? seg.borderOrange : seg.border;
            const textActive = orange
              ? seg.textInActiveOrange
              : seg.textInActive;
            const itemStyle = selected === index ? active : seg.inActive;
            const text = selected === index ? seg.textActive : textActive;
            const border = index !== data.length - 1 ? borderSeg : undefined;
            return (
              <TouchableCo
                key={`${index}`}
                touchStyle={[itemStyle, containerItem, border]}
                onPress={() => this.setTab(index)}
              >
                <View>
                  <AppText style={[text, { fontSize: wp('2.75%') }]}>
                    {item}
                  </AppText>
                </View>
                {index === badge.index && badge.status && (
                  <FontAwesome
                    name={'circle'}
                    color={COLOR.RED}
                    size={16}
                    style={{ position: 'absolute', top: 0, right: 2 }}
                  />
                )}
              </TouchableCo>
            );
          })}
        </View>
      </View>
    );
  }
}
const seg = {
  container: {
    borderRadius: 4,
    width: SIZE.device_width - SIZE.padding * 2,
    borderWidth: 1,
    borderColor: COLOR.HEADER_NORMAL,
    backgroundColor: COLOR.WHITE,
    flexDirection: 'row',
    margin: SIZE.padding,
  },
  active: {
    backgroundColor: COLOR.HEADER_NORMAL,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    height: 30,
  },
  activeOrange: {
    backgroundColor: COLOR.ORGANGE_700,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    height: 30,
  },
  inActive: {
    // backgroundColor: COLOR.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    // fontSize: 16,
    height: 30,
  },
  textActive: {
    fontSize: 13,
    color: COLOR.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  textInActive: {
    fontSize: 13,
    color: COLOR.HEADER_NORMAL,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  textInActiveOrange: {
    fontSize: 13,
    color: COLOR.ORGANGE_700,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  border: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: COLOR.HEADER_NORMAL,
  },
  borderOrange: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: COLOR.ORGANGE_700,
  },
};
export { SegmentControl };
