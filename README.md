# React Native Image Viewer

- Double tap to zoom image
- Pinch to zoom image
- Swipe down to close
- Caption and summaries

## Installation

Yarn:

```bash
yarn add @luu-truong/react-native-image-viewer react-native-gesture-handler
```

NPM:

```bash
npm install @luu-truong/react-native-image-viewer react-native-gesture-handler
```

To complete installation you must following [this guide](https://docs.swmansion.com/react-native-gesture-handler/docs/) to setup `react-native-gesture-handler`

Usage:

```javascript

import ImageViewer from '@luu-truong/react-native-image-viewer';

function Example() {
  const imageViewerRef = React.createRef();
  
  function showImagesViewer() {
    imageViewerRef.ref.show([
      {
        url: '...',
        title: 'blah blah'
      },
      {
        url: '...',
        width: 1200,
        height: 600,
        // see Image Object below to see available options
      }
    ]);
  }
  
  return (
    <>
      <TouchableOpacity onPress={() => showImagesViewer()}>
        <View>
          <Text>Show Images</Text>
        </View>
      </TouchableOpacity>
      <ImageViewer ref={imageViewerRef} imageProps={{
        initialWidth: 200,
        initialHeight: 200,
        renderFooter: (title?: string) => (<Text>{title}</Text>)
      }} />
    </>
  );
}

```

## Documentation

Image Object:

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| url  | string | yes | URL to image |
| width | number | no | Image width |
| height | number | no | Image height |
| title | string | no | Image title |
| headers | object | no | Headers to fetch with image |

Image Viewer Component Props:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| debug | boolean | no | Print debug message. Default: false |
| imageProps | object | no | Props passed to Image component. See Image Component Props |

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
