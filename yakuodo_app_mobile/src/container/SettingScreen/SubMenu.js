import React, { PureComponent } from 'react';
import { COLOR_GREEN } from '../../const/Color';
import { View } from 'react-native';
import { ItemSetting } from './Item/ItemSettIng';

export class SubMenu extends PureComponent {
    get _renderListSubMenu() {
        const renderNotification =
            this.props.data.map((item, i) => (
                    <ItemSetting
                        key={i}
                        name={item.name}
                        colorIcon={COLOR_GREEN}
                        iconUrl={item.iconUrl}
                        onPress={() => {
                            this.props.onPress(item);
                        }}
                    />
                ));
        return (
            <View >
                {renderNotification}
            </View>
        );
    }
    render() {
        return (
            <View>
                {this._renderListSubMenu}
            </View>
        );
    }

}
