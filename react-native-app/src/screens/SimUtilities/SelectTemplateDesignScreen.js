import {useNavigation, useRoute} from '@react-navigation/native';
import React from 'react';
import {FlatList, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {windowSize} from '../../commons/utils/devices';
import {ScreensView} from '../../components';
import AppNavigate from '../../navigations/AppNavigate';
import templates from './templates';

export default function SelectTemplateDesignScreen(props) {
  const route = useRoute();
  const simData = route.params;
  const navigation = useNavigation();
  const navigateToSimImageDesignScreen = (template) => () => {
    AppNavigate.navigateToSimImageDesignScreen(navigation.dispatch, {
      templateData: template,
      simData: simData,
    });
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={navigateToSimImageDesignScreen(item)}
      style={styles.container}>
      <Image source={item.template} style={styles.image} resizeMode="contain" />
    </TouchableOpacity>
  );
  const keyExtractor = (item) => item.id;
  return (
    <ScreensView isScroll={false} titleScreen={'Chọn Thiết Kế SIM'}>
      <FlatList
        renderItem={renderItem}
        data={templates}
        keyExtractor={keyExtractor}
        numColumns={2}
      />
    </ScreensView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  image: {width: windowSize.width * 0.5, height: windowSize.width * 0.5},
});
