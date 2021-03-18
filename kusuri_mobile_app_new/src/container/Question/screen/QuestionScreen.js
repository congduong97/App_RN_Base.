//Library:
import React, { PureComponent } from "react";
import { StyleSheet, StatusBar, SafeAreaView, View } from "react-native";

//Setup:
import { Api } from "../util/api";
import { COLOR_GRAY_LIGHT, COLOR_WHITE } from "../../../const/Color";

//Component:
import { subMenu } from "../../../const/System";
import { ListQuestion } from "../item/ListQuestion";
import { HeaderIconLeft, NetworkError, Loading } from "../../../commons";
import ReloadScreen from "../../../service/ReloadScreen";
import MaintainView from "../../../commons/MaintainView";

export default class QuestionScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: false,
      maintain: false,
    };
  }

  componentDidMount() {
    this.getApi();
    const { routeName } = this.props.navigation.state;
    ReloadScreen.onChange(routeName, () => {
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
      const resonpe = await Api.getQuesitions();
      if (resonpe.code === 200 && resonpe.res.status.code === 1000) {
        this.state.data = resonpe.res.data;
        this.state.noData = false;
        this.state.error = false;
        this.state.maintain = false;
      } else if (resonpe.code === 200 && resonpe.res.status.code === 4) {
        this.state.error = false;
        this.state.noData = true;
      } else if (resonpe.code == 502) {
        this.state.maintain = true;
        this.state.error = false;
      } else {
        this.state.error = true;
        this.state.maintain = false;
      }
    } catch (e) {
      this.state.maintain = false;
      this.state.error = true;
    } finally {
      this.setState({ loading: false });
    }
  };

  renderContent() {
    const { loading, error, data, noData } = this.state;
    if (loading) {
      return <Loading />;
    }

    if (error) {
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
    return <ListQuestion navigation={this.props.navigation} data={data} />;
  }

  render() {
    const { goBack } = this.props.navigation;
    const { maintain } = this.state;
    if (maintain) {
      return <MaintainView onPress={this.getApi} />;
    }
    return (
      <View style={styles.wrapperContainer}>
        <StatusBar backgroundColor={COLOR_GRAY_LIGHT} barStyle='dark-content' />
        <HeaderIconLeft
          title={subMenu.nameMenuQuestion || ""}
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
    flex: 1,
  },
});
