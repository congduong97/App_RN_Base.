import React, {useEffect} from 'react';
import {View} from 'react-native';

//Setup:
import {AppText} from '../../../elements/AppText';
import {SIZE, COLOR} from '../../../utils';

//Component:
import AppCheckBox from '../../../elements/AppCheckBox';

//Services:
function CheckBoxFavorite(props) {
  const {dataCheckBoxUser} = props;
  useEffect(() => {
    onDidMount();
  }, []);

  const onDidMount = async () => {};

  //Khung vùng chữ lưu ý trong màn myPage:
  const renderTitileAndBoxTitle = () => {
    return (
      <View
        style={{
          alignItems: 'center',
          width: SIZE.width(96),
          minHeight: SIZE.width(10),
          marginLeft: SIZE.width(2),
        }}>
        <AppText style={{color: '#6AA84F', fontSize: SIZE.H4}}>
          興味のあるカテゴリ
        </AppText>
        {dataCheckBoxUser && dataCheckBoxUser.length == 0 ? (
          <View
            style={{
              minHeight: SIZE.width(12),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <AppText
              style={{
                color: COLOR.COLOR_BLACK,
                fontSize: SIZE.H5 * 1.3,
              }}>
              {'  '}
              現在、データありません。
            </AppText>
          </View>
        ) : (
          <View
            style={{
              minHeight: SIZE.width(12),
              borderColor: '#38761D',
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: SIZE.width(2),
              marginTop: SIZE.width(2),
            }}>
            <AppText
              style={{
                color: COLOR.COLOR_BLACK,
                fontSize: SIZE.H5,
                padding: SIZE.width(2),
              }}>
              ご選択いただいた情報の最新情報をプッシュ通知、お知らせにて
              タイムリーに配信いたします。
            </AppText>
          </View>
        )}
      </View>
    );
  };

  //Phần hiển thị checkbox chọn mục yêu thích.
  const renderListCheckboxFavorite = () => {
    if (dataCheckBoxUser) {
      let listCheckbox = dataCheckBoxUser.map((item, index) => {
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
            marginLeft: SIZE.width(1),
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
          style={{maxWidth: SIZE.width(48), marginLeft: SIZE.width(2)}}>
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
    getFavoriteUse(item, value);
  };

  return (
    <View
      style={{
        minHeight: SIZE.width(15),
        width: SIZE.width(100),
        marginTop: SIZE.width(3),
      }}>
      {/* Khung chữ */}
      {renderTitileAndBoxTitle()}
      {renderListCheckboxFavorite()}
    </View>
  );
}
export {CheckBoxFavorite};
