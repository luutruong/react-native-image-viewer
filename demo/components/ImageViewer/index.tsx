import React from 'react';
import {Modal, Dimensions, VirtualizedList} from 'react-native';
import Image from './Image';
import {ImageViewerImageProps, ImageViewerComponentProps, ImageViewerComponentState, SwipeDirection} from './types';

const SCREEN_WIDTH = Dimensions.get('window').width;

class ImageViewer extends React.Component<ImageViewerComponentProps, ImageViewerComponentState> {
  state: ImageViewerComponentState = {
    visible: false,
    images: [],
    scrollEnabled: true,
    startIndex: 0,
  };
  private _scrollRef: {current: VirtualizedList<any> | null} = React.createRef();

  public show(images: ImageViewerImageProps[], startIndex: number = 0) {
    this.setState({images, visible: true, startIndex});
  }

  private _closeInternal = () => this.setState({visible: false});
  private _renderImage = (info: {item: ImageViewerImageProps; index: number}) => (
    <Image
      source={info.item.source}
      title={info.item.title}
      onClose={this._closeInternal}
      toggleEnableScroll={(enabled: boolean) => this.setState({scrollEnabled: enabled})}
      imageIndex={info.index}
      imageTotal={this._getItemCount()}
      // extendable props
      debug={this.props.debug}
      initialWidth={this.props.imageProps?.initialWidth}
      initialHeight={this.props.imageProps?.initialHeight}
      renderFooter={this.props.imageProps?.renderFooter}
    />
  );

  private _getItemCount = () => this.state.images.length;
  private _getItem = (data: any, index: number) => data[index];
  private _getItemLayout = (_data: any, index: number) => ({
    length: SCREEN_WIDTH,
    offset: SCREEN_WIDTH * index,
    index,
  });

  private _keyExtractor = (item: ImageViewerImageProps, index: number) => `${index}`;

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
          initialScrollIndex={this.state.startIndex}
        />
      </Modal>
    );
  }
}

export default ImageViewer;
