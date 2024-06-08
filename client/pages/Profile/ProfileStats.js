import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryTheme,
} from 'victory-native';

const ProfileStats = () => {
  const data = [
    { quarter: 1, earnings: 13000 },
    { quarter: 2, earnings: 16500 },
    { quarter: 3, earnings: 14250 },
    { quarter: 4, earnings: 19000 },
  ];

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
          />
          <VictoryAxis
            dependentAxis
            style={{
              axis: { stroke: 'white' },
              tickLabels: { fill: 'white' },
              // grid: { stroke: 'none' },
            }}
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
});
