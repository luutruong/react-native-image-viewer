var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React from 'react';
import { Animated, Image as RNImage, ActivityIndicator, PanResponder, Dimensions, StyleSheet, View, Text, SafeAreaView, Platform, } from 'react-native';
import { GestureDetector, Gesture, gestureHandlerRootHOC, } from 'react-native-gesture-handler';
var SCREEN_WIDTH = Dimensions.get('window').width;
var SCREEN_HEIGHT = Dimensions.get('window').height;
var ImageComponent = /** @class */ (function (_super) {
    __extends(ImageComponent, _super);
    function ImageComponent(props) {
        var _this = _super.call(this, props) || this;
        _this._scale = new Animated.Value(1);
        _this._lastOffset = { x: 0, y: 0 };
        _this._lastScale = 1;
        _this._isGestureMoved = false;
        _this._getMaximumScale = function () { return 2.5; };
        _this._getMinimumScale = function () { return 1.0; };
        _this._handleImageZoomInOut = function (evt) {
            _this._debug('double tab triggered', '_scaleNum', _this._lastScale, evt, 'ratio', _this._getRatio());
            if (_this._lastScale > _this._getMinimumScale()) {
                _this._translateXY.setOffset({ x: 0, y: 0 });
                _this._setIsZooming(false);
                Animated.parallel([
                    Animated.timing(_this._translateXY, {
                        toValue: { x: 0, y: 0 },
                        useNativeDriver: true,
                        duration: 250,
                    }),
                    Animated.timing(_this._scale, {
                        toValue: 1,
                        useNativeDriver: true,
                        duration: 250,
                    }),
                ]).start();
                _this._lastScale = 1;
                _this._lastOffset = { x: 0, y: 0 };
            }
            else {
                var scale = _this._getRatio() <= _this._getMinimumScale() ? _this._getMaximumScale() : SCREEN_WIDTH / _this.state.width;
                var oldWidth = _this._getRatio() * _this.state.width;
                var oldHeight = _this._getRatio() * _this.state.height;
                var newWidth = scale * oldWidth;
                var newHeight = scale * oldHeight;
                var padding = 50;
                var x_1 = evt.x;
                var y_1 = evt.y;
                var horizontalCenter = (newWidth - SCREEN_WIDTH) / 2;
                var verticalCenter = (newHeight - SCREEN_HEIGHT) / 2;
                if (verticalCenter <= SCREEN_HEIGHT) {
                    if (x_1 >= SCREEN_WIDTH / 2) {
                        x_1 = SCREEN_WIDTH / 2 - x_1 - padding * scale;
                        if (Math.abs(x_1) >= horizontalCenter) {
                            x_1 = -1 * horizontalCenter;
                        }
                    }
                    else {
                        x_1 = SCREEN_WIDTH / 2 - x_1 + padding * scale;
                        if (Math.abs(x_1) >= horizontalCenter) {
                            x_1 = horizontalCenter;
                        }
                    }
                    y_1 = 0;
                }
                else {
                    x_1 = 0;
                    if (y_1 >= SCREEN_HEIGHT / 2) {
                        // touched bottom
                        y_1 = SCREEN_HEIGHT / 2 - y_1 + padding * scale;
                    }
                    else {
                        y_1 = SCREEN_HEIGHT / 2 - y_1 - padding * scale;
                    }
                }
                Animated.parallel([
                    Animated.timing(_this._translateXY, {
                        toValue: { x: x_1, y: y_1 },
                        duration: 250,
                        useNativeDriver: true,
                    }),
                    Animated.timing(_this._scale, {
                        toValue: scale,
                        useNativeDriver: true,
                        duration: 250,
                    }),
                ]).start(function () {
                    _this._lastOffset = { x: x_1, y: y_1 };
                });
                _this._lastScale = scale;
                _this._setIsZooming(true);
            }
        };
        _this._getRatio = function () {
            return _this.state.width
                ? _this.state.width >= SCREEN_WIDTH
                    ? SCREEN_WIDTH / _this.state.width
                    : _this.state.width / SCREEN_WIDTH
                : 0;
        };
        _this._computeMoveBounds = function () {
            var ratio = _this._getRatio();
            if (_this._lastScale <= 1 || ratio === 0) {
                return { x: 0, y: 0 };
            }
            var imageWidth = _this.state.width * ratio * _this._lastScale;
            var imageHeight = _this.state.height * ratio * _this._lastScale;
            var bounds = function (width, maxWidth) { return (width >= maxWidth ? (width - maxWidth) / 2 : 0); };
            return { x: bounds(imageWidth, SCREEN_WIDTH), y: bounds(imageHeight, SCREEN_HEIGHT) };
        };
        _this._onImageLoadEnd = function () { return _this.setState({ loading: false }); };
        _this._onPinchEnd = function (evt) {
            _this._debug('_onPinchEnd', evt);
            var scale = evt.scale;
            if (scale < _this._getMinimumScale()) {
                scale = _this._getMinimumScale();
                _this._setIsZooming(false);
            }
            else {
                scale = Math.min(_this._getMaximumScale(), scale);
                _this._setIsZooming(true);
            }
            _this._lastScale = scale;
            _this._translateXY.setOffset({ x: 0, y: 0 });
            _this._lastOffset = { x: 0, y: 0 };
            Animated.parallel([
                Animated.timing(_this._scale, {
                    toValue: scale,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(_this._translateXY, {
                    toValue: { x: 0, y: 0 },
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start();
        };
        _this._onPinchUpdate = function (evt) {
            var scale = _this._lastScale * evt.scale;
            if (scale < _this._getMinimumScale()) {
                _this._scale.setValue(_this._getMinimumScale());
                _this._setIsZooming(false);
            }
            else {
                _this._scale.setValue(Math.min(_this._getMaximumScale(), scale));
                _this._setIsZooming(true);
            }
        };
        _this._debug = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return _this.props.debug && console.log.apply(console, args);
        };
        _this._setIsZooming = function (isZooming) { return _this.setState({ isZooming: isZooming }, function () { return _this.props.onZoomStateChange(isZooming); }); };
        _this._renderHeader = function () {
            if (_this.state.isZooming) {
                return null;
            }
            var headerAnim = [
                styles.header,
                {
                    transform: [
                        {
                            translateY: _this._translateXY.y.interpolate({
                                inputRange: [0, 100],
                                outputRange: [0, -100],
                            }),
                        },
                    ],
                },
            ];
            return (<Animated.View style={headerAnim}>
        {_this.props.imagesTotal > 1 && (<View style={styles.headerCount}>
            <Text style={styles.defaultText}>{"".concat(_this.props.imageIndex + 1, "/").concat(_this.props.imagesTotal)}</Text>
          </View>)}
      </Animated.View>);
        };
        _this._renderFooter = function () {
            var renderFooter = _this.props.renderFooter;
            if (typeof renderFooter !== 'function' && !_this.props.title) {
                return null;
            }
            if (_this.state.isZooming) {
                return null;
            }
            var innerComponent;
            if (renderFooter !== undefined) {
                if (typeof renderFooter !== 'function') {
                    throw new Error('`renderFooter` must be a function');
                }
                innerComponent = renderFooter(_this.props.title);
            }
            else {
                innerComponent = <Text style={styles.defaultText}>{_this.props.title}</Text>;
            }
            var footerAnim = [
                styles.footer,
                {
                    transform: [
                        {
                            translateY: _this._translateXY.y.interpolate({
                                inputRange: [0, 100],
                                outputRange: [0, 100],
                            }),
                        },
                    ],
                },
            ];
            return <Animated.View style={footerAnim}>{innerComponent}</Animated.View>;
        };
        _this._gestureDoubleTap = function () { return Gesture.Tap().maxDuration(250).numberOfTaps(2).onStart(function (evt) {
            _this._debug('_gestureDoubleTap', 'onStart');
            _this._handleImageZoomInOut(evt);
            _this._debug('_gestureDoubleTap', 'this._handleImageZoomInOut', '-> ok');
        }); };
        _this._gesturePinch = function () { return Gesture.Pinch().onEnd(function (evt) {
            _this._debug('_gesturePinch', 'onEnd');
            _this._onPinchEnd(evt);
        }).onUpdate(function (evt) {
            _this._debug('_gesturePinch', 'onUpdate', evt);
            _this._onPinchUpdate(evt);
        }); };
        _this.state = {
            width: null,
            height: null,
            loading: true,
            isZooming: false,
        };
        _this._translateXY = new Animated.ValueXY();
        _this._scale = new Animated.Value(1);
        var onShouldSetPanResponder = _this._onShouldSetPanResponder.bind(_this);
        var onPanMove = _this._onPanResponderMove.bind(_this);
        var onPanEnd = _this._onPanResponderEnd.bind(_this);
        _this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: onShouldSetPanResponder,
            onStartShouldSetPanResponderCapture: function () { return true; },
            onMoveShouldSetPanResponder: function () { return true; },
            onMoveShouldSetPanResponderCapture: function () { return true; },
            onPanResponderTerminate: onPanEnd,
            onPanResponderRelease: onPanEnd,
            onPanResponderMove: onPanMove,
        });
        return _this;
    }
    ImageComponent.prototype._onShouldSetPanResponder = function (evt) {
        return evt.nativeEvent.touches.length === 1;
    };
    ImageComponent.prototype._onPanResponderMove = function (_evt, gesture) {
        this._debug('_onPanResponderMove', 'dx', gesture.dx, 'dy', gesture.dy, this._lastOffset);
        this._isGestureMoved = true;
        if (this._lastScale > this._getMinimumScale()) {
            var bounds = this._computeMoveBounds();
            var x = gesture.dx + this._lastOffset.x;
            var y = gesture.dy + this._lastOffset.y;
            if (Math.abs(x) >= bounds.x) {
                x = x < 0 ? -1 * bounds.x : bounds.x;
            }
            if (Math.abs(y) >= bounds.y) {
                y = y < 0 ? -1 * bounds.y : bounds.y;
            }
            this._translateXY.setValue({ x: x, y: y });
            this._translateXY.setOffset({ x: 0, y: 0 });
            return;
        }
        if (Math.abs(gesture.dx) > Math.abs(gesture.dy)) {
            this._debug('_onPanResponderMove', 'horizontal');
            this.props.onZoomStateChange(false);
            return;
        }
        this._debug('_onPanResponderMove', 'vertical');
        this.props.onZoomStateChange(true);
        this._translateXY.setValue({ x: 0, y: Math.max(0, gesture.dy) });
    };
    ImageComponent.prototype._onPanResponderEnd = function (_evt, gesture) {
        var _this = this;
        if (!this._isGestureMoved) {
            return;
        }
        this._isGestureMoved = false;
        if (this._lastScale > this._getMinimumScale()) {
            var bounds = this._computeMoveBounds();
            var x = this._lastOffset.x + gesture.dx;
            var y = this._lastOffset.y + gesture.dy;
            if (Math.abs(x) >= bounds.x) {
                x = x < 0 ? -1 * bounds.x : bounds.x;
            }
            if (Math.abs(y) >= bounds.y) {
                y = y < 0 ? -1 * bounds.y : bounds.y;
            }
            this._lastOffset = { x: x, y: y };
            this._debug('_onPanResponderEnd', this._lastOffset, 'dx', gesture.dx);
            this._translateXY.setOffset(this._lastOffset);
            this._translateXY.setValue({ x: 0, y: 0 });
            return;
        }
        if (gesture.dy >= 120) {
            Animated.timing(this._translateXY, {
                toValue: { x: 0, y: SCREEN_HEIGHT },
                duration: 150,
                useNativeDriver: true,
            }).start(function () { return _this.props.onClose(); });
        }
        else {
            // fixed case swipe left when jump restart
            Animated.spring(this._translateXY, {
                toValue: { x: 0, y: 0 },
                useNativeDriver: true,
            }).start();
        }
    };
    ImageComponent.getDerivedStateFromProps = function (nextProps, prevState) {
        if (prevState.width === null || prevState.height === null) {
            var resolveSource = RNImage.resolveAssetSource(nextProps.source);
            return {
                width: resolveSource.width || 0,
                height: resolveSource.height || 0,
            };
        }
        return null;
    };
    ImageComponent.prototype.componentDidMount = function () {
        var _this = this;
        if (!this.state.width || !this.state.height) {
            this._debug('Image', 'fetch image size with headers', this.props.source);
            var resolve = RNImage.resolveAssetSource(this.props.source);
            RNImage.getSizeWithHeaders(resolve.uri, resolve.headers ? resolve.headers : {}, function (width, height) {
                _this.setState({ width: width, height: height });
            });
        }
    };
    ImageComponent.prototype.render = function () {
        var moveObjStyle = {
            position: 'absolute',
            transform: __spreadArray(__spreadArray([], this._translateXY.getTranslateTransform(), true), [
                {
                    scale: this._scale,
                },
            ], false),
        };
        var computeImageStyle = {
            width: this.props.initialWidth,
            height: this.props.initialHeight,
        };
        if (this.state.width && this.state.height) {
            var ratio = this._getRatio();
            Object.assign(computeImageStyle, {
                width: Math.floor(ratio * this.state.width),
                height: Math.floor(ratio * this.state.height),
            });
        }
        var backdropStyle = [
            styles.backdrop,
            StyleSheet.absoluteFill,
            {
                opacity: this._translateXY.y.interpolate({
                    inputRange: [0, SCREEN_HEIGHT],
                    outputRange: [1, 0],
                }),
            },
        ];
        return (<View style={styles.container}>
        <Animated.View style={backdropStyle} {...this._panResponder.panHandlers}/>
        <Animated.View style={moveObjStyle} {...(this.state.isZooming || Platform.OS === 'ios' ? this._panResponder.panHandlers : {})} renderToHardwareTextureAndroid>
          <GestureDetector gesture={Gesture.Exclusive(this._gestureDoubleTap(), this._gesturePinch())}>
            <RNImage source={this.props.source} style={computeImageStyle} onLoadEnd={this._onImageLoadEnd}/>
          </GestureDetector>
        </Animated.View>
        <SafeAreaView style={styles.safeAreaContainer} pointerEvents="none">
          {this._renderHeader()}
          {this.state.loading && <ActivityIndicator color={'#fff'}/>}
          {this._renderFooter()}
        </SafeAreaView>
      </View>);
    };
    ImageComponent.defaultProps = {
        initialWidth: 200,
        initialHeight: 200,
        debug: false,
        renderFooter: undefined,
    };
    return ImageComponent;
}(React.Component));
var styles = StyleSheet.create({
    container: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    backdrop: {
        backgroundColor: '#000',
    },
    header: {
        alignItems: 'center',
    },
    footer: {
        width: SCREEN_WIDTH,
    },
    safeAreaContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    defaultText: {
        color: '#fff',
    },
    headerCount: {
        backgroundColor: '#131313',
        padding: 10,
        borderRadius: 10,
    },
});
var Image = gestureHandlerRootHOC(function (props) { return <ImageComponent {...props}/>; });
export default Image;
