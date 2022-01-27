import React from 'react';
import {TouchableOpacity, View} from 'react-native';

export default function DoubleTap(props: {children: any}) {
  const onPress = () => console.log('foo.', Date.now());

  return (
    <TouchableOpacity disabled={false} onPress={() => onPress()} activeOpacity={0.4} {...props}>
      <View style={{flex:1, backgroundColor: 'blue'}}>{props.children}</View>
    </TouchableOpacity>
  );
}
