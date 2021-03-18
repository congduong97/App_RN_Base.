//Library:
import React, {useMemo, useEffect} from 'react';
import {View} from 'react-native';
import * as Animatable from 'react-native-animatable';
//Setup:
import {SIZE} from '../../../utils';
import {HomeItemMenu} from './HomeItemMenu';

//Component:

const HomeMenu = ({homeMainMenu}) => {
  const wrapperPadding = 6;
  useEffect(() => {
    return () => {};
  }, []);

  //Hiển thị item menu:
  const renderItemMenu = useMemo(() => {
    const homeMainMenuCovert = [...homeMainMenu];
    return homeMainMenuCovert.map((row, rowIndex) => {
      const margin = 6;
      let itemWidth = 0;
      if (row.length > 0) {
        itemWidth =
          (SIZE.device_width - wrapperPadding * 2 - (row.length - 1) * margin) /
          row.length;
      }
      return (
        <Animatable.View
          key={`row+${rowIndex}`}
          // animation='fadeInLeft'
          // delay={(rowIndex + 1) * 400}
          // duration={600}
          useNativeDriver={true}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: rowIndex === 0 ? 0 : 8,
          }}>
          {row.map((item, index) => {
            if (item && item.typeDisplay == 'NONE') {
              return (
                <View
                  key={`column+${index}`}
                  style={{height: itemWidth / 0.83, width: itemWidth}}
                />
              );
            }
            return (
              <HomeItemMenu
                key={`column+${index}`}
                rowIndex={rowIndex}
                index={index}
                heightItem={itemWidth / 0.83}
                widthItem={itemWidth}
                item={item}
              />
            );
          })}
        </Animatable.View>
      );
    });
  }, [homeMainMenu]);
  return (
    <View style={{paddingHorizontal: wrapperPadding, marginTop: 10}}>
      {renderItemMenu}
    </View>
  );
};

export default HomeMenu;
