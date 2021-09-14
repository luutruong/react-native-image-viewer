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
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import axios from 'axios';
import ImageViewer from './components/ImageViewer';

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const imageViewerRef = React.createRef();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  function showImageViewer() {
    axios
      .get('https://picsum.photos/v2/list?limit=20')
      .then((res: any) => res.data)
      .then((res: any) => {
        const images = res.map((item: any) => ({
          width: item.width,
          height: item.height,
          url: item.download_url,
          title: item.author,
        }));
        imageViewerRef.current.show(images);
      });
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => showImageViewer()}
          hitSlop={{top: 20, left: 20, right: 20, bottom: 20}}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Show</Text>
          </View>
        </TouchableOpacity>
      </View>
      <ImageViewer ref={imageViewerRef} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lighter,
  },
  button: {
    paddingHorizontal: 50,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#2985c6',
    borderRadius: 10,
    backgroundColor: '#2577b1',
  },
  buttonText: {
    fontSize: 15,
    textTransform: 'uppercase',
    fontWeight: '600',
    color: '#fff',
  },
});

export default App;
