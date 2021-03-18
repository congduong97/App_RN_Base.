import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { ButtonTypeOne, NetworkError, Loading } from '../../../commons';
import { COLOR_WHITE, COLOR_GRAY } from '../../../const/Color';
import { DEVICE_WIDTH } from '../../../const/System';
import { AppImage } from '../../../component/AppImage';
import { STRING } from '../util/string';
import { Api } from '../util/api';
import { HeaderIconLeft } from '../../../commons';
export default class Recruitment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSuccess: false,
            isLoading: true,
            applied: false,
            err: false
        };
    }
  
    componentDidMount(){
        this.getApi();

    }
    getApi = async () => {
        try {
            const { id } = this.props.navigation.state.params.data;
            const response = await Api.getApplyBanner(id);
            this.state.isLoading = true;
            if (response.code === 200 && response.res.status.code === 1000) {
                this.state.isSuccess = true;
                this.state.err = false;
            } else if (response.code === 200 && response.res.status.code === 1028) {
                this.state.err = false;
                this.state.applied = true;
            } else {
                this.state.err = true;
            }
        } catch (err) {
            this.state.err = true;
        } finally {
            this.setState({
                isLoading: false,
            });
        }
    }

    goTo = () => {
        const { navigation } = this.props;
        navigation.navigate('ApplyCoupon', { data: navigation.state.params.data });
    }
    renderContent = () => {
        const { isLoading, err, applied } = this.state;
        const { data } = this.props.navigation.state.params;
        if (isLoading) return (<Loading />);
        if (err) return (<NetworkError />);
        if (applied) return <View style={styles.textUsedApply}><Text style={styles.textError}>{STRING.userApply}</Text></View>;
        return (
            <View style={{ flex: 1, paddingHorizontal: 15 }}>
                <Text style={styles.textDescription}>{data.description}</Text>
                <AppImage
                    url={data.imageUrl}
                    style={styles.sizeImage} resizeMode={'cover'}
                />
                <ButtonTypeOne style={{ marginTop: 100, fontSize: 15 }} name={STRING.next} onPress={this.goTo} />
            </View>
        );
    }

    render() {
        const { isLoading, err } = this.state;
        // const { data } = this.props.navigation.state.params;
        const { goBack } = this.props.navigation;
        if (isLoading) return (<Loading />);
        if (err) return (<NetworkError onPress={this.getApi} />);
        return (
            <View style={styles.container}>
                <HeaderIconLeft
                    goBack={goBack}
                />
                {this.renderContent()}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR_WHITE,
       
    },
    textDescription: {
        marginVertical: 25,
        lineHeight: 19,
        fontSize: 16,
        color: COLOR_GRAY
    },
    sizeImage: {
        width: DEVICE_WIDTH - 30,
        height: DEVICE_WIDTH / 2 - 10
    },
    textError: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        color: COLOR_GRAY,
        fontSize: 20,
        textAlign: 'center'
    },
    textUsedApply: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    }

});
