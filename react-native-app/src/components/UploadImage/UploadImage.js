import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import UploadImageItem from './UploadImageItem';
import uploadImagePicker from '../../commons/utils/uploadImage';

export default function UploadImage({
  dataItem,
  param,
  refUploadImage,
  onAddImage,
}) {
  let [images, setImages] = React.useState([]);
  if (dataItem) {
    refUploadImage.current.reservationId = dataItem.cartId;
  }
  const onAddImages = (path) => {
    setImages((prevState) => {
      if (path !== null) {
        refUploadImage.current.images = [
          ...refUploadImage.current.images,
          path,
        ];
        return [...prevState, path];
      }
      return prevState;
    });
  };

  const handleImagePicker = (param) => async () => {
    let path = await uploadImagePicker(param);
    if (dataItem) {
      onAddImages(path);
    } else if (onAddImage) {
      onAddImage(path, setImages);
    }
  };
  return (
    <View style={styles.uploadImageContainer}>
      {images.map((item, index) => (
        <UploadImageItem item={item} key={index} />
      ))}
      <UploadImageItem
        handleImagePicker={handleImagePicker(param)}
        param={param}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  uploadImageContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    height: 310,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dotted',
    margin: 10,
  },
});
