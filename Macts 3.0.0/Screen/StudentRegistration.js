import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, SafeAreaView, Dimensions, Alert, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';

// Get the screen dimensions
const screenWidth = Dimensions.get('window').width;

// Calculate the responsive font size based on the screen width
const responsiveSize = (fontSize) => {
  const standardScreenWidth = 400; // Standard screen width (iPhone 8 width)
  const scaleFactor = screenWidth / standardScreenWidth;
  const responsiveSize = Math.round(fontSize * scaleFactor);
  return responsiveSize;
};

const StudentRegistration = ({ route, navigation }) => { 
  const { user_id } = route.params;

  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [user_email, setUser_email] = useState('');
  const [tuptId, setTuptId] = useState('');
  const [course, setCourse] = useState('');
  const [section, setSection] = useState('');
  const [isRegistered, setIsRegistered] = useState(false); // State to track registration status
  const [loading, setLoading] = useState(false); // State to track loading state

  // Function to check if the user is already registered
  const checkRegistrationStatus = async () => {
    try {
      const response = await axios.get(`http://192.168.100.138:2525/studentinfo/${user_id}`);
      // const response = await axios.get(`http://192.168.140.90:2525/studentinfo/${user_id}`);
      if (response.data.length > 0) {
        setIsRegistered(true);
      } else {
        setIsRegistered(false);
      }
    } catch (error) {
      console.error('Error checking registration status:', error);
    }
  };

  useEffect(() => {
    checkRegistrationStatus(); // Check registration status when the component mounts
  }, []);

  const handleRegister = async () => {
    if (!firstName || !middleName || !lastName || !user_email || !tuptId || !course || !section) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true); // Set loading state to true while registering

    try {
      const response = await axios.post('http://192.168.100.138:2525/student_registration', {
      // const response = await axios.post('http://192.168.140.90:2525/student_registration', {
        firstName,  
        middleName,
        lastName,
        tuptId,
        course,
        section,
        user_id,
        user_email,
      });
      // Handle successful registration
      setIsRegistered(true);
      console.log('Registered successfully:', response.data);
      // Handle successful signup
      navigation.navigate('StudentInfo', {user_id: user_id});
      Alert.alert('Registration Successful', 'You have been registered successfully!');
    } catch (error) {
      console.error('Error registration:', error);
      Alert.alert('Registration Failed', 'Failed to register. Please try again later.');
    } finally {
      setLoading(false); // Set loading state to false after registration attempt
    }
  };

  return (
    <SafeAreaView style={[isRegistered ? styles.whiteBackground : styles.container]}>
      {isRegistered ? (
        <View style={styles.registeredContainer}>
          <Text style={styles.registeredText}>You are already registered!</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContentContainer}
        >
          {loading ? ( // Display ActivityIndicator while loading
            <ActivityIndicator size="large" color="#20AB7D" />
          ) : (
            <>
              <TouchableOpacity>
                <Image
                  source={require('../img/account.png')}
                  style={styles.logo}
                />
              </TouchableOpacity>
              
              <View style={styles.inputContainer}>
                <Image
                  source={require('../img/icons/name.png')}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="First name"
                  placeholderTextColor="gray"
                  onChangeText={setFirstName}
                  isRequired
                />
              </View>
              <View style={styles.inputContainer}>
                <Image
                  source={require('../img/icons/name.png')}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Middle name"
                  placeholderTextColor="gray"
                  onChangeText={setMiddleName}
                  isRequired
                />
              </View>
              <View style={styles.inputContainer}>
                <Image
                  source={require('../img/icons/name.png')}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Last name"
                  onChangeText={setLastName}
                  placeholderTextColor="gray"
                  isRequired
                />
              </View>

              <View style={styles.inputContainer}>
                <Image
                  source={require('../img/icons/email.png')}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  onChangeText={setUser_email}
                  placeholderTextColor="gray"
                  isRequired
                />
              </View>

              <View style={styles.inputContainer}>
                <Image
                  source={require('../img/icons/name.png')}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="TUPT-ID No."
                  onChangeText={setTuptId}
                  placeholderTextColor="gray"
                  isRequired
                />
              </View>
              <View style={styles.inputContainer}>
                <Image
                  source={require('../img/icons/name.png')}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Course"
                  onChangeText={setCourse}
                  placeholderTextColor="gray"
                  isRequired
                />
              </View>
              <View style={styles.inputContainer}>
                <Image
                  source={require('../img/icons/name.png')}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Section"
                  onChangeText={setSection}
                  placeholderTextColor="gray"
                  isRequired
                />
              </View>

              <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
                <Text style={styles.registerText}>Register</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default StudentRegistration;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  whiteBackground: {
    backgroundColor: 'white',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: responsiveSize(120),
    width: responsiveSize(120),
    resizeMode: 'contain',
    marginBottom: responsiveSize(35),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#17171B',
    borderRadius: 15,
    marginBottom: responsiveSize(14),
    height: responsiveSize(55),
    width: '80%',
  },
  inputIcon: {
    width: responsiveSize(20),
    height: responsiveSize(20),
    marginLeft: responsiveSize(15),
    marginRight: responsiveSize(10),
    resizeMode: 'contain',
  },
  input: {
    flex: 1,
    color: 'white',
    padding: responsiveSize(12),
    fontSize: responsiveSize(14),
    paddingLeft: 0,
  },
  registerBtn: {
    marginTop: responsiveSize(25),
    backgroundColor: '#20AB7D',
    paddingVertical: responsiveSize(14),
    borderRadius: responsiveSize(15),
    alignItems: 'center',
    width: '80%',
    marginBottom: responsiveSize(35),
  },
  registerText: {
    color: 'white',
    fontSize: responsiveSize(16),
  },
  registeredContainer: {
    marginTop: responsiveSize(350),
    marginBottom: responsiveSize(410),
  },
  registeredText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    height: responsiveSize(50),
  },
});