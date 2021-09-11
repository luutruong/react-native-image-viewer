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
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native';
import {HandlerStateChangeEvent, TapGestureHandler} from 'react-native-gesture-handler';

interface ImageProps {
  url: string;
  width?: number;
  height?: number;
  headers?: {[key: string]: any};
  onClose: () => void;
  onSwipe: (horizontal: boolean) => void;
  onImageZoom: (isZoomOut: boolean) => void;
}
interface ImageState {
  width: number | null;
  height: number | null;
  loading: boolean;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const ImageAnimated = Animated.createAnimatedComponent(RNImage);

class Image extends React.Component<ImageProps, ImageState> {
  private _panResponder: PanResponderInstance;
  private _translateXY: Animated.ValueXY;
  private _scaleValue: Animated.Value;

  private _lastOffset: {x: number; y: number} = {x: 0, y: 0};

  private _scaleNum: number = 1;

  constructor(props: ImageProps) {
    super(props);

    this.state = {
      width: null,
      height: null,
      loading: true,
    };

    this._translateXY = new Animated.ValueXY();
    this._scaleValue = new Animated.Value(1);

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
  }

  private _onShouldSetPanResponder(evt: GestureResponderEvent) {
    return evt.nativeEvent.touches.length === 1;
  }

  private _onPanResponderMove(_evt: any, gesture: PanResponderGestureState) {
    console.log('_onPanResponderMove', 'dx', gesture.dx, 'dy', gesture.dy, this._lastOffset);
    if (this._scaleNum > 1) {
      const bounds = this._computeMoveBounds();
      let x = gesture.dx + this._lastOffset.x;
      let y = gesture.dy + this._lastOffset.y;
      console.log(x, y, gesture.moveX, gesture.moveY);
      if (Math.abs(x) >= bounds.x) {
        x = x < 0 ? -1 * bounds.x : bounds.x;
      }
      if (Math.abs(y) >= bounds.y) {
        y = y < 0 ? -1 * bounds.y : bounds.y;
      }

      this._translateXY.setValue({x, y});

      return;
    }

    if (Math.abs(gesture.dx) > Math.abs(gesture.dy)) {
      // swipe left/right
      this.props.onSwipe(true);
      return;
    }

    this.props.onSwipe(false);
    this._translateXY.setValue({x: 0, y: gesture.dy});
  };
  private _onPanResponderEnd(_evt: any, gesture: PanResponderGestureState) {
    console.log('_onPanResponderEnd', 'dx', gesture.dx, 'dy', gesture.dy, this._lastOffset);
    if (this._scaleNum > 1) {
      const bounds = this._computeMoveBounds();
      let x = gesture.dx;
      let y = gesture.dy;

      if (Math.abs(x) >= bounds.x) {
        x = x < 0 ? -1 * bounds.x : bounds.x;
      }
      if (Math.abs(y) >= bounds.y) {
        y = y < 0 ? -1 * bounds.y : bounds.y;
      }

      this._lastOffset = {x, y};
      this._translateXY.flattenOffset();
      console.log(this._lastOffset);
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

  private _handleImageZoomInOut = (evt: HandlerStateChangeEvent) => {
    console.log('double tab triggered', '_scaleNum', this._scaleNum, evt.nativeEvent, 'ratio', this._getRatio());
    if (this._scaleNum > 1) {
      Animated.parallel([
        Animated.timing(this._translateXY, {
          toValue: {x: 0, y: 0},
          useNativeDriver: true,
          duration: 100,
        }),
        Animated.spring(this._scaleValue, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start()
      this._scaleNum = 1;
      this.props.onImageZoom(false);
    } else {
      const scaleUp = this._getRatio() <= 1 ? 2 : SCREEN_WIDTH / this.state.width!;
      // Animated.spring(this._scaleValue, {
      //   toValue: scaleUp,
      //   useNativeDriver: true,
      // }).start();
      Animated.parallel([
        Animated.timing(this._translateXY, {
          toValue: {x: evt.nativeEvent.x as number, y: 0},
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(this._scaleValue, {
          toValue: scaleUp,
          useNativeDriver: true,
        }),
      ]).start();
      this._scaleNum = scaleUp;
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
    if (this._scaleNum <= 1 || ratio === 0) {
      return {x: 0, y: 0};
    }

    const imageWidth = this.state.width! * ratio * this._scaleNum;
    const imageHeight = this.state.height! * ratio * this._scaleNum;

    const bounds = (width: number, maxWidth: number) =>
      width >= maxWidth ? (width - maxWidth) / 2 : 0;
    
    return {x: bounds(imageWidth, SCREEN_WIDTH), y: bounds(imageHeight, SCREEN_HEIGHT)};
  }

  static getDerivedStateFromProps(nextProps: Readonly<ImageProps>, prevState: Readonly<ImageState>): any {
    if (prevState.width === null || prevState.height === null) {
      return {
        width: nextProps.width || 0,
        height: nextProps.height || 0,
      };
    }

    return null;
  }

  componentDidMount() {
    if (!this.state.width || !this.state.height) {
      console.log('Image', 'fetch image size with headers', this.props.url, this.props.headers);
      RNImage.getSizeWithHeaders(
        this.props.url,
        this.props.headers || {},
        (width: number, height: number) => {
          console.log(width, height);
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
          scale: this._scaleValue,
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
        <Animated.View style={moveObjStyle} {...this._panResponder.panHandlers}>
          <TapGestureHandler numberOfTaps={2} onActivated={this._handleImageZoomInOut}>
            <ImageAnimated source={{uri: this.props.url, headers: this.props.headers}} style={computeImageStyle} />
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
