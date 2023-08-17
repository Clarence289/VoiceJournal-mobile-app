import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, BackHandler } from 'react-native';
import { Audio } from 'expo-av';

const RecordingScreen = ({ navigation }) => {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [durationMillis, setDurationMillis] = useState(0);
  const [sound, setSound] = useState(null);

  useEffect(() => {
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [recording, sound]);

  const handleToggleRecording = async () => {
    if (isRecording) {
      await recording.stopAndUnloadAsync();
      setIsRecording(false);
      setRecordings([...recordings, recording.getURI()]);
      setRecording(null);
    } else {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        console.error('Permission to access audio is not granted');
        return;
      }

      const recordingObject = new Audio.Recording();
      await recordingObject.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      recordingObject.setOnRecordingStatusUpdate(handleRecordingStatusUpdate);
      
      if (!recording) {
        await recordingObject.startAsync();
      } else {
        await recordingObject.startAsync();
        await recordingObject.pauseAsync();
      }
      
      setRecording(recordingObject);
      setIsRecording(!isRecording);
    }
  };

  const handleRecordingStatusUpdate = ({ isRecording, durationMillis }) => {
    setIsRecording(isRecording);
    setDurationMillis(durationMillis);
  };

  const handlePlaySound = async (uri) => {
    const { sound } = await Audio.Sound.createAsync({ uri });
    setSound(sound);
    await sound.playAsync();
  };

  const handleDeleteRecording = (uri) => {
    if (sound) {
      sound.unloadAsync();
    }
    const updatedRecordings = recordings.filter((recordingUri) => recordingUri !== uri);
    setRecordings(updatedRecordings);
  };

  const handleBackPress = () => {
    if (isRecording) {
      handleToggleRecording();
      return true;
    }
    return false;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      backHandler.remove();
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [isRecording, sound]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Recording Screen</Text>
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={handleToggleRecording}
      >
        <Text style={styles.toggleButtonText}>
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Text>
      </TouchableOpacity>
      <FlatList
        data={recordings}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.recordingItem}>
            <Text>{item}</Text>
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => handlePlaySound(item)}
            >
              <Text style={styles.playButtonText}>Play</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteRecording(item)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.stopButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.stopButtonText}>Stop</Text>
      </TouchableOpacity>
      <Text style={styles.durationText}>
        Duration: {Math.floor(durationMillis / 1000)} seconds
      </Text>
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
  toggleButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 18,
  },
  recordingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  playButton: {
    backgroundColor: 'green',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 3,
    marginLeft: 10,
  },
  playButtonText: {
    color: 'white',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 3,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
  },
  stopButton: {
    backgroundColor: 'gray',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  stopButtonText: {
    color: 'white',
    fontSize: 18,
  },
  durationText: {
    marginTop: 10,
  },
});

export default RecordingScreen;
