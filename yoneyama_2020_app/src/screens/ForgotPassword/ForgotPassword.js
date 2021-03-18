//Library:
import React, {useState, useMemo, useRef, useImperativeHandle} from 'react';
import {LayoutAnimation, UIManager, Platform, SafeAreaView} from 'react-native';
import Modal from 'react-native-modal';

//Setup:
import {SIZE} from '../../utils';

//Component:
import ForgotScreen from './items/ForgotScreen';
import OptScreen from './items/OptScreen';
import RegisterScreen from './items/RegisterScreen';
import SuccessScreen from './items/SuccessScreen';
import MyPagePass from './items/MyPagePass';
import Toast from '../../elements/Toast';
import {ToastModal} from './utils/ToastModal';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const ForgotPassword = (props, ref) => {
  const [show, setShow] = useState(false);
  const [indexScreen, setIndexScreen] = useState();
  const data = useRef({});
  const mode = useRef('');

  //Đẩy ref:
  useImperativeHandle(ref, () => ({setShowModal}), []);
  const setShowModal = (screen) => {
    mode.current = screen;
    if (screen === 'mypage') {
      setIndexScreen('mypage');
    } else {
      setIndexScreen('forgot');
    }
    setShow(true);
  };

  //Đóng modal:
  const closeModal = () => {
    data.current = {};
    setShow(false);
  };

  const setContent = (screen, dataScreen) => {
    data.current = {...data.current, ...dataScreen};
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        400,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.scaleXY,
      ),
    );
    setIndexScreen(screen);
  };

  const renderContent = useMemo(() => {
    switch (indexScreen) {
      case 'mypage':
        return (
          <MyPagePass
            dataScreen={data.current}
            closeModal={closeModal}
            setContent={setContent}
          />
        );

      case 'otp':
        return (
          <OptScreen
            mode={mode.current}
            dataScreen={data.current}
            closeModal={closeModal}
            setContent={setContent}
          />
        );

      case 'register':
        return (
          <RegisterScreen
            mode={mode.current}
            dataScreen={data.current}
            closeModal={closeModal}
            setContent={setContent}
          />
        );

      case 'success':
        return (
          <SuccessScreen
            mode={mode.current}
            closeModal={closeModal}
            setContent={setContent}
          />
        );

      default:
        return (
          <ForgotScreen
            mode={mode.current}
            dataScreen={data.current}
            closeModal={closeModal}
            setContent={setContent}
          />
        );
    }
  }, [indexScreen]);

  return (
    <Modal
      useNativeDriver={true}
      hideModalContentWhileAnimating={true}
      animationIn="zoomInDown"
      animationOut="fadeOut"
      animationInTiming={500}
      animationOutTiming={300}
      backdropTransitionInTiming={500}
      backdropTransitionOutTiming={300}
      isVisible={show}
      deviceHeight={SIZE.device_height}
      deviceWidth={SIZE.device_width}
      style={{
        margin: 0,
      }}>
      <SafeAreaView>
        {renderContent}
        <Toast ref={ToastModal.toastRef} inModal={true} />
      </SafeAreaView>
    </Modal>
  );
};

export default React.forwardRef(ForgotPassword);
