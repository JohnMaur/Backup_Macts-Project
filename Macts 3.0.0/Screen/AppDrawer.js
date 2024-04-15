import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Image, SafeAreaView, Dimensions } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import StudentInfo from './StudentInfo';
import Dashboard from './Dashboard';
import StudentRegistration from './StudentRegistration';
import UpdateInfo from './UpdateInfo';
import StudentReport from './StudentReport';

const Drawer = createDrawerNavigator();

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

const CustomDrawerContent = ({ navigation, state, username, user_id, tagValue }) => {

  const logOutNav = () => {
    navigation.navigate('Login');
  };
 
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View style={styles.profileContainer}>
          <TouchableOpacity>
            <Image 
              source={require('../img/account.png')}
              style={styles.profileIcon}
            />
          </TouchableOpacity>
          <Text style={styles.profileName}>{username}</Text>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: state.routes[state.index].name === 'StudentInfo' ? '#20AB7D' : '#1B1A1E',
            paddingVertical: 16,
            paddingHorizontal: 16,
            borderRadius: 5,
          }}
          onPress={() => navigation.navigate('StudentInfo', { user_id: user_id })}
        >
        <View style={styles.navContainer}>
          <Image 
            source={require('../img/nav-icon/student_info.png')}
            style={styles.drawerIcon}
          />
          <Text style={styles.drawerLabel}>Profile</Text>
        </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: state.routes[state.index].name === 'Dashboard' ? '#20AB7D' : '#1B1A1E',
            paddingVertical: 16,
            paddingHorizontal: 16,
            borderRadius: 5,
          }}
          onPress={() => navigation.navigate('Dashboard', { user_id: user_id, tagValue: tagValue})}
        >
        <View style={styles.navContainer}>
          <Image 
            source={require('../img/nav-icon/dashboardIcon.png')}
            style={styles.drawerIcon}
          />
          <Text style={styles.drawerLabel}>Dashboard</Text>
        </View>
        </TouchableOpacity>


        {/* <TouchableOpacity
          style={{
            backgroundColor: state.routes[state.index].name === 'Student Registration' ? '#20AB7D' : '#1B1A1E',
            paddingVertical: 16,
            paddingHorizontal: 16,
            borderRadius: 5,
          }}
          onPress={() => navigation.navigate('Student Registration', { user_id: user_id })}
        >
          <View style={styles.navContainer}>
            <Image 
              source={require('../img/nav-icon/registration.png')}
              style={styles.drawerIcon}
            />
            <Text style={styles.drawerLabel}>Student Registration</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: state.routes[state.index].name === 'Update Information' ? '#20AB7D' : '#1B1A1E',
            paddingVertical: 16,
            paddingHorizontal: 16,
            borderRadius: 5,
          }}
          onPress={() => navigation.navigate('Update Information', { user_id: user_id })}
        >
          <View style={styles.navContainer}>
            <Image 
              source={require('../img/nav-icon/update.png')}
              style={styles.drawerIcon}
            />
            <Text style={styles.drawerLabel}>Update Information</Text>
          </View>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={{
            backgroundColor: state.routes[state.index].name === 'Student Report' ? '#20AB7D' : '#1B1A1E',
            paddingVertical: 16,
            paddingHorizontal: 16,
            borderRadius: 5,
          }}
          onPress={() => navigation.navigate('Student Report', { user_id: user_id })}
        >
          <View style={styles.navContainer}>
            <Image 
              source={require('../img/nav-icon/report.png')}
              style={styles.drawerIcon}
            />
            <Text style={styles.drawerLabel}>Report</Text>
          </View>
        </TouchableOpacity>
 
      </View>
      <TouchableOpacity onPress={logOutNav}>
        <Text style={styles.logOutButton}>Log Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export const AppDrawer = ({ route }) => {
  const { username } = route.params;
  const { user_id } = route.params;
  const { tagValue } = route.params;

  return (
    <Drawer.Navigator 
      drawerContent={props => <CustomDrawerContent {...props} username={username} 
      user_id={user_id}
      tagValue={tagValue}
    />}
       screenOptions={{
        headerStyle: {
          backgroundColor: "#25242B",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: 'bold',
          letterSpacing: 1,
        },
      }}
    >
      <Drawer.Screen 
        name="StudentInfo" 
        component={StudentInfo} 
        initialParams={{ user_id: user_id, }}
        options={{
        title: 'My Profile'
        }} 
      />
      <Drawer.Screen name="Dashboard" component={Dashboard} />
      <Drawer.Screen 
        name="Student Registration" 
        component={StudentRegistration} 
      />
      <Drawer.Screen 
        name="Update Information" 
        component={UpdateInfo} 
      />
      <Drawer.Screen 
        name="Student Report" 
        component={StudentReport} 
      />
    </Drawer.Navigator>
  );
};

export default AppDrawer;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#1B1A1E',
    paddingTop: StatusBar.currentHeight,
    justifyContent: 'space-between',
  },
  profileContainer: {
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    height: responsiveSize(100),
    flexDirection: 'row',
    elevation: 1,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: responsiveSize(10),
    paddingHorizontal: responsiveSize(16),
  },
  profileIcon: {
    width: responsiveSize(50),
    height: responsiveSize(50),
    resizeMode: 'contain',
    borderRadius: 100,
    marginRight: responsiveSize(12),
  },
  profileName: {
    color: 'white',
    fontSize: responsiveSize(18),
  },
  navContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawerIcon: {
    width: responsiveSize(20),
    height: responsiveSize(20),
    resizeMode: 'contain',
    marginRight: responsiveSize(10),
  },
  drawerLabel: {
    fontSize: responsiveSize(16),
    color: 'white',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  logOutButton: {
    color: 'white',
    backgroundColor: '#35343B',
    width: '80%',
    marginHorizontal: responsiveSize(30),
    padding: responsiveSize(10),
    textAlign: 'center',
    borderRadius: 10,
    fontSize: responsiveSize(16),
    fontWeight: 'bold',
    marginBottom: responsiveSize(30),
  },
});