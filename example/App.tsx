import { Canvas, CanvasHandle } from "@noxother/signature";
import { Color } from "@shopify/react-native-skia";
import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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
          width: 50,
          height: 50,
          borderRadius: 15,
          backgroundColor: color,
          borderColor: "black",
          borderWidth: 3,
        }}
      />
    </Pressable>
  );
};

export default function App() {
  const canvasRef = useRef<CanvasHandle>(null);
  const resetHandler = () => {
    canvasRef.current?.clearCanvas();
  };

  const undoHandler = () => {
    canvasRef.current?.undo();
  };

  const [color, setColor] = useState<Color | undefined>(undefined);

  const colorPressHandler = (color: Color) => {
    setColor(color);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <SafeAreaView style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            margin: 20,
          }}
        >
          <View style={{ flexDirection: "row", gap: 20 }}>
            <ColorOption color="red" onPress={colorPressHandler} />
            <ColorOption color="blue" onPress={colorPressHandler} />
            <ColorOption color="green" onPress={colorPressHandler} />
            <ColorOption color="purple" onPress={colorPressHandler} />
          </View>
          <View style={{ flexDirection: "row", gap: 20 }}>
            <Pressable style={styles.resetButton} onPress={undoHandler}>
              <Text style={styles.buttonText}>Undo</Text>
            </Pressable>
            <Pressable style={styles.resetButton} onPress={resetHandler}>
              <Text style={styles.buttonText}>Reset</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.canvasContainer}>
          <Canvas ref={canvasRef} strokeColor={color} strokeWidth={6} />
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
  canvasContainer: {
    flex: 1,
    borderWidth: 2,
    borderColor: "lightgrey",
    borderStyle: "dashed",
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: "black",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
  },
  buttonText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
});
