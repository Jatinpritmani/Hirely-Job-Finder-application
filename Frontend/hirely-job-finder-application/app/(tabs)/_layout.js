import { Tabs } from 'expo-router';

// local imports
import { HomeBlueIcon, HomeIcon, ProfileBlueIcon, ProfileIcon, SaveBlueIcon, SaveIcon } from '../../assets/svgs';
import typography from '../../themes/typography';
import { StyleSheet, useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors'
import { styles } from '../../themes';
import { getHeight } from '../../constants/constants';

export default function TabLayout() {
    const colorScheme = useColorScheme()
    return (
        <Tabs screenOptions={{
            tabBarStyle: localStyles.tabbarStyle,
            headerShown: false,
            tabBarActiveTintColor: Colors[colorScheme]?.primary,
            tabBarLabelStyle: localStyles.labelStyle,
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (focused ? <HomeBlueIcon size={28} /> : <HomeIcon size={28} />),
                }}
            />
            <Tabs.Screen
                name="saved"
                options={{
                    title: 'Saved',
                    tabBarIcon: ({ color, focused }) => (focused ? <SaveBlueIcon size={28} /> : <SaveIcon size={28} />),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, focused }) => (focused ? <ProfileBlueIcon size={28} /> : <ProfileIcon size={28} />),
                }}
            />
        </Tabs>
    );
}

const localStyles = StyleSheet.create({
    labelStyle: {
        ...typography.fontSizes.f12,
        ...typography.fontWeights.Medium,
        ...styles.mt5
    },
    tabbarStyle: {
        height: getHeight(100),
        ...styles.pt15,
    }
})