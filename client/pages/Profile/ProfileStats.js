import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryTheme,
} from 'victory-native';
import api from '../../Components/Config';
import { AuthContext } from '../../Context/authContext';


const ProfileStats = () => {
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [state] = useContext(AuthContext);

  useEffect(() => {
    fetchVolumeData();
  }, []);

  // Fetch the workout volume data for the last 7 days from your backend
  const fetchVolumeData = async () => {
    try {
      const response = await api.get(`/fitnet/getWorkoutVolumeForLast7Days/${state.user._id}`);
      const fetchedData = response.data;
      
      // Helper function to get the day name from a date string
      const getDayName = (dateStr) => {
        const date = new Date(dateStr);
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days[date.getDay()];
      };

      // Map fetched data to the format needed by VictoryChart
      const chartData = fetchedData.map(item => ({
        quarter: getDayName(item.date), // Use day name as x-axis
        earnings: item.volume // Use volume as y-axis
      }));
      
      setData(chartData);
    } catch (error) {
      console.error('Error fetching workout volume data:', error);
    }
  };

  // Helper function to format tick labels
  const formatTick = (tick) => {
    // Format the tick value to a readable number
    return tick.toLocaleString(); // Converts number to a string with commas as thousands separators
  };

  return (
    <View style={styles.container}>
      <View style={styles.topLeftLabelContainer}>
        <Text style={styles.topLeftLabel}>Statistics</Text>
      </View>
      <View style={styles.contentContainer}>
      <VictoryChart width={350} theme={VictoryTheme.material}>
          <VictoryAxis
            style={{
              axis: { stroke: 'white' },
              tickLabels: { fill: 'white' },
              grid: { stroke: 'none' },
            }}
            tickFormat={(tick) => tick} // Format the x-axis labels
          />
          <VictoryAxis
            dependentAxis
            style={{
              axis: { stroke: 'white' },
              tickLabels: { fill: 'white' },
              grid: { stroke: 'none' },
            }}
            tickFormat={formatTick}
          />
          <VictoryBar
            data={data}
            x="quarter"
            y="earnings"
            style={{
              data: { fill: '#c43a31' },
              labels: { fill: 'white' },
            }}
            barWidth={({ index }) => index * 2 + 15}
            animate={{
              duration: 1000,
              onLoad: { duration: 1000 },
            }}
          />
        </VictoryChart>
        {selectedData && (
          <View style={styles.tooltipContainer}>
            <Text style={styles.tooltipText}>
              {`${selectedData.quarter}: ${selectedData.earnings}`}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default ProfileStats;

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 20,
    paddingTop: 10,
    height: windowHeight / 2,
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
  tooltipContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 5,
  },
  tooltipText: {
    color: 'white',
    fontSize: 16,
  },
});
