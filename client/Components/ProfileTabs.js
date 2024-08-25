import React, { useContext, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ProfileGym from '../pages/Profile/ProfileGym';
import ProfileStats from '../pages/Profile/ProfileStats';
import ProfileTrainer from '../pages/Profile/ProfileTrainer';
import ProfileWorkout from '../pages/Profile/ProfileWorkout';
import { AuthContext } from '../Context/authContext';
import ProfileDetails from '../pages/Profile/ProfileDetails';

const ProfileTabs = ({ type, navigation }) => {
  // State to manage active tab and the corresponding component
  const [activeTab, setActiveTab] = useState('Workout');
  const [state] = useContext(AuthContext);
  const [selectedComponent, setSelectedComponent] = useState(
    <ProfileWorkout />
  );

  // Function to handle tab press
  const handleTabPress = (tab) => {
    setActiveTab(tab);
    switch (tab) {
      case 'Workout':
        setSelectedComponent(<ProfileWorkout/>);
        break;
      case 'Trainer':
        setSelectedComponent(<ProfileTrainer />);
        break;
      case 'Gym':
        setSelectedComponent(<ProfileGym navigation={navigation}/>);
        break;
      case 'Statistics':
        setSelectedComponent(<ProfileStats />);
        break;
      case 'Details':
        setSelectedComponent(<ProfileDetails />);
        break;
      default:
        setSelectedComponent(null);
        break;
    }
  };

  return (
    <View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'Workout' && styles.activeTabButton,
          ]}
          onPress={() => handleTabPress('Workout')}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'Workout' && styles.activeTabButtonText,
            ]}
          >
            {(state.user.usertype=="Attendee"||state.user.usertype=="trainer")?'Workout':'Posts'}
          </Text>
        </TouchableOpacity>

        {state.user.usertype=="Gym"&&<TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'Details' && styles.activeTabButton,
          ]}
          onPress={() => handleTabPress('Details')}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'Details' && styles.activeTabButtonText,
            ]}
          >
            Details
          </Text>
        </TouchableOpacity>}

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'Gym' && styles.activeTabButton,
          ]}
          onPress={() => handleTabPress('Gym')}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'Gym' && styles.activeTabButtonText,
            ]}
          >
            {(state.user.usertype=="Attendee"||state.user.usertype=="trainer")?'Gym':'Subscriptions'}
          </Text>
        </TouchableOpacity>
        {(state.user.usertype=="Attendee"||state.user.usertype=="trainer")&&<TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'Statistics' && styles.activeTabButton,
          ]}
          onPress={() => handleTabPress('Statistics')}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'Statistics' && styles.activeTabButtonText,
            ]}
          >
            Statistics
          </Text>
        </TouchableOpacity>}

        {(state.user.usertype=="Attendee"||state.user.usertype=="trainer")&&<TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'Trainer' && styles.activeTabButton,
          ]}
          onPress={() => handleTabPress('Trainer')}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'Trainer' && styles.activeTabButtonText,
            ]}
          >
            Trainer
          </Text>
        </TouchableOpacity>}
      </View>
      {/* Render the selected component */}
      {selectedComponent}
    </View>
  );
};

export default ProfileTabs;

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 10,
    marginLeft: 12,
  },
  tabButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    borderColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 100,
  },
  tabButtonText: {
    color: '#DFE7EB',
    fontSize: 15,
    fontWeight: 'bold',
  },
  activeTabButton: {
    borderColor: '#DFE7EB',
    backgroundColor: '#FFF',
  },
  activeTabButtonText: {
    color: '#0A2533',
    fontWeight: 'bold',
  },
});
