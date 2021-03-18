import React, {useRef, useEffect, useState} from 'react';
import {View, TouchableOpacity, Alert} from 'react-native';
import {AppText, AppIcon} from '../../../elements';
import {SIZE, COLOR, FetchApi, ToastService} from '../../../utils';
import {useNavigation} from '@react-navigation/native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {BookmarkService} from '../services/BookmarkService';

export default function ItemBookMark(props) {
  const {code1, name2, address6} = props.data;
  const [isSwipedRight, setIsSwipedRight] = useState(false);
  const navigation = useNavigation();
  const swipe = useRef();
  const isLoading = useRef(false);
  const timer = useRef(0);
  useEffect(() => {
    swipe.current.close();
    clearTimeout(timer.current)
  }, [props.editing]);

  const openRightAction = () => {
    swipe.current.openRight();
  };

  const onRemoveItem = () => {
    Alert.alert(
      '',
      'この店舗をお気に入りから削除しますか？',
      [
        {
          text: 'キャンセル',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: onUnFollow,
        },
      ],
      {cancelable: false},
    );
  };

  const onUnFollow = async () => {
    if (!isLoading.current) {
      isLoading.current = true;
      const res = await FetchApi.storeSetBookmarked(code1);
      if (res.success) {
        let dataAfterUnfollow = {...props.data, bookmarked: false,unFollowInStoreBookmarkItem:true};
        BookmarkService.set(dataAfterUnfollow);
      } else {
        ToastService.showToast(res.message);
      }
      timer.current = setTimeout(() => {
        isLoading.current = false;
      }, 1000);
    }
   
  };

  const onSwipeOpen = () => {
    setIsSwipedRight(true);
  };
  const onSwipeClose = () => {
    setIsSwipedRight(false);
  };

  const renderIconLeft = () => {
    return (
      <TouchableOpacity
        style={{
          width: 70,
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
        }}
        onPress={openRightAction}>
        <View
          style={{
            height: 30,
            width: 30,
            borderRadius: 15,
            backgroundColor: '#EF6572',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              height: 4,
              width: '70%',
              backgroundColor: COLOR.white,
              borderRadius: 6,
            }}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const renderIconRight = () => {
    if (isSwipedRight) {
      return null;
    }
    return (
      <TouchableOpacity
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
        }}
        onPress={openRightAction}>
        <AppIcon
          type={'Feather'}
          icon={'menu'}
          iconColor={COLOR.grey_500}
          iconSize={24}
        />
      </TouchableOpacity>
    );
  };

  const renderRightActions = () => {
    if (!props.editing) {
      return null;
    }
    return (
      <TouchableOpacity
        style={{
          backgroundColor: '#EF6572',
          width: 67,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={onRemoveItem}>
        <AppText style={{color: COLOR.white}}>削除</AppText>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable
      ref={swipe}
      renderRightActions={renderRightActions}
      onSwipeableRightWillOpen={onSwipeOpen}
      onSwipeableWillClose={onSwipeClose}>
      <TouchableOpacity
        onPress={() => navigation.navigate('STORE_DETAIL', {data: props.data})}
        activeOpacity={0.8}
        style={{
          flex: 1,
          width: SIZE.device_width,
          flexDirection: 'row',
          paddingVertical: SIZE.padding,
          backgroundColor: COLOR.white,
          paddingRight: SIZE.padding,
          paddingLeft: props.editing ? 0 : SIZE.padding,
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottomColor: COLOR.grey_300,
          borderBottomWidth: 0.8,
        }}>
        {props.editing && renderIconLeft()}
        <View style={{flex: 1}}>
          <AppText
            style={{
              fontSize: SIZE.H5,
              marginRight: 10,
              fontFamily: 'irohamaru-Medium',
            }}>
            {name2}
          </AppText>
          <AppText
            style={{
              fontSize: SIZE.H6,
              marginRight: 10,
              flex: 1,
              color: '#8c8c8c',
              marginTop: 10,
            }}>
            {address6}
          </AppText>
        </View>
        {props.editing ? (
          renderIconRight()
        ) : (
          <AppIcon
            type={'Entypo'}
            icon={'chevron-thin-right'}
            iconColor={COLOR.grey_500}
            iconSize={24}
          />
        )}
      </TouchableOpacity>
    </Swipeable>
  );
}
