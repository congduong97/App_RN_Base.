import React, { PureComponent } from 'react';
import {
    View, Text, StyleSheet, Platform, ScrollView, SafeAreaView
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import WebViewComponent from '../../component/WebViewComponent';
import {

    COLOR_WHITE,
    COLOR_BLACK, APP_COLOR, COLOR_GRAY_LIGHT
} from '../../const/Color';
import {
    DEVICE_WIDTH,
    managerAcount, keyAsyncStorage, SYSTEAM_VERSION, subMenu
} from '../../const/System';
import { STRING } from '../../const/String';
import { pushResetScreen } from '../../util';
import { ButtonLogin } from '../LoginScreen/Item/ButtonLogin';


export default class Rule extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const { routeName } = this.props.navigation.state;
        if (routeName == 'POLICY') {
            AsyncStorage.getItem('policy').then(res => {
                this.setState({ terms: res });
            });
        } else {
            AsyncStorage.getItem('termInfo').then(res => {
                this.setState({ terms: res });
            });
        }
    }
    componentWillUnmount() {


        // screenProps.disableBottomTab(true);
    }
    _onNavigationStateChange2(webViewState) {
        if (isIOS) {
            if (webViewState.navigationType == 'click') {
                this.setState({ reloadWebview: false });
                this.props.navigation.navigate('WEB_VIEW', { url: webViewState.url });
                setTimeout(() => {
                    this.setState({ reloadWebview: true });
                }, 100);
            }
        } else if (webViewState.url !== 'about:blank') {
            this.setState({ reloadWebview: false });
            this.props.navigation.navigate('WEB_VIEW', { url: webViewState.url });
            setTimeout(() => {
                this.setState({ reloadWebview: true });
            }, 100);
        }
    }

    renderWebView() {
        return (
            <WebViewComponent
                styleContainer={{ flex: 1, paddingRight: 8 }}
                navigation={this.props.navigation}
                html={this.state.terms}
            />


        );
    }

    render() {
        const { params, routeName } = this.props.navigation.state;
        // console.log('params', this.props.navigation.state);
        const { goBack } = this.props.navigation;
        const name = routeName == 'POLICY' ? subMenu.nameMenuPolicy || STRING.policy : subMenu.nameMenuTerm || STRING.term_if_use;
        return (
            <View style={styles.wrapperContainer}>

                <SafeAreaView style={styles.wrapperHeader}>
                    <Text info style={[styles.textButton, { color: COLOR_BLACK }]}>{name}</Text>

                </SafeAreaView>


                <View
                    style={{
                        flex: 10, borderColor: COLOR_GRAY_LIGHT, borderWidth: 1, padding: 8, margin: 16, paddingRight: 0
                    }}
                >

                    {
                        this.renderWebView()
                    }

                </View>
                <View style={{ margin: 16 }}>
                    <ButtonLogin
                        name={routeName == 'TERM' || routeName == 'POLICY' ? STRING.go_back : STRING.agree_start_now}
                        loadingLogin={false}
                        onPress={() => {
                            AsyncStorage.setItem(keyAsyncStorage.isAgree, 'success');

                            if (routeName == 'TERM' || routeName == 'POLICY') {
                                goBack(null);
                            } else  {
                                pushResetScreen(this.props.navigation, 'HomeNavigator');
                            }
                        }}
                    />
                </View>
                <SafeAreaView />


            </View>
        );
    }
}

const isIOS = Platform.OS === 'ios';

const styles = StyleSheet.create({
    wrapperCenter: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    wrapperContainer: {
        paddingTop: isIOS ? 0 : 16,
        backgroundColor: COLOR_WHITE,
        flex: 1
        // opacity: 0
    },
    wrapperHeader: {
        // flex: 1,
        marginTop: parseInt(SYSTEAM_VERSION) < 11 && isIOS ? 20 : 0,

        justifyContent: 'center',
        alignItems: 'center',
        // paddingTop: isIOS ? 40 : 20,
        // width: DEVICE_WIDTH,
        // backgroundColor: COLOR_WHITE
    },
    wrapperCloseButton: {
        position: 'absolute',
        top: isIOS ? 33 : 13,
        left: 12.5,
    },
    wrapperBody: {
        width: DEVICE_WIDTH - 32,
        margin: 16,
        flex: 11,
        // borderWidth: 1,
        // borderColor: COLOR_GRAY_LIGHT,
        backgroundColor: COLOR_WHITE
    },

    textButton: {
        color: APP_COLOR.COLOR_TEXT_BUTTON_TYPE_1,
        fontSize: 16,
        fontFamily: 'SegoeUI',

    },


});
