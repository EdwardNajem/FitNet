import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import WhiteButton from '../../../Components/WhiteButton';

const ContactUs = () => {
  const handleEmailPress = () => {
    const email = 'edward.najem65@gmail.com';
    const subject = 'Contacting via email';
    const body = 'Greetings,';
    const emailUrl = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    Linking.openURL(emailUrl).catch((err) =>
      console.error('Error opening email:', err)
    );
  };

  const handlePhonePress = () => {
    const phoneNumber = '+96181377247';
    const phoneUrl = `tel:${phoneNumber}`;
    Linking.openURL(phoneUrl).catch((err) =>
      console.error('Error opening phone dialer:', err)
    );
  };

  return (
    <View style={styles.container}>
      <WhiteButton title="Contact via Email" onPress={handleEmailPress} />
      <WhiteButton title="Contact via Phone" onPress={handlePhonePress} />
    </View>
  );
};

export default ContactUs;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
    position: 'relative',
    flex: 1,
    height: '100%',
    backgroundColor: '#1C1C1E',
  },
  content: {
    width: '100%',
    paddingHorizontal: 7,
  },
  centered: {
    alignItems: 'center',
  },
});
