import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ListNotesScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>List Notes Screen</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Recording')}
      >
        <Text style={styles.buttonText}>Go to Recording</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#CED2CC'
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default ListNotesScreen;
