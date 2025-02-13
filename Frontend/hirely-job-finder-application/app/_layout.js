import { DarkTheme, DefaultTheme, ThemeProvider, useTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import Toast, { BaseToast } from 'react-native-toast-message';


// local imports 

import { useColorScheme } from '@/hooks/useColorScheme';
import { Provider } from 'react-redux';
import { store } from '../context/store';
import typography from '@/themes/typography';
import { Colors } from '@/constants/Colors';
import { moderateScale } from '@/constants/constants';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const color = useTheme()
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-BlackItalic": require("../assets/fonts/Poppins-BlackItalic.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-BoldItalic": require("../assets/fonts/Poppins-BoldItalic.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraBoldItalic": require("../assets/fonts/Poppins-ExtraBoldItalic.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-ExtraLightItalic": require("../assets/fonts/Poppins-ExtraLightItalic.ttf"),
    "Poppins-Italic": require("../assets/fonts/Poppins-Italic.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-LightItalic": require("../assets/fonts/Poppins-LightItalic.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-MediumItalic": require("../assets/fonts/Poppins-MediumItalic.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-SemiBoldItalic": require("../assets/fonts/Poppins-SemiBoldItalic.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
    "Poppins-ThinItalic": require("../assets/fonts/Poppins-ThinItalic.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }


  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Provider store={store}>

        <Stack initialRouteName='uploadCV' screenOptions={{ headerShown: false }}>
          {/* <Stack.Screen name="index" /> */}
          <Stack.Screen name="start" />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="submitProfileDetail" />
          <Stack.Screen name="forgotPassword" />
          <Stack.Screen name="uploadCV" />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
        <Toast position='top' topOffset={70}
          config={{
            success: (props) => (
              <BaseToast
                {...props}
                style={{ borderLeftColor: Colors[colorScheme]?.success, backgroundColor: '#f0f8f5' }}
                contentContainerStyle={{ paddingHorizontal: moderateScale(15) }}
                text1Style={{
                  ...typography.fontSizes.f14,
                  ...typography.fontWeights.Medium,
                  color: Colors[colorScheme]?.success
                }}
                text2Style={{
                  ...typography.fontSizes.f12,
                  ...typography.fontWeights.Medium,
                  color: Colors[colorScheme]?.text
                }}
              />
            ),
            error: (props) => (
              <BaseToast
                {...props}
                style={{ borderLeftColor: Colors[colorScheme]?.danger, backgroundColor: '#fdecea' }}
                contentContainerStyle={{ paddingHorizontal: moderateScale(15) }}
                text1Style={{
                  ...typography.fontSizes.f14,
                  ...typography.fontWeights.Medium,
                  color: Colors[colorScheme]?.danger
                }}
                text2Style={{
                  ...typography.fontSizes.f12,
                  ...typography.fontWeights.Medium,
                  color: Colors[colorScheme]?.text
                }}
              />
            ),
            info: (props) => (
              <BaseToast
                {...props}
                style={{ borderLeftColor: Colors[colorScheme]?.info, backgroundColor: '#e8f4ff' }}
                contentContainerStyle={{ paddingHorizontal: moderateScale(15) }}
                text1Style={{
                  ...typography.fontSizes.f14,
                  ...typography.fontWeights.Medium,
                  color: Colors[colorScheme]?.info
                }}
                text2Style={{
                  ...typography.fontSizes.f12,
                  ...typography.fontWeights.Medium,
                  color: Colors[colorScheme]?.text
                }}
              />
            )
          }} />
      </Provider>
    </ThemeProvider>
  );
}
