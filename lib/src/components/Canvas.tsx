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
import {
  Gesture,
  GestureDetector,
  type GestureType,
} from "react-native-gesture-handler";
import { useDerivedValue, useSharedValue } from "react-native-reanimated";

export type CanvasHandle = {
  makeImageSnapshot: () => SkImage | undefined;
  clearCanvas: () => void;
};

type CanvasProps = {
  strokeColor?: Color;
  strokeWidth?: number;
  gestureHandler?: GestureType;
};

type StrokeDetails = Required<Pick<CanvasProps, "strokeColor" | "strokeWidth">>;

export const Canvas = forwardRef<CanvasHandle, CanvasProps>(
  ({ strokeColor = "black", strokeWidth = 2, gestureHandler }, ref) => {
    const skiaCanvasRef = useCanvasRef();
    const cachedStrokes = useSharedValue<[SkPath, StrokeDetails][]>([]);
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
          paint.setStrokeCap(StrokeCap.Round);
          paint.setStyle(PaintStyle.Stroke);

          for (const cachedStroke of cachedStrokes.value) {
            const [stroke, details] = cachedStroke;
            const { strokeColor, strokeWidth } = details;

            paint.setColor(Skia.Color(strokeColor));
            paint.setStrokeWidth(strokeWidth);

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
          [
            Skia.Path.MakeFromSVGString(currentStroke.value) as SkPath,
            { strokeColor, strokeWidth },
          ],
        ];

        currentStroke.value = "";
      })
      .minPointers(1)
      .maxPointers(1)
      .minDistance(1);

    const composedHandler = gestureHandler
      ? Gesture.Simultaneous(panGesture, gestureHandler)
      : panGesture;

    return (
      <GestureDetector gesture={composedHandler}>
        <SkiaCanvas ref={skiaCanvasRef} style={styles.canvas}>
          <Picture picture={cachedPicture} />
          <Path
            path={currentStroke}
            color={strokeColor}
            strokeWidth={strokeWidth}
            style="stroke"
            strokeCap="round"
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
