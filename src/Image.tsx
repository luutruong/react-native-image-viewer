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
  PanResponderGestureState
} from 'react-native';
import {HandlerStateChangeEvent, TapGestureHandler, PinchGestureHandler, State, GestureEvent} from 'react-native-gesture-handler';
import {ImageComponentProps, ImageComponentState} from './index.d';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const ImageAnimated = Animated.createAnimatedComponent(RNImage);

class Image extends React.Component<ImageComponentProps, ImageComponentState> {
  private _panResponder: PanResponderInstance;
  private _translateXY: Animated.ValueXY;

  // private _baseScale = new Animated.Value(1);
  // private _pinchScale = new Animated.Value(1);
  private _scale = new Animated.Value(1);

  private _lastOffset: {x: number; y: number} = {x: 0, y: 0};

  private _lastScale: number = 1;
  
  private _isGestureMoved: boolean = false;

  constructor(props: ImageComponentProps) {
    super(props);

    this.state = {
      width: null,
      height: null,
      loading: true,
    };

    this._translateXY = new Animated.ValueXY();
    this._scale = new Animated.Value(1);

    const onShouldSetPanResponder = this._onShouldSetPanResponder.bind(this);
    const onPanMove = this._onPanResponderMove.bind(this);
    const onPanEnd = this._onPanResponderEnd.bind(this);

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: onShouldSetPanResponder,
      onMoveShouldSetPanResponder: onShouldSetPanResponder,
      onPanResponderTerminate: onPanEnd,
      onPanResponderRelease: onPanEnd,
      onPanResponderMove: onPanMove,
    });

    this._translateXY.addListener((value) => {
      console.log('animated value', value);
    })
  }

  private _onShouldSetPanResponder(evt: GestureResponderEvent) {
    return evt.nativeEvent.touches.length === 1;
  }

  private _onPanResponderMove(_evt: any, gesture: PanResponderGestureState) {
    console.log('_onPanResponderMove', 'dx', gesture.dx, 'dy', gesture.dy, this._lastOffset);
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
      this.props.onSwipe(gesture.dx > 0 ? 'left' : 'right');

      return;
    }

    this.props.onSwipe(gesture.dy > 0 ? 'down' : 'up');
    this._translateXY.setValue({x: 0, y: Math.max(0, gesture.dy)});
  };
  private _onPanResponderEnd(_evt: any, gesture: PanResponderGestureState) {
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
      console.log('_onPanResponderEnd', this._lastOffset, 'dx', gesture.dx);

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
      Animated.spring(this._translateXY, {
        toValue: {x: 0, y: 0},
        useNativeDriver: true,
      }).start();
    }
  };

  private _getMaximumScale = (): number => 2.5;
  private _getMinimumScale = (): number => 1.0;

  private _handleImageZoomInOut = (evt: HandlerStateChangeEvent) => {
    console.log('double tab triggered', '_scaleNum', this._lastScale, evt.nativeEvent, 'ratio', this._getRatio());

    if (this._lastScale > this._getMinimumScale()) {
      this._translateXY.setOffset({x: 0, y: 0});
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
      ]).start()
      this._lastScale = 1;
      this._lastOffset = {x: 0, y: 0};
      this.props.onImageZoom(false);
    } else {
      const scale = this._getRatio() <= this._getMinimumScale() ? this._getMaximumScale() : SCREEN_WIDTH / this.state.width!;
      const oldWidth = this._getRatio() * this.state.width!;
      const oldHeight = this._getRatio() * this.state.height!;

      const newWidth = scale * oldWidth;
      const newHeight = scale * oldHeight;
      const padding = 50
      
      let x = evt.nativeEvent.x as number;
      let y = evt.nativeEvent.y as number;
      console.log('touched point', x, y);

      const horizontalCenter = (newWidth - SCREEN_WIDTH) / 2;
      const verticalCenter = (newHeight - SCREEN_HEIGHT) / 2;
      if (verticalCenter <= SCREEN_HEIGHT) {
        if (x >= (SCREEN_WIDTH / 2)) {
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
        if (y >= (SCREEN_HEIGHT / 2)) {
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
        this._lastOffset = {x, y}
      });
      this._lastScale = scale;
      this.props.onImageZoom(true);
    }
  };

  private _getRatio = () => this.state.width 
    ? this.state.width >= SCREEN_WIDTH 
      ? SCREEN_WIDTH / this.state.width 
      : this.state.width / SCREEN_WIDTH
    : 0;
  private _computeMoveBounds = (): {x: number, y: number} => {
    const ratio = this._getRatio();
    if (this._lastScale <= 1 || ratio === 0) {
      return {x: 0, y: 0};
    }

    const imageWidth = this.state.width! * ratio * this._lastScale;
    const imageHeight = this.state.height! * ratio * this._lastScale;

    const bounds = (width: number, maxWidth: number) =>
      width >= maxWidth ? (width - maxWidth) / 2 : 0;
    
    return {x: bounds(imageWidth, SCREEN_WIDTH), y: bounds(imageHeight, SCREEN_HEIGHT)};
  }

  private _onImageLoadEnd = () => this.setState({loading: false});

  private _onPinchHandlerStateChange = (evt: HandlerStateChangeEvent) => {
    if (evt.nativeEvent.oldState === State.ACTIVE) {
      console.log('_onPinchHandlerStateChange', evt.nativeEvent.scale);
      let scale = evt.nativeEvent.scale as number;
      if (scale < 1) {
        scale = 1;
        this.props.onImageZoom(false);
      } else {
        scale = Math.min(2, scale);
      }

      this._lastScale = scale;
      this._scale.setValue(scale);
    }
  };
  private _onPinchGestureEvent = (evt: GestureEvent) => {
    if (evt.nativeEvent.state === State.ACTIVE) {
      const scale = this._lastScale * (evt.nativeEvent.scale as number);

      if (scale < 1) {
        this._scale.setValue(1);
      } else {
        this._scale.setValue(Math.min(2, scale));
      }

      this.props.onImageZoom(true);
    }
  };

  static getDerivedStateFromProps(nextProps: Readonly<ImageComponentProps>, prevState: Readonly<ImageComponentState>): any {
    if (prevState.width === null || prevState.height === null) {
      return {
        width: nextProps.image.width || 0,
        height: nextProps.image.height || 0,
      };
    }

    return null;
  }

  componentDidMount() {
    if (!this.state.width || !this.state.height) {
      console.log('Image', 'fetch image size with headers', this.props.image);
      RNImage.getSizeWithHeaders(
        this.props.image.url,
        this.props.image.headers || {},
        (width: number, height: number) => {
          this.setState({width, height});
        },
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
        }
      ]
    };
    const computeImageStyle = {
      width: 200,
      height: 200,
    };
    if (this.state.width && this.state.height) {
      const ratio = this._getRatio();
      Object.assign(computeImageStyle, {
        width: Math.floor(ratio * this.state.width),
        height: Math.floor(this.state.height * ratio),
      })
    }
    const backdropStyle: any = [
      styles.backdrop,
      StyleSheet.absoluteFill,
      {
        opacity: this._translateXY.y.interpolate({
          inputRange: [0, SCREEN_HEIGHT],
          outputRange: [1, 0],
        })
      }
    ]

    return (
      <View style={styles.container}>
        <Animated.View style={backdropStyle} />
        {this.state.loading && <ActivityIndicator />}
        <Animated.View style={moveObjStyle} {...this._panResponder.panHandlers} onLayout={(evt) => console.log('onLayout', evt.nativeEvent.layout)}>
          <TapGestureHandler numberOfTaps={2} onActivated={this._handleImageZoomInOut}>
            <PinchGestureHandler 
              onGestureEvent={this._onPinchGestureEvent}
              onHandlerStateChange={this._onPinchHandlerStateChange}>
              <ImageAnimated
                source={{uri: this.props.image.url, headers: this.props.image.headers}}
                style={computeImageStyle}
                onLoadEnd={this._onImageLoadEnd}
              />
            </PinchGestureHandler>
          </TapGestureHandler>
        </Animated.View>
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
});

export default Image;
