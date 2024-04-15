import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, FlatList, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios'; // Import Axios for making HTTP requests

// Get the screen dimensions
const screenWidth = Dimensions.get('window').width;

// Calculate the responsive font size based on the screen width
const responsiveSize = (fontSize) => {
  const standardScreenWidth = 400; 
  const scaleFactor = screenWidth / standardScreenWidth;
  const responsiveSize = Math.round(fontSize * scaleFactor);
  return responsiveSize;
};

const StudentReport = ({ route }) => {
  const { user_id } = route.params;
  const [rfidData, setRfidData] = useState([]); // State variable to store the fetched RFID data

  // Function to fetch RFID data from the server
  const fetchRfidData = async () => {
    try {
      const response = await axios.get(`http://192.168.100.138:2525/rfid_history/${user_id}`); 
      setRfidData(response.data); // Update the state with the fetched data
    } catch (error) {
      console.error('Error fetching RFID data:', error);
    }
  };

  // Fetch RFID data when the component mounts
  useEffect(() => {
    fetchRfidData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchRfidData();
    }, [])
  );

  const renderItem = ({ item }) => {
    return (
      <View style={styles.data}>
        <Text style={[styles.cell, {width: responsiveSize(150)}]}>{item.tap_historyTuptId}</Text>
        <Text style={[styles.cell, {width: responsiveSize(200)}]}>{`${item.tap_historyFirstname} ${item.tap_historyMiddlename} ${item.tap_historyLastname} `}</Text>
        <Text style={[styles.cell, {width: responsiveSize(150)}]}>{item.tap_historyCourse}</Text>
        <Text style={[styles.cell, {width: responsiveSize(100), paddingLeft: responsiveSize(16)}]}>{item.tap_historySection}</Text>
        <Text style={[styles.cell, {width: responsiveSize(250)}]}>{item.tap_historyEmail}</Text>
        <Text style={[styles.cell, {width: responsiveSize(230)}]}>{item.tap_historyDate}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView horizontal>
        <View style={styles.listContainer}>
          <View style={styles.header}>
            <Text style={[styles.headerTitle, {width: responsiveSize(150)}]}>TUPT-ID</Text>
            <Text style={[styles.headerTitle, {width: responsiveSize(200)}]}>Name</Text>
            <Text style={[styles.headerTitle, {width: responsiveSize(150)}]}>Course</Text>
            <Text style={[styles.headerTitle, {width: responsiveSize(100)}]}>Section</Text>
            <Text style={[styles.headerTitle, {width: responsiveSize(250)}]}>Email</Text>
            <Text style={[styles.headerTitle, {width: responsiveSize(230)}]}>Date</Text>
          </View>
          <FlatList 
            data={rfidData}
            renderItem={renderItem}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default StudentReport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25242B',
  },
  listContainer: {
    flex: 1,
    borderWidth: responsiveSize(1),
    borderColor: "white",
    marginHorizontal: responsiveSize(25),
    marginVertical: responsiveSize(40),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: responsiveSize(1), 
    borderColor: "white",  
    paddingVertical: responsiveSize(18),
    padding: responsiveSize(10),
  },
  headerTitle: {
    fontSize: responsiveSize(16),
    color: "white",
    fontWeight: "bold",
    textAlign: "left",
    flex: 1,
  },
  data: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: responsiveSize(10),
    borderBottomWidth: responsiveSize(1), 
    borderColor: "white",   
  },
  cell: {
    fontSize: responsiveSize(16),
    color: "white",
    textAlign: "left",
    flex: 1,
  }
});