import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {SIZE, COLOR} from '../../../utils';
import Feather from 'react-native-vector-icons/dist/Feather';
import * as Animatable from 'react-native-animatable';
import {AppText} from '../../../elements';
import {QuestionService} from '../services/QuestionService';

const ItemQuestion = ({item, index, setActiveItem}) => {
  const {question, answer, id} = item;
  const [showAnswer, setShowAnswer] = useState(false);

  const onToggleAnswer = () => {
    setShowAnswer(!showAnswer);
    QuestionService.setAndBroadcast(index);
  };
  useEffect(() => {
    QuestionService.onChange(`${index}`, (key) => {
      if (key !== index) {
        setShowAnswer(false);
      }
    });
    return () => {};
  }, []);

  return (
    <Animatable.View style={{width: SIZE.device_width}}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onToggleAnswer}
        style={{
          flexDirection: 'row',
          padding: 20,
          borderBottomWidth: 1,
          borderColor: '#F6F6F6',
          alignItems: 'center',
          width: SIZE.device_width,
        }}>
        <View
          style={{
            height: SIZE.H1,
            width: SIZE.H1,
            borderRadius: SIZE.H1 / 2,
            backgroundColor: '#68463A',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <AppText style={{color: COLOR.white, fontSize: SIZE.H4}}>Q</AppText>
        </View>
        <View style={{paddingHorizontal: 10, flex: 8}}>
          <AppText style={{color: '#68463A', fontSize: SIZE.H5 * 1.2}}>
            {question}
          </AppText>
        </View>
        <Feather
          name={showAnswer ? 'chevron-up' : 'chevron-down'}
          color={showAnswer ? '#68463A' : '#AFAFAF'}
          size={SIZE.H1}
        />
      </TouchableOpacity>
      {showAnswer && (
        <Animatable.View
          useNativeDriver={true}
          animation={'fadeIn'}
          duration={500}
          style={{
            paddingHorizontal: 30 + SIZE.H1,
            paddingVertical: 20,
            backgroundColor: '#FFFDF6',
          }}>
          <AppText style={{color: '#4D4D4D', fontSize: SIZE.H5 * 1.2}}>
            {answer}
          </AppText>
        </Animatable.View>
      )}
    </Animatable.View>
  );
};

export default React.memo(ItemQuestion);
