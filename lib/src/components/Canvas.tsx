import {StyleSheet} from "react-native";
import {Canvas as SkiaCanvas, Path} from '@shopify/react-native-skia'
import {useSharedValue} from "react-native-reanimated";
import {Gesture, GestureDetector} from "react-native-gesture-handler";

export const Canvas = () => {

  const currentStroke = useSharedValue('');

  const panGesture = Gesture.Pan()
    .onBegin((e) => {
      currentStroke.value = `M ${e.x} ${e.y} L ${e.x} ${e.y}`
    })
    .onChange((e) => {
      currentStroke.value += ` L ${e.x} ${e.y}`
    })
    .onEnd(() => {
      currentStroke.value = '';
    });

  return (
    <GestureDetector gesture={panGesture}>
      <SkiaCanvas style={styles.canvas}>
        <Path path={currentStroke} color="black" strokeWidth={2} style="stroke"/>
      </SkiaCanvas>
    </GestureDetector>
  )
}

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
  }
})
