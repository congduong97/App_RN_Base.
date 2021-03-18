//Library:
import React, {useEffect, useState, useContext} from 'react';
import {StyleSheet} from 'react-native';

//Setup:
import {SIZE, COLOR} from '../../utils';

//Component:
import {AppContainer} from '../../elements';
import {AppText} from '../../elements/AppText';
import {ItemQuestion} from '../Question/item/ItemQuestion';
import {ContextContainer} from '../../contexts/AppContext';

function QuestionDetail(route) {
  const [getName, setStateNameScreen] = useState('');
  const {name, item, index} = route.route.params;
  const {colorApp} = useContext(ContextContainer);
  useEffect(() => {
    setStateNameScreen(name);
    return () => {};
  }, []);

  return (
    <AppContainer
      haveTitle
      goBackScreen
      nameScreen={getName}
      style={{backgroundColor: colorApp.backgroundColor}}>
      <ItemQuestion data={item} detail index={index} inDetail />
      <AppText style={styles.textDetailQuestion}>{item.answer}</AppText>
    </AppContainer>
  );
}
const styles = StyleSheet.create({
  wrapperContainer: {
    backgroundColor: COLOR.white,
    flex: 1,
  },
  textDetail: {
    marginLeft: SIZE.width(2),
    marginRight: SIZE.width(2),
    fontSize: 12,
    color: COLOR.COLOR_GRAY_900,
  },
  textDetailQuestion: {
    marginLeft: SIZE.width(3),
    marginRight: SIZE.width(3),
    marginTop: SIZE.width(1),
    marginBottom: SIZE.width(1),
    fontSize: 17,
    color: COLOR.COLOR_GRAY_900,
  },
});

export default QuestionDetail;
