import React, { PureComponent } from 'react';
import { ListUsing } from './Item/ListUsing';
import { StyleSheet, View, StatusBar, ScrollView, SafeAreaView } from 'react-native';
import { HeaderIconLeft, NetworkError, Loading } from '../../commons';
import { Api } from '../../service';
import { COLOR_GRAY_LIGHT, COLOR_WHITE } from '../../const/Color';
import { ItemApp } from './Item/ItemApp';
import { ItemImage } from './Item/ItemImage';
import { tracker, subMenu } from '../../const/System';
import ReloadScreen from '../../service/ReloadScreen';

export default class UsingScreen extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            image: '',
            step: []

        };
    }
    componentDidMount() {
        this.getApi();
    }
    componentWillUnmount(){
        const { routeName } = this.props.navigation.state
        ReloadScreen.unChange(routeName)

    }

    async getApi() {
        const {loading} = this.state
        if(loading){
            return
        }

        try {
            this.setState({ loading: true });

            const responseImage = Api.getUsingImage();
            
            const responseStepUsing = Api.getStepUsing();
            const image = await responseImage;
            const step = await responseStepUsing;
            if (image.res.status.code == 1000 && image.res.status.code == 1000) {
                this.state.error = false;
                // console.log('step', step);
                // console.log('image', image);

                this.state.image = image.res.data;
                // console.log('image.res.data', image.res.data);
                this.state.step = step.res.data;
            } else {
                this.state.error = true;
            }
        } catch (e) {
            this.state.error = true;
        } finally {
            this.setState({ loading: false });
        }
    }
    renderContent() {
        const { loading, error, step, image } = this.state;
        if (loading) {
            return (
                <Loading />
            );
        } else if (error) {
            return (
                <NetworkError onPress={() => this.getApi()} />

            );
        }
        return (
            <ScrollView style={{ flex: 1 }}>
                <ItemApp />
                <ItemImage data={image} title={'check'} />
                <ListUsing
                    navigation={this.props.navigation}
                    data={step}
                />

            </ScrollView>

        );
    }
    render() {
        const { goBack } = this.props.navigation;
        return (
            <View style={styles.wrapperContainer}>
                <StatusBar backgroundColor={COLOR_GRAY_LIGHT} barStyle="dark-content" />
                <HeaderIconLeft
                    title={subMenu.nameMenuUsing || ''}
                    goBack={goBack}
                />
                {this.renderContent()}
                <SafeAreaView />


            </View>


        );
    }

}
const styles = StyleSheet.create({
    wrapperContainer: {
        backgroundColor: COLOR_WHITE,
        flex: 1
    }

});

