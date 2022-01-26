import React from 'react';
import { ImageViewerComponentProps, ImageViewerComponentState } from './types';
declare class ImageViewer extends React.Component<ImageViewerComponentProps, ImageViewerComponentState> {
    state: ImageViewerComponentState;
    static defaultProps: {
        animationType: string;
    };
    private _scrollRef;
    private _closeInternal;
    private _renderImage;
    private _onZoomStateChange;
    private _getItemCount;
    private _getItem;
    private _getItemLayout;
    private _keyExtractor;
    render(): JSX.Element;
}
export default ImageViewer;
