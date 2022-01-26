/// <reference types="react" />
import { ImageRequireSource, ImageURISource } from 'react-native';
export declare type ImageViewerImageProps = {
    source: ImageURISource | ImageRequireSource;
    title?: string;
};
export declare type SwipeDirection = 'up' | 'down' | 'left' | 'right';
export interface ImageComponentProps extends ImageComponentOptionalProps {
    source: ImageURISource | ImageRequireSource;
    title?: string;
    onClose: () => void;
    onZoomStateChange: (isZooming: boolean) => void;
    imageIndex: number;
    imagesTotal: number;
}
export interface ImageComponentOptionalProps {
    debug?: boolean;
    initialWidth?: number;
    initialHeight?: number;
    renderFooter?: (title?: string) => JSX.Element | null;
}
export interface ImageComponentState {
    width: number | null;
    height: number | null;
    loading: boolean;
    isZooming: boolean;
}
export interface ImageViewerComponentProps {
    debug?: boolean;
    imageProps?: ImageComponentOptionalProps;
    animationType?: 'slide' | 'fade' | 'none';
    images: ImageViewerImageProps[];
    visible: boolean;
    initialIndex?: number;
    onClose: () => void;
}
export interface ImageViewerComponentState {
    scrollEnabled: boolean;
    isZooming: boolean;
}
