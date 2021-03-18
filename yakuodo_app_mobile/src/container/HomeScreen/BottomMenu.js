import React, { PureComponent } from 'react';
import { Linking, Image, Alert, TouchableOpacity, SafeAreaView, Text, View } from 'react-native';
import { URL_PDF, URL_IMAGE } from '../../const/Url';
import { tab, managerAcount, isIOS, DEVICE_WIDTH } from '../../const/System';
import { COLOR_GRAY, COLOR_WHITE, APP_COLOR, COLOR_GRAY_LIGHT } from '../../const/Color';
import { STRING } from '../../const/String';
import NotificationCount from '../../service/NotificationCount';
import CurrentScreen from '../../service/CurrentScreen';
import { openMenu } from '../../util/module/openMenu';
import { CheckDataApp } from '../LauncherScreen/service';

export default class BottomMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      active: 0,
      namTabActive: '',
      show: tab.show,
      menu: tab.menuBottom
    };
  }
  componentDidMount() {
    const { onRef } = this.props;
    onRef(this);

    this.listenerChangeScreenAndChangeActiveBottomMenu();
    CheckDataApp.onChange('BOTTOM_MENU', () => {
      const { menu, show } = this.state
      if (show !== tab.show || JSON.stringify(menu) !== JSON.stringify(tab.menuBottom)) {
        this.setState({ show: tab.show, menu: tab.menuBottom, active: 0 })
      }

    })

  }
  componentWillUnmount(){
    CheckDataApp.unChange('BOTTOM_MENU')

  }
 onPressBottomMenu = (item, index) => {
    const { navigation } = this.props;
    if (item.function !== 'WEB_VIEW' || item.function !== 'LINK_APP' || item.function !== 'QR') {
      this.setState({ active: index });
    }
    openMenu(item, navigation,null,true);
  }
  setActive = (key) => {
    let indexs = 0;
    this.state.menu.map((item, index) => {
      if (item.function == key) {
        indexs = index;
      }
    });
    if (indexs !== this.state.active) {
      this.setState({ active: indexs });
    }
  }
  listenerChangeScreenAndChangeActiveBottomMenu = () => {
    CurrentScreen.onChange('BottomMenu', sreenName => {
      if (sreenName == 'QR' && sreenName == 'WEB_VIEW') {
        return;
      }
      let screenNameConvert = sreenName;
      switch (sreenName) {
        // case 'SearchCoupon':
        //   screenNameConvert = 'COUPON';
        //   break;
        // case 'CouponDetail':
        //   screenNameConvert = 'COUPON';
        //   break;
        // case 'ConfirmCoupon':
        //   screenNameConvert = 'COUPON';
        //   break;
        case 'DetailNotification':
          screenNameConvert = 'COMPANY_NOTIFICATION';
          break;
        case 'DetailPushNotification':
          screenNameConvert = 'PUSH_NOTIFICATION';
          break;
        case 'IntroducingWaca':
          screenNameConvert = 'MY_PAGE';
          break;
        case 'Rule':
          screenNameConvert = 'SETTING';
          break;
        // case 'HISTORY_COUPON':
        //   screenNameConvert = 'SETTING';
        //   break;

        case 'TERM':
          screenNameConvert = 'SETTING';
          break;
        case 'Over':
          screenNameConvert = 'SETTING';
          break;
        case 'INTRODUCE_IMAGE':
          screenNameConvert = 'SETTING';
          break;
        case 'POLICY':
          screenNameConvert = 'SETTING';
          break;
        case 'USING':
          screenNameConvert = 'SETTING';

          break;
        case 'QUESTION':
          screenNameConvert = 'SETTING';

          break;

        default:
          screenNameConvert = sreenName;
      }
      this.setActive(screenNameConvert);
    });
  }
  componentWillUnmount() {
    CurrentScreen.unChange('BottomMenu');
  }

  render() {
    const { menu,show } = this.state;
    if(!show){
      return null
    }

    const renderMenu = menu.map((item, index) => {
      const isActive = index === this.state.active;
      return (
        <TouchableOpacity
          key={`${index}a`}
          vertical
          style={{ paddingTop: 0, justifyContent: 'center', alignItems: 'center', flex: 1 }}
          onPress={() => {
            if (!tab.block) {
              this.onPressBottomMenu(item, index);
            }
          }}
        >
          <Image
            resizeMode={'contain'}
            source={{ uri: URL_IMAGE + item.iconUrl }}
            style={{ width: 25, height: 25, marginBottom: 10, tintColor: isActive ? APP_COLOR.COLOR_TEXT : COLOR_GRAY }}
          // onPress={() => {
          //   this.onPressBottomMenu(item, index);
          // }}
          />
          <Text
            style={{
              textAlign: 'center', bottom: 5, fontSize: 12, color: isActive ? APP_COLOR.COLOR_TEXT : COLOR_GRAY
            }}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      );
    });
    return (
      <View style={{ backgroundColor: COLOR_WHITE }}>
        <View style={{ backgroundColor: COLOR_WHITE, padding: 0, height: 55, flexDirection: 'row', justifyContent: 'center', width: DEVICE_WIDTH, borderColor: COLOR_GRAY_LIGHT, borderTopWidth: 1 }}>{renderMenu}</View>
        <SafeAreaView />
      </View>
    );
  }
}
