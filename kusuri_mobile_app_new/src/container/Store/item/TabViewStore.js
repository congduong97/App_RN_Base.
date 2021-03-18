import React, { PureComponent } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import { COLOR_WHITE, APP_COLOR, COLOR_RED } from "../../../const/Color";
import { STRING } from "../until/string";
import { DEVICE_WIDTH } from "../../../const/System";
import BookmarkScreen from "../screen/BookmarkScreen";
import SearchStoreScreen from "../screen/SearchStoreScreen";

export default class TabViewStore extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      index: this.props.initIndex ? 1 : 0,
      routes: [
        { key: "first", title: STRING.titleSearch },
        { key: "second", title: STRING.titleBookmark },
      ],
      clickUse: false,
    };
  }
  componentDidMount() {
    const { onRef } = this.props;
    onRef && onRef(this);
  }

  reloadScreenMaintain = () => {
    const { index } = this.state;
    if (index == 0) {
      this.SearchStore.checkHasCatalog();
    } else {
      this.bookmark.getListStoreBookmarked();
    }
  };

  renderSearch = () => {
    const { navigation } = this.props;
    return (
      <SearchStoreScreen
        onRef={(ref) => {
          this.SearchStore = ref;
        }}
        navigation={navigation}
      />
    );
  };

  rederBookMark = () => {
    const { navigation } = this.props;
    return (
      <BookmarkScreen
        navigation={navigation}
        onRef={(ref) => {
          this.bookmark = ref;
        }}
      />
    );
  };
  getcheckTab = (index) => {
    const { clickUse } = this.state;
    if (index === 1 && !clickUse) {
      if (this.bookmark && this.bookmark.getListStoreBookmarked) {
        this.bookmark.getListStoreBookmarked();
      }
    }
    this.setState({ index });
  };

  render() {
    return (
      <TabView
        lazy={true}
        renderTabBar={(props) => (
          <TabBar
            scrollEnabled
            {...props}
            renderLabel={({ route, focused }) => (
              <View
                style={[
                  styles.labelStyle,
                  {
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: focused
                      ? APP_COLOR.COLOR_TEXT_TAB_BAR_UN_ACTIVE
                      : COLOR_WHITE,
                    borderTopWidth: 1,
                    borderColor: APP_COLOR.COLOR_TEXT_TAB_BAR_UN_ACTIVE,
                    borderWidth: 1,
                    borderTopStartRadius: 4,
                    borderTopEndRadius: 4,
                  },
                ]}
              >
                <Text
                  style={{
                    color: focused
                      ? COLOR_WHITE
                      : APP_COLOR.COLOR_TEXT_TAB_BAR_UN_ACTIVE,
                  }}
                >
                  {route.title}
                </Text>
              </View>
            )}
            sceneContainerStyle={{ borderBottomWidth: 0 }}
            indicatorStyle={{
              backgroundColor: COLOR_WHITE,
              width: 0,
              height: 0,
            }}
            tabStyle={{
              width: DEVICE_WIDTH / 2,
              height: 45,
              padding: 0,
              borderColor: APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1,
              borderWidth: 0,
            }}
            labelStyle={{
              color: APP_COLOR.COLOR_TEXT,
              fontSize: 14,
              borderWidth: 0,
            }}
            style={[
              styles.container,
              {
                backgroundColor: COLOR_WHITE,
                borderBottomColor: COLOR_RED,
                borderBottomWidth: 1.5,
                borderTopWidth: 0,
                marginTop: 7,
              },
            ]}
          />
        )}
        bounces
        scrollEnabled
        navigationState={this.state}
        renderScene={SceneMap({
          first: this.renderSearch,
          second: this.rederBookMark,
        })}
        onIndexChange={this.getcheckTab}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderTopWidth: 1,
    width: "100%",
    height: 40,
  },
  labelStyle: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 11,
    width: DEVICE_WIDTH / 2 - 10,
    height: "100%",
  },
});
