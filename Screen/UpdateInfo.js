import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, SafeAreaView, Dimensions, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

// Get the screen dimensions
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// Calculate the responsive font size based on the screen width
const responsiveSize = (fontSize) => {
  const standardScreenWidth = 400; // Standard screen width (iPhone 8 width)
  const scaleFactor = screenWidth / standardScreenWidth;
  const responsiveSize = Math.round(fontSize * scaleFactor);
  return responsiveSize;
};


const UpdateInfo = ({ route, navigation }) => { 
  const { user_id } = route.params;
  const [updateInfo, setUpdateInfo] = useState(null);

  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [user_email, setUser_email] = useState('');
  const [tuptId, setTuptId] = useState('');
  const [course, setCourse] = useState('');
  const [section, setSection] = useState('');
  const [allInputsFilled, setAllInputsFilled] = useState(false); // State to track if all inputs are filled
  const [loading, setLoading] = useState(false); // State to track loading state

  useEffect(() => {
    // Check if all inputs are filled
    const inputsFilled = firstName && middleName && lastName && user_email && tuptId && course && section;
    setAllInputsFilled(inputsFilled);
  }, [firstName, middleName, lastName, user_email, tuptId, course, section]);


  const handleUpdate = () => {
    // Check if any input field is empty
    if (!firstName || !middleName || !lastName || !user_email || !tuptId || !course || !section) {
      Alert.alert('Error', 'Please fill out all input fields');
      return; 
    }

    setLoading(true); // Set loading state to true while updating

    // Make an HTTP request to update the student information
    axios.post(`http://192.168.100.138:2525/update_studentinfo/${user_id}`, {
    // axios.post(`http://192.168.140.90:2525/update_studentinfo/${user_id}`, {
      firstName,
      middleName,
      lastName,
      user_email,
      tuptId,
      course,
      section,
    })
    .then(response => {
      // Handle success
      navigation.navigate('StudentInfo', {user_id: user_id});
      console.log('Update successful:', response.data);
      Alert.alert('Update successful');
    })
    .catch(error => {
      // Handle error
      console.error('Error updating student information:', error);
      Alert.alert('Error', 'Failed to update information');
    })
    .finally(() => {
      setLoading(false); // Set loading state to false after updating attempt
    });
  };

  const fetchUpdateInfo = async () => {
    try {
      setLoading(true); // Set loading state to true while fetching
      const response = await axios.get(`http://192.168.100.138:2525/studentinfo/${user_id}`);
      // const response = await axios.get(`http://192.168.140.90:2525/studentinfo/${user_id}`);
      setUpdateInfo(response.data[0]); // Assuming only one student info is returned
    } catch (error) {
      console.error('Error fetching student information:', error);
    } finally {
      setLoading(false); // Set loading state to false after fetching
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUpdateInfo();
    }, [])
  );

  const handleRegisterLink = () => {
    navigation.navigate('Student Registration', {user_id: user_id});
  };

  return (
    <SafeAreaView style={[styles.container, updateInfo ? null : styles.whiteBackground]}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#20AB7D" animating={loading} />
        </View>
      ) : updateInfo ? (
        <>       
          <ScrollView 
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContentContainer}
          >
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

            <TouchableOpacity 
              style={[styles.registerBtn, !allInputsFilled && styles.disabledBtn]} 
              onPress={() => {
                if (!allInputsFilled) {
                  Alert.alert('Incomplete Information', 'Please fill out all input fields before updating.');
                } else {
                  handleUpdate();
                }
              }}
            >
              <Text style={styles.registerText}>Update</Text>
            </TouchableOpacity>
          </ScrollView>
        </> 
      ) : (
        <View style={styles.registerFirstContainer}>
          <Text style={styles.registerFirstText}>No data, register first</Text>
          <TouchableOpacity style={styles.registerButton} onPress={handleRegisterLink}>
            <Text style={styles.registerBtnText}>Register</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default UpdateInfo;

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
  registerFirstContainer: {
    marginTop: responsiveSize(330),
    alignItems: 'center',
  },
  registerText: {
    color: 'white',
    fontSize: responsiveSize(16),
  },
  registerFirstText: {
    color: 'black',
    fontSize: responsiveSize(24),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  registerButton: {
    marginTop: responsiveSize(12),
    backgroundColor: 'black',
    paddingVertical: responsiveSize(13),
    borderRadius: responsiveSize(15),
    alignItems: 'center',
    width: '50%',
    alignSelf: 'center',
  },
  registerBtnText: {
    color: 'white',
    fontWeight: 'bold',
    letterSpacing: 1,
    fontSize: responsiveSize(16),
  },
  disabledBtn: {
    backgroundColor: '#888', // Use a different color for disabled button
  },
});