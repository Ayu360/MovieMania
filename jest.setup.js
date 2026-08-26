// Shallow mocks for reanimated + worklets so jest doesn't try to load the
// native worklet runtime. Our tests don't verify animation behavior, only
// that the screen renders.
jest.mock('react-native-worklets', () => ({}))
jest.mock('react-native-worklets/plugin', () => ({}))

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
)

jest.mock('expo-router', () => {
  return {
    __esModule: true,
    Redirect: () => null,
    Link: ({ children }) => children,
    router: {
      push: jest.fn(),
      replace: jest.fn(),
      navigate: jest.fn(),
      back: jest.fn(),
      dismissAll: jest.fn(),
    },
    useLocalSearchParams: () => ({}),
    Stack: Object.assign(({ children }) => children, {
      Screen: () => null,
      Protected: ({ children }) => children,
    }),
    Tabs: Object.assign(({ children }) => children, {
      Screen: () => null,
      Protected: ({ children }) => children,
    }),
  }
})

jest.mock('expo-blur', () => {
  const RN = require('react-native')
  return { BlurView: RN.View }
})

jest.mock('react-native-reanimated', () => {
  const RN = require('react-native')
  const passthrough = (v) => v
  return {
    __esModule: true,
    default: {
      View: RN.View,
      Image: RN.Image,
      ScrollView: RN.ScrollView,
      Text: RN.Text,
      createAnimatedComponent: (C) => C,
    },
    useSharedValue: (v) => ({ value: v }),
    useAnimatedStyle: (fn) => {
      try { return fn() ?? {} } catch { return {} }
    },
    useAnimatedScrollHandler: () => () => {},
    withRepeat: passthrough,
    withTiming: passthrough,
    withSpring: passthrough,
    withDelay: (_, v) => v,
    cancelAnimation: () => {},
    interpolate: (_v, _i, output) => (Array.isArray(output) ? output[0] : 0),
    Easing: {
      linear: () => 0,
      ease: () => 0,
      inOut: () => 0,
      out: () => 0,
      in: () => 0,
      bezier: () => () => 0,
    },
    Extrapolation: { EXTEND: 'extend', CLAMP: 'clamp', IDENTITY: 'identity' },
    Extrapolate: { EXTEND: 'extend', CLAMP: 'clamp', IDENTITY: 'identity' },
  }
})
