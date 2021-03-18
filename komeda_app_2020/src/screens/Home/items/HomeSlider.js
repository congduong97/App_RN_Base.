//Library:
import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import Swiper from 'react-native-swiper';
import {useNavigation} from '@react-navigation/core';

//Setup:
import {SIZE, COLOR} from '../../../utils';

//Component:
import {AppImageButton, Loading} from '../../../elements';
import {keyNavigation} from '../../../navigators/utils/KeyNavigation';

const HomeSlider = ({slider, index}) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  //Xem chi tiết slider.
  const onPressItem = () => {
    // navigation.navigate(keyNavigation.NEWS_LIST);
    navigation.navigate(keyNavigation.MAIN_NAVIGATOR, {
      screen: keyNavigation.NEWS_LIST,
    });
  };

  useEffect(() => {
    return () => {};
  }, [index]);

  //Item Slider:
  const itemSlider = () => {
    return slider.map((item) => (
      <AppImageButton
        resizeMode={'stretch'}
        onPress={onPressItem}
        key={`${item.key}`}
        source={{uri: item.url}}
        style={{
          width: SIZE.device_width,
          height: (SIZE.device_width * 540) / 960,
        }}
      />
    ));
  };

  if (slider === undefined) {
    return (
      <Loading
        style={{
          height: (SIZE.device_width * 540) / 960,
          width: SIZE.device_width,
        }}
      />
    );
  }
  if ((slider && slider.length == 0) || slider === null) {
    return null;
  }
  if (slider && slider.length > 0) {
    return (
      <Swiper
        style={{height: (SIZE.device_width * 540) / 960}}
        renderPagination={(indexActive, total) => {
          return (
            <View
              style={{
                flexDirection: 'row',
                width: SIZE.device_width,
                backgroundColor: '#3D2516',
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 6,
                marginBottom: 10,
              }}>
              {Array(total)
                .fill(null)
                .map((item, index) => {
                  if (index === indexActive) {
                    return (
                      <View
                        key={`${index}`}
                        style={{
                          height: 10,
                          width: 10,
                          borderRadius: 5,
                          //marginLeft: 16,
                          marginHorizontal: 6,
                          backgroundColor: COLOR.white,
                        }}
                      />
                    );
                  }
                  return (
                    <View
                      key={`${index}`}
                      style={{
                        borderWidth: 1,
                        borderColor: COLOR.white,
                        height: 10,
                        width: 10,
                        borderRadius: 5,
                        marginHorizontal: 6,
                        //marginLeft: 16,
                      }}
                    />
                  );
                })}
            </View>
          );
        }}
        autoplayTimeout={8}
        autoplay={true}>
        {itemSlider()}
      </Swiper>
    );
  }
};

export default React.memo(HomeSlider);

//Lưu ý :
//Slider của app này không còn được lấy trong useContext vì nó sẽ được hiển thị chỉ định cho từng user theo favorite và categori:
