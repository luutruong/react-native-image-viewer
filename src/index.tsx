import React from 'react';
import {Modal, Dimensions, VirtualizedList} from 'react-native';
import Image from './Image';
import {ImageViewerImageProps, SwipeDirection} from './types';

const SCREEN_WIDTH = Dimensions.get('window').width;

class ImageViewer extends React.Component {
  state = {
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
    />
  );

  render() {
    return (
      <Modal visible={this.state.visible} transparent animationType="none" onRequestClose={this._closeInternal}>
        <VirtualizedList
          horizontal
          showsHorizontalScrollIndicator={false}
          windowSize={2}
          data={this.state.images}
          renderItem={this._renderImage}
          keyExtractor={(item: ImageViewerImageProps) => item.url}
          getItemCount={() => this.state.images.length}
          getItem={(data: any, index: number) => data[index]}
          getItemLayout={(data: any, index: number) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
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
