import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// Get the screen dimensions
const screenWidth = Dimensions.get('window').width;

// Calculate the responsive font size based on the screen width
const responsiveSize = (fontSize) => {
  const standardScreenWidth = 400; 
  const scaleFactor = screenWidth / standardScreenWidth;
  const responsiveSize = Math.round(fontSize * scaleFactor);
  return responsiveSize;
};
  
const StudentInfo = ({ route }) => {
  const navigation = useNavigation();
  const { user_id } = route.params;
  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(true); // State to track loading state

  const fetchStudentInfo = async () => {
    try {
      const response = await axios.get(`http://192.168.100.138:2525/studentinfo/${user_id}`);
      // const response = await axios.get(`http://192.168.140.90:2525/studentinfo/${user_id}`);
      setStudentInfo(response.data[0]); // Assuming only one student info is returned
    } catch (error) {
      console.error('Error fetching student information:', error);
    } finally {
      setLoading(false); // Set loading state to false after fetching data
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchStudentInfo();
    }, [])
  );
 
  const handleRegisterLink = () => {
    navigation.navigate('Student Registration', {user_id: user_id});
  };

  // const handleUpdateLink = () => {
  //   navigation.navigate('Update Information', {user_id: user_id});
  // };

  const handleUpdateLink = () => {
    navigation.navigate('Update Information', { user_id: user_id, studentInfo: studentInfo });
  };
  
  return (
    <SafeAreaView style={[styles.container, studentInfo ? null : styles.whiteBackground]}>
      <View style={[styles.studentInfoMainContainer, loading && styles.loadingContainer]}>
        {loading ? ( // Render ActivityIndicator while loading
          <ActivityIndicator size="large" color="#20AB7D" />
        ) : (
          <>
            {studentInfo ? (
              <>
                <View style={styles.studentInfoBoxContainer}>
                  <TouchableOpacity>
                    <Image
                      source={require('../img/account.png')}
                      style={styles.profileIcon}
                    />
                  </TouchableOpacity>
                  <View style={styles.studentInfoContainer}>
                    <Text style={styles.descriptionStudentInfo}>Name:</Text>
                    <Text style={styles.studentInfo}>{`${studentInfo.studentInfo_first_name} ${studentInfo.studentInfo_middle_name} ${studentInfo.studentInfo_last_name}`}</Text>
                  </View>

                  <View style={styles.studentInfoContainer}>
                    <Text style={styles.descriptionStudentInfo}>TUPT-ID:</Text>
                    <Text style={styles.studentInfo}>{studentInfo.studentInfo_tuptId}</Text>
                  </View>
 
                  <View style={styles.studentInfoContainer}>
                    <Text style={styles.descriptionStudentInfo}>Email:</Text>
                    <Text style={styles.studentInfo}>{studentInfo.user_email}</Text>
                  </View>

                  <View style={styles.studentInfoContainer}>
                    <Text style={styles.descriptionStudentInfo}>Course:</Text>
                    <Text style={styles.studentInfo}>{studentInfo.studentInfo_course}</Text>
                  </View>

                  <View style={styles.studentInfoContainer}>
                    <Text style={styles.descriptionStudentInfo}>Section:</Text>
                    <Text style={styles.studentInfo}>{studentInfo.studentInfo_section}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.EditBtn} onPress={handleUpdateLink}>
                  <Text style={styles.EditText}>Update</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.registerFirstContainer}>
                <Text style={styles.registerFirstText}>No data, register first</Text>
                <TouchableOpacity style={styles.registerBtn} onPress={handleRegisterLink}>
                  <Text style={styles.registerText}>Register</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default StudentInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  whiteBackground: {
    backgroundColor: 'white',
    justifyContent: 'center'
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    height: responsiveSize(90),
    width: responsiveSize(90),
    resizeMode: 'contain',
    marginBottom: responsiveSize(20),
    marginTop: responsiveSize(30),
    marginLeft: responsiveSize(30),
  },
  studentInfoMainContainer: {
    marginBottom: responsiveSize(50),
    flex: 1,
    justifyContent: 'space-between',
  },
  studentInfoBoxContainer: {
    backgroundColor: '#25242B',
    elevation: 2,
    borderRadius: responsiveSize(20),
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "black",
    shadowOpacity: 0.3,
    marginTop: responsiveSize(40),
    marginHorizontal: responsiveSize(20),
    paddingBottom: responsiveSize(20),
  },
  studentInfoContainer: {
    flexDirection: 'row',
    marginHorizontal: responsiveSize(30),
    marginBottom: responsiveSize(12),
  },
  descriptionStudentInfo: {
    color: '#20AB7D',
    fontSize: responsiveSize(18),
    fontWeight: 'bold',
    marginRight: responsiveSize(10),
  },
  studentInfo: {
    fontSize: responsiveSize(18),
    color: 'white',
  },
  EditBtn: {
    marginTop: responsiveSize(30),
    backgroundColor: '#20AB7D',
    paddingVertical: responsiveSize(12),
    borderRadius: responsiveSize(15),
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
  },
  EditText: {
    color: 'white',
    fontWeight: 'bold',
    letterSpacing: 1,
    fontSize: responsiveSize(18),
  },
  registerFirstContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  registerFirstText: {
    color: 'black',
    fontSize: responsiveSize(24),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  registerBtn: {
    marginTop: responsiveSize(12),
    backgroundColor: 'black',
    paddingVertical: responsiveSize(13),
    borderRadius: responsiveSize(15),
    alignItems: 'center',
    width: '50%',
    alignSelf: 'center',
  },
  registerText: {
    color: 'white',
    fontWeight: 'bold',
    letterSpacing: 1,
    fontSize: responsiveSize(16),
  }
});
