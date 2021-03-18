import React, {useEffect, useState} from 'react';
import {View} from 'react-native';

//Setup:
import {AppText} from '../../../elements/AppText';
import {SIZE, FetchApi} from '../../../utils';

//Component:
import AppCheckBox from '../../../elements/AppCheckBox';
import {Loading} from '../../../elements';

//Vaiable:

function CheckBoxFavorite(props, ref) {
  const {checkNetWorkListFavotite} = props;
  let dataAPIListFavorite = [];
  const [dataListFavorite, setStateDataListFavorite] = useState([]);
  const [isLoading, setStateIsLoading] = useState(true);
  useEffect(() => {
    listFavoriteCategoryRegistrationUser();
  }, []);

  //Đăng kí danh sách sở thích :
  const listFavoriteCategoryRegistrationUser = async () => {
    const response = await FetchApi.listFavoriteCategoryRegistrationUser();
    let dataFavoriteAPI = response.data;
    if (response && response.status_code == 200 && response.code == 1000) {
      if (Array.isArray(dataFavoriteAPI) && dataFavoriteAPI.length >= 0) {
        setStateIsLoading(false);
        setStateDataListFavorite(dataFavoriteAPI);
        checkNetWorkListFavotite('GOOD');
      }
    }
    if (response && response.message == 'Network request failed') {
      checkNetWorkListFavotite('NETWORK_ERROR');
    }
  };

  //Phần hiển thị checkbox chọn mục yêu thích:
  const renderListCheckboxFavorite = () => {
    if (isLoading) {
      return <Loading></Loading>;
    } else {
      let listCheckbox = dataListFavorite.map((item, index) => {
        return <View key={`${index}`}>{checkBoxFavorite(item)}</View>;
      });
      return listCheckbox;
    }
  };

  //Danh sách checkbox lựa chọn sở thích:
  const checkBoxFavorite = (item) => {
    return (
      <View style={{width: SIZE.width(100)}}>
        <AppText
          style={{
            fontSize: SIZE.H4,
            color: '#6AA84F',
            marginTop: SIZE.width(3),
            marginBottom: SIZE.width(3),
            marginLeft: SIZE.width(6),
          }}>
          {item.parent.name}
        </AppText>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}>
          {listitemCheckbox(item.children)}
        </View>
      </View>
    );
  };

  //Hiển thị danh sách checkbox:
  const listitemCheckbox = (listCheckbox) => {
    let listItemCheckBox = listCheckbox.map((item, index) => {
      return (
        <View
          key={`${index}`}
          style={{
            maxWidth: SIZE.width(48),
            marginLeft: SIZE.width(2),
          }}>
          {itemCheckboxFavorite(item)}
        </View>
      );
    });
    return listItemCheckBox;
  };

  //Item :
  const itemCheckboxFavorite = (item) => {
    return (
      <View
        style={{
          minHeight: SIZE.width(12),
          marginTop: SIZE.width(1),
          justifyContent: 'center',
        }}>
        <AppCheckBox
          value={item.status}
          style={{marginLeft: SIZE.width(7)}}
          size={SIZE.H4 * 1.3}
          onChangeData={(value) => onchangeDataCheckboxAPI(item, value)}
          textStyle={{
            fontSize: SIZE.H6,
            marginLeft: SIZE.width(1.3),
            width: SIZE.width(32),
          }}
          text={item.name}
        />
      </View>
    );
  };

  //Thêm dữ liệu vào cục data để đẩy lên API:
  const onchangeDataCheckboxAPI = (item, value) => {
    const {getFavoriteUse} = props;
    if (item && value) {
      let findItemPush = dataAPIListFavorite.find(
        (element) => element.name == item.name,
      );
      if (!findItemPush) {
        dataAPIListFavorite.push(item);
        getFavoriteUse(dataAPIListFavorite);
      }
    } else {
      let findItemDelete = dataAPIListFavorite.findIndex(
        (element) => element.name == item.name,
      );
      dataAPIListFavorite.splice(findItemDelete, 1);
      getFavoriteUse(dataAPIListFavorite);
    }
  };

  return (
    <View
      style={{
        width: SIZE.width(100),
        marginTop: SIZE.width(2),
      }}>
      {renderListCheckboxFavorite()}
    </View>
  );
}
export {CheckBoxFavorite};
