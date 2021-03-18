import React from 'react';
import { View, StyleSheet, FlatList, ScrollView } from 'react-native';
import PreviewImageItem from './PreviewImageItem';

export default function PreviewImage({requestPreviewFile}) {
  let [images, setImages] = React.useState([]);
  
  let getImage = async () => {
    let res = await requestPreviewFile();
    setImages(res);
  };

  React.useEffect(() => {
    getImage();
  }, [])
  
  return <ScrollView>
    <View style={styles.container}>
        {
          images.map((item, index) => <PreviewImageItem {...item} key={index}/>)
        }
    </View>
  </ScrollView>
}

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      flexWrap: 'wrap',

      paddingVertical: 30,
      paddingHorizontal: 10,
      justifyContent: "center"
    }
});