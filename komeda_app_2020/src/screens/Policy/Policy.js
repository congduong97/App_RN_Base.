//Library:
import React, {useContext, useState, useEffect} from 'react';
import {ScrollView, StyleSheet, Dimensions, View, Linking} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import HTML from 'react-native-render-html';

//Setup:
import {SIZE, COLOR, AsyncStoreKey} from '../../utils';
import {ContextContainer} from '../../contexts/AppContext';
import {keyNavigation} from '../../navigators/utils/KeyNavigation';

//Component:
import {AppHeader, AppTextButton} from '../../elements';
import {BottomService} from '../../navigators/services/BottomService';
import {openUlrBrowser} from '../../utils/modules/OpenURL';

//Screen:
const Policy = ({navigation}) => {
  const {policy, colorApp} = useContext(ContextContainer);

  const [showButton, setShowButton] = useState(false);
  useEffect(() => {
    onDidMount();
    return () => {};
  }, []);

  const onDidMount = async () => {
    const hasLaunched = await AsyncStorage.getItem(AsyncStoreKey.hasLaunched);
    if (hasLaunched !== 'hasLaunched') {
      BottomService.setDisplay(false);
      setShowButton(true);
    }
  };
  const convertHtmlContent = (content) => {
    const customContent = content
      ? content
          .replace(/(<p><em>)/gm, '<em>')
          .replace(/(<\/p><\/em>)/gm, '</em>')
          .replace(/(<p><i>)/gm, '<i>')
          .replace(/(<\/p><\/i>)/gm, '</i>')
          .replace(/(\n)/gm, '<br />')
          .replace(/(<br \/><br \/>)/gm, '<br/ >')
      : '';

    console.log(`<div>${customContent}</div>`);

    return `<div>${customContent}</div>`;
  };

  //Đồng ý và bắt đầu dùng app.
  const onPressAcceptPolicy = () => {
    navigation.reset({
      routes: [{name: keyNavigation.ENTRY}],
    });
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: showButton ? COLOR.background_light : '#F0F0F0',
          marginBottom: showButton ? 32 : 0,
        },
      ]}>
      <AppHeader title={'利用規約'} leftGoBack={!showButton} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 24,
          paddingHorizontal: 12,
        }}
        style={{
          backgroundColor: COLOR.white,
          marginHorizontal: 12,
          marginTop: 24,
          marginBottom: 24,
          borderWidth: 1,
          borderRadius: 4,
          borderColor: '#DADADA',
        }}>
        <HTML
          tagsStyles={{
            span: {
              fontFamily: 'irohamaru-Regular',
              fontSize: SIZE.H4,
            },
            h6: {
              lineHeight: SIZE.H4 + 7,
              fontSize: SIZE.H4,
              fontFamily: 'irohamaru-Regular',
            },
            div: {
              overflow: 'hidden',
            },
            p: {
              lineHeight: SIZE.H4 + 7,
              fontSize: SIZE.H4,
              fontFamily: 'irohamaru-Regular',
              color: '#4D4D4D',
            },
            em: {
              fontSize: SIZE.H4,
              fontStyle: 'italic',
              color: '#4D4D4D',
            },
            i: {
              fontSize: SIZE.H4,
              fontStyle: 'italic',
              color: '#4D4D4D',
            },
          }}
          //ignoredStyles={['font-family']}
          html={convertHtmlContent(policy)}
          imagesMaxWidth={Dimensions.get('window').width}
          onLinkPress={(e, href) => {
            Linking.canOpenURL(href).then((supported) => {
              if (supported) {
                Linking.openURL(href);
              } else {
                openUlrBrowser(href);
              }
            });
          }}
        />
      </ScrollView>
      {showButton && (
        <AppTextButton
          title={'利用規約に同意してはじめる'}
          style={{
            height: SIZE.height(7.5),
            marginHorizontal: SIZE.width(3),
            backgroundColor: colorApp.backgroundColorButton,
            borderRadius: 0,
          }}
          textStyle={{
            color: colorApp.textColorButton,
            fontFamily: 'irohamaru-Medium',
            fontSize: SIZE.H4,
          }}
          onPress={onPressAcceptPolicy}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
  },
});

export default Policy;
