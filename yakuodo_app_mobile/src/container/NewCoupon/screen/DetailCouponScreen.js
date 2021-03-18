import React, {PureComponent} from 'react';
import {View} from 'react-native';
import HeaderIconLeft from '../../../commons/HeaderIconLeft';
import {tab} from '../../../const/System';
import {COLOR_WHITE} from '../../../const/Color';
import ItemDetailCoupon from '../item/ItemDetailCoupon';
import Loading from '../../../commons/Loading';
import {API} from '../util/api';

export default class DetailCouponScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }
  componentDidMount() {
    const {loading} = this.state;

    if (loading) {
      if (this.timeoutLoading) {
        clearTimeout(this.timeoutLoading);
      }
      this.timeoutLoading = setTimeout(() => {
        this.setState({loading: false});
      }, 150);
    }
    this.getCountCouponDetail();
  }

  /**
   * call api for statics
   */
  getCountCouponDetail = async () => {
    try {
      const {data} = this.props.navigation.state.params;

      const {id} = data;
      const respones = await API.countCouponDetail(id);
    } catch (err) {
      console.log(err);
    }
  };
  renderItemDetailCoupon = () => {
    const dataDetailCoupon = this.props.navigation.state.params;
    const {loading} = this.state;
    if (loading) {
      return <Loading />;
    }
    return (
      <ItemDetailCoupon
        dataTextDeception={dataDetailCoupon}
        dataDetail={dataDetailCoupon.data}
        navigation={this.props.navigation}
      />
    );
  };
  componentWillUnmount() {
    if (this.timeoutLoading) {
      clearTimeout(this.timeoutLoading);
    }
  }
  render() {
    const {goBack} = this.props.navigation;
    const {iconUrlCouPonScreen, nameCouPonScreen} = tab.screenTab;
    return (
      <View style={{flex: 1, backgroundColor: COLOR_WHITE}}>
        <HeaderIconLeft
          navigation={this.props.navigation}
          title={nameCouPonScreen}
          goBack={goBack}
          imageUrl={iconUrlCouPonScreen}
        />
        {this.renderItemDetailCoupon()}
      </View>
    );
  }
}
