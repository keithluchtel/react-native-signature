import { StatusBar } from 'expo-status-bar';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {Canvas} from "react-native-signature";
import {GestureHandlerRootView} from "react-native-gesture-handler";

export default function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <StatusBar style="auto" />
      <SafeAreaView style={styles.container}>
        <Text>Open up App.tsx to start working on your app!</Text>
        <View style={styles.section}>
          <Canvas />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  section: {
    flex: 1
  }
});
