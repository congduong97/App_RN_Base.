import React from 'react';
import {View, FlatList} from 'react-native';
import {SearchBar, AppHeader} from '../../elements';
import {SIZE} from '../../utils';
import StoreFilterItem from './items/StoreFilterItem';

export default function StoreFilter({props, route}) {
  const {dataSearch} = route.params;

  const renderItem = ({item, index}) => {
    return <StoreFilterItem data={item} />;
  };

  return (
    <View style={{flex: 1}}>
      <AppHeader title='検索結果' leftGoBack />
      <SearchBar
        styleWrap={{width: SIZE.device_width}}
        placeholder='店舗名・地名・住所でさがす'
        defaultValue={dataSearch}
      />
      <FlatList
        keyExtractor={(item, index) => `${index}`}
        data={[]}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        removeClippedSubviews={false}
        // ListEmptyComponent={renderEmpty}
        onEndReachedThreshold={0.8}
        // onEndReached={onLoadMore}
        // ListHeaderComponent={renderHeader}
        // ListFooterComponent={renderLoading}
      />
    </View>
  );
}
