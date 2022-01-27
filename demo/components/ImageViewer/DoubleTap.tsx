import React from 'react';
import {TouchableWithoutFeedback} from 'react-native';

export default function DoubleTap(props: {children: any}) {
  let lastPressed = 0;
  const onPress = React.useCallback(() => {
    console.log('onPress', lastPressed);
    if (lastPressed === 0) {
      lastPressed = Date.now();
      console.log(' -> ', lastPressed);
    } else {
      const diff = Date.now() - lastPressed;
      console.log(diff);
      if (diff <= 500) {
        console.log('double tap!');
      }

      lastPressed = 0;
    }
  }, []);

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      {props.children}
    </TouchableWithoutFeedback>
  );
}
