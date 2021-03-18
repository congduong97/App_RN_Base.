import React, { PureComponent } from 'react';
import {
    TouchableOpacity, View, Text,
} from 'react-native';
import { APP_COLOR, COLOR_GRAY_LIGHT, COLOR_WHITE, COLOR_RED } from '../../const/Color';
import { DEVICE_WIDTH } from '../../const/System';

export class Segment extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            active: this.props.active || 0
        };
    }

    componentDidMount() {
        this.props.onRef(this);
    }
    setActive(active) {
        this.setState({ active: active || 0 });
    }


    render() {
        const renderItem = this.props.data.map((item, index) => {
            const { length } = this.props.data;
            const { active } = this.state;

            const isLeft = (index === 0);
            const isRight = (length === (index + 1));
            return (
                <TouchableOpacity
                    activeOpacity={0.8}
                    key={`${index}`} style={{
                        height: 28,
                        borderBottomRightRadius: isRight ? 4 : 0,
                        borderTopRightRadius: isRight ? 4 : 0,
                        borderBottomLeftRadius: isLeft ? 4 : 0,
                        borderTopLeftRadius: isLeft ? 4 : 0,
                        flex: 1,
                        backgroundColor: active === index ? APP_COLOR.COLOR_BORDER_TAB_BAR_ACTIVE : COLOR_WHITE,
                        borderWidth: active === index ? 0 : 1,
                        borderRightWidth: isRight ? 1 : 0,
                        borderColor: APP_COLOR.COLOR_BORDER_TAB_BAR_UN_ACTIVE,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onPress={() => {
                        if (item.changeScreen) {
                            this.props.onPress(index);
                        } else {
                            this.setState({ active: index });
                            this.props.onPress(index);
                        }
                    }}
                >

                    <Text
                        numberOfLines={1}
                        
                        style={{ 
                            color: this.state.active == index ? APP_COLOR.COLOR_TEXT_TAB_BAR_ACTIVE : APP_COLOR.COLOR_TEXT_TAB_BAR_UN_ACTIVE, 
                            // fontSize: DEVICE_WIDTH / 40,
                            fontSize: DEVICE_WIDTH / 39,
                        }}
                    >{item.title}</Text>


                </TouchableOpacity>
            );
        });
        return (
            <View
                style={{
                    height: 50,
                    backgroundColor: COLOR_WHITE,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    paddingLeft: 20,
                    paddingRight: 20,
                    borderBottomWidth: 1,
                    width: '100%',
                    borderColor: COLOR_GRAY_LIGHT
                }}
            >
                {renderItem}
            </View>
        );
    }
}
