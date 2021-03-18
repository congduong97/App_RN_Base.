//Library:
import React, {useEffect, useState, useRef} from 'react';
import {FlatList, View, StyleSheet} from 'react-native';

//Setup:
import {FetchApi, COLOR} from '../../utils';

//Component:
import {Loading, ErrorView, AppHeader} from '../../elements';
import ItemQuestion from './item/ItemQuestion';
import ReloadDataScreen from '../../elements/ReloadData';
import {STRING} from '../../utils/constants/String';
import {NetworkError} from '../../elements/NetworkError';

//Screen:
function Question({route}) {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const error = useRef();

  useEffect(() => {
    getQuestion();
    return () => {};
  }, []);

  //Tải lại trang khi danh sách trống:
  // const pressReloadData = () => {
  //   getQuestion();
  // };

  //Lấy danh sách câu hỏi thường gặp:
  const getQuestion = async () => {
    error.current = undefined;
    if (!loading) {
      setLoading(true);
    }
    const response = await FetchApi.getListQuestion();
    if (response && response.status_code == 200 && response.code == 1000) {
      setQuestion(response.data);
    } else if (response.status_code >= 500) {
      error.current = 'server_maintain';
    } else {
      error.current = 'network';
    }
    setLoading(false);
  };

  //Item Quenstion:
  const renderItem = ({item, index}) => {
    return <ItemQuestion item={item} index={index} />;
  };

  //Key:
  const keyExtractorItem = (item, index) => `${index}${item}`;

  //Danh sách câu hỏi:
  const renderContent = () => {
    if (loading) {
      return <Loading />;
    }

    if (error.current === 'network') {
      return (
        <NetworkError
          title={STRING.network_error_try_again_later}
          onPress={getQuestion}
        />
      );
    }
    if (error.current == 'server_maintain') {
      return (
        <ErrorView
          icon={{name: 'ios-settings'}}
          errorName={STRING.server_maintain}
          onPress={getQuestion}
        />
      );
    }

    if (!question || (question && question.length == 0)) {
      return (
        <ReloadDataScreen
          title={'データがありません'}
          iconName={'reload'}
          onPress={getQuestion}
        />
      );
    }
    return (
      <FlatList
        data={question}
        keyExtractor={keyExtractorItem}
        renderItem={renderItem}
      />
    );
  };
  return (
    <View style={styles.container}>
      <AppHeader title={'よくあるご質問'} leftGoBack />
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: COLOR.white,
  },
});
export default Question;
