import React, {useRef} from 'react';
import {Image, Keyboard, StyleSheet, View} from 'react-native';
import {Icon, Color} from '../../commons/constants';
import {validateImageUri} from '../../commons/utils/validate';
import IconView, {IconViewType} from '../../components/IconView';
import ActionSheet, {ActionSheetType} from '../../components/ActionSheet';

export default function AvatarView(props) {
  const {
    id: idView,
    isCapture = true,
    onPress,
    pictureData,
    isEdit,
    avatarUrl,
  } = props;
  const refActionSheet = useRef();
  const selectPhotoTapped = ({id, data}) => {
    refActionSheet && refActionSheet.current.open();
  };
  const onReponsePicture = ({data}) => {
    onPress &&
      onPress({
        id: idView,
        data: {
          uri: data?.uri,
          name: data?.fileName,
          type: data?.type,
        },
      });
  };

  const imageUrl = pictureData
    ? {uri: pictureData}
    : validateImageUri(avatarUrl, Icon.avatarDefault);
  return (
    <View
      style={styles.styleViewAvatar}
      onStartShouldSetResponder={() => Keyboard.dismiss()}>
      <Image source={imageUrl} style={styles.styleAvatar} />
      {isCapture && (
        <IconView
          id={idView}
          name={'camera'}
          type={IconViewType.AntDesign}
          color={Color.MayaBlue}
          size={20}
          style={styles.styleIconCameara}
          onPress={selectPhotoTapped}
        />
      )}
      <ActionSheet
        id={idView}
        ref={refActionSheet}
        actionType={ActionSheetType.ChoosePicture}
        onReponse={onReponsePicture}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  styleViewAvatar: {
    // position: 'absolute',
    // top: -45,
    marginBottom: 20,
    alignSelf: 'center',
    zIndex: 99,
  },
  styleAvatar: {
    width: 100,
    height: 100,
    borderRadius: 60,
  },
  styleIconCameara: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 3,
    shadowColor: 'gray',
  },
});
