import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AppImage } from '../../../component/AppImage';
import { DEVICE_WIDTH } from '../../../const/System';
import { COLOR_GRAY_LIGHT, COLOR_BLACK, COLOR_GRAY, APP_COLOR, COLOR_WHITE } from '../../../const/Color';
import { getTimeFomartDDMMYY } from '../../../util';
import { Api } from '../../../service';
import HandleAppLyCoupon from '../../../service/HandleAppLyCoupon';
// import console = require('console');
// import console = require('console');

export class ItemBanner extends PureComponent {
    constructor(props) {
        super(props);
    }
    getTextTime = () => {
        const { endTime, startTime } = this.props.data;
        if (endTime && endTime.includes('9999') && startTime) {
            return `受付期間：${getTimeFomartDDMMYY(startTime)} ~ 終了期間未定`;
        } else if (endTime && startTime) {
            return `受付期間：${getTimeFomartDDMMYY(startTime)} ~ ${getTimeFomartDDMMYY(endTime)}`;
        }
        return '';
    }
    callApiClick = async () => {
        try {
            const { data } = this.props;
            const rensponse = await Api.detailBannerApp(data.id);
        } catch (error) {


        }
    }
    clickWebView = () => {
        const { confirm } = this.props;
        if (!confirm) {
            this.callApiClick();
            const { linkApply } = this.props.data;
            this.props.navigation.navigate('WEB_VIEW', { url: linkApply });
        }
    }
    selectBanner = () => {
        const { data, isLoading } = this.props;
        const { selected, applied } = data;
        if (!isLoading && !applied) {
            if (selected) {
                HandleAppLyCoupon.set({ data, type: 'UN_SELECT' });
            } else {
                HandleAppLyCoupon.set({ data, type: 'SELECT' });
            }
        }
    }
    getTextColor = () => {
        const { data } = this.props;

        const { applied, selected } = data;
        if (applied) {
            return COLOR_WHITE;
        }
        if (selected) {
            return APP_COLOR.COLOR_TEXT_BUTTON_TYPE_1;
        }
        return APP_COLOR.COLOR_TEXT_BUTTON_TYPE_2;
    }
    getBackgroundColor = () => {
        const { data } = this.props;

        const { applied, selected } = data;
        if (applied) {
            return COLOR_GRAY;
        }
        if (selected) {
            return APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1;
        }
        return COLOR_WHITE;
    }
    getBoderColor = () => {
        const { data } = this.props;

        const { applied, selected } = data;
        if (applied) {
            return COLOR_GRAY;
        }
        if (selected) {
            return APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1;
        }
        return APP_COLOR.COLOR_BORDER_BUTTON_TYPE_2;
    }
    getTextSelect = () => {
        const { data } = this.props;

        const { applied, selected } = data;
        if (applied) {
            return '応募済み';
        }
        if (selected) {
            return '選択済み';
        }
        return '選択する';
    }


    render() {
        const { data, navigation } = this.props;
        const { imageUrl, title, applied, selected, numberMemberApply } = data;
        return (
            <TouchableOpacity onPress={this.clickWebView} style={{ borderBottomWidth: 2, borderColor: COLOR_GRAY_LIGHT, paddingVertical: 16 }} >
                <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 16 }}>
                            <Text style={{ color: COLOR_BLACK, fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>{title}</Text>
                            <Text style={{ color: COLOR_GRAY, fontSize: 12, marginBottom: 10 }}>{this.getTextTime()}</Text>
                            {numberMemberApply && numberMemberApply >= 10 ?
                                <Text style={{ color: COLOR_GRAY, fontSize: 12, marginBottom: 10 }}>{`応募者数：${numberMemberApply}名`}</Text>
                                : null

                            }
                        </View>
                        <TouchableOpacity
                            activeOpacity={applied ? 1 : 0.2}
                            onPress={this.selectBanner}
                            style={{ width: 54, height: 24, backgroundColor: this.getBackgroundColor(), justifyContent: 'center', alignItems: 'center', margin: 8,marginRight:16, borderRadius: 4, borderColor: this.getBoderColor(), borderWidth: 1 }}
                        >
                            <Text style={{ color: this.getTextColor(), fontSize: 10 }}>{this.getTextSelect()}</Text>
                        </TouchableOpacity>


                    </View>
                    <AppImage url={imageUrl} style={{ width: DEVICE_WIDTH - 32, height: (DEVICE_WIDTH - 32) * 9 / 16, borderRadius: 4, }} resizeMode={'cover'} />

                </View>

            </TouchableOpacity>
        );
    }
}
