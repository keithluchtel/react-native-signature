import {StyleSheet} from "react-native";
import {
  Canvas as SkiaCanvas,
  createPicture,
  PaintStyle,
  Path, Picture,
  Skia,
  type SkPath,
  StrokeCap
} from '@shopify/react-native-skia'
import {useDerivedValue, useSharedValue} from "react-native-reanimated";
import {Gesture, GestureDetector} from "react-native-gesture-handler";

export const Canvas = () => {

  const cachedStrokes = useSharedValue<SkPath[]>([]);
  const currentStroke = useSharedValue('');

  const cachedPicture = useDerivedValue(() => (
    createPicture(canvas => {
      const paint = Skia.Paint();
      paint.setStrokeWidth(2);
      paint.setStrokeCap(StrokeCap.Round);
      paint.setStyle(PaintStyle.Stroke);

      for (const stroke of cachedStrokes.value) {
        canvas.drawPath(stroke, paint);
      }
    })
  ), [cachedStrokes]);
  const panGesture = Gesture.Pan()
    .onBegin((e) => {
      currentStroke.value = `M ${e.x} ${e.y} L ${e.x} ${e.y}`
    })
    .onChange((e) => {
      currentStroke.value += ` L ${e.x} ${e.y}`
    })
    .onEnd(() => {
      cachedStrokes.value = [
        ...cachedStrokes.value,
        Skia.Path.MakeFromSVGString(currentStroke.value) as SkPath
      ];
      currentStroke.value = '';
    });

  return (
    <GestureDetector gesture={panGesture}>
      <SkiaCanvas style={styles.canvas}>
        <Picture picture={cachedPicture} />
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
