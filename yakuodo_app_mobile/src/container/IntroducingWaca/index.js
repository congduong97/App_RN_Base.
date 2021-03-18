import React, { PureComponent } from 'react';
import { NetworkError, Loading, HeaderIconLeft } from '../../commons';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Api } from '../../service';
import { COLOR_WHITE } from '../../const/Color';
import { STRING } from '../../const/String';
import { isIOS, DEVICE_WIDTH, APP } from '../../const/System';
import { AppImage } from '../../component/AppImage';
import WebViewComponent from '../../component/WebViewComponent';
import ReloadScreen from '../../service/ReloadScreen';

export default class IntroducingWaca extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            waiIntro: null,
            waiTerm: null,
            error: false,
            loading: false


        };
    }
    componentDidMount() {
        this.getApi();
        const { routeName } = this.props.navigation.state

        ReloadScreen.onChange(routeName, () => {
            // alert('reload')
            this.getApi(true)
        })
    }
    componentWillUnmount() {
        const { routeName } = this.props.navigation.state
        ReloadScreen.unChange(routeName)

    }
    async getApi() {
        const { loading } = this.state
        if (loading) {
            return
        }
        this.setState({ loading: true });
        try {
            const responseIntro = await Api.getWaiIntro();
            if (responseIntro.code == 200 && responseIntro.res.status.code == 1000) {
                this.state.waiIntro = responseIntro.res.data.content;
                this.state.error = false;
            } else {
                this.state.error = false;
            }
        } catch (e) {
            this.state.error = true;
        } finally {
            this.setState({ loading: false });
        }
    }
    renderWebView() {
        return (
            <WebViewComponent
                scrollEnabled
                scalesPageToFit={!(isIOS)}
                navigation={this.props.navigation}
                style={{ width: DEVICE_WIDTH, height: '100%', padding: 100, }}
                html={this.state.waiIntro}
            />);
    }
    renderContent() {
        const { waiIntro, waiTerm, error, loading } = this.state;
        if (error) {
            return (
                <NetworkError onPress={() => this.getApi()} />
            );
        }
        if (loading) {
            return (
                <Loading />
            );
        }
        return (
            <ScrollView style={[styles.wrapperContainer, { padding: 16 }]} >
                <AppImage url={APP.IMAGE_LOGO} style={styles.imageLogo} />
                {this.renderWebView()}
            </ScrollView>
        );
    }
    render() {
        const { goBack } = this.props.navigation;
        return (
            <View style={styles.wrapperContainer}>
                <HeaderIconLeft
                    title={STRING.introducingWaca}
                    goBack={goBack}
                />
                {this.renderContent()}

            </View>
        );
    }

}
const styles = StyleSheet.create({
    wrapperContainer: {
        flex: 1,
        backgroundColor: COLOR_WHITE,
        paddingBottom: 16,
    },
    imageLogo: {
        height: 50,
        width: 150
    }


});
