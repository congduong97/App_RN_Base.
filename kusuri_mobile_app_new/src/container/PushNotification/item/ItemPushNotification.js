import React, { PureComponent } from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import {
     COLOR_GRAY_LIGHT, COLOR_WHITE, APP_COLOR,
} from '../../../const/Color';

import { AppImage } from '../../../component/AppImage';
import { Api } from '../util/api';
import { OpenMenu } from '../../../util/module/OpenMenu';
import { styleInApp } from '../../../const/System';
import { getTimeFomartDDMMYY } from '../../../util';
import { TextTime } from '../../../component/TextTime/TextTime';
// import console = require('console');

export class ItemPushNotification extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            wiewed: this.props.item.wiewed
        };
    }

    onPress = () => {
        const { navigation, item } = this.props;
        const { wiewed } = this.state;
        const { typePush, id, linkWebview } = this.props.item;
        if (typePush !== 1) {
            Api.getPushNotificationDetail(id);
        }
        if (!wiewed) {
            this.props.item.wiewed = true;
            this.setState({ wiewed: true });
        }
        if (typePush == 1) {
            navigation.navigate('DetailPushNotification', { id: item.id });
        } else if (typePush == 2 && linkWebview) {
            navigation.navigate('WEB_VIEW', { url: linkWebview });
        } else if (typePush == 3) {
            OpenMenu(item.menuEntity, navigation);
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps && nextProps.item && (nextProps.item.wiewed !== prevState.wiewed)) {
            prevState.wiewed = nextProps.item.wiewed;
        }
        return {
            loading: !!nextProps.loading,
        };
    }
    render() {
        const { pushTime, imageUrl, title, description } = this.props.item;
        const { wiewed } = this.state;
        return (
            <TouchableOpacity
                onPress={this.onPress}
                actionOpacity={0.8}
                style={[styles.wrapperCard, { backgroundColor: wiewed ? APP_COLOR.BACKGROUND_COLOR : COLOR_GRAY_LIGHT }]}
            >
                <View style={{ flex: 8 }} >
                    <Text style={styleInApp.title}>{title}</Text>
                    <Text style={styleInApp.shortDescription}>{description}</Text>
                    <TextTime time={getTimeFomartDDMMYY(pushTime)} />
                </View>
                {imageUrl && (<View
                    style={{ alignItems: 'flex-end', justifyContent: 'center', }}
                >
                    <AppImage
                        onPress={this.onPress}
                        url={imageUrl}
                        resizeMode={'cover'}
                        style={{ width: 90, height: 90 }}
                    />
                </View>)}

            </TouchableOpacity>
        );
    }
}
const styles = StyleSheet.create({
    wrapperBody: {
        flex: 1,
    },
    wrapperCenter: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    wrapperCard: {
        borderColor: COLOR_GRAY_LIGHT,
        borderBottomWidth: 1,
        padding: 10,
        flexDirection: 'row',
    },


});
