import React from 'react';
import {Modal, Dimensions, VirtualizedList, Platform} from 'react-native';
import Image from './Image';
import {ImageViewerImageProps, ImageViewerComponentProps, ImageViewerComponentState} from './types';

const SCREEN_WIDTH = Dimensions.get('window').width;

class ImageViewer extends React.Component<ImageViewerComponentProps, ImageViewerComponentState> {
  state: ImageViewerComponentState = {
    scrollEnabled: true,
  };
  static defaultProps = {
    animationType: 'none',
  };

  private _scrollRef: {current: any} = React.createRef();

  private _closeInternal = () => this.props.onClose();
  private _renderImage = (info: {item: ImageViewerImageProps; index: number}) => (
    <Image
      source={info.item.source}
      title={info.item.title}
      onClose={this._closeInternal}
      toggleEnableScroll={this._handleToggleScrollState}
      imageIndex={info.index}
      imagesTotal={this._getItemCount()}
      // extendable props
      debug={this.props.debug}
      initialWidth={this.props.imageProps?.initialWidth}
      initialHeight={this.props.imageProps?.initialHeight}
      renderFooter={this.props.imageProps?.renderFooter}
    />
  );

  private _handleToggleScrollState = (enabled: boolean) => {
    this.setState({scrollEnabled: enabled});
  };

  private _getItemCount = () => this.props.images.length;
  private _getItem = (data: any, index: number) => data[index];
  private _getItemLayout = (_data: any, index: number) => ({
    length: SCREEN_WIDTH,
    offset: SCREEN_WIDTH * index,
    index,
  });

  private _keyExtractor = (_item: ImageViewerImageProps, index: number) => `${index}`;

  render() {
    const platformProps = Platform.select({
      ios: {
        bounces: false,
        directionalLockEnabled: true,
      },
      android: {},
    });

    return (
      <Modal visible={this.props.visible} transparent animationType={this.props.animationType} onRequestClose={this._closeInternal}>
        <VirtualizedList
          horizontal
          showsHorizontalScrollIndicator={false}
          windowSize={2}
          data={this.props.images}
          renderItem={this._renderImage}
          keyExtractor={this._keyExtractor}
          getItemCount={this._getItemCount}
          getItem={this._getItem}
          getItemLayout={this._getItemLayout}
          scrollEnabled
          ref={this._scrollRef}
          removeClippedSubviews={true}
          maxToRenderPerBatch={2}
          initialNumToRender={2}
          updateCellsBatchingPeriod={100}
          pagingEnabled
          initialScrollIndex={this.props.initialIndex}
          listKey={'RNImageViewer'}
          disableScrollViewPanResponder={!this.state.scrollEnabled}
          {...platformProps}
        />
      </Modal>
    );
  }
}

export default ImageViewer;
