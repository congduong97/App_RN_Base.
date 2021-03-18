import React, {
  useState,
  useMemo,
  useRef,
  useImperativeHandle,
  useEffect,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  Animated,
  ScrollView,
  Button,
} from "react-native";
import { SIZE } from "../const/size";

const Dropdown = (props, ref) => {
  const {
    data,
    styleTextBody,
    defaultValue,
    touchOnItem,
    scrollTo,
    containerStyle,
    styleItem,
    styleViewList,
    textPlaceHolder,
    defaultId,
  } = props;
  const [isShow, setIsShow] = useState(false);
  const [currentLabel, setCurrentLabel] = useState(
    !!defaultValue ? defaultValue : ""
  );
  const [currentId, setCurrentId] = useState(!!defaultId ? defaultId : 0);
  const buttonRef = useRef(null);
  const positionTop = useRef(null);
  const positionRight = useRef(null);
  const btnWidth = useRef(null);
  const scrollViewRef = useRef(null);
  const [dataSourceCords, setDataSourceCords] = useState([]);
  const timeout = useRef(null);
  useImperativeHandle(ref, () => ({
    hide,
    onPressButton,
  }));

  const onPressItem = (item, index) => {
    touchOnItem && touchOnItem(item);
    setCurrentId(item.id);
    setCurrentLabel(item.name);
    setIsShow(false);
  };

  useEffect(() => {
    const getIndexItem = () => {
      for (let index = 0; index < data.length; index++) {
        if (currentId == data[index].id) {
          return index > 0 ? index - 1 : index;
        }
      }
      return 1;
    };
    // console.log("getIndexItem", getIndexItem());
    timeout.current = setTimeout(() => {
      if (!!scrollViewRef.current && scrollTo) {
        scrollViewRef.current.scrollResponderScrollTo({
          x: 0,
          y: dataSourceCords[getIndexItem() - 1],
          animated: true,
        });
      }
    }, 300);

    return () => {
      timeout.current && clearTimeout(timeout.current);
    };
  }, [isShow, data]);

  const onPressButton = () => {
    updatePosition(() => {
      if (!isShow && data.length>0) {
        setIsShow(true);
      }
    });
  };
  const hide = () => {
    if (isShow) {
      // setTimeout(() => {
      setIsShow(false);
      // }, 400);
    }
  };
  const updatePosition = (cb) => {
    if (buttonRef.current && buttonRef.current.measure) {
      buttonRef.current.measure((fx, fy, width, height, px, py) => {
        // console.log('buttonRef', buttonRef.current.measure);
        positionTop.current = py;
        positionRight.current = px;
        btnWidth.current = width;
        cb && cb();
      });
    }
  };
  const renderModal = () => {
    return (
      <TouchableOpacity style={{ flex: 1 }} onPress={hide} activeOpacity={1}>
        <ScrollView
          ref={scrollViewRef}
          bounces={false}
          style={[
            {
              position: "relative",
              top: positionTop.current,
              borderColor: "gray",
              // maxHeight: SIZE.height(30),
              borderWidth: 0.5,
              borderColor: "#C6C6C6",
            },
            styleViewList,
          ]}
        >
          {!!data &&
            data.length > 0 &&
            data.map((item, index) => (
              <TouchableOpacity
                style={[
                  {
                    backgroundColor: currentId == item.id ? "#C6C6C6" : "white",
                    borderTopWidth: index > 0 ? 0.5 : 0,
                    borderColor: "#C6C6C6",
                    // borderRightWidth:0.5,
                    // borderLeftWidth:0.5
                  },
                  styleItem,
                ]}
                key={`${index}`}
                onPress={() => onPressItem(item, index)}
                onLayout={(event) => {
                  const layout = event.nativeEvent.layout;
                  dataSourceCords[index] = layout.y;
                  setDataSourceCords(dataSourceCords);
                }}
                activeOpacity={1}
              >
                <Text
                  style={[
                    {
                      fontSize: 14,
                      color: currentId == item.id ? "black" : "gray",
                    },
                    styleTextBody,
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </TouchableOpacity>
    );
  };
  return (
    <View style={containerStyle}>
      <TouchableOpacity
        style={styleItem}
        ref={buttonRef}
        onPress={onPressButton}
        activeOpacity={1}
      >
        <Text
          style={[
            { fontSize: 14, color: !!currentLabel ? "black" : "#C6C6C6" },
            styleTextBody,
          ]}
        >
          {!!currentLabel
            ? currentLabel
            : !!textPlaceHolder
            ? textPlaceHolder
            : ""}
        </Text>
      </TouchableOpacity>
      <Modal
        animationType={"fade"}
        transparent={true}
        onRequestClose={hide}
        visible={isShow}
      >
        {renderModal()}
      </Modal>
    </View>
  );
};

export default React.forwardRef(Dropdown);
