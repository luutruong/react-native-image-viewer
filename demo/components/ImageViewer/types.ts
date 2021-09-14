export type ImageViewerImageProps = {
  url: string;
  title?: string;
  headers?: {[key: string]: any};
  width?: number;
  height?: number;
}
export type SwipeDirection = 'up' | 'down' | 'left' | 'right';

// Image.tsx
export interface ImageComponentProps extends ImageComponentOptionalProps {
  image: ImageViewerImageProps;
  onClose: () => void;
  toggleEnableScroll: (enabled: boolean) => void;

  imageIndex: number;
  imageTotal: number;
}
export interface ImageComponentOptionalProps {
  // optional
  debug?: boolean;
  // render image with default width
  initialWidth?: number;
  // render image with default height
  initialHeight?: number;
  // render footer
  renderFooter?: (title?: string) => JSX.Element | null;
}

export interface ImageComponentState {
  width: number | null;
  height: number | null;
  loading: boolean;
}

// index.tsx
export interface ImageViewerComponentProps {
  debug?: boolean;
  imageProps?: ImageComponentOptionalProps;
}
export interface ImageViewerComponentState {
  visible: boolean;
  images: ImageViewerImageProps[];
  scrollEnabled: boolean;
}
