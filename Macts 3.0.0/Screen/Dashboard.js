import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, Dimensions, Modal, TouchableOpacity } from 'react-native';
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
  const [isCooldown, setIsCooldown] = useState(false);
  const [showExcessiveTappingModal, setShowExcessiveTappingModal] = useState(false);

  useEffect(() => {
    const socket = io('http://192.168.100.138:2727');

    socket.on('tagData', data => {
      console.log('Received tag data:', data);
      setTagData(prevTagData => [...prevTagData, data]);

      // Check if cooldown is active
      if (isCooldown && data === tagValue) {
        console.log("Excessive tapping detected. Please wait for a minute before tapping again.");
        setShowExcessiveTappingModal(true);
        return;
      }

      // Compare fetched student info with tagValue
      if (data === tagValue) {
        fetchStudentInfo(data); // Call fetchStudentInfo with data as argument
        setIsCooldown(true); // Activate cooldown
        setTimeout(() => {
          setIsCooldown(false); // Deactivate cooldown after 1 minute
        }, 60000); // 1 minute cooldown
     
      } else {
        console.log("Tag value doesn't match the student information.");
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [currentTap, isCooldown]); // Add tagValue to the dependency array

  useEffect(() => {
    const excessiveTappingTimer = setTimeout(() => {
      setShowExcessiveTappingModal(false);
    }, 60000); // 60 seconds

    return () => clearTimeout(excessiveTappingTimer);
  }, [showExcessiveTappingModal]);

  useEffect(() => {
    if (currentTap) {
      insertDataIntoDatabase(currentTap);
    }
  }, [currentTap]);

  const fetchStudentInfo = async (data) => {
    try {
      // Fetch student information based on user_id
      // This is just a placeholder, you need to implement this based on your API
      const response = await axios.get(`http://192.168.100.138:2525/studentinfo/${user_id}`);
      const fetchedStudentInfo = response.data[0];
      
      // Compare fetched student info with tagValue
      if (tagValue === data) {
        setStudentInfo(fetchedStudentInfo); // Set studentInfo state
        const currentTime = new Date().toLocaleString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
        });
        setCurrentTap({ ...fetchedStudentInfo, taggedAt: currentTime }); // Update currentTap state
        console.log('Student Info:', fetchedStudentInfo);
        setPreviousTap(currentTap);
      } else {
        console.log("Tag value doesn't match the student information.");
      }
    } catch (error) {
      console.error('Error fetching student information:', error);
    }
  };

  const insertDataIntoDatabase = async (data) => {
    try {
      // Send HTTP request to insert data into database
      await axios.post('http://192.168.100.138:2525/rfid_history', {
        firstName: data.studentInfo_first_name,
        middleName: data.studentInfo_middle_name,
        lastName: data.studentInfo_last_name,
        tuptId: data.studentInfo_tuptId,
        course: data.studentInfo_course,
        section: data.studentInfo_section,
        email: data.user_email,
        date: data.taggedAt,
        user_id: data.user_id,
      });
      // console.log('Data inserted into database:', data);
    } catch (error) {
      console.error('Error inserting data into database:', error);
    }
  };
  
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.tapTitle}>Current Tap</Text>
        <View style={styles.tapContainer}>
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
        <Modal
          animationType="slide"
          transparent={true}
          visible={showExcessiveTappingModal}
          onRequestClose={() => {
            setShowExcessiveTappingModal(false);
          }}
        >

          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                You've already tapped your RFID card. Please wait for a minute before tapping again.
              </Text>
              <TouchableOpacity
                style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                onPress={() => setShowExcessiveTappingModal(false)}
              >
                <Text style={styles.textStyle}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
      borderRadius: responsiveSize(12),
      shadowOffset: { width: 1, height: 1 },
      shadowColor: "black",
      shadowOpacity: 0.3,
    },
    tapTitle: {
      color: 'white',
      fontSize: responsiveSize(20),
      fontWeight: 'bold',
      marginBottom: responsiveSize(20),
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
      borderRadius: responsiveSize(100),
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
      marginBottom: responsiveSize(10),
    },
    studentTitle: {
      fontSize: responsiveSize(16),
      color: '#20AB7D',
      fontWeight: 'bold',
    },
    studentData: {
      color: 'white',
      marginLeft: 2,
      fontWeight: 'bold',
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
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: responsiveSize(22),
    },
    modalView: {
      margin: responsiveSize(20),
      backgroundColor: "white",
      borderRadius: responsiveSize(20),
      padding: responsiveSize(35),
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    openButton: {
      backgroundColor: "#F194FF",
      borderRadius: responsiveSize(20),
      padding: responsiveSize(10),
      elevation: 2
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    modalText: {
      marginBottom: responsiveSize(15),
      textAlign: "center"
    }
  });