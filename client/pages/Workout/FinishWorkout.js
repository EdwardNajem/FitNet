import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Modal,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';



const FinishWorkout=()=>{

return (


<View style={styles.container}>
    <Text style={styles.title}>Post</Text>
</View>



)






}


export default FinishWorkout;

const styles=StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 10,
    backgroundColor: '#2F2F2F',
  },
});