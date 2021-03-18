import React, { Component } from "react";
import { StatusBar, View, TouchableOpacity, Text, SafeAreaView, StyleSheet, Platform, Image } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import IconView from './IconView'
import { Colors } from '../commons'
const heightToolBar = Platform.OS === 'ios' ? 45 : 45;

const AppStatusBar = ({ backgroundColor, ...props }) => (
    <View style={[{ backgroundColor, height: heightToolBar, }]}>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
);

class BaseView extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    drawViewScreen() {
        let { drawViewScreen } = this.props
        if (drawViewScreen) {
            return drawViewScreen
        }
        return null
    }

    render() {
        let { isShowIconLeft = true, isScroll = true,
            isShowIconRight, styleContent,
            children, titleScreen,
            styleTitle, styleTitleToolbarBase, isShowViewScreen,
            stylesViewTitle,
            isBorderBottomWidth = true,
            isShowSubTitle = false,
            isShowBack = true,
            stylesView } = this.props
        return (
            <View style={[stylesView]}>
                <LinearGradient
                    locations={[0, 0.5, 0.8]}
                    // colors={['white', 'white', 'white']}
                    colors={['#ffffff', '#ffffff', '#ffffff']}
                    // colors={[AppColors.colorMainDaiMau1, AppColors.colorMainDaiMau2, AppColors.colorMainDaiMau3]}
                    style={[styles.linearGradient]}>
                    <AppStatusBar
                        backgroundColor='transparent'
                        style={{ height: heightToolBar, }}
                    />

                    {/* ve tollbar va icon left */}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingVertical: 8
                    }}>
                        {isShowBack && <IconView
                            name={'ic-arrow-left'}
                            size={24}
                            style={{
                                padding: 8,
                                backgroundColor: '#D4FAFF',
                                borderRadius: 8,
                                position: 'absolute',
                                left: 12
                            }}
                        />}

                        <View style={[stylesViewTitle, { marginLeft: 8 }]}>
                            <Text numberOfLines={1} ellipsizeMode={'tail'} style={[styles.styleTitleToolbarBase, styleTitleToolbarBase]}>{titleScreen}</Text>
                        </View>

                        {isShowIconRight && <IconView
                            name={'ic-search'}
                            size={24}
                            style={{
                                padding: 8,
                                backgroundColor: '#D4FAFF',
                                borderRadius: 8,
                                position: 'absolute',
                                right: 12
                            }}
                        />}
                    </View>
                </LinearGradient>
                {styleContent ?
                    <View style={styleContent}>
                        {children}
                    </View>
                    : children}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    linearGradient: {
        paddingBottom: 8,
        shadowColor: 'gray',
    },
    styleLinear: {
        elevation: 2,
        shadowOpacity: 0.5,
        shadowOffset: {
            height: 1,
            width: 1
        },
        borderBottomWidth: 0.5,
        borderBottomColor: '#E5E5E5'
    },

    styleViewIconLeftBase: {
        position: 'absolute',
        padding: 5,
        height: '100%',
        width: heightToolBar,
        justifyContent: 'center',
        alignItems: 'flex-start',
        left: 10,
    },

    styleViewIconRightBase: {
        padding: 5,
        width: heightToolBar,
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginRight: 12
    },

    styleViewToolbarBase: {
        backgroundColor: 'transparent',
        height: heightToolBar,
        alignItems: 'center',
        flexDirection: 'row',
    },

    styleTitleToolbarBase: {
        fontWeight: '600',
        fontSize: 16,
        fontFamily: 'SFProText-Regular'
    },
    stylesubTitle: {
        fontFamily: 'Lato-Regular',
        color: Colors.colorText1,
        fontSize: 12,
        marginTop: -2
    }
})

export default BaseView
