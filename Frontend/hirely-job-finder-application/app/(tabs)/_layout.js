import { Tabs, useSegments } from 'expo-router';
import { useSelector } from 'react-redux';


// local imports
import { AppliedJob, AppliedJObBlue, CreateJobBlueIcon, CreateJobIcon, HomeBlueIcon, HomeIcon, ProfileBlueIcon, ProfileIcon, SaveBlueIcon, SaveIcon } from '../../assets/svgs';
import typography from '../../themes/typography';
import { StyleSheet, useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors'
import { styles } from '../../themes';
import { getHeight, isUserJobSeeker, isUserRecruiter } from '../../constants/constants';

export default function TabLayout() {
    const currentTab = useSegments()?.[1];
    const colorScheme = useColorScheme()
    const currentUserDetail = useSelector(state => state.userReducer.currentUserDetail)

    return (
        <Tabs screenOptions={{
            tabBarStyle: [localStyles.tabbarStyle, {
                display: currentTab == 'create' ? 'none' : 'flex',
                backgroundColor: Colors[colorScheme]?.white
            }],
            headerShown: false,
            tabBarActiveTintColor: Colors[colorScheme]?.primary,
            tabBarLabelStyle: localStyles.labelStyle,
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    gestureEnabled: false,
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (focused ? <HomeBlueIcon /> : <HomeIcon />),
                }}
            />
            <Tabs.Screen
                name="saved"
                options={{
                    title: 'Saved',
                    tabBarIcon: ({ color, focused }) => (focused ? <SaveBlueIcon /> : <SaveIcon />),
                    href: isUserJobSeeker(currentUserDetail?.user_type) ? "/saved" : null

                }}
            />
            <Tabs.Screen
                name="create"
                options={{
                    title: 'Create',
                    tabBarIcon: ({ color, focused }) => (focused ? <CreateJobBlueIcon /> : <CreateJobIcon />),
                    href: isUserRecruiter(currentUserDetail?.user_type) ? "/create" : null,
                }}
            />
            <Tabs.Screen
                name="appliedJobs"
                options={{
                    title: 'Applied',
                    tabBarIcon: ({ color, focused }) => (focused ? <AppliedJObBlue /> : <AppliedJob />),
                    href: isUserJobSeeker(currentUserDetail?.user_type) ? "/appliedJobs" : null,
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
        ...styles.mt5,
    },
    tabbarStyle: {
        height: getHeight(100),
        ...styles.pt15,
    }
})