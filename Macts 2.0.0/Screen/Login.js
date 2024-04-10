import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import axios from 'axios'; // Import axios for making HTTP requests
import { useNavigation, useFocusEffect } from '@react-navigation/native';

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

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState([]);

  const navigation = useNavigation();

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://192.168.100.138:2525/users');
      // const response = await axios.get('http://192.168.140.90:2525/users');
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
 
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    fetchUserData(); // Fetch user data on every render
  }, []); // No dependencies, so it runs only once when the component mounts

  useFocusEffect(
    React.useCallback(() => {
      fetchUserData();
    }, [])
  );

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  const handleLogin = () => {
    const user = userData.find(user => user.user_name === username && user.user_password === password);
    if (user) {
      // Fetch user data again after login
      fetchUserData().then(() => {
        // Navigate to the appropriate screen based on the user's role or status
        navigation.replace('AppDrawer', { username: user.user_name, user_id: user.user_id, tagValue: user.tagValue});
      });
    } else {
      Alert.alert('Invalid username or password');
    }
  };
 
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
 
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      // Reset password visibility when navigating away from SignUp screen
      setShowPassword(false);
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
              onChangeText={(text) => setUsername(text)}
              value={username}
              isRequired
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
              onChangeText={(text) => setPassword(text)}
              value={password}
              isRequired
            />
            <TouchableWithoutFeedback onPress={togglePasswordVisibility}>
              <Image
                source={showPassword ? require('../img/icons/show.png') : require('../img/icons/hide.png')}
                style={styles.passwordIcon}
              />
            </TouchableWithoutFeedback>
          </View>
        

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSignUp}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>

          <View style={styles.iconContainer}>
            <View style={styles.icons}>
              <TouchableOpacity>
                <Image 
                  style={styles.icon}
                  source={require('../img/icons/facebook.png')}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.icons}>
              <TouchableOpacity>
                <Image 
                  style={styles.icon}
                  source={require('../img/icons/google.png')}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.icons}>
              <TouchableOpacity>
                <Image 
                  style={styles.icon}
                  source={require('../img/icons/mobile.png')}
                />
              </TouchableOpacity>
            </View>

          </View>

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>By using MACT’s, you are agreeing to our</Text>
            <TouchableOpacity >
              <Text style={styles.termOfServiceLink}>Terms of Service</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Styles for the components
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    height: '30%',
    marginTop: responsiveSize(100),
    resizeMode: 'contain',
  },
  textInputContainer: {
    width: '80%',
  },
  input: {
    flex: 1,
    paddingVertical: '5%',
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#17171B',
    borderRadius: 15,
    marginBottom: '3%',
  },
  inputIcon: {
    width: responsiveSize(20),
    height: responsiveSize(20),
    marginLeft: responsiveSize(15),
    marginRight: responsiveSize(10),
    resizeMode: 'contain',
  },
  loginButton: {
    marginTop: '4%',
    backgroundColor: '#35343B',
    paddingVertical: '3%',
    borderRadius: 15,
    alignItems: 'center',
  },
  buttonText: {
    marginTop: responsiveSize(4),
    marginBottom: responsiveSize(4),
    color: 'white',
    fontSize: responsiveSize(16),
  },
  signUpLink: {
    color: '#61DBB2',
    fontSize: responsiveSize(16),
    marginTop: '4%',
    textAlign: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    height: '10%',
    justifyContent: 'center',
    marginBottom: responsiveSize(30),
  },
  icons: {
    marginTop: '8%',
    backgroundColor: '#2F2E35',
    borderWidth: 0.5,
    borderRadius: 10,
    borderColor: '#20AB7D',
    height: responsiveSize(55),
    width: responsiveSize(75),
    marginRight: '4%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    height: responsiveSize(30),
    width: responsiveSize(30),
    resizeMode: 'contain',
  },
  footerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '12%',
  },
  footerText: {
    fontSize: responsiveSize(14),
    color: 'white'
  },
  termOfServiceLink: {
    color: '#61DBB2',
    marginTop: '2%',
  },
  passwordIcon: {
    width: '6%',
    height: '75%',
    marginRight: '5%',
    resizeMode: 'contain',
  },
});

export default Login;