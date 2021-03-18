import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { IndicatorViewPager, PagerDotIndicator } from '../../../liberyCustom/rn-viewpager';
import { DEVICE_WIDTH, keyAsyncStorage } from '../../../const/System';
import { APP_COLOR } from '../../../const/Color';
import { AppImage } from '../../../component/AppImage';
export class SliderImage extends PureComponent {
    state = {
        slider: []
    };

    componentDidMount() {
        AsyncStorage.getItem(keyAsyncStorage.slider).then(res => {
            if (Array.isArray(JSON.parse(res))) {
                this.setState({ slider: JSON.parse(res) });
            }
        });
    }


    _renderDotIndicator() {
        const { length } = this.state.slider;
        return (
            <PagerDotIndicator
                pageCount={length === 1 ? 0 : length}
                dotStyle={{ height: 8, width: 8, borderRadius: 8 }}
                selectedDotStyle={{
                    backgroundColor: APP_COLOR.COLOR_TEXT,
                    height: 8,
                    width: 8,
                    borderRadius: 8
                }}
            />
        );
    }

    get _renderSlider() {
        const renderSliderImage = this.state.slider.map((item, index) => (
            <View key={`${index}a`}>


                <AppImage
                    url={item.url} style={{ width: '100%', height: '100%' }} resizeMode={'cover'}

                />
            </View>

        ));
        return (
            <IndicatorViewPager
            
                autoPlayEnable
                stopEnd
                autoPlayInterval={4000}
                pageEnd={this.state.slider.length - 1}
                loop
                keyboardDismissMode={'none'}

                style={styles.imageFeature}
                indicator={this._renderDotIndicator()}
            >
                {renderSliderImage}
            </IndicatorViewPager>
        );
    }

    render() {
        const { slider } = this.state;
        if (slider.length > 0) {
            return <View style={{ width: DEVICE_WIDTH - 32 - 16, height: DEVICE_WIDTH * (9 / 16) }}>{this._renderSlider}</View>;
        }
        return null;
    }
}

const styles = StyleSheet.create({
    imageFeature: {
        width: DEVICE_WIDTH - 32 - 16,
        height: DEVICE_WIDTH * (9 / 16)
    }
});
