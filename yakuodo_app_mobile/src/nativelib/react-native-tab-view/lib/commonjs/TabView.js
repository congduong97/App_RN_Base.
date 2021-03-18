var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");var _interopRequireWildcard=require("@babel/runtime/helpers/interopRequireWildcard");Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _extends2=_interopRequireDefault(require("@babel/runtime/helpers/extends"));var _objectSpread2=_interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));var _classCallCheck2=_interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));var _createClass2=_interopRequireDefault(require("@babel/runtime/helpers/createClass"));var _possibleConstructorReturn2=_interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));var _getPrototypeOf3=_interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));var _inherits2=_interopRequireDefault(require("@babel/runtime/helpers/inherits"));var React=_interopRequireWildcard(require("react"));var _reactNative=require("react-native");var _reactNativeReanimated=_interopRequireDefault(require("react-native-reanimated"));var _TabBar=_interopRequireDefault(require("./TabBar"));var _Pager=_interopRequireDefault(require("./Pager"));var _SceneView=_interopRequireDefault(require("./SceneView"));var _jsxFileName="/Users/satya/Workspace/Projects/react-native-tab-view/src/TabView.tsx";var TabView=function(_React$Component){(0,_inherits2.default)(TabView,_React$Component);function TabView(){var _getPrototypeOf2;var _this;(0,_classCallCheck2.default)(this,TabView);for(var _len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key];}_this=(0,_possibleConstructorReturn2.default)(this,(_getPrototypeOf2=(0,_getPrototypeOf3.default)(TabView)).call.apply(_getPrototypeOf2,[this].concat(args)));_this.state={layout:(0,_objectSpread2.default)({width:0,height:0},_this.props.initialLayout)};_this.jumpToIndex=function(index){if(index!==_this.props.navigationState.index){_this.props.onIndexChange(index);}};_this.handleLayout=function(e){var _e$nativeEvent$layout=e.nativeEvent.layout,height=_e$nativeEvent$layout.height,width=_e$nativeEvent$layout.width;if(_this.state.layout.width===width&&_this.state.layout.height===height){return;}_this.setState({layout:{height:height,width:width}});};return _this;}(0,_createClass2.default)(TabView,[{key:"render",value:function render(){var _this$props=this.props,positionListener=_this$props.position,onSwipeStart=_this$props.onSwipeStart,onSwipeEnd=_this$props.onSwipeEnd,navigationState=_this$props.navigationState,lazy=_this$props.lazy,lazyPreloadDistance=_this$props.lazyPreloadDistance,removeClippedSubviews=_this$props.removeClippedSubviews,keyboardDismissMode=_this$props.keyboardDismissMode,swipeEnabled=_this$props.swipeEnabled,swipeDistanceThreshold=_this$props.swipeDistanceThreshold,swipeVelocityThreshold=_this$props.swipeVelocityThreshold,timingConfig=_this$props.timingConfig,springConfig=_this$props.springConfig,tabBarPosition=_this$props.tabBarPosition,renderTabBar=_this$props.renderTabBar,renderScene=_this$props.renderScene,renderLazyPlaceholder=_this$props.renderLazyPlaceholder,sceneContainerStyle=_this$props.sceneContainerStyle,style=_this$props.style,gestureHandlerProps=_this$props.gestureHandlerProps;var layout=this.state.layout;return React.createElement(_reactNative.View,{onLayout:this.handleLayout,style:[styles.pager,style],__source:{fileName:_jsxFileName,lineNumber:125}},React.createElement(_Pager.default,{navigationState:navigationState,layout:layout,keyboardDismissMode:keyboardDismissMode,swipeEnabled:swipeEnabled,swipeDistanceThreshold:swipeDistanceThreshold,swipeVelocityThreshold:swipeVelocityThreshold,timingConfig:timingConfig,springConfig:springConfig,onSwipeStart:onSwipeStart,onSwipeEnd:onSwipeEnd,onIndexChange:this.jumpToIndex,removeClippedSubviews:removeClippedSubviews,gestureHandlerProps:gestureHandlerProps,__source:{fileName:_jsxFileName,lineNumber:126}},function(_ref){var position=_ref.position,render=_ref.render,addListener=_ref.addListener,removeListener=_ref.removeListener,jumpTo=_ref.jumpTo;var sceneRendererProps={position:position,layout:layout,jumpTo:jumpTo};return React.createElement(React.Fragment,{__source:{fileName:_jsxFileName,lineNumber:151}},positionListener?React.createElement(_reactNativeReanimated.default.Code,{exec:_reactNativeReanimated.default.set(positionListener,position),__source:{fileName:_jsxFileName,lineNumber:153}}):null,tabBarPosition==='top'&&renderTabBar((0,_objectSpread2.default)({},sceneRendererProps,{navigationState:navigationState})),render(navigationState.routes.map(function(route,i){return React.createElement(_SceneView.default,(0,_extends2.default)({},sceneRendererProps,{addListener:addListener,removeListener:removeListener,key:route.key,index:i,lazy:lazy,lazyPreloadDistance:lazyPreloadDistance,navigationState:navigationState,style:sceneContainerStyle,__source:{fileName:_jsxFileName,lineNumber:165}}),function(_ref2){var loading=_ref2.loading;return loading?renderLazyPlaceholder({route:route}):renderScene((0,_objectSpread2.default)({},sceneRendererProps,{route:route}));});})),tabBarPosition==='bottom'&&renderTabBar((0,_objectSpread2.default)({},sceneRendererProps,{navigationState:navigationState})));}));}}]);return TabView;}(React.Component);exports.default=TabView;TabView.defaultProps={tabBarPosition:'top',renderTabBar:function renderTabBar(props){return React.createElement(_TabBar.default,(0,_extends2.default)({},props,{__source:{fileName:_jsxFileName,lineNumber:58}}));},renderLazyPlaceholder:function renderLazyPlaceholder(){return null;},keyboardDismissMode:'on-drag',swipeEnabled:true,lazy:false,lazyPreloadDistance:0,removeClippedSubviews:false,springConfig:{},timingConfig:{},gestureHandlerProps:{}};var styles=_reactNative.StyleSheet.create({pager:{flex:1,overflow:'hidden'}});
//# sourceMappingURL=TabView.js.map