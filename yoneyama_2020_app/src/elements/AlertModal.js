import React, {useImperativeHandle, useState} from 'react';
import Modal from 'react-native-modal';
import {SIZE} from '../utils';
import {SafeAreaView} from 'react-native';

const AlertModal = (props, ref) => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState({title: null, message: null});
  const [content, setContent] = useState(null);
  useImperativeHandle(ref, () => ({setShowModal, closeModal, showToast}), []);

  const setShowModal = (renderContent) => {
    setContent(renderContent);

    setShow(true);
  };

  const closeModal = () => {
    setShow(false);
    setContent(null);
  };
  const showToast = (title, message) => {
    setData({title, message});
    setShow(true);
  };

  return (
    <Modal
      useNativeDriver={true}
      backdropOpacity={0.2}
      hideModalContentWhileAnimating={true}
      animationOut="fadeOut"
      animationInTiming={300}
      backdropTransitionInTiming={300}
      backdropTransitionOutTiming={300}
      isVisible={show}
      deviceHeight={SIZE.device_height}
      deviceWidth={SIZE.device_width}
      style={{
        margin: 0,
      }}>
      <SafeAreaView>
        <>{content}</>
      </SafeAreaView>
    </Modal>
  );
};

export default React.forwardRef(AlertModal);
