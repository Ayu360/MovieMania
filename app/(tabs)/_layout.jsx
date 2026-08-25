import { NativeTabs } from 'expo-router/unstable-native-tabs'
import { colors, icons } from '@/constants'

export default function Layout() {
  return (
    <NativeTabs
      backgroundColor={colors.surface}
      blurEffect="systemChromeMaterialDark"
      tintColor={colors.accent.orange}
      iconColor={{ default: colors.text.muted, selected: colors.accent.orange }}
      labelStyle={{
        default: { color: colors.text.muted, fontSize: 11 },
        selected: { color: colors.accent.orange, fontSize: 11, fontWeight: '600' },
      }}
      disableTransparentOnScrollEdge
    >
      <NativeTabs.Trigger name="homeScreen">
        <NativeTabs.Trigger.Label>Discover</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'film', selected: 'film.fill' }}
          src={icons.search}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="favorites">
        <NativeTabs.Trigger.Label>Watchlist</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'bookmark', selected: 'bookmark.fill' }}
          src={icons.rightArrow}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  )
}
