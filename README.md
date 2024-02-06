# React Native Signature

A signature canvas -- built with Skia

![2024-02-05 21 42 10](https://github.com/keithluchtel/react-native-signature/assets/475007/13749e0d-974c-484c-aa5d-c68ced62e840)

## Installation

`@noxother/signature` has a few peer dependencies which must be installed first if not already present in your project

```shell
yarn add react-native-reanimated react-native-gesture-handler @shopify/react-native-skia
```

Follow the installation instructions for each package to make sure they are setup correctly.

> [!NOTE]
> If using Expo, currently you will need to create a development build. The version of Skia that Expo ships with by default is not compatible.

Next, install `@noxother/signature`:

```shell
yarn add @noxother/signature
```

## Components

### `Canvas`

`Canvas` is added to your layout, and is the area users will interact with to sign.

| Prop | Type | Description |
| :--- | :--- | :---        |
| `strokeColor` | `Color` (from Skia) | Color used when drawing |
| `strokeWidth` | `number` | Width of stroke |
| `gestureHandler` | `GestureType` (from RNGH) | Gesture handler to add custom handling for all touch events |



## License
MIT
