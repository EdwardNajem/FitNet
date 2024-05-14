import React from 'react';
import { View } from 'react-native';

const GreyCircle = ({ size }) => {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: '#ccc',
      }}
    />
  );
};

export default GreyCircle;
