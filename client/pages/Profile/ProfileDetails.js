import React, { useState, useEffect, useContext } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Image,
  FlatList,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import api from '../../Components/Config';
import { AuthContext } from '../../Context/authContext';
import { ScrollView } from 'react-native';

const ProfileDetails = ({navigation}) => {
    const [state] = useContext(AuthContext);
    const [workingHours, setWorkingHours] = useState([]);
    const [subscriptionFees, setSubscriptionFees] = useState();

    useEffect(() => {
        if(state.user.usertype=="Gym"){
          getGymDetails();
        }
      }, [])
    
      const getGymDetails = async () => {
        try {
          const response = await api.get(`/fitnet/getGymDetails/${state.user._id}`);
      
          if (response.data.success) {
            const { workingHours, subscriptionFee } = response.data.data;
      
            // Convert date strings to Date objects
            const formattedWorkingHours = workingHours.map(hour => ({
              ...hour,
              openingHour: new Date(hour.openingHour),
              closingHour: new Date(hour.closingHour),
            }));
      
            // Set state with the formatted data
            setWorkingHours(formattedWorkingHours);
            setSubscriptionFees(subscriptionFee);
          } else {
            console.error('Failed to fetch gym details:', response.data.message);
          }
        } catch (error) {
          console.error('Error fetching gym details:', error);
        }
      };

    return(
        <View style={styles.container}>
        <View style={styles.topLeftLabelContainer}>
            <Text style={styles.topLeftLabel}>Details</Text>
        </View>
        <ScrollView contentContainerStyle={styles.subscriptionsContainer} fadingEdgeLength={10}>
            <Text style={styles.title}>Subscription Fees:</Text>
            <Text style={styles.subtitle}>${subscriptionFees}</Text>
            <Text style={styles.title}>Schedule:</Text>
            {
                workingHours.map((workingHour, index) => {
                    return(
                        <View key={index} style={{ paddingBottom: 10, flexDirection: 'row'  }}>
                            <Text style={styles.label}>{workingHour.day}:</Text>
                            <Text style={styles.label}>{workingHour.status}</Text>
                            {workingHour.status=="open"&&
                            <View style={{ gap: 10, flexDirection: 'row', marginHorizontal: 10 }}>
                                <Text style={styles.labelHour}>{workingHour.openingHour.toLocaleTimeString()}</Text>
                                <Text style={styles.labelHour}>till</Text>
                                <Text style={styles.labelHour}>{workingHour.closingHour.toLocaleTimeString()}</Text>
                            </View>
                            }
                        </View>  
                    )
                })
            }
        </ScrollView>

        </View>
    )
}

export default ProfileDetails;

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  followButton: {
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: '#FF4C0A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'center',
    marginLeft: 'auto',
    marginRight: '5%'
  },
  followButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
  },
  followingButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FF4C0A',
  },
  followingButtonText: {
    color: '#FF4C0A',
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 20,
  },
  subscriptionsContainer: {
    marginTop: 30,
  },
  subscriptionContainer: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF20',
    padding: 10,
    borderRadius: 40,
    marginVertical: 5,
  },
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 20,
    paddingTop: 10,
    height: windowHeight / 1.8,
  },
  topLeftLabelContainer: {
    position: 'absolute',
    top: 10,
    left: 20,
  },
  topLeftLabel: {
    fontSize: 16,
    color: 'gray',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  orangeText: {
    color: '#FF4C0A',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    // textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FF4C0A',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 80,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    bottom: 40,
    left: '50%',
    backgroundColor: '#FF4C0A',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    // marginVertical: 10,
    marginVertical: 'auto',
    color: 'white',
    width: 50,
  },
  labelHour: {
    fontSize: 16,
    // marginVertical: 10,
    marginVertical: 'auto',
    color: 'white',
    width: 'auto',
  },
});
