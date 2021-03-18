import React, { PureComponent } from 'react';
import { ListQuestion } from './Item/ListQuestion';
import { StyleSheet, View, StatusBar, SafeAreaView, Text } from 'react-native';
import { HeaderIconLeft, NetworkError, Loading } from '../../commons';
import { Api } from '../../service';
import { COLOR_GRAY_LIGHT, COLOR_WHITE } from '../../const/Color';
import { Container } from 'native-base';
import { tracker, subMenu } from '../../const/System';
import ReloadScreen from '../../service/ReloadScreen';

export default class QuestionScreen extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: false,
        };
    }
    componentDidMount() {
        this.getApi();
        const { routeName } = this.props.navigation.state

        ReloadScreen.onChange(routeName, () => {
          this.getApi(true);
        })
    }
    componentWillUnmount(){
        const { routeName } = this.props.navigation.state
        ReloadScreen.unChange(routeName)
        
    }

   
    getApi = async () => {
        const { loading} = this.state
        if(loading){
            return
        }
        this.setState({ loading: true });

        try {
            const resonpe = await Api.getQuesitions();
            // console.log(resonpe);
            if (resonpe.code == 200 && resonpe.res.status.code == 1000) {
                this.state.data = resonpe.res.data;
                this.state.error = false;
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
        const { loading, error, data } = this.state;
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
                <ListQuestion
                navigation={this.props.navigation}
                     data={data}
                />
            );
    }
    render() {
        const { goBack } = this.props.navigation;
        return (
            <Container style={styles.wrapperContainer}>
                <StatusBar backgroundColor={COLOR_GRAY_LIGHT} barStyle="dark-content" />
                <HeaderIconLeft
                    title={subMenu.nameMenuQuestion || ''}
                    goBack={goBack}
                />

                {this.renderContent()}
                <SafeAreaView />


            </Container>


        );
    }

}
const styles = StyleSheet.create({
    wrapperContainer: {
        backgroundColor: COLOR_WHITE,
        flex: 1
        
    }

});
