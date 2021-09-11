import React from 'react';
import {Modal, Dimensions, VirtualizedList} from 'react-native';
import Image from './Image';

interface ImageViewerImage {
  url: string;
  title?: string;
  headers?: {[key: string]: any};
  width?: number;
  height?: number;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

class ImageViewer extends React.Component {
  state = {
    visible: false,
    images: [],
    scrollEnabled: true,
  };
  private _scrollRef: {current: VirtualizedList<any> | null} = React.createRef();

  public show(images: ImageViewerImage[], startIndex: number = 0) {
    this.setState({images, visible: true});
  }

  private _closeInternal = () => this.setState({visible: false});
  private _renderImage = (info: {item: ImageViewerImage}) => (
    <Image
      url={info.item.url}
      width={info.item.width}
      height={info.item.height}
      headers={info.item.headers}
      onClose={this._closeInternal}
      onSwipe={(horizontal: boolean) => this.setState({scrollEnabled: horizontal})}
      onImageZoom={(zoom: boolean) => this.setState({scrollEnabled: !zoom})}
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
          keyExtractor={(item: ImageViewerImage) => item.url}
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
