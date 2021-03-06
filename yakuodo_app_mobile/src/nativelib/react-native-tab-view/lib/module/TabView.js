import _extends from"@babel/runtime/helpers/extends";
import _objectSpread from"@babel/runtime/helpers/objectSpread";
import _classCallCheck from"@babel/runtime/helpers/classCallCheck";
import _createClass from"@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from"@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from"@babel/runtime/helpers/getPrototypeOf";
import _inherits from"@babel/runtime/helpers/inherits";
var _jsxFileName="/Users/satya/Workspace/Projects/react-native-tab-view/src/TabView.tsx";
import*as React from'react';
import {
    StyleSheet,
    View
}

from'react-native';
import Animated from'react-native-reanimated';
import TabBar from'./TabBar';
import Pager from'./Pager';
import SceneView from'./SceneView';
var TabView=function(_React$Component) {
    _inherits(TabView, _React$Component);
    function TabView() {
        var _getPrototypeOf2;
        var _this;
        _classCallCheck(this, TabView);
        for(var _len=arguments.length, args=new Array(_len), _key=0;
        _key<_len;
        _key++) {
            args[_key]=arguments[_key];
        }
        _this=_possibleConstructorReturn(this, (_getPrototypeOf2=_getPrototypeOf(TabView)).call.apply(_getPrototypeOf2, [this].concat(args)));
        _this.state= {
            layout:_objectSpread( {
                width: 0, height: 0
            }
            , _this.props.initialLayout)
        }
        ;
        _this.jumpToIndex=function(index) {
            if(index!==_this.props.navigationState.index) {
                _this.props.onIndexChange(index);
            }
        }
        ;
        _this.handleLayout=function(e) {
            var _e$nativeEvent$layout=e.nativeEvent.layout,
            height=_e$nativeEvent$layout.height,
            width=_e$nativeEvent$layout.width;
            if(_this.state.layout.width===width&&_this.state.layout.height===height) {
                return;
            }
            _this.setState( {
                layout: {
                    height: height, width: width
                }
            }
            );
        }
        ;
        return _this;
    }
    _createClass(TabView, [ {
        key:"render", value:function render() {
            var _this$props=this.props, positionListener=_this$props.position, onSwipeStart=_this$props.onSwipeStart, onSwipeEnd=_this$props.onSwipeEnd, navigationState=_this$props.navigationState, lazy=_this$props.lazy, lazyPreloadDistance=_this$props.lazyPreloadDistance, removeClippedSubviews=_this$props.removeClippedSubviews, keyboardDismissMode=_this$props.keyboardDismissMode, swipeEnabled=_this$props.swipeEnabled, swipeDistanceThreshold=_this$props.swipeDistanceThreshold, swipeVelocityThreshold=_this$props.swipeVelocityThreshold, timingConfig=_this$props.timingConfig, springConfig=_this$props.springConfig, tabBarPosition=_this$props.tabBarPosition, renderTabBar=_this$props.renderTabBar, renderScene=_this$props.renderScene, renderLazyPlaceholder=_this$props.renderLazyPlaceholder, sceneContainerStyle=_this$props.sceneContainerStyle, style=_this$props.style, gestureHandlerProps=_this$props.gestureHandlerProps;
            var layout=this.state.layout;
            return React.createElement(View, {
                onLayout:this.handleLayout, style:[styles.pager, style], __source: {
                    fileName: _jsxFileName, lineNumber: 125
                }
            }
            , React.createElement(Pager, {
                navigationState:navigationState, layout:layout, keyboardDismissMode:keyboardDismissMode, swipeEnabled:swipeEnabled, swipeDistanceThreshold:swipeDistanceThreshold, swipeVelocityThreshold:swipeVelocityThreshold, timingConfig:timingConfig, springConfig:springConfig, onSwipeStart:onSwipeStart, onSwipeEnd:onSwipeEnd, onIndexChange:this.jumpToIndex, removeClippedSubviews:removeClippedSubviews, gestureHandlerProps:gestureHandlerProps, __source: {
                    fileName: _jsxFileName, lineNumber: 126
                }
            }
            , function(_ref) {
                var position=_ref.position, render=_ref.render, addListener=_ref.addListener, removeListener=_ref.removeListener, jumpTo=_ref.jumpTo;
                var sceneRendererProps= {
                    position: position, layout: layout, jumpTo: jumpTo
                }
                ;
                return React.createElement(React.Fragment, {
                    __source: {
                        fileName: _jsxFileName, lineNumber: 151
                    }
                }
                , positionListener?React.createElement(Animated.Code, {
                    exec:Animated.set(positionListener, position), __source: {
                        fileName: _jsxFileName, lineNumber: 153
                    }
                }
                ):null, 
                tabBarPosition==='top'&&renderTabBar(_objectSpread( {}
                , sceneRendererProps, {
                    navigationState: navigationState
                }
                )),
                 render(navigationState.routes.map(function(route, i) {
                    return React.createElement(SceneView, _extends( {}
                    , sceneRendererProps, {
                        addListener:addListener, removeListener:removeListener, key:route.key, index:i, lazy:lazy, lazyPreloadDistance:lazyPreloadDistance, navigationState:navigationState, style:sceneContainerStyle, __source: {
                            fileName: _jsxFileName, lineNumber: 165
                        }
                    }
                    ), function(_ref2) {
                        var loading=_ref2.loading;
                        return loading?renderLazyPlaceholder( {
                            route: route
                        }
                        ):renderScene(_objectSpread( {}
                        , sceneRendererProps, {
                            route: route
                        }
                        ));
                    }
                    );
                }
                )), tabBarPosition==='bottom'&&renderTabBar(_objectSpread( {}
                , sceneRendererProps, {
                    navigationState: navigationState
                }
                )));
            }
            ));
        }
    }
    ]);
    return TabView;
}

(React.Component);
TabView.defaultProps= {
    tabBarPosition:'top',
    renderTabBar:function renderTabBar(props) {
        return React.createElement(TabBar, _extends( {}
        , props, {
            __source: {
                fileName: _jsxFileName, lineNumber: 58
            }
        }
        ));
    }
    ,
    renderLazyPlaceholder:function renderLazyPlaceholder() {
        return null;
    }
    ,
    keyboardDismissMode:'on-drag',
    swipeEnabled:true,
    lazy:false,
    lazyPreloadDistance:0,
    removeClippedSubviews:false,
    springConfig: {}
    ,
    timingConfig: {}
    ,
    gestureHandlerProps: {}
}

;
export {
    TabView as default
}

;
var styles=StyleSheet.create( {
    pager: {
        flex: 1, overflow: 'hidden'
    }
}

);