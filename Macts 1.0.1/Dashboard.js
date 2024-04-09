import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, Dimensions } from 'react-native';
import io from 'socket.io-client';

const screenWidth = Dimensions.get('window').width;

const responsiveSize = (fontSize) => {
  const standardScreenWidth = 400;
  const scaleFactor = screenWidth / standardScreenWidth;
  const responsiveSize = Math.round(fontSize * scaleFactor);
  return responsiveSize;
};

const Dashboard = ({ route }) => {
  const { user_id } = route.params;
  const { tagValue } = route.params;

  const [tagData, setTagData] = useState([]);

  useEffect(() => {
    const socket = io('http://192.168.100.138:2727');

    socket.on('tagData', data => {
      console.log('Received tag data:', data);
      setTagData(prevTagData => [...prevTagData, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.studentInfoContainer}>
        <View>
          <Image 
            source={require('../img/account.png')}
            style={styles.studentProfile}
          />
        </View>

        <View style={styles.studentDataContainer}>
          <Text style={styles.studentName}>{user_id}</Text>

          <View style={styles.nestedStudentData}>
            <Text style={styles.studentTitle}>TUPT ID: </Text>
            <Text style={styles.studentData}></Text>
          </View>

          <View style={styles.nestedStudentData}>
            <Text style={styles.studentTitle}>Course: </Text>
            <Text style={styles.studentData}></Text>
          </View>

          <View style={styles.nestedStudentData}>
            <Text style={styles.studentTitle}>Section: </Text>
            <Text style={styles.studentData}>3D</Text>
          </View>

          <View style={styles.nestedStudentData}>
            <Text style={styles.studentTitle}>Time: </Text>
            <Text style={styles.studentData}>07:30:23 AM</Text>
          </View>

        </View>
      </View>

      <Text style={styles.displayText}>Previous</Text>
      <View style={styles.studentInfoContainer}>
        <View>
          <Image 
            source={require('../img/account.png')}
            style={styles.studentProfile}
          />
        </View>

        <View style={styles.studentDataContainer}>
          <Text style={styles.studentName}>John Sigfrido F. Maur</Text>

          <View style={styles.nestedStudentData}>
            <Text style={styles.studentTitle}>TUPT ID: </Text>
            <Text style={styles.studentData}>TUPT-21-0882</Text>
          </View>

          <View style={styles.nestedStudentData}>
            <Text style={styles.studentTitle}>Course: </Text>
            <Text style={styles.studentData}>BTVTEICT-CP</Text>
          </View>

          <View style={styles.nestedStudentData}>
            <Text style={styles.studentTitle}>Section: </Text>
            <Text style={styles.studentData}>3D</Text>
          </View>

          <View style={styles.nestedStudentData}>
            <Text style={styles.studentTitle}>Time: </Text>
            <Text style={styles.studentData}>02:18:23 PM</Text>
          </View>

        </View>
      </View>

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ marginBottom: 20, fontSize: 25, fontWeight: "bold", color: "white" }}>RFID Tag Data:</Text>
        {tagData.map((tag, index) => (
          <Text style={{ fontSize: 25, fontWeight: "bold", color: "white" }} key={index}>{tag}</Text>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    paddingTop: responsiveSize(35),
  },
  studentInfoContainer: {
    backgroundColor: '#25242B',
    marginHorizontal: responsiveSize(30),
    height: responsiveSize(210),
    width: responsiveSize(330),
    elevation: 2,
    borderRadius: 12,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "black",
    shadowOpacity: 0.3,
    flexDirection: 'row',
  },
  studentProfile: {
    width: responsiveSize(60),
    height: responsiveSize(60),
    resizeMode: 'contain',
    margin: responsiveSize(20),
    borderRadius: 100,
  },
  studentDataContainer: {
    marginTop: responsiveSize(35),
  },  
  studentName: {
    color: 'white',
    fontSize: responsiveSize(18),
    fontWeight: 'bold',
    marginBottom: responsiveSize(15),
  },
  nestedStudentData: {
    flexDirection: 'row',
    marginBottom: responsiveSize(8),
  },
  studentTitle: {
    fontSize: responsiveSize(16),
    color: '#20AB7D',
    fontWeight: 'bold',
  },
  studentData: {
    color: 'white',
    marginLeft: 2,
    fontWeight: 'bold'
  },  
  displayText: {
    color: 'white',
    fontSize: responsiveSize(22),
    fontWeight: 'bold',
    marginLeft: responsiveSize(20),
    marginTop: responsiveSize(30),
    marginBottom: responsiveSize(20),
  },
  tagDataTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
    marginLeft: responsiveSize(20),
  },
  tagData: {
    fontSize: 25,
    fontWeight: "bold",
    color: "white",
    marginLeft: responsiveSize(20),
  },
});
