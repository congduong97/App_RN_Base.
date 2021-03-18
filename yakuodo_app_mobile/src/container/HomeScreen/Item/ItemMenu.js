import React, {PureComponent} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  View,
  AppState,
} from 'react-native';

import {DEVICE_WIDTH} from '../../../const/System';
import {
  COLOR_GRAY_LIGHT,
  COLOR_WHITE,
  COLOR_YELLOW,
} from '../../../const/Color';
import {NavigationEvents} from 'react-navigation';

import {Api} from '../../../service';
import {AppImage} from '../../../component/AppImage';

import {openMenu} from '../../../util/module/openMenu';

let loadNotification = false;
export class ItemMenu extends PureComponent {
  constructor(props) {
    super(props);

    const {name} = this.props.item;
    this.state = {
      itemAnimation: new Animated.Value(0.01),
      name,
    };
    this.animationValue = {
      itemAnimation: new Animated.Value(0.01),
    };
    this.onPressItemMenu = this.onPressItemMenu.bind(this);
    this.animation = this.animation.bind(this);
  }

  componentDidMount() {
    const {onRef} = this.props;
    onRef && onRef(this);
    const {item} = this.props;
    if (item.function === 'COMPANY_NOTIFICATION') {
      this.getApiNotification();
      AppState.addEventListener('change', this.handleAppStateChangeNotication);
    } else if (item.function === 'COUPON') {
      this.getApiNewCoupon();
      AppState.addEventListener('change', this.handleAppStateChangeCoupon);
    }
    this.animationTimeout = setTimeout(this.animation, 100);
  }
  handleAppStateChangeNotication = changeStatus => {
    // console.log('changeStatus', changeStatus);
    if (changeStatus === 'active') {
      this.getApiNotification();
      // this.getApiNewCoupon();
    }
  };
  handleAppStateChangeCoupon = changeStatus => {
    // console.log('changeStatus', changeStatus);
    if (changeStatus === 'active') {
      this.getApiNewCoupon();
    }
  };

  getApiNotification = async () => {
    //if api is loading
    // console.log('okee');
    // if (loadNotification) {
    //   return;
    // }
    // loadNotification = true;
    try {
      const response = await Api.getNewNotification();
      console.log('response', response);
      if (response.code === 200 && response.res.status.code === 1000) {
        // console.log('response.res.data', response.res.data);
        const isNew = response.res.data;
        this.setState({isNew});
      }
    } catch (err) {
      // console.log(err);
    } finally {
      // loadNotification = false;
    }
  };
  getApiNewCoupon = async () => {
    //if api is loading
    // if (loadNotification) {
    //   return;
    // }
    // loadNotification = true;
    try {
      const response = await Api.getNewCoupon();
      console.log('response getNewCoupon ', response);
      if (response.code === 200 && response.res.status.code === 1000) {
        // console.log('oke');
        console.log('response get api new coupon', response);
        const isNew = !!response.res.data;
        this.setState({isNew});
      }
    } catch (err) {
      console.log(err);
    } finally {
      // loadNotification = false;
    }
  };
  //check item menu require login

  onPressItemMenu() {
    const {navigation, item} = this.props;
    // console.log('item', item);
    if (
      item.function === 'COMPANY_NOTIFICATION' ||
      item.function === 'COUPON'
    ) {
      this.setState({isNew: false});
    }
    if (item.iconUrl === '' && item.name === '' && item.url === 'null') {
      return;
    }
    if (item.function === 'COUPON') {
      openMenu(item, navigation, null, true);
    } else {
      openMenu(item, navigation);
    }
  }
  animation() {
    const {itemAnimation} = this.animationValue;
    // const { itemAnimation } = this.state;

    const {index} = this.props;
    Animated.timing(itemAnimation, {
      toValue: 1,
      duration: 300,
      delay: index * 50,
      useNativeDriver: true,
    }).start(() => {
      this.animationTimeout && clearTimeout(this.animationTimeout);
    });
  }
  renderNavigationEvent = () => {
    const {item} = this.props;
    if (item.function === 'COMPANY_NOTIFICATION') {
      return <NavigationEvents onWillFocus={this.getApiNotification} />;
    }
    return null;
  };

  render() {
    // console.log('itemmenu');
    const {item} = this.props;
    const {itemAnimation} = this.animationValue;
    const {name, isNew} = this.state;

    const scale = itemAnimation.interpolate({
      inputRange: [0.01, 0.6, 1],
      outputRange: [0.01, 0.6, 1],
    });
    const opacity = itemAnimation.interpolate({
      inputRange: [0.01, 0.6, 1],
      outputRange: [0.01, 0.3, 1],
    });
    const translateY = itemAnimation.interpolate({
      inputRange: [0.01, 0.6, 1],
      outputRange: [-20, -10, 0],
    });
    return (
      <Animated.View
        style={[
          styles.wrapperCenter,
          styles.wrapperBody,
          {
            width: DEVICE_WIDTH / this.props.column,
            height: DEVICE_WIDTH / this.props.column,
            opacity,
            transform: [{scale}, {translateY}, {perspective: 1000}],
          },
        ]}>
        {
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.wrapperCenter, {padding: 20}]}
            onPress={this.onPressItemMenu}>
            <AppImage
              url={item.iconUrl}
              style={styles.imageIcon}
              resizeMode={'contain'}
              onPress={this.onPressItemMenu}
            />
            {isNew ? (
              <View
                style={{
                  position: 'absolute',
                  right: 10,
                  top: 10,
                  borderWidth: 1,
                  height: 20,
                  width: 20,
                  borderRadius: 10,
                  borderColor: COLOR_YELLOW,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{color: COLOR_YELLOW}}>N</Text>
              </View>
            ) : null}
            {this.renderNavigationEvent()}

            <Text style={[styles.textButton, {marginTop: 10}]}>{name}</Text>
          </TouchableOpacity>
        }
      </Animated.View>
    );
  }
}
const styles = StyleSheet.create({
  wrapperBody: {
    backgroundColor: COLOR_WHITE,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLOR_GRAY_LIGHT,
  },
  wrapperCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageFeature: {
    width: DEVICE_WIDTH,
    height: DEVICE_WIDTH / 2 + 50,
  },
  imageIcon: {
    width: 30,
    height: 30,
  },

  textButton: {
    fontSize: 12,
    textAlign: 'center',
  },
});
