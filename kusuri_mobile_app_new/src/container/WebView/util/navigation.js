
import MangerAccoutWebViewScreen from '../screen/MangerAccoutWebViewScreen';
import WebViewScreen from '../screen/WebViewScreen';
export const WebViewStack = {
    WEB_VIEW: {
        screen: WebViewScreen,
        navigationOptions: {
            header: null
        }
    },
    WEB_VIEW_PDF: {
        screen: WebViewScreen,
        navigationOptions: {
            header: null
        }
    },
    MANAGER_ACCOUNT_WEBVIEW: {
        screen: MangerAccoutWebViewScreen,
    },
};
