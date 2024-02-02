import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import {
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Canvas, CanvasHandle } from "react-native-signature";

export default function App() {
  const canvasRef = useRef<CanvasHandle>(null);
  const [image, setImage] = useState<string | undefined>(undefined);
  const resetHandler = () => {
    canvasRef.current?.clearCanvas();
  };

  const captureHandler = () => {
    const skiaImage = canvasRef.current?.makeImageSnapshot();
    if (skiaImage) {
      setImage(skiaImage.encodeToBase64());
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <SafeAreaView style={styles.container}>
        <Text>Open up App.tsx to start working on your app!</Text>
        <Button title="Reset" onPress={resetHandler} />
        <Button title="Capture" onPress={captureHandler} />
        {image && (
          <Image
            style={{ width: 100, height: 200 }}
            resizeMode="contain"
            resizeMethod="scale"
            source={{ uri: `data:image/png;base64,${image}` }}
          />
        )}
        <View style={styles.section}>
          <Canvas ref={canvasRef} />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  section: {
    flex: 1,
  },
});
