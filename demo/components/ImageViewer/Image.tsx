import React from 'react';
import {
  Animated,
  Image as RNImage,
  ActivityIndicator,
  PanResponder,
  GestureResponderEvent,
  PanResponderInstance,
  Dimensions,
  StyleSheet,
  View,
  PanResponderGestureState,
  Text,
  SafeAreaView,
  Platform,
} from 'react-native';
import {ImageComponentOptionalProps, ImageComponentProps, ImageComponentState} from './types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

class ImageComponent extends React.Component<ImageComponentProps, ImageComponentState> {
  static defaultProps: ImageComponentOptionalProps = {
    initialWidth: 200,
    initialHeight: 200,
    debug: false,
    renderFooter: undefined,
  };

  private _panResponder: PanResponderInstance;
  private _translateXY: Animated.ValueXY;

  private _scale = new Animated.Value(1);

  private _lastOffset: {x: number; y: number} = {x: 0, y: 0};

  private _lastScale: number = 1;

  private _isGestureMoved: boolean = false;
  private _lastTap: number = 0;

  private _distance: number = 150.0;
  private _isPinching: boolean = false;
  private _currentScale: number = 1.0;

  constructor(props: ImageComponentProps) {
    super(props);

    this.state = {
      width: null,
      height: null,
      loading: true,
      isZooming: false,
    } as ImageComponentState;

    this._translateXY = new Animated.ValueXY();
    this._scale = new Animated.Value(1);

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._onShouldSetPanResponder,
      // onStartShouldSetPanResponderCapture: () => true,

      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      // onPanResponderTerminate: onPanEnd,
      onPanResponderTerminationRequest: () => false,

      onPanResponderRelease: this._onPanResponderRelease,
      onPanResponderMove: this._onPanResponderMove,

      onPanResponderGrant: this._onPanResponderGrant,
      onShouldBlockNativeResponder: () => true,
    });
  }

  private _onShouldSetPanResponder = (evt: GestureResponderEvent) => evt.nativeEvent.touches.length <= 2;

  private _onPanResponderGrant = (evt: GestureResponderEvent, gesture: PanResponderGestureState) => {
    if (gesture.numberActiveTouches === 2) {
      const dx = Math.abs(evt.nativeEvent.touches[0].pageX - evt.nativeEvent.touches[1].pageX)
      const dy = Math.abs(evt.nativeEvent.touches[0].pageY - evt.nativeEvent.touches[1].pageY);

      this._distance = Math.sqrt(dx * dx + dy * dy);
      this._debug('_onPanResponderGrant', 'distance', this._distance);
      this._isPinching = true;
    }
  }

  private _onPanResponderMove = (evt: GestureResponderEvent, gesture: PanResponderGestureState) => {
    this._debug('_onPanResponderMove', 'dx', gesture.dx, 'dy', gesture.dy, this._lastOffset);
    if (gesture.numberActiveTouches === 2) {
      const dx = Math.abs(evt.nativeEvent.touches[0].pageX - evt.nativeEvent.touches[1].pageX)
      const dy = Math.abs(evt.nativeEvent.touches[0].pageY - evt.nativeEvent.touches[1].pageY);

      const distance = Math.sqrt(dx * dx + dy * dy);
      const scale = (distance / this._distance) * this._lastScale;
      this._debug('_onPanResponderMove', 'pinch to zoom', 'scale', scale);
      this._onPinchUpdate({scale});

      this._currentScale = scale;

      return;
    }

    this._isGestureMoved = true;

    if (this._lastScale > this._getMinimumScale()) {
      const bounds = this._computeMoveBounds();

      let x = gesture.dx + this._lastOffset.x;
      let y = gesture.dy + this._lastOffset.y;

      if (Math.abs(x) >= bounds.x) {
        x = x < 0 ? -1 * bounds.x : bounds.x;
      }
      if (Math.abs(y) >= bounds.y) {
        y = y < 0 ? -1 * bounds.y : bounds.y;
      }

      this._translateXY.setValue({x, y});
      this._translateXY.setOffset({x: 0, y: 0});

      return;
    }

    if (Math.abs(gesture.dx) > Math.abs(gesture.dy)) {
      this._debug('_onPanResponderMove', 'horizontal');
      this.props.onZoomStateChange(false);
      return;
    }

    this._debug('_onPanResponderMove', 'vertical');
    this.props.onZoomStateChange(true);
    this._translateXY.setValue({x: 0, y: Math.max(0, gesture.dy)});
  }
  private _onPanResponderRelease = (_evt: GestureResponderEvent, gesture: PanResponderGestureState) => {
    this._debug('_onPanResponderRelease', 'gesture.numberActiveTouches', gesture.numberActiveTouches);
    if (this._isPinching) {
      this._isPinching = false;
      this._onPinchEnd({scale: this._currentScale});
      return;
    }

    if (gesture.numberActiveTouches === 0) {
      this._debug('_onPanResponderRelease', 'gesture.dx', gesture.dx, 'gesture.dy', gesture.dy);
      if (Math.abs(gesture.dx) < 10 && Math.abs(gesture.dy) < 10) {
        this._handleTap({
          x: gesture.x0,
          y: gesture.y0
        });

        return; 
      }
    }

    if (!this._isGestureMoved) {
      return;
    }
    this._isGestureMoved = false;

    if (this._lastScale > this._getMinimumScale()) {
      const bounds = this._computeMoveBounds();
      let x = this._lastOffset.x + gesture.dx;
      let y = this._lastOffset.y + gesture.dy;

      if (Math.abs(x) >= bounds.x) {
        x = x < 0 ? -1 * bounds.x : bounds.x;
      }
      if (Math.abs(y) >= bounds.y) {
        y = y < 0 ? -1 * bounds.y : bounds.y;
      }

      this._lastOffset = {x, y};
      this._debug('_onPanResponderEnd', this._lastOffset, 'dx', gesture.dx);

      this._translateXY.setOffset(this._lastOffset);
      this._translateXY.setValue({x: 0, y: 0});

      return;
    }

    if (gesture.dy >= 120) {
      Animated.timing(this._translateXY, {
        toValue: {x: 0, y: SCREEN_HEIGHT},
        duration: 150,
        useNativeDriver: true,
      }).start(() => this.props.onClose());
    } else {
      // fixed case swipe left when jump restart
      Animated.spring(this._translateXY, {
        toValue: {x: 0, y: 0},
        useNativeDriver: true,
      }).start();
    }
  }

  private _getMaximumScale = (): number => 2.5;
  private _getMinimumScale = (): number => 1.0;

  private _handleImageZoomInOut = (evt: {x: number; y: number}) => {
    this._debug('double tab triggered', '_scaleNum', this._lastScale, evt, 'ratio', this._getRatio());

    if (this._lastScale > this._getMinimumScale()) {
      this._translateXY.setOffset({x: 0, y: 0});
      this._setIsZooming(false);
      Animated.parallel([
        Animated.timing(this._translateXY, {
          toValue: {x: 0, y: 0},
          useNativeDriver: true,
          duration: 250,
        }),
        Animated.timing(this._scale, {
          toValue: 1,
          useNativeDriver: true,
          duration: 250,
        }),
      ]).start();
      this._lastScale = 1;
      this._lastOffset = {x: 0, y: 0};
    } else {
      const scale =
        this._getRatio() <= this._getMinimumScale() ? this._getMaximumScale() : SCREEN_WIDTH / this.state.width!;
      const oldWidth = this._getRatio() * this.state.width!;
      const oldHeight = this._getRatio() * this.state.height!;

      const newWidth = scale * oldWidth;
      const newHeight = scale * oldHeight;
      const padding = 50;

      let x = evt.x as number;
      let y = evt.y as number;

      const horizontalCenter = (newWidth - SCREEN_WIDTH) / 2;
      const verticalCenter = (newHeight - SCREEN_HEIGHT) / 2;
      if (verticalCenter <= SCREEN_HEIGHT) {
        if (x >= SCREEN_WIDTH / 2) {
          x = SCREEN_WIDTH / 2 - x - padding * scale;
          if (Math.abs(x) >= horizontalCenter) {
            x = -1 * horizontalCenter;
          }
        } else {
          x = SCREEN_WIDTH / 2 - x + padding * scale;
          if (Math.abs(x) >= horizontalCenter) {
            x = horizontalCenter;
          }
        }

        y = 0;
      } else {
        x = 0;
        if (y >= SCREEN_HEIGHT / 2) {
          // touched bottom
          y = SCREEN_HEIGHT / 2 - y + padding * scale;
        } else {
          y = SCREEN_HEIGHT / 2 - y - padding * scale;
        }
      }

      Animated.parallel([
        Animated.timing(this._translateXY, {
          toValue: {x, y},
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(this._scale, {
          toValue: scale,
          useNativeDriver: true,
          duration: 250,
        }),
      ]).start(() => {
        this._lastOffset = {x, y};
      });
      this._lastScale = scale;
      this._setIsZooming(true);
    }
  };

  private _handleTap = (tapCoords: {x: number; y: number}) => {
    const now = (new Date()).getTime();
    const delta = now - this._lastTap;

    this._debug('_handleTap', '_lastTap', this._lastTap, 'delta', delta);
    if (delta <= 500) {
      // double tap
      this._handleImageZoomInOut(tapCoords);
    }

    this._lastTap = now;
  };

  private _getRatio = () =>
    this.state.width
      ? this.state.width >= SCREEN_WIDTH
        ? SCREEN_WIDTH / this.state.width
        : this.state.width / SCREEN_WIDTH
      : 0;
  private _computeMoveBounds = (): {x: number; y: number} => {
    const ratio = this._getRatio();
    if (this._lastScale <= 1 || ratio === 0) {
      return {x: 0, y: 0};
    }

    const imageWidth = this.state.width! * ratio * this._lastScale;
    const imageHeight = this.state.height! * ratio * this._lastScale;

    const bounds = (width: number, maxWidth: number) => (width >= maxWidth ? (width - maxWidth) / 2 : 0);

    return {x: bounds(imageWidth, SCREEN_WIDTH), y: bounds(imageHeight, SCREEN_HEIGHT)};
  };

  private _onImageLoadEnd = () => this.setState({loading: false});

  private _onPinchEnd = (evt: {scale: number}) => {
    this._debug('_onPinchEnd', evt);

    let scale = evt.scale as number;
    if (scale < this._getMinimumScale()) {
      scale = this._getMinimumScale();

      this._setIsZooming(false);
    } else {
      scale = Math.min(this._getMaximumScale(), scale);
      this._setIsZooming(true);
    }

    this._lastScale = scale;

    this._translateXY.setOffset({x: 0, y: 0});
    this._lastOffset = {x: 0, y: 0};
    Animated.parallel([
      Animated.timing(this._scale, {
        toValue: scale,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(this._translateXY, {
        toValue: {x: 0, y: 0},
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };
  private _onPinchUpdate = (evt: {scale: number}) => {
    const scale = evt.scale;

    if (scale < this._getMinimumScale()) {
      this._scale.setValue(this._getMinimumScale());
      this._setIsZooming(false);
    } else {
      this._scale.setValue(Math.min(this._getMaximumScale(), scale));
      this._setIsZooming(true);
    }
  };

  private _debug = (...args: any[]) => this.props.debug && console.log(...args);
  private _setIsZooming = (isZooming: boolean) => this.setState({isZooming}, () => this.props.onZoomStateChange(isZooming));

  private _renderHeader = () => {
    if (this.state.isZooming) {
      return null;
    }

    const headerAnim: any = [
      styles.header,
      {
        transform: [
          {
            translateY: this._translateXY.y.interpolate({
              inputRange: [0, 100],
              outputRange: [0, -100],
            }),
          },
        ],
      },
    ];

    return (
      <Animated.View style={headerAnim}>
        {this.props.imagesTotal > 1 && (
          <View style={styles.headerCount}>
            <Text style={styles.defaultText}>{`${this.props.imageIndex + 1}/${this.props.imagesTotal}`}</Text>
          </View>
        )}
      </Animated.View>
    );
  };

  private _renderFooter = () => {
    const {renderFooter} = this.props;
    if (typeof renderFooter !== 'function' && !this.props.title) {
      return null;
    }

    if (this.state.isZooming) {
      return null;
    }

    let innerComponent;
    if (renderFooter !== undefined) {
      if (typeof renderFooter !== 'function') {
        throw new Error('`renderFooter` must be a function');
      }
      innerComponent = renderFooter(this.props.title);
    } else {
      innerComponent = <Text style={styles.defaultText}>{this.props.title}</Text>;
    }

    const footerAnim = [
      styles.footer,
      {
        transform: [
          {
            translateY: this._translateXY.y.interpolate({
              inputRange: [0, 100],
              outputRange: [0, 100],
            }),
          },
        ],
      },
    ];

    return <Animated.View style={footerAnim}>{innerComponent}</Animated.View>;
  };

  static getDerivedStateFromProps(
    nextProps: Readonly<ImageComponentProps>,
    prevState: Readonly<ImageComponentState>
  ): any {
    if (prevState.width === null || prevState.height === null) {
      const resolveSource = RNImage.resolveAssetSource(nextProps.source);
      return {
        width: resolveSource.width || 0,
        height: resolveSource.height || 0,
      };
    }

    return null;
  }

  componentDidMount() {
    if (!this.state.width || !this.state.height) {
      this._debug('Image', 'fetch image size with headers', this.props.source);
      const resolve = RNImage.resolveAssetSource(this.props.source) as any;

      RNImage.getSizeWithHeaders(
        resolve.uri,
        resolve.headers ? resolve.headers : {},
        (width: number, height: number) => {
          this.setState({width, height});
        }
      );
    }
  }

  render() {
    const moveObjStyle: any = {
      position: 'absolute',
      transform: [
        ...this._translateXY.getTranslateTransform(),
        {
          scale: this._scale,
        },
      ],
    };
    const computeImageStyle = {
      width: this.props.initialWidth,
      height: this.props.initialHeight,
    };
    if (this.state.width && this.state.height) {
      const ratio = this._getRatio();
      Object.assign(computeImageStyle, {
        width: Math.floor(ratio * this.state.width),
        height: Math.floor(ratio * this.state.height),
      });
    }
    const backdropStyle: any = [
      styles.backdrop,
      StyleSheet.absoluteFill,
      {
        opacity: this._translateXY.y.interpolate({
          inputRange: [0, SCREEN_HEIGHT],
          outputRange: [1, 0],
        }),
      },
    ];

    return (
      <View style={styles.container}>
        <Animated.View style={backdropStyle} {...this._panResponder.panHandlers} />
        <Animated.View
          style={moveObjStyle}
          {...(this.state.isZooming || Platform.OS === 'ios' ? this._panResponder.panHandlers : {})}
          renderToHardwareTextureAndroid>
            <RNImage source={this.props.source} style={computeImageStyle} onLoadEnd={this._onImageLoadEnd} />
        </Animated.View>
        <SafeAreaView style={styles.safeAreaContainer} pointerEvents="none">
          {this._renderHeader()}
          {this.state.loading && <ActivityIndicator color={'#fff'} />}
          {this._renderFooter()}
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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

export default ImageComponent;
