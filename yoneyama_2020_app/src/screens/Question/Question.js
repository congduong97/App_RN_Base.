//Library:
import React, {useEffect, useState, useContext} from 'react';
import {useNavigation} from '@react-navigation/core';
import {FlatList} from 'react-native';

//Setup:
import {FetchApi} from '../../utils';

//Component:
import ReloadDataScreen from '../../elements/ReloadData';
import {AppContainer, Loading, ErrorView} from '../../elements';
import {ItemQuestion} from './item/ItemQuestion';
import {ContextContainer} from '../../contexts/AppContext';

function Question(route) {
  const {colorApp} = useContext(ContextContainer);
  const [name, setStateNameScreen] = useState('');
  const [data, setStateData] = useState('');
  const [loading, setStateLoading] = useState(true);
  const [errorView, setStateErrorView] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    getNameScreen();
    getDataQuestion();
    return () => {};
  }, []);

  //Tải lại trang khi danh sách trống:
  const pressReloadData = () => {
    getDataQuestion();
  };

  //Lấy danh sách câu hỏi thường gặp:
  const getDataQuestion = async () => {
    const response = await FetchApi.getListQuestion();
    if (response && response.status_code == 200 && response.code == 1000) {
      setStateData(response.data);
      setStateLoading(false);
    } else {
      setStateLoading(false);
      setStateErrorView(true);
    }
  };

  //Lấy tên màn hình:
  const getNameScreen = () => {
    const {itemMenu} = route.route.params;
    if (itemMenu) {
      setStateNameScreen(itemMenu.name);
    }
  };

  //Item Quenstion:
  const renderItem = ({item, index}) => {
    return (
      <ItemQuestion
        data={item}
        index={index}
        navigation={navigation}
        nameScreen={name}
      />
    );
  };

  //Key:
  const keyExtractorItem = (item, index) => `${index}${item}`;

  //Danh sách câu hỏi:
  const renderTitle = () => {
    if (loading) {
      return <Loading />;
    }

    if (errorView) {
      return <ErrorView />;
    }

    if (data && data.length == 0) {
      return (
        <ReloadDataScreen
          title={'データがありません'}
          iconName={'reload'}
          onPress={pressReloadData}
        />
      );
    }
    return (
      <FlatList
        data={data}
        keyExtractor={keyExtractorItem}
        renderItem={renderItem}
      />
    );
  };
  return (
    <AppContainer
      haveTitle
      goBackScreen
      nameScreen={name}
      style={{backgroundColor: colorApp.backgroundColor}}>
      {renderTitle()}
    </AppContainer>
  );
}
export default Question;
