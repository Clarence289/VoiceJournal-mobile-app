import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ListNotesScreen from '/src/Components/ListNotesScreen';
import RecordingScreen from '/src/Components/RecordingScreen';
import PlaybackScreen from '/src/Components/PlaybackScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="List">
        <Stack.Screen name="List" component={ListNotesScreen} />
        <Stack.Screen name="Recording" component={RecordingScreen} />
        <Stack.Screen name="Playback" component={PlaybackScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
