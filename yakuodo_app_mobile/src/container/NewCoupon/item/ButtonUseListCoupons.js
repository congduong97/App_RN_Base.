import React, {PureComponent} from 'react';
import {View} from 'react-native';
import {COLOR_WHITE, COLOR_GRAY_LIGHT} from '../../../const/Color';
import {STRING} from '../../../const/String';
import {ButtonLogin} from '../../LoginScreen/Item/ButtonLogin';
import {CouponSelectService} from '../util/services/CouponSelectService';
export default class ButtonUseListCoupons extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      listCouponSelected: [],
    };
  }
  gotoListCouponSelectUse = () => {
    const {navigation} = this.props;
    navigation.navigate('LIST_SELECT_COUPON');
  };

  componentDidMount() {
    CouponSelectService.onChange('LIST_COUPON_SELECT', (data, listData) => {
      // console.log('set empty', listData);
      this.setState({
        listCouponSelected: [...listData],
      });
    });
  }
  componentWillMount() {
    CouponSelectService.unChange('LIST_COUPON_SELECT');
  }
  render() {
    const {loadingUseCoupon} = this.props;
    const {listCouponSelected} = this.state;
    if (listCouponSelected.length === 0) {
      return null;
    }
    return (
      <View
        style={[
          {
            padding: 7,
            backgroundColor: COLOR_WHITE,
            borderTopColor: COLOR_GRAY_LIGHT,
            borderTopWidth: 1,
          },
        ]}>
        <ButtonLogin
          onPress={this.gotoListCouponSelectUse}
          loadingLogin={loadingUseCoupon}
          name={STRING.used_coupon}
        />
      </View>
    );
  }
}
