import {Linking} from 'react-native';

const openUlrBrowser = (link) => {
  Linking.canOpenURL(link)
    .then((supported) => {
      Linking.openURL(link).catch((error) => {});
    })
    .catch((error) => {});
};

export {openUlrBrowser};
