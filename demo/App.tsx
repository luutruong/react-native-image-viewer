/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import axios from 'axios';
import ImageViewer from './components/ImageViewer';

const WIDTH = Dimensions.get('window').width;

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [images, setImages] = React.useState([]);
  const [visible, setVisible] = React.useState(false);
  const [showIndex, setShowIndex] = React.useState(0);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  React.useEffect(() => {
    axios
      .get('https://picsum.photos/v2/list?limit=20')
      .then((res: any) => res.data)
      .then((res: any) => {
        const imagesMap = res.map((item: any) => ({
          title: item.author,
          source: {
            uri: item.download_url,
            headers: {
              'X-Test': 'foo',
            },
            width: item.width,
            height: item.height,
          },
        }));
        setImages(imagesMap);
      });
  }, []);

  function onImagePress(index: number) {
    setShowIndex(index);
    setVisible(true);
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView>
        {images.map((image, index) => (
          <TouchableOpacity
            activeOpacity={0.8}
            key={index}
            onPress={() => onImagePress(index)}>
            <View>
              <Image source={image.source} style={styles.image} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ImageViewer
        images={images}
        initialIndex={showIndex}
        visible={visible}
        onClose={() => setVisible(false)}
        animationType="slide"
        debug={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: WIDTH,
    height: 360,
  },
});

export default App;
