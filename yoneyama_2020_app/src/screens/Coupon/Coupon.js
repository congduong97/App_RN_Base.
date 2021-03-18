//Library:
import React, {useState, useEffect, useRef} from 'react';
import {View, ScrollView, TouchableOpacity} from 'react-native';
import {TabView} from 'react-native-tab-view';

//Setup:
import {AppContainer, Loading} from '../../elements';
import {COLOR, FetchApi} from '../../utils';

//Component:
import ListCoupon from './items/ListCoupon';
import {AppText} from '../../elements/AppText';
import {withInteractionsManaged} from '../../HOC/withInteractionsManaged';
import {NetworkError} from '../../elements/NetworkError';
import ReloadDataScreen from '../../elements/ReloadData';

//Services:
import ServicesUpdateComponent from '../../utils/services/ServicesUpdateComponent';

function Coupon() {
  const [index, setIndex] = useState(0);
  const routes = useRef([]);
  const data = useRef({});
  const dataCoupon = useRef([]);
  const error = useRef({
    status: false,
    message: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ServicesUpdateComponent.set('SEEN_LIST_COUPON');
    onDidMount();
    return () => {};
  }, []);

  const onDidMount = async () => {
    if (!loading) {
      setLoading(true);
    }
    await fetchData();
    setLoading(false);
  };

  const fetchData = async () => {
    if (error.current.status) {
      error.current.status = false;
    }
    routes.current = [{key: 'all', title: 'すべて'}];
    let result = await FetchApi.getDataCoupon();
    if (result && result.success) {
      data.current = {...(result.data || {})};
      dataCoupon.current = [
        ...data.current.listForAllCoupon,
        ...data.current.listLimitedMemberCoupon,
        ...data.current.listMemberDesignationCoupon,
      ];
      data.current.listCategory.forEach((category) => {
        routes.current.push({
          key: category.id,
          title: category.name,
        });
      });
    } else {
      if (result.code === 1054) {
        return (data.current = {});
      }

      error.current.status = true;
      error.current.message = result.message;
    }
  };

  const renderScene = ({route}) => {
    let dataTab = dataCoupon.current.filter(
      (item) => item.categoryId === route.key,
    );

    if (route.key === 'all') {
      return (
        <ListCoupon
          fetchData={onDidMount}
          keyTab={route.key}
          data={dataCoupon.current}
          limitTime={data.current.couponSettingEntity.limitTime}
          tabAll={true}
          note={data.current.couponSettingEntity.note}
        />
      );
    }
    return (
      <ListCoupon
        fetchData={onDidMount}
        keyTab={route.key}
        data={dataTab}
        limitTime={data.current.couponSettingEntity.limitTime}
        note={data.current.couponSettingEntity.note}
      />
    );
  };

  const renderTabBar = (props) => {
    return (
      <View
        style={{
          padding: 10,
        }}>
        <ScrollView
          horizontal
          contentContainerStyle={{alignItems: 'center'}}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}>
          {data.current.listCategory.length >= 1 &&
            routes.current.map((route, i) => {
              return (
                <TouchableOpacity
                  key={`${route.key}`}
                  style={{
                    alignItems: 'center',
                    paddingHorizontal: 15,
                    paddingVertical: 8,
                    borderBottomWidth: 2,
                    borderColor:
                      props.navigationState.index === i
                        ? COLOR.main_color_2
                        : COLOR.white,
                  }}
                  onPress={() => setIndex(i)}>
                  <AppText style={{}}>{route.title}</AppText>
                </TouchableOpacity>
              );
            })}
        </ScrollView>
      </View>
    );
  };

  const renderContent = () => {
    if (loading) {
      return <Loading />;
    }

    if (
      !data.current.couponSettingEntity ||
      !data.current.listCategory ||
      !data.current.listForAllCoupon ||
      !data.current.listLimitedMemberCoupon ||
      !data.current.listMemberDesignationCoupon ||
      (data.current.listForAllCoupon.length === 0 &&
        data.current.listLimitedMemberCoupon.length === 0 &&
        data.current.listMemberDesignationCoupon.length === 0)
    ) {
      return (
        <ReloadDataScreen
          title={'データがありません'}
          iconName={'reload'}
          onPress={onDidMount}
        />
      );
    }
    return (
      <TabView
        style={{flex: 1}}
        navigationState={{index: index, routes: routes.current}}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    );
  };

  if (error.current.status) {
    return (
      <AppContainer haveTitle goBackScreen nameScreen={'クーポン'}>
        <NetworkError
          title={
            'ただいま大変混み合っております。しばらく経ってから再度お試しください。'
          }
          onPress={() => {
            onDidMount();
          }}
        />
      </AppContainer>
    );
  }

  return (
    <AppContainer haveTitle goBackScreen haveBottom nameScreen={'クーポン'}>
      {renderContent()}
    </AppContainer>
  );
}

export default withInteractionsManaged(Coupon);
