import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, Dimensions } from 'react-native';
import io from 'socket.io-client';
import axios from 'axios';

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
  const [studentInfo, setStudentInfo] = useState(null);
  const [currentTap, setCurrentTap] = useState(null);
  const [previousTap, setPreviousTap] = useState(null);

  useEffect(() => {
    const socket = io('http://192.168.100.138:2727');

    socket.on('tagData', data => {
      console.log('Received tag data:', data);
      setTagData(prevTagData => [...prevTagData, data]);

      // Compare fetched student info with tagValue
      if (data === tagValue) {
        fetchStudentInfo(data); // Call fetchStudentInfo with data as argument
      } else {
        console.log("Tag value does not match fetched student info, skipping...");
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [currentTap]); // Add tagValue to the dependency array

  const fetchStudentInfo = async (data) => {
    try {
      // Fetch student information based on user_id
      // This is just a placeholder, you need to implement this based on your API
      const response = await axios.get(`http://192.168.100.138:2525/studentinfo/${user_id}`);
      const fetchedStudentInfo = response.data[0];
      
      // Compare fetched student info with tagValue
      if (tagValue === data) {
        setStudentInfo(fetchedStudentInfo); // Set studentInfo state
        const currentTime = new Date().toLocaleTimeString(); // Get current time
        setCurrentTap({ ...fetchedStudentInfo, taggedAt: currentTime }); // Update currentTap state
        setPreviousTap(currentTap);
      } else {
        console.log("Tag value does not match fetched student info, skipping...");
      }
    } catch (error) {
      console.error('Error fetching student information:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tapContainer}>
        <Text style={styles.tapTitle}>Current Tap</Text>
        {currentTap ? (
          <View style={styles.studentInfoContainer}>
            <Image 
              source={require('../img/account.png')}
              style={styles.studentProfile}
            />
            <View style={styles.studentDataContainer}>
              <Text style={styles.studentName}>{`${currentTap.studentInfo_first_name} ${currentTap.studentInfo_middle_name} ${currentTap.studentInfo_last_name}`}</Text>
              <View style={styles.nestedStudentData}>
                <Text style={styles.studentTitle}>TUPT ID: </Text>
                <Text style={styles.studentData}>{currentTap.studentInfo_tuptId}</Text>
              </View>
              <View style={styles.nestedStudentData}>
                <Text style={styles.studentTitle}>Course: </Text>
                <Text style={styles.studentData}>{currentTap.studentInfo_course}</Text>
              </View>
              <View style={styles.nestedStudentData}>
                <Text style={styles.studentTitle}>Section: </Text>
                <Text style={styles.studentData}>{currentTap.studentInfo_section}</Text>
              </View>
              <View style={styles.nestedStudentData}>
                <Text style={styles.studentTitle}>Email: </Text>
                <Text style={styles.studentData}>{currentTap.user_email}</Text>
              </View>
              <View style={styles.nestedStudentData}>
                <Text style={styles.studentTitle}>Time: </Text>
                <Text style={styles.studentData}>{currentTap.taggedAt}</Text>
              </View>
            </View>
          </View>
        ) : (
          <Text style={styles.noStudentInfoText}>Tap your RFID tag</Text>
        )}
      </View>

      <Text style={styles.displayText}>Previous Tap</Text>
      <View style={styles.tapContainer}>
        {previousTap ? (
          <View style={styles.studentInfoContainer}>
            <Image 
              source={require('../img/account.png')}
              style={styles.studentProfile}
            />
            <View style={styles.studentDataContainer}>
              <Text style={styles.studentName}>{`${previousTap.studentInfo_first_name} ${previousTap.studentInfo_middle_name} ${previousTap.studentInfo_last_name}`}</Text>
              <View style={styles.nestedStudentData}>
                <Text style={styles.studentTitle}>TUPT ID: </Text>
                <Text style={styles.studentData}>{previousTap.studentInfo_tuptId}</Text>
              </View>
              <View style={styles.nestedStudentData}>
                <Text style={styles.studentTitle}>Course: </Text>
                <Text style={styles.studentData}>{previousTap.studentInfo_course}</Text>
              </View>
              <View style={styles.nestedStudentData}>
                <Text style={styles.studentTitle}>Section: </Text>
                <Text style={styles.studentData}>{previousTap.studentInfo_section}</Text>
              </View>
              <View style={styles.nestedStudentData}>
                <Text style={styles.studentTitle}>Email: </Text>
                <Text style={styles.studentData}>{previousTap.user_email}</Text>
              </View>
              <View style={styles.nestedStudentData}>
                <Text style={styles.studentTitle}>Time: </Text>
                <Text style={styles.studentData}>{previousTap.taggedAt}</Text>
              </View>
            </View>
          </View>
        ) : (
          <Text style={styles.noStudentInfoText}>Tap your RFID tag</Text>
        )}
      </View>

      {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ marginBottom: 20, fontSize: 25, fontWeight: "bold", color: "white" }}>RFID Tag Data:</Text>
        {tagData.map((tag, index) => (
          <Text style={{ fontSize: 25, fontWeight: "bold", color: "white" }} key={index}>{tag}</Text>
        ))}
      </View> */}
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
  tapContainer: {
    backgroundColor: '#25242B',
    marginHorizontal: responsiveSize(30),
    marginBottom: responsiveSize(20),
    elevation: 2,
    borderRadius: 12,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "black",
    shadowOpacity: 0.3,
  },
  tapTitle: {
    color: 'white',
    fontSize: responsiveSize(20),
    fontWeight: 'bold',
    marginVertical: responsiveSize(10),
    marginLeft: responsiveSize(20),
  },
  studentInfoContainer: {
    flexDirection: 'row',
  },
  studentProfile: {
    width: responsiveSize(50),
    height: responsiveSize(50),
    resizeMode: 'contain',
    margin: responsiveSize(15),
    borderRadius: 100,
  },
  studentDataContainer: {
    marginTop: responsiveSize(20),
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
  noStudentInfoText: {
    color: 'white',
    height: responsiveSize(100),
    fontSize: responsiveSize(18),
    fontWeight: 'bold',
    marginLeft: responsiveSize(20),
    marginTop: responsiveSize(20),
    paddingBottom: responsiveSize(20),
  },
});
