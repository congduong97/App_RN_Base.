import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, View, StatusBar } from "react-native";
import { SliderBox } from "react-native-image-slider-box";
import { Dimension, Fonts } from "../../../commons";
import { ButtonView, ScreensView } from "../../../components";
import AppNavigate from "../../../navigations/AppNavigate";
import ImageSlide from "./imageSlide";
export default function IntroScreen() {
    const navigation = useNavigation();
    const handleAgree = () => {
        AppNavigate.navigateToLoginScreen(navigation.dispatch)
    }
    return (
        <ScreensView
            isToolbar={false}
        // bgColorStatusBar={'#ADB1B390'}
        >
            <StatusBar
                translucent
                backgroundColor={"transparent"}
                barStyle="dark-content"
            />
            <View style={{flex:1}}>
            <SliderBox
                images={ImageSlide}
                sliderBoxHeight={"100%"}
                dotStyle={{
                    marginBottom: 60,
                    width: 8,
                    height: 8,
                    borderRadius: 8,
                    padding: 0,

                }}
                dotColor="#00C6AD"
                inactiveDotColor="white"
                paginationBoxVerticalPadding={20}
                autoplay
                circleLoop

            />
            </View>
            <View style={styles.styleViewText}>
                <Text style={styles.stText1}>{"ĐĂNG KÝ LỊCH KHÁM BỆNH TỪ XA"}</Text>
                <Text style={{ ...styles.stText2, lineHeight: 35 }}>
                    {"Giúp bạn dễ dàng hơn trong việc đăng"}
                </Text>

                <Text style={styles.stText2}>
                    {" ký khám bệnh, tiết kiệm thời gian..."}
                </Text>
            </View>
            <ButtonView
                title={"Bắt đầu"}
                onPress={handleAgree}
                style={styles.styleButtonView}
            />
        </ScreensView>
    )
}

const styles = StyleSheet.create({
    styleContainer: {
        backgroundColor: 'white',
    },
    stImage: {
        flex: 1,
        width: "100%",
        height: "100%",
        justifyContent: 'center'
        // backgroundColor: "white",
        // position: "absolute",
    },
    stText1: {
        color: "white",
        fontFamily: Fonts.SFProDisplaySemibold,
        fontSize: Dimension.fontSize20,
        // textTransform: "uppercase",
        // alignSelf: "center",
        textAlign: "center",

        // letterSpacing: 0.2,
        marginBottom: Dimension.margin2x,
    },
    stText2: {
        // lineHeight: 35,
        color: "white",
        fontSize: Dimension.fontSize16,
        fontFamily: Fonts.SFProDisplayRegular,
        // alignSelf: "center",
        // textAlign: "center",
        letterSpacing: 0.2,
    },
    styleViewText: {
        position: 'absolute',
        top: 300,
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'

    },
    styleButtonView: {
        marginBottom: 20,
        marginHorizontal: 15,
        position: 'absolute',
        width: '90%',
        alignSelf: 'center',
        bottom: 0
    }


})
