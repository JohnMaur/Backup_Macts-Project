import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StudentReport = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>Student report</Text>
    </View>
  );
};

export default StudentReport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Adjust background color as needed
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 20,
  },
});
