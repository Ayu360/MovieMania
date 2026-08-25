import { Tabs } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'
import { BlurView } from 'expo-blur'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors } from '@/constants'

const TabIcon = ({ emoji, focused }) => (
  <Text style={[styles.icon, focused && styles.iconFocused]}>{emoji}</Text>
)

// Real frosted-glass tab bar: a BlurView renders the material, a subtle dark
// tint on top keeps text readable, and a hairline top border defines the edge.
const TabBarBackground = () => (
  <View style={styles.tabBarBgWrap}>
    <BlurView tint="dark" intensity={70} style={StyleSheet.absoluteFill} />
    <View style={styles.tabBarTint} />
    <View style={styles.tabBarBorder} />
  </View>
)

export default function TabsLayout() {
  const insets = useSafeAreaInsets()
  const bottomPad = insets.bottom || 12

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent.orange,
        tabBarInactiveTintColor: colors.text.muted,
        tabBarShowLabel: true,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 56 + bottomPad,
          paddingTop: 8,
          paddingBottom: bottomPad,
          borderTopWidth: 0,
          backgroundColor: 'transparent',
          elevation: 0,
        },
        tabBarLabelStyle: styles.label,
        tabBarItemStyle: styles.item,
        sceneStyle: { backgroundColor: colors.primary },
      }}
    >
      <Tabs.Screen
        name="homeScreen"
        options={{
          title: 'Discover',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🎬" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Watchlist',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🔖" focused={focused} />,
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  tabBarBgWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  tabBarTint: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(20, 24, 28, 0.35)',
  },
  tabBarBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  item: {
    paddingTop: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  icon: {
    fontSize: 22,
    opacity: 0.55,
  },
  iconFocused: {
    opacity: 1,
  },
})
