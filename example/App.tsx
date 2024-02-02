import { Color, Skia } from "@shopify/react-native-skia";
import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import {
  Button,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Canvas, CanvasHandle } from "react-native-signature";

type ColorOptionProps = {
  color: Color;
  onPress: (color: Color) => void;
};
const ColorOption = ({ color, onPress }: ColorOptionProps) => {
  return (
    <Pressable onPress={() => onPress(color)}>
      <View
        // @ts-ignore-next-line
        style={{
          width: 30,
          height: 30,
          borderRadius: 15,
          backgroundColor: color,
        }}
      />
    </Pressable>
  );
};

export default function App() {
  const canvasRef = useRef<CanvasHandle>(null);
  const [image, setImage] = useState<string | undefined>(undefined);
  const resetHandler = () => {
    canvasRef.current?.clearCanvas();
  };
  const [color, setColor] = useState<Color | undefined>(undefined);

  const captureHandler = () => {
    const skiaImage = canvasRef.current?.makeImageSnapshot();
    if (skiaImage) {
      setImage(skiaImage.encodeToBase64());
    }
  };

  const colorPressHandler = (color: Color) => {
    setColor(color);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <SafeAreaView style={styles.container}>
        <Text>Open up App.tsx to start working on your app!</Text>
        <View style={{ flexDirection: "row", gap: 20 }}>
          <ColorOption color="red" onPress={colorPressHandler} />
          <ColorOption color="blue" onPress={colorPressHandler} />
          <ColorOption color="green" onPress={colorPressHandler} />
          <ColorOption color="purple" onPress={colorPressHandler} />
        </View>
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
          <Canvas ref={canvasRef} color={color} />
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
