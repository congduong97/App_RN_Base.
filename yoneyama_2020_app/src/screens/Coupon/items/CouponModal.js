//Library:
import React, {useState, useMemo, useImperativeHandle, useEffect} from 'react';
import Modal from 'react-native-modal';
import {LayoutAnimation} from 'react-native';

//Component:
import ModalDetail from './ModalDetail';
import ModalCountDown from './ModalCountDown';

//Services:
import {CouponService} from '../services/CouponService';

const CouponModal = (props, ref) => {
  const [show, setShow] = useState(false);
  const [nameScreen, setNameScreen] = useState('ModalDetail');
  const [data, setData] = useState(props.data);

  useImperativeHandle(ref, () => ({setShowModal}), []);

  useEffect(() => {
    CouponService.onChangeCoupon(
      `CouponModal-${data.id}-${props.tabAll}`,
      (coupon) => {
        if (data.id === coupon.id) {
          setData({...coupon});
        }
      },
    );
    return () => {
      CouponService.deleteKey(`CouponModal-${data.id}-${props.tabAll}`);
    };
  }, []);

  const setShowModal = (couponState) => {
    setShow(true);
    if (couponState.using) {
      setNameScreen('ModalCountDown');
    }
  };

  //Đóng modal:
  const closeModal = () => {
    setShow(false);
    setNameScreen('ModalDetail');
  };

  const setContent = (screen) => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        15,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.scaleXY,
      ),
    );
    setNameScreen(screen);
  };

  const renderContent = useMemo(() => {
    switch (nameScreen) {
      case 'ModalDetail':
        return (
          <ModalDetail
            setContent={setContent}
            data={data}
            closeModal={closeModal}
            note={props.note}
          />
        );
      case 'ModalCountDown':
        return (
          <ModalCountDown
            closeModal={closeModal}
            data={data}
            limitTime={props.limitTime}
          />
        );
      default:
        return;
    }
  }, [nameScreen]);

  return (
    <Modal
      useNativeDriver={true}
      hideModalContentWhileAnimating={true}
      onBackdropPress={closeModal}
      animationIn="fadeIn"
      animationOut="fadeOut"
      isVisible={show}
      style={{alignItems: 'center', margin: 0}}>
      {show && renderContent}
    </Modal>
  );
};

export default React.forwardRef(CouponModal);
