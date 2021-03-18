import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {AppHeader, Loading, AppImage} from '../../elements';
import {FetchApi, SIZE} from '../../utils';
import {ScrollView} from 'react-native-gesture-handler';

const HowToUse = ({route}) => {
  const [imgUrl, setImageUrl] = useState();
  const [imgHeight, setImageHeight] = useState(SIZE.device_height);

  useEffect(() => {
    getData();
    return () => {};
  }, []);
  const getData = async () => {
    const response = await FetchApi.howToUse();

    if (response.success) {
      Image.getSize(response.data.imageUsingEntity.url, (width, height) => {
        // calculate image width and height
        const scaleFactor = width / SIZE.device_width;
        const imageHeight = height / scaleFactor;
        setImageHeight(imageHeight);
        setImageUrl(response.data.imageUsingEntity.url);
      });
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title={'使い方ガイド'} leftGoBack />
      {!imgUrl ? (
        <Loading />
      ) : (
        <ScrollView style={{flex: 1}}>
          <AppImage
            resizeMode='contain'
            source={{uri: imgUrl}}
            style={{width: SIZE.device_width, height: imgHeight}}
          />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: '#F0F0F0',
  },
});

export default HowToUse;
