import React, {PureComponent} from 'react';
import {SafeAreaView} from 'react-native';
import {Container, Header, Item, Input, Button, Text, Left} from 'native-base';
import {STRING} from '../../../const/String';
import Icon from 'react-native-vector-icons/Ionicons';
import {COLOR_WHITE, APP_COLOR, COLOR_GRAY_LIGHT} from '../../../const/Color';
import {SYSTEAM_VERSION, isIOS} from '../../../const/System';
import ListItemSearchCoupons from '../screen/ListItemSearchCoupons';

import {API} from '../util/api';

export class SearchCoupon extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    };
  }
  addKeySearchCoupon = async text => {
    try {
      const response = await API.addHistoryCoupon(text ? text : '');
      // console.log('responseresponse', response);
    } catch (e) {}
  };

  render() {
    const {goBack} = this.props.navigation;
    const {searchCoupon} = this.props.navigation.state.params;
    const headerPaddingTop = isIOS && SYSTEAM_VERSION < 11 ? 20 : 0;
    return (
      <Container style={{flex: 1, backgroundColor: COLOR_WHITE}}>
        <SafeAreaView>
          <Header
            searchBar
            hasSegment
            rounded
            style={{
              backgroundColor: COLOR_GRAY_LIGHT,
              justifyContent: 'center',
              paddingTop: headerPaddingTop,
            }}>
            <Left style={{flex: 0.1, width: 50}}>
              <Button
                transparent
                onPress={() => {
                  goBack(null);
                }}>
                <Icon
                  name="ios-arrow-back"
                  size={25}
                  color={APP_COLOR.COLOR_TEXT}
                />
              </Button>
            </Left>

            <Item style={{justifyContent: 'center'}}>
              <Icon size={25} style={{paddingLeft: 9}} name="ios-search" />
              <Input
                onSubmitEditing={event => {
                  if (this.state.text) {
                    this.addKeySearchCoupon(this.state.text);
                    searchCoupon(this.state.text);
                    goBack();
                  }
                }}
                autoFocus
                value={this.state.text}
                returnKeyType={'search'}
                onChangeText={text =>
                  this.setState({text: text.replace(/\s+/g, ' ')})
                }
                placeholder={'商品名、クーポン名をご入力'}
              />
            </Item>
            <Button
              style={{
                width: 100,
                flex: 0.2,
                padding: 2,
                paddingLeft: 5,
                paddingRight: 2,
                height: 24,
                marginLeft: 5,
                backgroundColor: APP_COLOR.COLOR_TEXT,
              }}
              onPress={() => {
                if (this.state.text) {
                  // console.log('this.state.text', this.state.text);
                  searchCoupon(this.state.text);
                  this.addKeySearchCoupon(this.state.text);
                  goBack();
                }
              }}>
              <Text style={{fontSize: 10, paddingLeft: 2, paddingRight: 2}}>
                {STRING.search}
              </Text>
            </Button>
          </Header>
        </SafeAreaView>
        <ListItemSearchCoupons
          onPress={item => {
            searchCoupon(item);
            this.addKeySearchCoupon(item);
            goBack();
          }}
        />
      </Container>
    );
  }
}
