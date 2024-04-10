import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

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

const SignUp = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://192.168.100.138:2525/users');
      // const response = await axios.get('http://192.168.140.90:2525/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };

  const handleSignUp = async () => {
    if (!username || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
  
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://192.168.100.138:2525/signup', {
      // const response = await axios.post('http://192.168.140.90:2525/signup', {
        username,
        password,
      });
      // Handle successful signup
      console.log('Signup successful:', response.data);
      Alert.alert('Signup successful');
      await fetchUserData(); // Fetch user data
      navigation.navigate('Login'); // Navigate to the login screen
    } catch (error) {
      console.error('Error signing up:', error);
      Alert.alert('Error', 'Failed to sign up');
    }    
  };

  const handleLoginLink = () => {
    navigation.navigate('Login');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      // Reset password visibility when navigating away from SignUp screen
      setShowPassword(false);
      setShowConfirmPassword(false);
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        enabled
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
       
        <View style={styles.content}>
          <Image 
            source={require('../img/macts_logo.png')} 
            style={styles.logo}
          />
          <View style={styles.textInputContainer}>
            <View style={styles.inputContainer}>
              <Image 
                source={require('../img/icons/name.png')} 
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="lightgray"
                onChangeText={setUsername}
              />
            </View>
            <View style={styles.inputContainer}>
              <Image 
                source={require('../img/icons/password.png')} 
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="lightgray"
                secureTextEntry={!showPassword}
                onChangeText={setPassword}
              />
              <TouchableWithoutFeedback onPress={togglePasswordVisibility}>
                <Image
                  source={showPassword ? require('../img/icons/show.png') : require('../img/icons/hide.png')}
                  style={styles.passwordIcon}
                />
              </TouchableWithoutFeedback>
            </View>
            <View style={styles.inputContainer}>
              <Image 
                source={require('../img/icons/password.png')} 
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="lightgray"
                secureTextEntry={!showConfirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableWithoutFeedback onPress={toggleConfirmPasswordVisibility}>
                <Image
                  source={showConfirmPassword ? require('../img/icons/show.png') : require('../img/icons/hide.png')}
                  style={styles.passwordIcon}
                />
              </TouchableWithoutFeedback>
            </View>
          

            <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLoginLink}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>

            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>By using MACT’s, you are agreeing to our</Text>
              <TouchableOpacity >
                <Text style={styles.termOfServiceLink}>Terms of Service</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1E1E1E'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    height: '30%',
    marginTop: responsiveSize(90),
    resizeMode: 'contain', 
  },
  textInputContainer: {
    width: '100%',
    marginBottom: responsiveSize(50),
  },
  input: {
    flex: 1,
    paddingVertical: '4.4%',
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#17171B',
    borderRadius: 15,
    marginBottom: '4%',
  },
  inputIcon: {
    width: '7%',
    height: '40%',
    marginLeft: '6%',
    marginRight: responsiveSize(10),
    resizeMode: 'contain',
  },
  loginLink: {
    color: '#61DBB2',
    fontSize: responsiveSize(16),
    marginTop: '3.5%',
    textAlign: 'center',
  },
  signUpButton: {
    marginTop: '8%',
    backgroundColor: '#20AB7D',
    paddingVertical: '4.4%',
    borderRadius: 15,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  footerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '12%',
  },
  footerText: {
    fontSize: responsiveSize(14),
    color: 'white',
  },
  termOfServiceLink: {
    color: '#61DBB2',
    marginTop: '2.5%',
  }, 
  passwordIcon: {
    width: '6%',
    height: '75%',
    marginRight: '5%',
    resizeMode: 'contain',
  },
});

export default SignUp;