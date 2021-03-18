import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, StatusBar, View, Text, Image, Vibration, SafeAreaView } from 'react-native';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import { COLOR_WHITE } from '../../const/Color';
import Ionicons from 'react-native-vector-icons/Ionicons'

const styles = {
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  iconApp: {
    resizeMode: 'cover',
    width: 50,
    height: 50,
  },
  icon: {
    marginTop: 10,
    marginLeft: 10,
    resizeMode: 'contain',
    width: 48,
    height: 48,
  },
  textContainer: {
    alignSelf: 'center',
  },
  title: {
    color: '#2A2A2A',
    fontWeight: 'bold',
  },
  message: {
    color: '#2A2A2A',
    marginTop: 5,
  },
  footer: {
    backgroundColor: '#696969',
    borderRadius: 5,
    alignSelf: 'center',
    height: 5,
    width: 35,
    margin: 5,
  },
};

class DefaultNotificationBody extends React.Component {
  constructor() {
    super();

    this.onSwipe = this.onSwipe.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isOpen !== this.props.isOpen) {
      StatusBar.setHidden(nextProps.isOpen);
    }

    if ((this.props.vibrate || nextProps.vibrate) && nextProps.isOpen && !this.props.isOpen) {
      Vibration.vibrate();
    }
  }

  onSwipe(direction) {
    const { SWIPE_UP } = swipeDirections;

    if (direction === SWIPE_UP) {
      this.props.onClose();
    }
  }

  renderIcon() {
    const {
      iconApp,
      icon,
    } = this.props;
    return <View style={{ justifyContent: "center", alignItems: 'center',height:'100%',width:'20%' }}>
    <Ionicons name={'md-notifications-outline'} size={30} />
    </View>
  }

  render() {
    const {
      title,
      message,
      onPress,
      onClose,
    } = this.props;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLOR_WHITE }}>
        <View style={styles.root}>
          <GestureRecognizer onSwipe={this.onSwipe} style={styles.container}>
            <TouchableOpacity
              style={styles.content}
              activeOpacity={0.3}
              underlayColor="transparent"
              onPress={() => {
                onClose();
                onPress();
              }}
            >
              {this.renderIcon()}
              <View style={styles.textContainer}>
                <Text numberOfLines={1} style={styles.title}>{title}</Text>
                <Text numberOfLines={1} style={styles.message}>{message}</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.footer} />
          </GestureRecognizer>
        </View>
      </SafeAreaView>

    );
  }
}

DefaultNotificationBody.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  vibrate: PropTypes.bool,
  isOpen: PropTypes.bool,
  onPress: PropTypes.func,
  onClose: PropTypes.func,
  iconApp: Image.propTypes.source,
  icon: Image.propTypes.source,
};

DefaultNotificationBody.defaultProps = {
  title: 'Notification',
  message: 'This is a test notification',
  vibrate: true,
  isOpen: false,
  iconApp: null,
  icon: null,
  onPress: () => null,
  onClose: () => null,
};

export default DefaultNotificationBody;
