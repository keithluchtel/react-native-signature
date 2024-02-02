import {
  Canvas as SkiaCanvas,
  type Color,
  createPicture,
  PaintStyle,
  Path,
  Picture,
  Skia,
  type SkImage,
  type SkPath,
  StrokeCap,
  useCanvasRef,
} from "@shopify/react-native-skia";
import { forwardRef, useImperativeHandle } from "react";
import { StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useDerivedValue, useSharedValue } from "react-native-reanimated";

export type CanvasHandle = {
  makeImageSnapshot: () => SkImage | undefined;
  clearCanvas: () => void;
};

type CanvasProps = {
  color: Color;
};

export const Canvas = forwardRef<CanvasHandle, CanvasProps>(
  ({ color = "black" }, ref) => {
    const skiaCanvasRef = useCanvasRef();
    const cachedStrokes = useSharedValue<[SkPath, Color][]>([]);
    const currentStroke = useSharedValue("");

    useImperativeHandle(ref, () => ({
      makeImageSnapshot() {
        return skiaCanvasRef.current?.makeImageSnapshot();
      },
      clearCanvas() {
        currentStroke.value = "";
        cachedStrokes.value = [];

        skiaCanvasRef.current?.redraw();
      },
    }));

    const cachedPicture = useDerivedValue(
      () =>
        createPicture((canvas) => {
          const paint = Skia.Paint();
          paint.setStrokeWidth(2);
          paint.setStrokeCap(StrokeCap.Round);
          paint.setStyle(PaintStyle.Stroke);

          for (const cachedStroke of cachedStrokes.value) {
            const [stroke, strokeColor] = cachedStroke;

            if (strokeColor) {
              paint.setColor(Skia.Color(strokeColor));
            }
            canvas.drawPath(stroke, paint);
          }
        }),
      [cachedStrokes],
    );

    const panGesture = Gesture.Pan()
      .onBegin((e) => {
        currentStroke.value = `M ${e.x} ${e.y} L ${e.x} ${e.y}`;
      })
      .onChange((e) => {
        currentStroke.value += ` L ${e.x} ${e.y}`;
      })
      .onFinalize(() => {
        cachedStrokes.value = [
          ...cachedStrokes.value,
          [Skia.Path.MakeFromSVGString(currentStroke.value) as SkPath, color],
        ];

        currentStroke.value = "";
      })
      .minPointers(1)
      .maxPointers(1)
      .minDistance(1);

    return (
      <GestureDetector gesture={panGesture}>
        <SkiaCanvas ref={skiaCanvasRef} style={styles.canvas}>
          <Picture picture={cachedPicture} />
          <Path
            path={currentStroke}
            color={color}
            strokeWidth={2}
            style="stroke"
          />
        </SkiaCanvas>
      </GestureDetector>
    );
  },
);

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
  },
});
