import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  LogBox,
  Text,
  TouchableOpacity,
  View,
  Image,
  Linking,
  Alert,
} from 'react-native';
import ActionButton from 'react-native-action-button';
import {useDispatch, useSelector} from 'react-redux';
import {
  Dimension,
  Fates,
  Price,
  Telecoms,
  Color,
  Icon,
} from '../../commons/constants';
import {IconView, ScreensView, TextView} from '../../components';
import {handleClickPhoneNumber} from '../../commons/utils';
import {IconViewType} from '../../components/IconView';
import AppNavigate from '../../navigations/AppNavigate';
import models from '../../models';
import API from '../../networking';
import MenuCategoriesView from './MenuCategoriesView';
import MenuHomeView from './MenuHomeView';
import styles from './styles';
LogBox.ignoreLogs([
  'VirtualizedLists should never be nested',
  'componentWillReceiveProps has been renamed',
]);

const LinkUrl = {
  phone: '0822822822',
  chat: {
    app:
      Platform.OS === 'android'
        ? 'fb://page/194978893901695/'
        : 'fb-messenger://user-thread/194978893901695',
    web: 'https://www.messenger.com/t/simsodepthanhdat',
  },
};

const NUM_COLUMN = 3;
const HIGHTLIGHT_CATEGORY_COLUMN = 4;
const callPhone = () => {
  handleClickPhoneNumber(LinkUrl.phone);
};
const goChat = () => {
  Alert.alert(
    'Xác nhận',
    'Nhắn tin với simthanhdat.vn',
    [
      {
        text: 'Không',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Có',
        onPress: () =>
          Linking.canOpenURL(LinkUrl.chat.app).then((supported) => {
            if (supported) {
              return Linking.openURL(LinkUrl.chat.app);
            } else {
              return Linking.openURL(LinkUrl.chat.web);
            }
          }),
      },
    ],
    {cancelable: false},
  );
};

function HeaderHomeView(props) {
  const {onPress, countNoti = 0} = props;
  const handleOnPressNotify = () => {
    onPress({id: 'TypeNotify', data: {}});
  };
  return (
    <View style={styles.styleContainsHeader}>
      <TextView
        id={'TypeSearchHeader'}
        onPress={onPress}
        style={styles.styleSearch}
        nameIconLeft={'search'}
        typeIconLeft={IconViewType.FontAwesome}
        sizeIconLeft={20}
        value={'Tìm Sim Đẹp '}
        styleValue={styles.styleTextValueSearch}
      />

      <TouchableOpacity
        style={{
          marginLeft: 10,
          marginTop: 5,
          justifyContent: 'center',
          marginRight: 0,
        }}
        onPress={handleOnPressNotify}>
        <IconView
          name="bell"
          size={25}
          color="white"
          type={IconViewType.FontAwesome}
        />
        {countNoti > 0 ? (
          <View style={styles.containerNoti}>
            <Text style={styles.countNoti}>
              {countNoti > 99 ? '99+' : countNoti}
            </Text>
          </View>
        ) : (
          <></>
        )}
      </TouchableOpacity>
    </View>
  );
}

export default function HomeScreen(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isAgency = models.isRoleAgency();
  const [phoneNiceCategories, setPhoneNiceCategories] = useState([]);
  const reftParams = useRef({
    isReloadData: true,
    page: 0,
    size: Dimension.NUMBER_ITEM_PAGE_DEFAULT,
  });
  const simCategories = useSelector(
    (state) => state.CommonsReducer.simCategories,
  );
  const {totalNotifiUnread, dataNotification} = useSelector(
    (state) => state.NotificationsReducer,
  );

  useEffect(() => {
    if (dataNotification) {
      if (dataNotification.dataItem) {
        AppNavigate.navigateToOrderDetailScreen(
          navigation.dispatch,
          dataNotification,
        );
      } else {
        AppNavigate.navigateToNotificationScreen(navigation.dispatch);
      }
    }
  }, [dataNotification]);

  useEffect(() => {
    if (!isAgency && models.getQuickOrder() === null) {
      models.saveQuickOrder(true);
    }
    API.requestNotifications(dispatch, reftParams.current);
  }, []);

  useEffect(() => {
    if (simCategories && simCategories.length > 0) {
      // let sodep = simCategories.filter((item) => item.exam);
      let sodep = models.getCategoriesSIMNice();
      setPhoneNiceCategories(sodep);
    }
  }, [simCategories]);

  const handleClickMenu = ({id, data}) => {
    let params = {};
    if (id === 'TypeSearchHeader') {
      params.showGuide = true;
      AppNavigate.navigateToSearchScreen(navigation.dispatch, params);
    } else if (id === 'TypeNotify') {
      AppNavigate.navigateToNotificationScreen(navigation.dispatch, params);
    } else {
      if (id === 'TypeTelecom') {
        params = {showGuide: false, telecomId: data.id};
      } else if (id === 'TypePrice') {
        params = {
          showGuide: false,
          priceFrom: data.priceFrom,
          priceTo: data.priceTo,
        };
      } else if (id === 'TypeFengshui') {
        params = {showGuide: false, fengshui: data};
      } else if (id === 'TypeBeautiful') {
        params = {showGuide: false, categoryId: data.id};
      }
      AppNavigate.navigateToSearchScreen(navigation.dispatch, params);
    }
  };

  return (
    <>
      <ScreensView
        isShowBack={false}
        styleContent={{backgroundColor: Color.bgColor}}
        centerElement={
          <HeaderHomeView
            onPress={handleClickMenu}
            countNoti={totalNotifiUnread}
          />
        }
        headerBottomView={<MenuHomeView />}>
        <MenuCategoriesView
          id={'TypeTelecom'}
          onPress={handleClickMenu}
          titleBlock={'Chọn Sim Theo Nhà Mạng'}
          listData={Telecoms}
          isShowNameItem={false}
          isCircle
          numberColumn={Telecoms.length}
          styleContainsItem={styles.styleContainsItemCircle}
          styleItem={styles.styleItemCircle}
        />
        <MenuCategoriesView
          id={'TypePrice'}
          onPress={handleClickMenu}
          titleBlock={'Chọn Sim Theo Giá'}
          listData={Price}
          numberColumn={NUM_COLUMN}
          styleContainsItem={styles.styleItemRectangle}
        />
        <MenuCategoriesView
          id={'TypeFengshui'}
          onPress={handleClickMenu}
          titleBlock={'Chọn Sim Theo Mệnh'}
          listData={Fates}
          numberColumn={Fates.length}
          isCircle
          styleContainsItem={[
            styles.styleContainsItemCircle,
            {borderColor: 'white'},
          ]}
          styleText={styles.textMenuFates}
        />
        <MenuCategoriesView
          id={'TypeBeautiful'}
          onPress={handleClickMenu}
          titleBlock={'Chọn Sim Số Đẹp'}
          listData={phoneNiceCategories}
          numberColumn={HIGHTLIGHT_CATEGORY_COLUMN}
          styleText={styles.textMenuFates}
          isHilight
          styleContainsItem={styles.styleContainsBeautiful}
        />
      </ScreensView>
      <ActionButton
        buttonColor={Color.MayaBlue}
        renderIcon={() => (
          <Image
            source={Icon.help}
            style={{height: 25, width: 25}}
            tintColor="white"
          />
        )}
        degrees={90}
        hideShadow={true}
        bgColor="rgba(0,0,0,.4)">
        <ActionButton.Item
          textContainerStyle={styles.actionTextContainer}
          textStyle={styles.actionText}
          buttonColor={Color.SoftGreen}
          title={LinkUrl.phone}
          onPress={callPhone}>
          <IconView
            name="telephone"
            size={Dimension.sizeIcon28}
            color={Color.White}
          />
        </ActionButton.Item>
        <ActionButton.Item
          textContainerStyle={styles.actionTextContainer}
          textStyle={styles.actionText}
          buttonColor={Color.colorFacebook}
          title="Chat với simthanhdat.vn"
          onPress={goChat}>
          <Image
            source={Icon.facebook_sharp}
            style={{
              width: 25,
              height: 25,
              tintColor: 'white',
            }}
            tintColor="white"
          />
        </ActionButton.Item>
      </ActionButton>
    </>
  );
}
