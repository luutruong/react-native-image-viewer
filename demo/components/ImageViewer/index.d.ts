export interface ImageViewerImageProps {
  url: string;
  title?: string;
  headers?: {[key: string]: any};
  width?: number;
  height?: number;
}

export interface ImageComponentProps {
  image: ImageViewerImageProps;
  onClose: () => void;
  onSwipe: (direction: SwipeDirection) => void;
  onImageZoom: (isZoomOut: boolean) => void;
}
export interface ImageComponentState {
  width: number | null;
  height: number | null;
  loading: boolean;
}

export type SwipeDirection = 'up' | 'down' | 'left' | 'right';