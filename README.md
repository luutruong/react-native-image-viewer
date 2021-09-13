# React Native Image Viewer

- Double tap to zoom image
- Pinch to zoom image
- Swipe down to close

## Installation

```bash
$ yarn add @luutruong/react-native-image-viewer react-native-gesture-handler
```

Example:

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

Image Props:

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| url  | string | yes | URL to image |
| width | number | no | Image width |
| height | number | no | Image height |
| title | string | no | Image title |
| headers | object | no | Headers to fetch with image |

Image Viewer Props:

