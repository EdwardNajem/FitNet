import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const OTPScreen = () => {
  const [otp, setOTP] = useState('');
  const navigation = useNavigation();
  const handleVerifyOTP = () => {
    console.log('Verifying OTP:', otp);
    navigation.navigate('MainProfile');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        onChangeText={setOTP}
        value={otp}
        keyboardType="numeric"
      />
      <Button style={styles.Button}  title="Verify OTP" onPress={handleVerifyOTP} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  input: {
    backgroundColor: 'white',
    width: '80%',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  Button:{
    backgroundColor:'#FF4C0A',
  },
});

export default OTPScreen;
