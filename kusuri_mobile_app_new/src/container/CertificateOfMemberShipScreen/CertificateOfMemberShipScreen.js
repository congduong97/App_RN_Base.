import React, { PureComponent } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { COLOR_GRAY_LIGHT, COLOR_WHITE, } from '../../const/Color';
import { tab, keyAsyncStorage } from '../../const/System';
import HeaderIconLeft from '../../commons/HeaderIconLeft';
import { AppImage } from '../../component/AppImage';

export default class CertificateOfMemberShip extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: ''
    };
  }
  componentDidMount() {
    this.getImageCertificate();
  }
  getImageCertificate = async () => {
    try {
      const res = await AsyncStorage.getItem(keyAsyncStorage.appDetail);
      if (res) {
        const imageUrl = await JSON.parse(res).certificateImage;
        this.setState({ imageUrl });
      }
    } catch (e) {

    }
  }


  render() {
    const { navigation, disableBackButton } = this.props;
    const { imageUrl } = this.state;
    const { iconUrlCertificateMemberScreen, nameCertificateMemberScreen } = tab.screenTab;

    return (
      <View style={styles.wrapperContainer}>
        <StatusBar backgroundColor={COLOR_GRAY_LIGHT} barStyle="dark-content" />
        <HeaderIconLeft
          disableBackButton={disableBackButton}
          title={nameCertificateMemberScreen}
          goBack={navigation.goBack}
          imageUrl={iconUrlCertificateMemberScreen}
        />
        <View style={styles.wrapperCenter}>

          <AppImage url={imageUrl} style={styles.image} resizeMode={'contain'} />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  wrapperContainer: {
    backgroundColor: COLOR_WHITE,
    flex: 1
  },
  wrapperCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: '100%',
    height: '100%'
  }
});
