/**
 * Created by tangzhibin on 16/3/23.
 */

'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, ViewPropTypes, TouchableOpacity } from 'react-native';
import ViewPager from './ViewPager';
import { isIOS, DEVICE_WIDTH } from '../../../const/System';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLOR_GRAY, COLOR_GRAY_LIGHT, COLOR_WHITE } from '../../../const/Color';
// import console = require('console');
// import console = require('console');

const VIEWPAGER_REF = 'viewPager';
const INDICATOR_REF = 'indicator';
export default class IndicatorViewPager extends Component {
    static propTypes = {
        ...ViewPager.propTypes,
        indicator: PropTypes.node,
        pagerStyle: ViewPropTypes.style,
        autoPlayEnable: PropTypes.bool,
        autoPlayInterval: PropTypes.number,
        horizontalScroll: PropTypes.bool
    }

    static defaultProps = {
        indicator: null,
        initialPage: 0,
        autoPlayInterval: 3000,
        autoPlayEnable: false,
        horizontalScroll: true

    }

    constructor(props) {
        super(props);
        this._onPageScroll = this._onPageScroll.bind(this);
        this._onPageSelected = this._onPageSelected.bind(this);
        this._goToNextPage = this._goToNextPage.bind(this);
        this._renderIndicator = this._renderIndicator.bind(this);
        this.setPage = this.setPage.bind(this);
        this.setPageWithoutAnimation = this.setPageWithoutAnimation.bind(this);
        this._startAutoPlay = this._startAutoPlay.bind(this);
        this._stopAutoPlay = this._stopAutoPlay.bind(this);
        this._currentIndex = props.initialPage;
        this._childrenCount = React.Children.count(props.children);
        this._goToBackPage = this._goToBackPage.bind(this);
        this.state = {
            params: 0,
            listPosition: []
        };
    }

    componentDidMount() {
        if (this.props.autoPlayEnable) this._startAutoPlay();
        else this._stopAutoPlay();
    }

    componentWillUpdate(nextProps, nextState) {
        this._childrenCount = React.Children.count(nextProps.children);
        if (this.props.autoPlayEnable !== nextProps.autoPlayEnable) {
            nextProps.autoPlayEnable ? this._startAutoPlay() : this._stopAutoPlay();
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={[styles.container, this.props.style]} >
                    <ViewPager
                        {...this.props}
                        horizontalScroll={this.props.horizontalScroll}
                        ref={VIEWPAGER_REF}
                        style={[styles.pager, this.props.pagerStyle]}
                        onPageScroll={this._onPageScroll}
                        onPageSelected={this._onPageSelected}
                    />
                    {this.props.checkRenderDotFooter ? null : this._renderIndicator()}

                </View>
                {this.props.checkRenderDotFooter ?
                    <View style={{ height: 32, width: '100%', backgroundColor: COLOR_WHITE, flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
                        <TouchableOpacity style={{ height: 32, justifyContent: 'center', alignItems: 'center', width: 30 }} onPress={this._goToBackPage}>
                            <Icon name={'angle-left'} size={16} color={COLOR_GRAY} />
                        </TouchableOpacity>
                        <View style={{ marginTop: 35, justifyContent: 'center', alignItems: 'center' }} >
                            {this._renderIndicator()}
                        </View>
                        <TouchableOpacity
                            style={{ height: 32, justifyContent: 'center', alignItems: 'center', width: 30 }}
                            onPress={this._goToNextPage}
                        >
                            <Icon name={'angle-right'} size={16} color={COLOR_GRAY} />
                        </TouchableOpacity>
                    </View> : null}

            </View>

        );
    }

    componentWillUnmount() {
        this._stopAutoPlay();
    }

    _onPageScroll(params) {
        // console.log('params',params)
        if (this.state.position == this.props.pageEnd && params.position == this.props.pageEnd && this.props.loop && params.offset == 0) {
            // this.setPageWithoutAnimation(0);
            this._goToNextPage();
            params.position = 0;
            params.offset = 0;
            // this._stopAutoPlay();
        }
        if (params.position === 0 && !isIOS && params.offset === 0) {
            this.state.listPosition.push({ position: 0 });
        }

        if ((this.state.position === -1 && params.position == 0 && this.props.loop)) {
            // this.setPage(this.props.pageEnd);
            // this.setPageWithoutAnimation(this.props.pageEnd);
            this._goToBackPage();


            // params.position = this.props.pageEnd;
            // params.offset = 0;
            // this._stopAutoPlay();
        }
        // console.log('params', params);
        this.state.position = params.position;

        this.state.offset = params.offset;

        if (this.state.offset !== 0) {
            this._stopAutoPlay();
        } else if (this.props.autoPlayEnable) {
            this._startAutoPlay();
        }

        const indicator = this.refs[INDICATOR_REF];
        indicator && indicator.onPageScroll && indicator.onPageScroll(params);
        this.props.onPageScroll && this.props.onPageScroll(params);
    }
    _onPageSelected(params) {
        const indicator = this.refs[INDICATOR_REF];
        indicator && indicator.onPageSelected && indicator.onPageSelected(params);
        this.props.onPageSelected && this.props.onPageSelected(params);
        this._currentIndex = params.position;
    }
    _renderIndicator() {
        const { indicator, initialPage } = this.props;
        if (!indicator) return null;
        return React.cloneElement(indicator, {
            ref: INDICATOR_REF,
            pager: this,
            initialPage
        });
    }

    _goToNextPage() {
        const { stopEnd } = this.props;
        const check = this._currentIndex + 1;
        // console.log('check', check);

        if (!stopEnd && this._childrenCount === check) {
            this.setPage(0);
        } else if (stopEnd && this._childrenCount === check) {
        
        } else {
            const nextIndex = (this._currentIndex + 1) % this._childrenCount;
            this.setPage(nextIndex);
        }
    }
    _goToBackPage() {
        // alert(`this._childrenCount${this._childrenCount}`)

        const { stopEnd } = this.props;
        const check = this._currentIndex - 1;
        // alert(this._currentIndex);


        if (!stopEnd && this._currentIndex === 0) {
            this.setPage(this.props.pageEnd);
        } else {
            const nextIndex = (this._currentIndex - 1) % this._childrenCount;
            this.setPage(nextIndex);
        }
    }

    _startAutoPlay() {
        if (this._timerId) clearInterval(this._timerId);
        this._timerId = setInterval(this._goToNextPage, this.props.autoPlayInterval);
    }

    _stopAutoPlay() {
        if (this._timerId) {
            clearInterval(this._timerId);
            this._timerId = null;
        }
    }

    setPage(selectedPage) {
        this.refs[VIEWPAGER_REF].setPage(selectedPage);
    }

    setPageWithoutAnimation(selectedPage) {
        this.refs[VIEWPAGER_REF].setPageWithoutAnimation(selectedPage);
    }
}

const styles = StyleSheet.create({
    container: {},
    pager: { flex: 1 }
});
