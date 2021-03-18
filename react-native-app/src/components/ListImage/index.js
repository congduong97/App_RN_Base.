import React, {useEffect, useImperativeHandle, useRef} from 'react';
import {StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {useDispatch} from 'react-redux';
import FastImage from 'react-native-fast-image';
import {useMergeState} from '../../AppProvider';
import API from '../../networking';
import {SCREEN_WIDTH} from '../../commons/utils/devices';
import {Dimension, Color, Size} from '../../commons/constants';
import * as ApiUrl from './../../networking/ApiUrl';
import ServicesUpdateComponent from '../../services/ServicesUpdateComponent';
function ListImageView(props, ref) {
  const {zoomImage, getUrlImgZoom, idItemSelect} = props;
  const dispatch = useDispatch();
  const [stateScreen, setStateScreen] = useMergeState({
    filesData: [],
  });
  const listImgApi = useRef([]);
  let {filesData} = stateScreen;
  useImperativeHandle(ref, () => ({uploadSuccessImgToFilesData}), []);

  useEffect(() => {
    ServicesUpdateComponent.onChange('ListImageView', (event) => {
      if (event == 'Upload_img_success') {
        setTimeout(() => {
          requestPreviewFile();
        }, 2000);
      }
    });
    requestPreviewFile();
    return () => {
      ServicesUpdateComponent.remove('ListImageView');
    };
  }, []);

  const requestPreviewFile = async () => {
    let dataFile = await API.requestPreviewImage(dispatch, idItemSelect);
    listImgApi.current = dataFile;
    setStateScreen({filesData: dataFile});
  };
  const pressImgZoom = (link) => () => {
    zoomImage();
    getUrlImgZoom(link);
  };

  const uploadSuccessImgToFilesData = (imgSelect) => {
    let newArray = [...listImgApi.current, imgSelect];
    listImgApi.current = newArray;
    setStateScreen({filesData: newArray});
  };

  const itemImgZoom = ({item, index}) => {
    const link = item.url.includes('rn_image_picker_lib_temp')
      ? item.url
      : `${ApiUrl.IMAGE_BASE_URL}/${ApiUrl.VIEW_IMAGE}/${item?.url}`;
    return (
      <TouchableOpacity key={`${index}${link}`} onPress={pressImgZoom(link)}>
        <FastImage
          key={`${index}${link}`}
          style={styles.stContentItem}
          source={{
            uri: link,
          }}></FastImage>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <FlatList
        keyExtractor={(item, index) => `${index}${item.id}`}
        numColumns={SCREEN_WIDTH / 70}
        data={filesData}
        renderItem={itemImgZoom}
        style={{
          flexGrow: 0,
          margin: Dimension.margin10,
          marginRight: Size.width(30),
        }}
      />
    </>
  );
}

export default React.forwardRef(ListImageView);

const styles = StyleSheet.create({
  stContentItem: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginHorizontal: 6,
    borderColor: Color.Border,
    borderWidth: 0.5,
  },
});
