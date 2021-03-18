import React, { PureComponent } from 'react';
import {
    View, Text, StyleSheet, StatusBar, RefreshControl, ScrollView
} from 'react-native';
import {

    COLOR_GRAY_LIGHT,
    COLOR_BROWN,
    COLOR_WHITE,
    COLOR_GRAY,
    COLOR_BLACK,
    APP_COLOR,
} from '../../../const/Color';
import { STRING } from '../util/string';
import {
    DEVICE_WIDTH,
    styleInApp
} from '../../../const/System';
import HeaderIconLeft from '../../../commons/HeaderIconLeft';
import { Api } from '../util/api';
import NetworkError from '../../../commons/NetworkError';
import Loading from '../../../commons/Loading';
import ItemTag from '../item/ItemTag';
import { UseCoupon } from '../item/UseCoupon';
import WebViewComponent from '../../../component/WebViewComponent';
import { AppImage } from '../../../component/AppImage';
import { getNameUse, getTimeFomartDDMMYY } from '../../../util';
import { TextCoupon } from '../item/TextCoupon';
import IconRun from '../../Account/item/IconRun'
import ReloadScreen from '../../../service/ReloadScreen';


export default class CouponDetail extends PureComponent {
    constructor() {
        super();
        this.state = {
            isLoadingRefresh: false,
            isLoading: false,
            networkError: false,
            display: false,
            time: '',
            use: '',
            title: '',
            urlImage: '',
            description: '',
            note: '',
            usageScope: null,
            hasUsageCode: false,
            usageCode: null,
            visibleCode: false,
            shop: '',
            shortDescription: '',
            used: false,


        };
    }

    componentDidMount() {
        this.getApi();
        const {routeName} = this.props.navigation.state
        ReloadScreen.onChange(routeName,()=>{
          // alert('reload')
          this.getApi(true)
        })
    }
    componentWillUnmount(){
        const {routeName} = this.props.navigation.state
        ReloadScreen.unChange(routeName)
    }


    getApi = async (loadRefresh) => {
        if (this.state.isLoading || this.state.isLoadingRefresh) {
            return;
        }
        try {
            const { id, turningId } = this.props.navigation.state.params.item;
            if (loadRefresh) {
                this.setState({ isLoadingRefresh: true });
            } else this.setState({ isLoading: true });
            
            const response = await Api.getCouponDetail(id, turningId);

        

            if (response.code === 200) {
                const { startTime, endTime, tags, usagePolicy, name, imageUrl, longDescription, note, usageScope, hasUsageCode, shortDescription,barCodeUrl,type ,timeReuse} = response.res;
                const { canUse, usageCode, store, used } = response.res;
                this.state.barCodeUrl = barCodeUrl
                this.state.type = type
                this.state.usageCode = usageCode;
                this.state.shortDescription = shortDescription;
                this.state.hasUsageCode = hasUsageCode;
                this.state.time = `${getTimeFomartDDMMYY(startTime)} - ${getTimeFomartDDMMYY(endTime)}`;
                this.state.tag = tags;
                this.state.visibleUseCoupon = !!canUse;
                this.state.use = getNameUse(usagePolicy);
                this.state.title = name;
                this.state.urlImage = imageUrl;
                this.state.description = longDescription;
                this.state.note = note;
                this.state.networkError = false;
                this.state.usageScope = usageScope;
                this.state.used = used;
                this.state.usagePolicy = usagePolicy
                this.state.timeReuse = timeReuse

            } else {
                this.state.networkError = true;
            }
        } catch (err) {

            this.state.networkError = true;
            // console.log(err);
        } finally {
            this.setState({ isLoading: false, isLoadingRefresh: false });
        }
    }

    refreshPage() {
        this.getApi();
    }

    usingQRCodeCouPon = () => {
        this.setState({ visibleCode: true });
        setTimeout(() => {
            this.refs.scrollView.scrollToEnd({ animated: true });
        }, 200);
    }
    upDate = () => {
        const { navigation } = this.props;
        const { type ,barCodeUrl } = this.state;
        const { upDate } = navigation.state.params;
        upDate(true);
        if (type ==1 && barCodeUrl) {
            this.usingQRCodeCouPon();
        }
        this.setState({ used: true });
    }

    renderContent = () => {
        const {
            isLoading, networkError, usageScope, isLoadingRefresh, use,
            urlImage, time, title, note, description, visibleUseCoupon, usageCode, hasUsageCode, visibleCode, shop, shortDescription,type,barCodeUrl,usagePolicy,timeReuse,used
        } = this.state;
        const { navigation } = this.props;
        const { history } = navigation.state.params;
        if (isLoading) {
            return (<Loading />);
        }
        if (networkError) {
            return (
                <NetworkError
                    onPress={() => this.getApi()}
                />
            );
        }
        return (
            <View style={{ backgroundColor: APP_COLOR.BACKGROUND_COLOR, flex: 1 }}>
                <ScrollView
                    ref="scrollView"
                    style={[styles.wrapperBody,
                         { marginBottom: history ? 0 : 72 }
                        ]}
                    refreshControl={
                        <RefreshControl
                            refreshing={isLoadingRefresh}
                            onRefresh={
                                () => this.getApi(true)
                            }
                        />
                    }
                >
                    <View style={styles.wrapperImageFeature}>
                        <AppImage
                            useZoom
                            style={styles.imageFeature}
                            url={urlImage}
                            resizeMode={'cover'}
                        />
                    </View>
                    <View style={{ padding: 16, paddingBottom: 0 }}>
                    
                        <Text style={[styleInApp.titleDetail, { color: COLOR_GRAY, marginBottom: 5 }]}>
                            {title}
                        </Text>
                        <TextCoupon nameIcon={'md-time'} name={STRING.time} data={time} />
                        {/* <TextCoupon nameIcon={'md-checkmark-circle-outline'} name={STRING.use} data={use} /> */}
                        {shop !== '' ?
                            <TextCoupon nameIcon={'md-brush'} name={STRING.shop} data={shop} /> : null
                        }
                        <Text style={[styleInApp.shortDescription, { marginTop: 0 }]}>{shortDescription}</Text>
                    </View>
                    <View style={{ padding: 16, borderTopWidth: 2, borderColor: COLOR_GRAY_LIGHT }}>
                    <WebViewComponent html={description} navigation={navigation} />



                        {visibleCode && type==1 && barCodeUrl || (usagePolicy =="COUNTLESS_TIME" && timeReuse==0 && used == true) ?
                            <View style={{justifyContent:'center',alignItems:'center'}}>
                                <IconRun></IconRun>
                                <AppImage
                                    useAutoHight
                                    style={{ width: DEVICE_WIDTH-64, height: DEVICE_WIDTH-64 }} url={barCodeUrl}
                                    resizeMode={'contain'}
                                />
                            </View> : null
                        }
                    </View>
                    <View style={styles.wrapperSpace} />
                </ScrollView>
                {history ? null :
                    <UseCoupon
                        used={used}
                        hasUsageCode={hasUsageCode}
                        upDate={(used) => {
                            this.upDate(used);
                        }}
                        navigation={navigation}
                    />}


            </View>
        );
    }

    render() {
        const { goBack } = this.props.navigation;

        return (
            <View style={[styles.wrapperContainer, { backgroundColor: APP_COLOR.BACKGROUND_COLOR }]}>
                <StatusBar backgroundColor={COLOR_GRAY_LIGHT} barStyle="dark-content" />
                <HeaderIconLeft title={STRING.coupon_detail} goBack={goBack} />
                {
                    this.renderContent()
                }
            </View>
        );
    }
}


const styles = StyleSheet.create({
    wrapperBody: {
        flex: 1,
        // marginBottom: 72
    },
    image: {
        height: 120,
        width: '100%',
    },
    wrapperContainer: {
        flex: 1,

    },
    wrapperCenter: {
        alignItems: 'center',
        justifyContent: 'center'
    },

    wrapperImageFeature: {
        backgroundColor: COLOR_GRAY_LIGHT,
        width: DEVICE_WIDTH,
        height: DEVICE_WIDTH
    },
    imageFeature: {
        width: DEVICE_WIDTH,
        height: DEVICE_WIDTH
    },
    textTitle: {
        fontFamily: 'SegoeUI',
        color: COLOR_BROWN,
        fontSize: 16,
        fontWeight: 'bold'
    },

    textDescription: {
        fontFamily: 'SegoeUI',
        color: COLOR_GRAY,
        fontSize: 13,

    },

    textTitleDetail: {
        color: COLOR_BLACK,
        fontSize: 15,
        fontFamily: 'SegoeUI',
    },


});
