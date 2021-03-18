import _extends from"@babel/runtime/helpers/extends";import _objectSpread from"@babel/runtime/helpers/objectSpread";import _slicedToArray from"@babel/runtime/helpers/slicedToArray";import _classCallCheck from"@babel/runtime/helpers/classCallCheck";import _createClass from"@babel/runtime/helpers/createClass";import _possibleConstructorReturn from"@babel/runtime/helpers/possibleConstructorReturn";import _getPrototypeOf from"@babel/runtime/helpers/getPrototypeOf";import _inherits from"@babel/runtime/helpers/inherits";var _jsxFileName="/Users/satya/Workspace/Projects/react-native-tab-view/src/Pager.tsx";import*as React from'react';import{StyleSheet,Keyboard,I18nManager}from'react-native';import{PanGestureHandler,State}from'react-native-gesture-handler';import Animated,{Easing}from'react-native-reanimated';import memoize from'./memoize';var Clock=Animated.Clock,Value=Animated.Value,onChange=Animated.onChange,abs=Animated.abs,add=Animated.add,and=Animated.and,block=Animated.block,call=Animated.call,ceil=Animated.ceil,clockRunning=Animated.clockRunning,cond=Animated.cond,divide=Animated.divide,eq=Animated.eq,event=Animated.event,floor=Animated.floor,greaterThan=Animated.greaterThan,lessThan=Animated.lessThan,max=Animated.max,min=Animated.min,multiply=Animated.multiply,neq=Animated.neq,or=Animated.or,not=Animated.not,round=Animated.round,set=Animated.set,spring=Animated.spring,startClock=Animated.startClock,stopClock=Animated.stopClock,sub=Animated.sub,timing=Animated.timing;var TRUE=1;var FALSE=0;var NOOP=0;var UNSET=-1;var DIRECTION_LEFT=1;var DIRECTION_RIGHT=-1;var SWIPE_DISTANCE_MINIMUM=20;var SWIPE_DISTANCE_MULTIPLIER=1/1.75;var SWIPE_VELOCITY_THRESHOLD_DEFAULT=800;var SPRING_CONFIG={stiffness:1000,damping:500,mass:3,overshootClamping:true,restDisplacementThreshold:0.01,restSpeedThreshold:0.01};var TIMING_CONFIG={duration:200,easing:Easing.out(Easing.cubic)};var Pager=function(_React$Component){_inherits(Pager,_React$Component);function Pager(){var _getPrototypeOf2;var _this;_classCallCheck(this,Pager);for(var _len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key];}_this=_possibleConstructorReturn(this,(_getPrototypeOf2=_getPrototypeOf(Pager)).call.apply(_getPrototypeOf2,[this].concat(args)));_this.clock=new Clock();_this.velocityX=new Value(0);_this.gestureX=new Value(0);_this.gestureState=new Value(State.UNDETERMINED);_this.offsetX=new Value(0);_this.progress=new Value(_this.props.navigationState.index*_this.props.layout.width*DIRECTION_RIGHT);_this.index=new Value(_this.props.navigationState.index);_this.nextIndex=new Value(UNSET);_this.lastEnteredIndex=new Value(_this.props.navigationState.index);_this.isSwiping=new Value(FALSE);_this.isSwipeGesture=new Value(FALSE);_this.routesLength=new Value(_this.props.navigationState.routes.length);_this.layoutWidth=new Value(_this.props.layout.width);_this.swipeDistanceThreshold=new Value(_this.props.swipeDistanceThreshold||180);_this.swipeVelocityThreshold=new Value(_this.props.swipeVelocityThreshold);_this.position=cond(_this.layoutWidth,divide(multiply(_this.progress,-1),_this.layoutWidth),_this.index);_this.springConfig={damping:new Value(_this.props.springConfig.damping!==undefined?_this.props.springConfig.damping:SPRING_CONFIG.damping),mass:new Value(_this.props.springConfig.mass!==undefined?_this.props.springConfig.mass:SPRING_CONFIG.mass),stiffness:new Value(_this.props.springConfig.stiffness!==undefined?_this.props.springConfig.stiffness:SPRING_CONFIG.stiffness),restSpeedThreshold:new Value(_this.props.springConfig.restSpeedThreshold!==undefined?_this.props.springConfig.restSpeedThreshold:SPRING_CONFIG.restSpeedThreshold),restDisplacementThreshold:new Value(_this.props.springConfig.restDisplacementThreshold!==undefined?_this.props.springConfig.restDisplacementThreshold:SPRING_CONFIG.restDisplacementThreshold)};_this.timingConfig={duration:new Value(_this.props.timingConfig.duration!==undefined?_this.props.timingConfig.duration:TIMING_CONFIG.duration)};_this.initialVelocityForSpring=new Value(0);_this.currentIndexValue=_this.props.navigationState.index;_this.pendingIndexValue=undefined;_this.enterListeners=[];_this.jumpToIndex=function(index){_this.isSwipeGesture.setValue(FALSE);_this.nextIndex.setValue(index);};_this.jumpTo=function(key){var navigationState=_this.props.navigationState;var index=navigationState.routes.findIndex(function(route){return route.key===key;});if(navigationState.index===index){_this.jumpToIndex(index);}else{_this.props.onIndexChange(index);}};_this.addListener=function(type,listener){switch(type){case'enter':_this.enterListeners.push(listener);break;}};_this.removeListener=function(type,listener){switch(type){case'enter':{var _index=_this.enterListeners.indexOf(listener);if(_index>-1){_this.enterListeners.splice(_index,1);}break;}}};_this.handleEnteredIndexChange=function(_ref){var _ref2=_slicedToArray(_ref,1),value=_ref2[0];var index=Math.max(0,Math.min(value,_this.props.navigationState.routes.length-1));_this.enterListeners.forEach(function(listener){return listener(index);});};_this.transitionTo=function(index){var toValue=new Value(0);var frameTime=new Value(0);var state={position:_this.progress,time:new Value(0),finished:new Value(FALSE)};return block([cond(clockRunning(_this.clock),NOOP,[set(toValue,multiply(index,_this.layoutWidth,DIRECTION_RIGHT)),set(frameTime,0),set(state.time,0),set(state.finished,FALSE),set(_this.index,index),startClock(_this.clock)]),cond(_this.isSwipeGesture,[cond(not(clockRunning(_this.clock)),I18nManager.isRTL?set(_this.initialVelocityForSpring,multiply(-1,_this.velocityX)):set(_this.initialVelocityForSpring,_this.velocityX)),spring(_this.clock,_objectSpread({},state,{velocity:_this.initialVelocityForSpring}),_objectSpread({},SPRING_CONFIG,_this.springConfig,{toValue:toValue}))],timing(_this.clock,_objectSpread({},state,{frameTime:frameTime}),_objectSpread({},TIMING_CONFIG,_this.timingConfig,{toValue:toValue}))),cond(state.finished,[set(_this.isSwipeGesture,FALSE),set(_this.gestureX,0),set(_this.velocityX,0),stopClock(_this.clock)])]);};_this.handleGestureEvent=event([{nativeEvent:{translationX:_this.gestureX,velocityX:_this.velocityX,state:_this.gestureState}}]);_this.translateX=block([onChange(_this.index,call([_this.index],function(_ref3){var _ref4=_slicedToArray(_ref3,1),value=_ref4[0];_this.currentIndexValue=value;if(value!==_this.props.navigationState.index){_this.props.onIndexChange(value);_this.pendingIndexValue=value;_this.forceUpdate();}})),onChange(_this.position,cond(I18nManager.isRTL?lessThan(_this.gestureX,0):greaterThan(_this.gestureX,0),cond(neq(floor(_this.position),_this.lastEnteredIndex),[set(_this.lastEnteredIndex,floor(_this.position)),call([floor(_this.position)],_this.handleEnteredIndexChange)]),cond(neq(ceil(_this.position),_this.lastEnteredIndex),[set(_this.lastEnteredIndex,ceil(_this.position)),call([ceil(_this.position)],_this.handleEnteredIndexChange)]))),onChange(_this.isSwiping,call([_this.isSwiping],function(_ref5){var _ref6=_slicedToArray(_ref5,1),value=_ref6[0];var _this$props=_this.props,keyboardDismissMode=_this$props.keyboardDismissMode,onSwipeStart=_this$props.onSwipeStart,onSwipeEnd=_this$props.onSwipeEnd;if(value===TRUE){onSwipeStart&&onSwipeStart();if(keyboardDismissMode==='on-drag'){Keyboard.dismiss();}}else{onSwipeEnd&&onSwipeEnd();}})),onChange(_this.nextIndex,cond(neq(_this.nextIndex,UNSET),[cond(clockRunning(_this.clock),stopClock(_this.clock)),set(_this.gestureX,0),set(_this.index,_this.nextIndex),set(_this.nextIndex,UNSET)])),cond(eq(_this.gestureState,State.ACTIVE),[cond(_this.isSwiping,NOOP,[set(_this.isSwiping,TRUE),set(_this.isSwipeGesture,TRUE),set(_this.offsetX,_this.progress)]),set(_this.progress,I18nManager.isRTL?sub(_this.offsetX,_this.gestureX):add(_this.offsetX,_this.gestureX)),stopClock(_this.clock)],[set(_this.isSwiping,FALSE),_this.transitionTo(cond(and(greaterThan(abs(_this.gestureX),SWIPE_DISTANCE_MINIMUM),or(greaterThan(abs(_this.gestureX),_this.swipeDistanceThreshold),greaterThan(abs(_this.velocityX),_this.swipeVelocityThreshold))),round(min(max(0,sub(_this.index,cond(greaterThan(abs(_this.gestureX),_this.swipeDistanceThreshold),cond(greaterThan(_this.gestureX,0),I18nManager.isRTL?DIRECTION_RIGHT:DIRECTION_LEFT,I18nManager.isRTL?DIRECTION_LEFT:DIRECTION_RIGHT),cond(greaterThan(_this.velocityX,0),I18nManager.isRTL?DIRECTION_RIGHT:DIRECTION_LEFT,I18nManager.isRTL?DIRECTION_LEFT:DIRECTION_RIGHT)))),sub(_this.routesLength,1))),_this.index))]),_this.progress]);_this.getTranslateX=memoize(function(layoutWidth,routesLength,translateX){return multiply(min(max(multiply(layoutWidth,sub(routesLength,1),DIRECTION_RIGHT),translateX),0),I18nManager.isRTL?-1:1);});return _this;}_createClass(Pager,[{key:"componentDidUpdate",value:function componentDidUpdate(prevProps){var _this$props2=this.props,navigationState=_this$props2.navigationState,layout=_this$props2.layout,swipeDistanceThreshold=_this$props2.swipeDistanceThreshold,swipeVelocityThreshold=_this$props2.swipeVelocityThreshold,springConfig=_this$props2.springConfig,timingConfig=_this$props2.timingConfig;var index=navigationState.index,routes=navigationState.routes;if(index!==prevProps.navigationState.index&&index!==this.currentIndexValue||typeof this.pendingIndexValue==='number'&&index!==this.pendingIndexValue){this.jumpToIndex(index);}this.pendingIndexValue=undefined;if(prevProps.navigationState.routes.length!==routes.length){this.routesLength.setValue(routes.length);}if(prevProps.layout.width!==layout.width){this.progress.setValue(-index*layout.width);this.layoutWidth.setValue(layout.width);}if(swipeDistanceThreshold!=null){if(prevProps.swipeDistanceThreshold!==swipeDistanceThreshold){this.swipeDistanceThreshold.setValue(swipeDistanceThreshold);}}else{if(prevProps.layout.width!==layout.width){this.swipeDistanceThreshold.setValue(layout.width*SWIPE_DISTANCE_MULTIPLIER);}}if(prevProps.swipeVelocityThreshold!==swipeVelocityThreshold){this.swipeVelocityThreshold.setValue(swipeVelocityThreshold!=null?swipeVelocityThreshold:SWIPE_VELOCITY_THRESHOLD_DEFAULT);}if(prevProps.springConfig!==springConfig){this.springConfig.damping.setValue(springConfig.damping!==undefined?springConfig.damping:SPRING_CONFIG.damping);this.springConfig.mass.setValue(springConfig.mass!==undefined?springConfig.mass:SPRING_CONFIG.mass);this.springConfig.stiffness.setValue(springConfig.stiffness!==undefined?springConfig.stiffness:SPRING_CONFIG.stiffness);this.springConfig.restSpeedThreshold.setValue(springConfig.restSpeedThreshold!==undefined?springConfig.restSpeedThreshold:SPRING_CONFIG.restSpeedThreshold);this.springConfig.restDisplacementThreshold.setValue(springConfig.restDisplacementThreshold!==undefined?springConfig.restDisplacementThreshold:SPRING_CONFIG.restDisplacementThreshold);}if(prevProps.timingConfig!==timingConfig){this.timingConfig.duration.setValue(timingConfig.duration!==undefined?timingConfig.duration:TIMING_CONFIG.duration);}}},{key:"render",value:function render(){var _this2=this;var _this$props3=this.props,layout=_this$props3.layout,navigationState=_this$props3.navigationState,swipeEnabled=_this$props3.swipeEnabled,children=_this$props3.children,removeClippedSubviews=_this$props3.removeClippedSubviews,gestureHandlerProps=_this$props3.gestureHandlerProps;var translateX=this.getTranslateX(this.layoutWidth,this.routesLength,this.translateX);return children({position:this.position,addListener:this.addListener,removeListener:this.removeListener,jumpTo:this.jumpTo,render:function render(children){return React.createElement(PanGestureHandler,_extends({enabled:layout.width!==0&&swipeEnabled,onGestureEvent:_this2.handleGestureEvent,onHandlerStateChange:_this2.handleGestureEvent,activeOffsetX:[-SWIPE_DISTANCE_MINIMUM,SWIPE_DISTANCE_MINIMUM],failOffsetY:[-SWIPE_DISTANCE_MINIMUM,SWIPE_DISTANCE_MINIMUM]},gestureHandlerProps,{__source:{fileName:_jsxFileName,lineNumber:614}}),React.createElement(Animated.View,{removeClippedSubviews:removeClippedSubviews,style:[styles.container,layout.width?{width:layout.width*navigationState.routes.length,transform:[{translateX:translateX}]}:null],__source:{fileName:_jsxFileName,lineNumber:622}},children));}});}}]);return Pager;}(React.Component);Pager.defaultProps={swipeVelocityThreshold:SWIPE_VELOCITY_THRESHOLD_DEFAULT};export{Pager as default};var styles=StyleSheet.create({container:{flex:1,flexDirection:'row'}});
//# sourceMappingURL=Pager.js.map