import { ImageRequireSource, ImageURISource } from "react-native";

export type ImageViewerImageProps = {
  source: ImageURISource | ImageRequireSource;
  title?: string;
}
export type SwipeDirection = 'up' | 'down' | 'left' | 'right';

// Image.tsx
export interface ImageComponentProps extends ImageComponentOptionalProps {
  source: ImageURISource | ImageRequireSource;
  title?: string;
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
  startIndex: number;
}
