import React, { PureComponent } from 'react';
import { StyleSheet, View, StatusBar, Text } from 'react-native';
import { HeaderIconLeft, NetworkError, Loading } from '../../commons';
import { COLOR_GRAY_LIGHT, COLOR_WHITE, COLOR_GRAY } from '../../const/Color';
import { ItemQuestion } from './Item/ItemQuestion';
import { tracker } from '../../const/System';
export class QuestionDetail extends PureComponent {
    componentDidMount() {
    }
    render() {
        const { item, index } = this.props.navigation.state.params;

        const { goBack } = this.props.navigation;
        return (
            <View style={styles.wrapperContainer}>
                 <StatusBar backgroundColor={COLOR_GRAY_LIGHT} barStyle="dark-content" />
                <HeaderIconLeft
                    title={'よくある質問'}
                    goBack={goBack}
                />
                <ItemQuestion data={item} detail index={index} />
                <Text style={styles.textDetail}>{item.anwser}</Text>

                
            </View>
        );
    }
}
const styles = StyleSheet.create({
    wrapperContainer: {
        backgroundColor: COLOR_WHITE,
        flex: 1
    },
    textDetail: {
        margin: 16,
        fontSize: 12,
        color: COLOR_GRAY

    }

});
