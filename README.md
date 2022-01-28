# React Native Image Viewer

- Double tap to zoom image
- Pinch to zoom image
- Swipe down to close
- Caption and summaries

## Installation

Yarn:

```bash
yarn add @luu-truong/react-native-image-viewer
```

NPM:

```bash
npm install @luu-truong/react-native-image-viewer
```

Usage:

```javascript

import ImageViewer from '@luu-truong/react-native-image-viewer';

function Example() {
  const [visible, setVisible] = React.useState(false);
  
  const images = [
    {
      source: {
        uri: 'https://...',
        headers: {
          'X-Custom-Header': 'foo',
        },
        width: 1200,
        height: 600
      },
      title: 'blah blah'
    },
    {
      source: require('image.png'),
    }
  ];
  
  return (
    <>
      <ImageViewer images={images} visible={visible} onClose={() => setVisible(false)} imageProps={{
        initialWidth: 200,
        initialHeight: 200,
        renderFooter: (title?: string) => (<Text>{title}</Text>)
      }} />
    </>
  );
}

```

## Documentation

Image Viewer Component Props:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| debug | boolean | no | Print debug message. Default: false |
| imageProps | object | no | Props passed to Image component. See Image Component Props |
| visible | boolean | yes | |
| images | Array | yes | |
| initialIndex | number | no | Show image index at initialize |
| onClose | () => void | yes | Callback when close image viewer |
| animationType | string | no | |

Image Component Props:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| initialWidth | number | no | Default: 200 |
| initialHeight | number | no | Default: 200 |
| renderFooter | (title?: string) => JSX.Element | null | no | Default: undefined |
| debug | boolean | no | Default: false |

## Examples

If you want to play with the API but don't feel like to trying it on a real device. Clone the repo and go to
`demo` folder and run:

```bash
yarn install
```

If you want to try IOS, run `pod install` in the ios folder.

Run `yarn start` to start metro server.

Run `yarn ios` to playing with iOS simulator
Run `yarn android` to playing with Android simulator

## React native support

| version | react-native version |
| ----- | ----- |
| 1.x.x | 0.64.0+ |
