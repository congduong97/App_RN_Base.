import React from 'react';
import PropTypes from 'prop-types';
import { View, ViewPropTypes,  ScrollView, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import HTML from 'react-native-render-html';
import { COLOR_GRAY } from '../../const/Color';
export default class AutoHeightWebView extends React.PureComponent {
    static propTypes = {
        ...WebView.propTypes,

        style: ViewPropTypes.style || View.propTypes.style,
        LoadingViewComponent: PropTypes.oneOfType([
            PropTypes.element,
            PropTypes.func
        ]),
        onLoad: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {
            contentHeight: 100,
            reloadWebview: true
        };
    }
 

    renderLoadingView() {
        const { LoadingViewComponent } = this.props;

        if (!this.state.contentHeight && LoadingViewComponent) {
            return React.isValidElement(LoadingViewComponent)
                ? LoadingViewComponent
                : <LoadingViewComponent />;
        }
    }
    onLinkPress = (event, link) => {
        if (link && link.includes('http')) {
            this.props.navigation.navigate('WEB_VIEW', { url: link });
        }
    }
    render() {
        const { html } = this.props;

        if (!html) {
            return null;
        }
        

        return (
            <ScrollView style={{ flex: 1 }}>
                <HTML onLinkPress={this.onLinkPress} html={html} ignoredStyles={['text-align']}
                baseFontStyle={{ fontSize: 14, color: COLOR_GRAY }} imagesMaxWidth={Dimensions.get('window').width} />
            </ScrollView>
        );
    }
}
