import React from 'react';
import {Modal, Dimensions, VirtualizedList} from 'react-native';
import Image from './Image';
import {ImageViewerImageProps, ImageViewerProps, ImageViewerState, SwipeDirection} from './types';

const SCREEN_WIDTH = Dimensions.get('window').width;

class ImageViewer extends React.Component<ImageViewerProps, ImageViewerState> {
  state: ImageViewerState = {
    visible: false,
    images: [],
    scrollEnabled: true,
  };
  private _scrollRef: {current: VirtualizedList<any> | null} = React.createRef();

  public show(images: ImageViewerImageProps[], startIndex: number = 0) {
    this.setState({images, visible: true});
  }

  private _closeInternal = () => this.setState({visible: false});
  private _renderImage = (info: {item: ImageViewerImageProps, index: number}) => (
    <Image
      image={info.item}
      onClose={this._closeInternal}
      onImageZoom={(zoom: boolean) => this.setState({scrollEnabled: !zoom})}
      onSwipe={(direction: SwipeDirection) => this.setState({scrollEnabled: direction === 'left' || direction === 'right'})}
      debug={this.props.debug}
    />
  );

  private _getItemCount = () => this.state.images.length;
  private _getItem = (data: any, index: number) => data[index];
  private _getItemLayout = (_data: any, index: number) => ({
    length: SCREEN_WIDTH,
    offset: SCREEN_WIDTH * index,
    index,
  });
  private _keyExtractor = (item: ImageViewerImageProps) => item.url;

  render() {
    return (
      <Modal visible={this.state.visible} transparent animationType="none" onRequestClose={this._closeInternal}>
        <VirtualizedList
          horizontal
          showsHorizontalScrollIndicator={false}
          windowSize={2}
          data={this.state.images}
          renderItem={this._renderImage}
          keyExtractor={this._keyExtractor}
          getItemCount={this._getItemCount}
          getItem={this._getItem}
          getItemLayout={this._getItemLayout}
          scrollEnabled={this.state.scrollEnabled}
          ref={this._scrollRef}
          removeClippedSubviews={true}
          maxToRenderPerBatch={2}
          initialNumToRender={2}
          pagingEnabled
        />
      </Modal>
    )
  }
}

export default ImageViewer;
