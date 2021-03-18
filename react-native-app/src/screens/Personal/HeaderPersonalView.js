import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Image, StyleSheet, View} from 'react-native';
import {Color, Dimension, Icon} from '../../commons/constants';
import {validateImageUri} from '../../commons/utils/validate';
import {IconView, TextView} from '../../components';
import models from '../../models';
import AppNavigate from '../../navigations/AppNavigate';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {concatenateString} from '../../commons/utils/format';

export default function HeaderPersonalView(props) {
  const [userInfo, setStateUserInfo] = useState({});
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const avatarUser = validateImageUri(userInfo?.avatar);
  const nameRoleDisplay = models.getRoleUser()?.shortName;
  useEffect(() => {
    if (isFocused) {
      setStateUserInfo(models.getUserInfo());
    }
  }, [isFocused]);
  const navigateToUpdateUser = () => {
    AppNavigate.navigateToUpdateUserScreen(navigation.dispatch);
  };

  return (
    <View style={styles.styleContains}>
      <View style={styles.styleContainsAvatar}>
        <Image
          resizeMode="cover"
          source={avatarUser}
          PlaceholderContent={<ActivityIndicator />}
          style={styles.avatar}
        />
        <View style={styles.styleContainsInfo}>
          <TextView
            style={styles.styleName}
            styleContainerText={styles.styleContainerName}
            styleTitle={styles.stTextRole}
            styleValue={styles.stTextFullName}
            title={`${nameRoleDisplay}:`}
            value={userInfo.fullName}
          />
          <TextView
            nameIconLeft={'telephone'}
            colorIconLeft="white"
            style={styles.styleRowText}
            styleContainerText={styles.styleContainerText}
            styleTitle={styles.styleTitle}
            styleValue={styles.styleValue}
            value={userInfo.phone}
          />
          <TextView
            nameIconLeft={'email'}
            colorIconLeft="white"
            style={styles.styleRowText}
            styleContainerText={styles.styleContainerText}
            styleTitle={styles.styleTitle}
            styleValue={styles.styleValue}
            value={userInfo.email}
          />
          <TextView
            nameIconLeft={'birthday-cake'}
            colorIconLeft="white"
            style={styles.styleRowText}
            styleContainerText={styles.styleContainerText}
            styleTitle={styles.styleTitle}
            styleValue={styles.styleValue}
            value={userInfo.dateOfBirth}
          />
        </View>
      </View>
      <TextView
        nameIconLeft={'home-address'}
        colorIconLeft="white"
        style={[styles.styleRowText, {justifyContent: 'center'}]}
        styleContainerText={styles.styleContainerText}
        styleTitle={styles.styleTitle}
        styleValue={styles.styleValue}
        value={userInfo?.fullAddress}
      />
      <IconView
        onPress={navigateToUpdateUser}
        name={'edit'}
        color="white"
        style={styles.styleIconEdit}
        size={20}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  styleContains: {
    flex: 1,
    paddingTop: 30,
  },
  styleContainsAvatar: {
    flexDirection: 'row',
  },

  avatar: {
    marginLeft: Dimension.margin20,
    borderRadius: 50,
    borderColor: 'white',
    borderWidth: 2,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Color.border,
  },
  styleContainsInfo: {
    marginLeft: Dimension.margin20,
    paddingRight: Dimension.margin,
    flex: 1,
  },
  styleName: {},
  styleContainerName: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 8,
  },

  stTextFullName: {
    fontSize: Dimension.fontSize21,
    flex: 1,
    color: 'white',
    fontWeight: '700',
    marginLeft: 10,
  },
  stTextRole: {
    fontSize: Dimension.fontSize14,
    color: Color.tomato,
    fontWeight: '700',
    alignSelf: 'center',
  },
  styleRowText: {
    height: 25,
  },
  styleContainerText: {alignSelf: 'center'},
  styleTitle: {},
  styleValue: {
    alignItems: 'center',
    color: 'white',
    marginLeft: Dimension.margin,
  },
  styleIconEdit: {
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
});
