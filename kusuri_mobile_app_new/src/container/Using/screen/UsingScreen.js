import React, { PureComponent } from "react";
import { ListUsing } from "../item/ListUsing";
import {
  StyleSheet,
  View,
  StatusBar,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { HeaderIconLeft, NetworkError, Loading } from "../../../commons";
import { Api } from "../util/api";
import { COLOR_GRAY_LIGHT, COLOR_WHITE } from "../../../const/Color";
import { ItemApp } from "../item/ItemApp";
import { ItemImage } from "../item/ItemImage";
import { subMenu } from "../../../const/System";
import ReloadScreen from "../../../service/ReloadScreen";
// import console = require('console');
// import console = require('console');

export default class UsingScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      image: "",
      step: [],
    };
  }
  componentDidMount() {
    this.getApi();
    const { routeName } = this.props.navigation.state;

    ReloadScreen.onChange(routeName, () => {
      // alert('reload')
      this.getApi(true);
    });
  }
  componentWillUnmount() {
    const { routeName } = this.props.navigation.state;

    ReloadScreen.unChange(routeName);
  }

  getApi = async () => {
    this.setState({ loading: true });

    try {
      const step = await Api.getStepUsing();
      // console.log('step', step);

      if (step.code === 200 && step.res.status.code === 1000) {
        this.state.error = false;
        this.state.noData = false;
        this.state.step = step.res.data.stepUsingEntity;
        this.state.image = step.res.data.imageUsingEntity;
        // console.log(' step.res.data.imageUsingEntity', step.res.data.imageUsingEntity.url);
        // alert('step.res.data.imageUsingEntity.url', step.res.data.imageUsingEntity.url);
      } else if (step.code === 200 && step.res.status.code === 4) {
        this.state.noData = true;
        this.state.error = false;
      } else {
        this.state.error = true;
      }
    } catch (e) {
      this.state.error = true;
    } finally {
      this.setState({ loading: false });
    }
  };
  renderContent() {
    const { loading, error, step, image, noData } = this.state;
    if (loading) {
      return <Loading />;
    } else if (error) {
      return <NetworkError onPress={() => this.getApi()} />;
    }
    if (noData) {
      return (
        <NetworkError
          title={"データなし"}
          iconName={"reload"}
          onPress={() => this.getApi()}
        />
      );
    }
    return (
      <ScrollView style={{ flex: 1 }}>
        <ItemApp />
        <ItemImage data={image} title={"check"} />
        <ListUsing navigation={this.props.navigation} data={step} />
      </ScrollView>
    );
  }
  render() {
    const { goBack } = this.props.navigation;
    return (
      <View style={styles.wrapperContainer}>
        <StatusBar backgroundColor={COLOR_GRAY_LIGHT} barStyle='dark-content' />
        <HeaderIconLeft title={subMenu.nameMenuUsing || ""} goBack={goBack} />
        {this.renderContent()}
        <SafeAreaView />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  wrapperContainer: {
    backgroundColor: COLOR_WHITE,
    flex: 1,
  },
});
