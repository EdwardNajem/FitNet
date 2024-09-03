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

const ProfileGym = ({navigation}) => {
  const [mapVisible, setMapVisible] = useState(false);
  const [gyms, setGyms] = useState([]);
  const [subscriptions, setSubscriptions] = useState();
  const [state] = useContext(AuthContext);
  const API_KEY = 'AIzaSyBpCCbk0nQVbVQM0lYAE-YqcT3brK4hc-U';

  useEffect(() => {
    fetchAllGyms();
    fetchUserSubscription();
  }, []);

  const gridCells = [
    { latMin: 33.1, latMax: 33.2, lonMin: 35.1, lonMax: 35.2 },
    { latMin: 33.1, latMax: 33.2, lonMin: 35.2, lonMax: 35.3 },
    { latMin: 33.1, latMax: 33.2, lonMin: 35.3, lonMax: 35.4 },
    { latMin: 33.1, latMax: 33.2, lonMin: 35.4, lonMax: 35.5 },
    { latMin: 33.1, latMax: 33.2, lonMin: 35.5, lonMax: 35.6 },
    { latMin: 33.2, latMax: 33.3, lonMin: 35.1, lonMax: 35.2 },
    { latMin: 33.2, latMax: 33.3, lonMin: 35.2, lonMax: 35.3 },
    { latMin: 33.2, latMax: 33.3, lonMin: 35.3, lonMax: 35.4 },
    { latMin: 33.2, latMax: 33.3, lonMin: 35.4, lonMax: 35.5 },
    { latMin: 33.2, latMax: 33.3, lonMin: 35.5, lonMax: 35.6 },
    { latMin: 33.3, latMax: 33.4, lonMin: 35.1, lonMax: 35.2 },
    { latMin: 33.3, latMax: 33.4, lonMin: 35.2, lonMax: 35.3 },
    { latMin: 33.3, latMax: 33.4, lonMin: 35.3, lonMax: 35.4 },
    { latMin: 33.3, latMax: 33.4, lonMin: 35.4, lonMax: 35.5 },
    { latMin: 33.3, latMax: 33.4, lonMin: 35.5, lonMax: 35.6 },
    { latMin: 33.4, latMax: 33.5, lonMin: 35.1, lonMax: 35.2 },
    { latMin: 33.4, latMax: 33.5, lonMin: 35.2, lonMax: 35.3 },
    { latMin: 33.4, latMax: 33.5, lonMin: 35.3, lonMax: 35.4 },
    { latMin: 33.4, latMax: 33.5, lonMin: 35.4, lonMax: 35.5 },
    { latMin: 33.4, latMax: 33.5, lonMin: 35.5, lonMax: 35.6 },
    { latMin: 33.5, latMax: 33.6, lonMin: 35.1, lonMax: 35.2 },
    { latMin: 33.5, latMax: 33.6, lonMin: 35.2, lonMax: 35.3 },
    { latMin: 33.5, latMax: 33.6, lonMin: 35.3, lonMax: 35.4 },
    { latMin: 33.5, latMax: 33.6, lonMin: 35.4, lonMax: 35.5 },
    { latMin: 33.5, latMax: 33.6, lonMin: 35.5, lonMax: 35.6 },
    { latMin: 33.6, latMax: 33.7, lonMin: 35.1, lonMax: 35.2 },
    { latMin: 33.6, latMax: 33.7, lonMin: 35.2, lonMax: 35.3 },
    { latMin: 33.6, latMax: 33.7, lonMin: 35.3, lonMax: 35.4 },
    { latMin: 33.6, latMax: 33.7, lonMin: 35.4, lonMax: 35.5 },
    { latMin: 33.6, latMax: 33.7, lonMin: 35.5, lonMax: 35.6 },
    { latMin: 33.7, latMax: 33.8, lonMin: 35.1, lonMax: 35.2 },
    { latMin: 33.7, latMax: 33.8, lonMin: 35.2, lonMax: 35.3 },
    { latMin: 33.7, latMax: 33.8, lonMin: 35.3, lonMax: 35.4 },
    { latMin: 33.7, latMax: 33.8, lonMin: 35.4, lonMax: 35.5 },
    { latMin: 33.7, latMax: 33.8, lonMin: 35.5, lonMax: 35.6 },
    { latMin: 33.8, latMax: 33.9, lonMin: 35.1, lonMax: 35.2 },
    { latMin: 33.8, latMax: 33.9, lonMin: 35.2, lonMax: 35.3 },
    { latMin: 33.8, latMax: 33.9, lonMin: 35.3, lonMax: 35.4 },
    { latMin: 33.8, latMax: 33.9, lonMin: 35.4, lonMax: 35.5 },
    { latMin: 33.8, latMax: 33.9, lonMin: 35.5, lonMax: 35.6 },
    { latMin: 33.9, latMax: 34.0, lonMin: 35.1, lonMax: 35.2 },
    { latMin: 33.9, latMax: 34.0, lonMin: 35.2, lonMax: 35.3 },
    { latMin: 33.9, latMax: 34.0, lonMin: 35.3, lonMax: 35.4 },
    { latMin: 33.9, latMax: 34.0, lonMin: 35.4, lonMax: 35.5 },
    { latMin: 33.9, latMax: 34.0, lonMin: 35.5, lonMax: 35.6 },
    { latMin: 34.0, latMax: 34.1, lonMin: 35.1, lonMax: 35.2 },
    { latMin: 34.0, latMax: 34.1, lonMin: 35.2, lonMax: 35.3 },
    { latMin: 34.0, latMax: 34.1, lonMin: 35.3, lonMax: 35.4 },
    { latMin: 34.0, latMax: 34.1, lonMin: 35.4, lonMax: 35.5 },
    { latMin: 34.0, latMax: 34.1, lonMin: 35.5, lonMax: 35.6 },
  ];

  const fetchGymsFromCell = async (latMin, latMax, lonMin, lonMax) => {
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
        params: {
          query: 'gym OR sports club',
          location: `${(latMin + latMax) / 2},${(lonMin + lonMax) / 2}`,
          radius: 50000, // 50 km radius
          key: API_KEY,
        },
      });
      return response.data.results;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const fetchAllGyms = async () => {
    let allGyms = [];
    for (const cell of gridCells) {
      const gymsData = await fetchGymsFromCell(cell.latMin, cell.latMax, cell.lonMin, cell.lonMax);
      allGyms = allGyms.concat(gymsData);
    }
    const uniqueGyms = Array.from(new Map(allGyms.map(gym => [gym.place_id, gym])).values());
    setGyms(uniqueGyms);
  };

  const fetchUserSubscription = async () => {
    // checkAllSubscriptionForUser
    try {
      const response = await api.get(`/fitnet/checkAllSubscriptionForUser/${state.user._id}`);

      if(response.status==200){
        setSubscriptions(response.data);
        console.log(response.data);
      }else{
        console.log('no subscriptions')
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleSearchGyms = async () => {
    navigation.navigate('SearchGyms');
  }

  const handleUnsubscribePress = async (subscriptionId, gymId) => {
    try {
      const data = {
        userId: state.user._id,
        gymId: gymId,
      };
  
      const response = await api.post('/fitnet/removeSubscriptionRequest', data);
  
      if (response) {
        alert('Successfully Unsubscribed');
  
        // Update the subscriptions state by filtering out the unsubscribed one
        if(subscriptions.lenght==1){
          setSubscriptions(null);
        }else{
          setSubscriptions((prevSubscriptions) => 
            prevSubscriptions.filter(subscription => subscription._id !== subscriptionId)
          );
        } 
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  if(state.user.usertype=='trainer'||state.user.usertype=='Attendee'){
    return (
        <View style={styles.container}>
          <View style={styles.topLeftLabelContainer}>
            <Text style={styles.topLeftLabel}>Gym</Text>
          </View>
          <ScrollView>
          {subscriptions && subscriptions.length !=0&&
            <ScrollView contentContainerStyle={styles.subscriptionsContainer}>
              {subscriptions.map((subscription) => (
              <View key={subscription._id} style={styles.subscriptionContainer}>
                <Image source={{ uri: subscription.gym.avatar }} style={styles.userImage} />
                <Text style={{ color: 'white' }}>{subscription.gym.username}</Text>
                {subscription && subscription.status === "pending" && (
                  <TouchableOpacity
                    style={[
                      styles.followButton,
                      subscription.status === 'pending' && styles.followingButton,
                    ]}
                    onPress={()=>handleUnsubscribePress(subscription._id,subscription.gym._id)}
                  >
                    <Text
                      style={[
                        styles.followButtonText,
                        subscription.status === 'pending' && styles.followingButtonText,
                      ]}
                    >
                      Pending
                    </Text>
                  </TouchableOpacity>
                )}
                {subscription && subscription.status === "active" && (
                  <TouchableOpacity
                    style={[
                      styles.followButton,
                      subscription.status === 'active' && styles.followingButton,
                    ]}
                    onPress={()=>handleUnsubscribePress(subscription._id,subscription.gym._id)}
                  >
                    <Text
                      style={[
                        styles.followButtonText,
                        subscription.status === 'active' && styles.followingButtonText,
                      ]}
                    >
                      Unsubscribe
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              ))}
            </ScrollView>
          }
          <View style={styles.contentContainer}>
            <Text style={styles.title}>
              Find Your <Text style={styles.orangeText}>Gym</Text>
            </Text>
            <Text style={styles.subtitle}>
              Locate and find a gym that{'\n'} best suits your goals
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setMapVisible(true)}
            >
              <Text style={styles.buttonText}>View Gyms</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSearchGyms()}
            >
              <Text style={styles.buttonText}>Search Gyms</Text>
            </TouchableOpacity>
          </View>
          </ScrollView>

          <Modal visible={mapVisible} animationType="slide">
            <View style={{ flex: 1 }}>
              <MapView
                style={{ flex: 1 }}
                initialRegion={{
                  latitude: 33.888629,
                  longitude: 35.495480,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              >
                {gyms.map((gym) => (
                  <Marker
                    key={gym.place_id} // Use a unique key
                    coordinate={{
                      latitude: gym.geometry.location.lat,
                      longitude: gym.geometry.location.lng,
                    }}
                    title={gym.name}
                  />
                ))}
              </MapView>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setMapVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
    );
  }else{
      if(state.user.usertype=="Gym"){

        const [activeSubscriptions, setActiveSubscriptions] = useState([]);
        const [pendingSubscriptions, setPendingSubscriptions] = useState([]);
        const [reload, setReload] = useState(false);

        const terminateSubscription = async (subscriptionId) => {
          try {
            // Make sure to await the API call
            const response = await api.get(`/fitnet/rejectSubscription/${subscriptionId}`);
        
            // Check if the response is successful
            if (response && response.status === 200) {
        
              setActiveSubscriptions((prevPending) =>
                prevPending.filter((sub) => sub._id !== subscriptionId)
              );
              setReload(!reload);

            } else {
              console.error('Failed to reject subscription:', response);
            }
            
          } catch (error) {
            console.log(error);
          }
        }

        const rejectSubscription = async (subscriptionId) => {
          try {
            // Make sure to await the API call
            const response = await api.get(`/fitnet/rejectSubscription/${subscriptionId}`);
        
            // Check if the response is successful
            if (response && response.status === 200) {
        
              setPendingSubscriptions((prevPending) =>
                prevPending.filter((sub) => sub._id !== subscriptionId)
              );
              setReload(!reload);

            } else {
              console.error('Failed to reject subscription:', response);
            }
            
          } catch (error) {
            console.log(error);
          }
        }

        const acceptSubscription = async (subscriptionId) => {
          try {
            // Make sure to await the API call
            const response = await api.get(`/fitnet/acceptSubscription/${subscriptionId}`);
        
            // Check if the response is successful
            if (response && response.status === 200) {
              const { subscription } = response.data; // Extract the updated subscription

              // console.log(subscription)
        
              // Update pendingSubscriptions: remove the accepted subscription
              setPendingSubscriptions((prevPending) =>
                prevPending.filter((sub) => sub._id !== subscriptionId)
              );

              setReload(!reload);

            } else {
              console.error('Failed to accept subscription:', response);
            }
          } catch (error) {
            console.error('Error accepting subscription:', error);
          }
        };

        const findSubscriptionRequestsForGym = async() => {
          try {
            const response = await api.get(`/fitnet/getSubscriptionsForGym/${state.user._id}`);

            if(response){
              // console.log(response.data);
              setActiveSubscriptions(response.data.activeSubscriptions);
              setPendingSubscriptions(response.data.pendingSubscriptions);
            }
          } catch (error) {
            console.log(error);
          }
        }

        useEffect(() => {
          findSubscriptionRequestsForGym();
        }, [reload])

        return(
          <View style={styles.container}>
            <View style={styles.topLeftLabelContainer}>
              <Text style={styles.topLeftLabel}>Subscriptions</Text>
            </View>
            <ScrollView contentContainerStyle={styles.subscriptionsContainer} fadingEdgeLength={100}>
              <Text style={{ color: 'white', fontSize: 20, marginVertical: 10 }}>Pending Subscriptions</Text>
              {
                pendingSubscriptions&&pendingSubscriptions.map((subscription, index) => {
                  return(
                    <View key={index} style={styles.subscriptionContainer}>
                      <Image source={{ uri: subscription.user.avatar }} style={styles.userImage} />
                      <View>
                        <Text style={{ color: 'white' }}>
                          {subscription.user && subscription.user.username 
                          ? subscription.user.username.length > 10
                            ? `${subscription.user.username.slice(0, 10)}...`
                            : subscription.user.username
                          : 'No Username'}
                        </Text>
                      
                        <View style={{ flexDirection: 'row' }}>
                          <TouchableOpacity
                            style={[
                              styles.followButton,
                            ]}
                            onPress={() => acceptSubscription(subscription._id)}
                          >
                            <Text style={styles.closeButtonText}>Accept</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.followButton,
                              styles.followingButton,
                            ]}
                            onPress={() => rejectSubscription(subscription._id)}
                          >
                            <Text style={styles.closeButtonText}>Reject</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  )
                })
              }
              {(!pendingSubscriptions||pendingSubscriptions.length==0)&&
                <Text style={{ textAlign: 'center', fontSize: 18, color: '#FF4C0A' }}>No Pending Subscriptions!</Text>
              }

            <Text style={{ color: 'white', fontSize: 20, marginVertical: 10 }}>Active Subscriptions</Text>
              {
                activeSubscriptions&&activeSubscriptions.map((subscription, index) => {
                  return(
                    <View key={index} style={styles.subscriptionContainer}>
                      <Image source={{ uri: subscription.user.avatar }} style={styles.userImage} />
                        <Text style={{ color: 'white' }}>
                          {subscription.user && subscription.user.username 
                          ? subscription.user.username.length > 10
                            ? `${subscription.user.username.slice(0, 10)}...`
                            : subscription.user.username
                          : 'No Username'}
                        </Text>
                        <TouchableOpacity
                          style={[
                            styles.followButton,
                          ]}
                          onPress={() => terminateSubscription(subscription._id)}
                        >
                          <Text style={styles.closeButtonText}>Terminate</Text>
                        </TouchableOpacity>
                    </View>
                  )
                })
              }
              {(!activeSubscriptions||activeSubscriptions.length==0)&&
                <Text style={{ textAlign: 'center', fontSize: 18, color: '#FF4C0A' }}>No Active Subscriptions!</Text>
              }
            </ScrollView>

          </View>
        )
      }
    }
};

export default ProfileGym;

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
    marginTop: 30,
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
    textAlign: 'center',
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
});
