import React, {PureComponent} from 'react';
import {
  View,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  AppState,
} from 'react-native';
import {
  DEVICE_WIDTH,
  tab,
  isIOS,
  managerAcount,
  keyAsyncStorage,
  stateSercurity,
} from '../../const/System';
import {STRING} from '../../const/String';
import {Loading, NetworkError, HeaderIconLeft} from '../../commons';
import {
  COLOR_GRAY_LIGHT,
  COLOR_WHITE,
  COLOR_BLACK,
  COLOR_GRAY,
  COLOR_RED,
} from '../../const/Color';
import {ButtonLogin} from '../LoginScreen/Item/ButtonLogin';
import {convertRank} from '../../util';
import {Api} from '../../service';
import {AppImage} from '../../component/AppImage';
import UserChange from '../../service/UserChange';
import ReloadScreen from '../../service/ReloadScreen';
import {ServiveModal} from '../HomeScreen/util/service';
import {Icon} from 'native-base';
import ModalBarCode from './Item/ModalBarCode';
import {checkBlackList} from '../Account/util/checkBlackList';
import CountDown from './CountUp';
import SystemSetting from 'react-native-system-setting';
import {NavigationEvents} from 'react-navigation';
import CurrentScreen from '../../service/CurrentScreen';
import AsyncStorage from '@react-native-community/async-storage';
const TextMyPage = props => (
  <View
    style={{
      width: '100%',
      flexDirection: 'row',
      padding: 8,
      paddingLeft: 10,
      backgroundColor: '#E7F0F9',
    }}>
    <Text style={styles.textPoint}>{props.title}</Text>
    <Text
      style={[
        styles.textPoint,
        {position: 'absolute', right: 8, top: 8, color: 'blue', fontSize: 16},
      ]}>
      {props.value}
    </Text>
  </View>
);

export default class MyPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      imageCertificate: '',
      point: 0,
      // mile: 0,
      rank: 0,
      requirePromotion: 0,
      isLoadingRefresh: false,
      money: null,
      accessTime: '',
      brightness: 0.5,
    };
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);

    SystemSetting.getAppBrightness().then(brightness => {
      console.log('brightness', brightness);
      this.state.brightness = brightness;
      SystemSetting.setAppBrightness(1);
    });

    this.getUserDetail();

    UserChange.onChange('userInfo', user => {
      // console.log('this.state.memberCode', this.state.memberCode);
      const {
        // mile,
        point,
        requiredPromotion,
        rank,
        memberCode,
      } = user;
      if (this.state.memberCode !== memberCode || this.state.error) {
        this.getUserDetail();
        this.state.memberCode = memberCode;
      } else if (point != this.state.point) {
        this.setState({
          // mile,
          point,
          requirePromotion: requiredPromotion,
          rank,
        });
      }
    });
    const {routeName} = this.props.navigation.state;

    ReloadScreen.onChange(routeName, () => {
      // alert('reload')
      this.getUserDetail(true);
    });
  }
  setBrightnessDefault = () => {
    SystemSetting.getBrightness().then(brightness => {
      console.log('brightness ccc', brightness);
      if (isIOS) {
        SystemSetting.setBrightnessForce(this.state.brightness);
      } else {
        SystemSetting.setAppBrightness(brightness);
      }
    });
  };
  setBrightness = () => {
    console.log('setBrightness');
    SystemSetting.setAppBrightness(1);
  };
  componentWillUnmount() {
    UserChange.unChange('userInfo');
    const {routeName} = this.props.navigation.state;
    ReloadScreen.unChange(routeName);
    this.setBrightnessDefault();
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
    console.log('vao day khong');
    if (isIOS) {
      if (nextAppState !== 'active') {
        this.setBrightnessDefault();
      } else {
        if (CurrentScreen.get() === 'MY_PAGE') {
          this.setBrightness();
        }
      }
    }
  };

  getUserDetail = async isLoadingRefresh => {
    const loadRef = this.state.isLoadingRefresh;
    if (loadRef) {
      return;
    }
    isLoadingRefresh
      ? this.setState({isLoadingRefresh: true})
      : this.setState({loading: true});

    try {
      const blackList = await checkBlackList();

      if (blackList) {
        return;
      }
      const respones = await Api.getInformationMyPage(true);
      // console.log('getInformationMyPage', respones);
      if (respones.code == 200 && respones.res.status.code == 1000) {
        const {
          // mile,
          point,
          requiredPromotion,
          rank,
          memberCode,
          comingRank,
          imageUrl,
          barcodeUrl,
          money,
          accessTime,
        } = respones.res.data;
        this.state.memberCode = memberCode;
        // this.state.mile = mile;
        this.state.coming_rank = comingRank;
        this.state.point = point;
        this.state.rank = rank;
        this.state.requirePromotion = requiredPromotion;
        this.state.error = false;
        this.state.imageBarCode = barcodeUrl;
        this.state.accessTime = accessTime;
        this.state.imageCertificate = imageUrl;
        this.state.money = money == null ? '＊＊＊' : money;
        UserChange.set(respones.res.data);
      } else {
        this.state.error = true;
      }
    } catch (e) {
      this.state.error = true;
    } finally {
      this.setState({loading: false, isLoadingRefresh: false});
    }
  };
  getMemberCocde = () => {
    return `${this.state.memberCode}`;
  };

  renderContent() {
    const {navigation} = this.props;

    const {
      // mile,
      point,
      requirePromotion,
      rank,
      imageCertificate,
      error,
      loading,
      isLoadingRefresh,
      imageBarCode,
      coming_rank,
      money,
      memberCode,
      accessTime,
    } = this.state;
    if (loading) {
      return <Loading />;
    }
    if (error) {
      return (
        <View>
          <NetworkError onPress={() => this.getUserDetail()} />
          <View style={{padding: 16, paddingTop: 100}}>
            <ButtonLogin
              onPress={() => ServiveModal.set()}
              name={STRING.change_account}
            />
          </View>
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.wrapperContainer}
        refreshControl={
          <RefreshControl
            refreshing={isLoadingRefresh}
            onRefresh={() => {
              this.getUserDetail(true);
            }}
          />
        }>
        <NavigationEvents
          onDidFocus={this.setBrightness}
          onDidBlur={this.setBrightnessDefault}
        />
        <View
          style={[
            styles.wrapperContainer,
            {
              alignItems: 'center',
            },
          ]}>
          <View
            style={[
              styles.image,
              {marginBottom: 16, marginTop: 16},
              styles.shadow,
            ]}>
            <AppImage
              style={[styles.image]}
              resizeMode={'contain'}
              url={imageCertificate}
            />
          </View>
          <CountDown
            style={{
              color: COLOR_BLACK,
              fontWeight: 'bold',
              marginBottom: 10,
              fontSize: 16,
            }}
            until={new Date(accessTime).getTime()}
          />

          {loading || isLoadingRefresh ? (
            <View
              style={[
                styles.imagerBarCoder,
                {justifyContent: 'center', alignItems: 'center'},
              ]}>
              <Loading />
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => {
                this.modalBarCode.setVisible();
              }}>
              <AppImage
                style={[styles.imagerBarCoder]}
                resizeMode={'cover'}
                url={imageBarCode}
              />
            </TouchableOpacity>
          )}

          <ModalBarCode
            accessTime={accessTime}
            getUserDetail={this.getUserDetail}
            loading={loading || isLoadingRefresh}
            url={imageBarCode}
            memberCode={memberCode}
            onRef={ref => (this.modalBarCode = ref)}
          />

          <TouchableOpacity
            onPress={() => {
              this.modalBarCode.setVisible();
            }}
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
            <Icon name={'search'} style={[[styles.icon, {fontSize: 20}]]} />
            <Text style={[styles.textMemberCode, {}]}>
              {this.getMemberCocde()}
            </Text>
          </TouchableOpacity>
          {loading || isLoadingRefresh ? (
            <Loading />
          ) : (
            <TouchableOpacity
              onPress={() => {
                this.getUserDetail(true);
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <Text style={{color: COLOR_GRAY, fontSize: 14}}>
                {'バーコードを更新'}
              </Text>
              <Icon
                onPress={() => {
                  this.getUserDetail(true);
                }}
                name={'reload'}
                type={'SimpleLineIcons'}
                style={styles.icon}
              />
            </TouchableOpacity>
          )}

          <TextMyPage value={`${point} pt`} title={STRING.wacaPoint} />
          <TextMyPage value={convertRank(rank)} title={STRING.wacaRank} />
          <View
            style={{
              width: '100%',
              justifyContent: 'flex-end',
              flexDirection: 'row',
              padding: 8,
            }}>
            <View>
              <View
                style={{
                  width: '100%',
                  justifyContent: 'flex-end',
                  flexDirection: 'row',
                }}>
                <Text style={{fontSize: 14}}>
                  {'来月の予定WA!CAステージ：'}
                  <Text style={{color: 'blue', fontSize: 14}}>
                    {convertRank(coming_rank)}
                  </Text>
                </Text>
              </View>
              <View
                style={{
                  width: '100%',
                  justifyContent: 'flex-end',
                  flexDirection: 'row',
                  marginTop: 4,
                }}>
                <Text style={{fontSize: 14}}>
                  {'次のステージに到達に必要な購入額：'}
                  <Text style={{color: 'blue', fontSize: 14}}>
                    {requirePromotion} 円
                  </Text>
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
            <TouchableOpacity
              style={{padding: 8}}
              onPress={() => {
                navigation.navigate('WEB_VIEW', {
                  url:
                    'https://prepay.cacs.jp/prc/ykod/card/CardIdInput;svid=01',
                });
              }}>
              <Text
                style={{
                  color: 'blue',
                  textDecorationLine: 'underline',
                  fontSize: 15,
                }}>
                {'WA!CAマネー残高照会Webサイト'}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              padding: 8,
              width: '100%',
              borderColor: COLOR_GRAY_LIGHT,
              borderBottomWidth: 1,
            }}>
            <ButtonLogin
              loadingLogin={isLoadingRefresh}
              onPress={() => {
                ServiveModal.set();
                AsyncStorage.setItem(keyAsyncStorage.isMemberCodeChange, 'yes');
              }}
              name={STRING.change_account}
            />
            {/* <ButtonLogin loadingLogin={isLoadingRefresh} style={{ borderColor: APP_COLOR.COLOR_TEXT, backgroundColor: COLOR_WHITE, borderWidth: 1, marginTop: 16, }} styleText={{ color: APP_COLOR.COLOR_TEXT }}  name={STRING.update_info_use} /> */}
            <View
              style={{
                padding: 8,
                borderWidth: 1,
                borderColor: '#cecece',
                marginTop: 10,
              }}>
              <Text style={styles.textNote}>
                <Text style={styles.textRed}>
                  {
                    '【ご注意】\nWA!CAカードは機種変更など再ログイン時に必要となるため破棄しないようお願いします。\n \nWA!CAカードに記載のPINコードをご入力いただくと、WA!CAカード同様にすべてのサービスをアプリバーコードでご利用いただけます。'
                  }
                </Text>
                PINコード未設定の方は「カード番号変更」から再度、会員連携をお願いします。
                {'\n \n'}
                <Text style={styles.textRed}>{'▼PINコード未入力時\n'}</Text>
                ・WA!CAポイント付与、利用
                <Text style={styles.textRed}>
                  {
                    '\n \n▼PINコード入力時 ※WA!CAカード同様にご利用いただけます。\n'
                  }
                </Text>
                ・WA!CAポイント付与、利用{'\n'}
                ・WA!CAマネーチャージ、利用
                <Text style={styles.textRed}>
                  {
                    '\n※アプリでWA!CAマネーのご利用にはWA!CAカードにて1度以上のチャージ実績が必要となります。'
                  }
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
  render() {
    const {disableBackButton, navigation} = this.props;
    const {nameMyPageScreen, iconMyPageScreen} = tab.screenTab;

    return (
      <View style={styles.wrapperContainer}>
        <HeaderIconLeft
          disableBackButton={disableBackButton}
          title={nameMyPageScreen}
          goBack={navigation.goBack}
          imageUrl={iconMyPageScreen}
        />
        {this.renderContent()}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: DEVICE_WIDTH * (9 / 16),
    elevation: 2,
  },
  imagerBarCoder: {
    width: DEVICE_WIDTH - 32,
    height: (DEVICE_WIDTH - 32) * (8 / 35),
  },
  shadow: isIOS
    ? {
        shadowColor: COLOR_GRAY,
        shadowOffset: {width: 2, height: 2},
        shadowOpacity: 0.5,
      }
    : {
        elevation: 2,
      },
  textNote: {
    fontSize: 12,
    width: '100%',
    padding: 8,
    color: COLOR_RED,
  },
  textRed: {
    color: COLOR_RED,
  },
  wrapperContainer: {
    flex: 1,
    backgroundColor: COLOR_WHITE,
    width: DEVICE_WIDTH,
    // justifyContent: 'center',
  },
  textMemberCode: {
    fontSize: 14,
    color: COLOR_BLACK,
    margin: 6,

    fontWeight: 'bold',
  },
  textPoint: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    color: COLOR_GRAY,
    fontSize: 16,
    marginLeft: 10,
    marginTop: 2,
  },
});
