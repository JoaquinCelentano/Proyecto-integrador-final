import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
Import Profile from './Src/Screens/Profile';
export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Profile/>  
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
