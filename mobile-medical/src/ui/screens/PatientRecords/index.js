import React, { useState } from "react";
import { Image, FlatList, Text, View, TextInput } from "react-native";
import { Colors, Dimension, Fonts } from "../../../commons";
import { ButtonView, ScreensView, TextView, IconView, } from "../../../components";
import styles from "./styles";

export default function MedicalRcordsScreen(props) {
  const [textSearch, setTextSearch] = useState('')

  const renderItemCall = ({ item, index }) => {
    return (
      <View style={{
        marginHorizontal: 12,
        marginTop: index === 0 ? 12 : 0,
        marginBottom: 12,
        elevation: 3,
        shadowColor: 'gray',
        borderRadius: 12,
        padding: 12,
        flexDirection: 'row'
      }}>
        <Image
          source={require('../../../../assets/images/avatar.jpg')}
          style={{
            height: 90,
            width: 90,
            borderRadius: 45
          }}
        />

        <View style={{ flex: 1, justifyContent: 'space-evenly', marginLeft: 8 }}>
          <Text
            style={[styles.styleText, { fontSize: 18, color: "black" }]}
          >
            {"Nguyễn Thị Mai"}
          </Text>
          <TextView
            style={styles.styleContainerDate}
            styleValue={{ fontWeight: "500", fontSize: 14 }}
            value={"Tôi"}
            styleIconLeft={styles.stylesIconLeft}
            nameIconLeft={"ic-user-dot"}
            iconColor={Colors.colorMain}
            iconSize={14}
          />
          <TextView
            style={styles.styleContainerDate}
            styleValue={{ fontWeight: "500", fontSize: 14 }}
            value={"21/09/1999"}
            styleIconLeft={styles.stylesIconLeft}
            nameIconLeft={"ic-calendar"}
            iconColor={Colors.colorCancel}
            iconSize={14}
          />
        </View>

        <IconView
          name={"Icons---check"}
          size={20}
          color={Colors.colorCancel}
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        />
      </View>
    )
  }

  const listEmptyComponent = () => {
    return (
      <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Image
          source={require('../../../../assets/images/lablePatient.png')}
          style={{

          }}
        />

        <Text style={{
          color: 'black',
          fontSize: 16,
          fontFamily: Fonts.SFProDisplayRegular,
        }}>{'Bạn chưa có hồ sơ sức khỏe nào'}</Text>
        <Text style={{
          color: Colors.colorTitleScreen,
          fontSize: 13,
          fontFamily: Fonts.SFProDisplayRegular,
        }}>{'Tạo một hồ sơ sức khỏe'}</Text>

        <ButtonView
          title={"Tạo hồ sơ sức khỏe"}
          // onPress={handleAgree}
          style={{ width: '90%', marginTop: 30 }}
        />
      </View>
    )
  }

  const renderHeader = () => {
    return (
      <View style={styles.styleViewSearch}>
        <TextInput
          style={{ flex: 1, paddingVertical: 12 }}
          onChangeText={(text) => setTextSearch(text)}
          value={textSearch}
          placeholder={"Tìm kiếm"}
        />
        <IconView name={"ic-search"} />
      </View>
    )
  }

  return (
    <ScreensView
      styleContent={{ flex: 1 }}
      titleScreen={"Hồ sơ sức khoẻ"}
      >

      <FlatList
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="never"
        data={[{}, {}]}
        // extraData={patientRecordsData.current}
        renderItem={renderItemCall}
        keyExtractor={(item, index) => `${item.id}${index}`}
        onEndReachedThreshold={0.2}
        // removeClippedSubviews
        ListEmptyComponent={listEmptyComponent}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
      />
    </ScreensView>
  );
}
