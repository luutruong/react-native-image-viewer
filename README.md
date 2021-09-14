# React Native Image Viewer

- Double tap to zoom image
- Pinch to zoom image
- Swipe down to close

## Installation

```bash
$ yarn add @luutruong/react-native-image-viewer react-native-gesture-handler
```

To complete installation you must following (https://docs.swmansion.com/react-native-gesture-handler/docs/)[this guide] to setup `react-native-gesture-handler`

Usage:

```javascript

import ImageViewer from '@luutruong/react-native-image-viewer';

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
        height: 600
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
      <ImageViewer ref={imageViewerRef} />
    </>
  );
}

```

## Documentation

Image Props:

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| url  | string | yes | URL to image |
| width | number | no | Image width |
| height | number | no | Image height |
| title | string | no | Image title |
| headers | object | no | Headers to fetch with image |

Image Viewer Props:

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
