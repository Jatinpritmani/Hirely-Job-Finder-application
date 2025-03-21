import { router } from "expo-router";
import {
    Image,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    View,
    Platform
} from "react-native";
import Swiper from "react-native-swiper";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';


// local imports
import HText from "../components/common/HText";
import HSafeAreaView from "../components/common/HSafeAreaView";
import HButton from "../components/common/HButton";
import { styles } from "@/themes";
import images from "../assets/images";
import { getHeight, moderateScale, screenWidth } from "@/constants/constants";
import { Colors } from "@/constants/Colors";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";





// Set notification handler
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

/**
 * Handles registration errors.
 * @param {string} errorMessage - The error message.
 */
function handleRegistrationError(errorMessage) {
    alert(errorMessage);
    throw new Error(errorMessage);
}

/**
 * Registers the device for push notifications.
 * @returns {Promise<string>} - The push token.
 */
async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            handleRegistrationError('Permission not granted to get push token for push notification!');
            return;
        }
        const projectId = '10f8e89c-25bf-4e88-a644-fddb36d51502'
        if (!projectId) {
            handleRegistrationError('Project ID not found');
        }
        try {
            const pushTokenString = (
                await Notifications.getExpoPushTokenAsync({
                    projectId,
                })
            ).data;
            await AsyncStorage.setItem('pushToken', pushTokenString);

            console.log(pushTokenString, "<-------token");
            return pushTokenString;
        } catch (e) {
            handleRegistrationError(`${e}`);
        }
    } else {
        handleRegistrationError('Must use physical device for push notifications');
    }
}

/**
 * This component renders the onboarding screen.
 * It includes a swiper with onboarding slides and handles push notification registration.
 */
export default function onBoarding() {
    const currentUserDetail = useSelector(state => state.userReducer)
    const colorScheme = useColorScheme();
    const swiperRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {
        registerForPushNotificationsAsync()
            .then(token => setExpoPushToken(token ?? ''))
            .catch((error) => setExpoPushToken(`${error}`));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            console.log('=================notification===================');
            console.log(notification);
            console.log('====================================');
            // setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response, "response");
        });

        return () => {
        };
    }, []);

    useEffect(() => {
        if (currentUserDetail) {
            if (currentUserDetail?.isUserLoggedIn) {
                setTimeout(() => {
                    router.replace("(tabs)");
                    setLoading(false);
                }, 100);
            }
            else {
                setLoading(false)
            }
        }
    }, [])



    const OnBoardingData = {
        onBoardingItem1: {
            id: 1,
            title: "One click Apply",
            image: images.onBoarding1,
            desc: "Empowering Your Journey, One Click at a Time.",
            btnTitle: "Next",
            onPress: () => onPressNext(),
        },
        onBoardingItem2: {
            id: 2,
            title: "Apply to best jobs",
            desc: "Bringing people and possibilities together through smart, intuitive technology.",
            image: images.onBoarding2,
            btnTitle: "Next",
            onPress: () => onPressNext(),
        },
        onBoardingItem3: {
            id: 3,
            title: "Innovate, Elevate, Succeed.",
            desc: "Unlock the future with cutting-edge solutions that drive growth and success.",
            image: images.onBoarding3,
            btnTitle: "Explore",
            onPress: () => onPressGetStarted(),
        },
    };

    /**
     * Handles the Get Started button press.
     */
    const onPressGetStarted = () => {
        router.replace("start");
    };

    /**
     * Handles the Next button press.
     */
    const onPressNext = () => {
        swiperRef?.current?.scrollTo(currentIndex + 1);
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Image
                    source={images.gradientStart}
                    style={{ width: '100%', height: '100%' }}
                />
                <View style={{ position: 'absolute', }}>
                    <HText type="S40" color={Colors[colorScheme]?.white} >
                        Hirely
                    </HText>

                </View>
            </View>
        );
    }

    return (
        <HSafeAreaView style={localStyles.main} containerStyle={styles.ph0}>
            <Swiper
                ref={swiperRef}
                showsButtons={false}
                onIndexChanged={(index) => setCurrentIndex(index)}
                loop={false}
                activeDotStyle={[
                    localStyles.activeDotStyle,
                    { backgroundColor: Colors[colorScheme]?.primary },
                ]}
                showsPagination={true}
                dotStyle={[
                    localStyles.dotStyle,
                    { backgroundColor: Colors[colorScheme]?.grayScale1 },
                ]}
                paginationStyle={localStyles.paginationStyle}
            >
                <OnboardingItem item={OnBoardingData.onBoardingItem1} />
                <OnboardingItem item={OnBoardingData.onBoardingItem2} />
                <OnboardingItem item={OnBoardingData.onBoardingItem3} />
            </Swiper>
        </HSafeAreaView>
    );
}

/**
 * This component renders an onboarding slide.
 * @param {Object} param0 - The onboarding item.
 */
const OnboardingItem = ({ item }) => {
    const colorScheme = useColorScheme();
    const onPressSkip = () => {
        router.replace("start");
    };

    return (
        <View style={[localStyles.onBoardingContainer]}>
            {item?.id != 3 && (
                <TouchableOpacity onPress={onPressSkip}>
                    <HText
                        style={[styles.selfEnd]}
                        type={"M16"}
                        align={"center"}
                        color={Colors[colorScheme]?.subText}
                    >
                        {"skip"}
                    </HText>
                </TouchableOpacity>
            )}
            <Image source={item.image} style={localStyles.OnboardingImage} />
            <View style={localStyles.headerContainer}>
                <HText type={"S28"} align={"center"}>
                    {item.title}
                </HText>
                <HText
                    type={"R14"}
                    align={"center"}
                    style={styles.mt40}
                    color={Colors[colorScheme]?.subText}
                >
                    {item.desc}
                </HText>
            </View>
            <View style={localStyles.btnContainer}>
                <HButton
                    textType={"S16"}
                    title={item.btnTitle}
                    onPress={item.onPress}
                    containerStyle={localStyles.btnStyle}
                />
            </View>
        </View>
    );
};


const localStyles = StyleSheet.create({
    main: {
        ...styles.center,
    },
    onBoardingContainer: {
        ...styles.flex,
        ...styles.m25,
        ...styles.mh30,
    },
    OnboardingImage: {
        resizeMode: "contain",
        height: getHeight(284),
        width: moderateScale(284),
        ...styles.selfCenter,
        ...styles.mt30,
    },
    paginationStyle: {
        bottom: getHeight(150),
    },
    dotStyle: {
        width: moderateScale(8),
        height: moderateScale(8),
        borderRadius: moderateScale(10),
        ...styles.mh5,
    },
    activeDotStyle: {
        width: moderateScale(28),
        height: moderateScale(8),
    },
    headerContainer: {
        ...styles.mh15,
        ...styles.mt40,
    },
    btnContainer: {
        position: "absolute",
        bottom: 0,
    },
    btnStyle: {
        width: screenWidth - moderateScale(54),
        bottom: moderateScale(0),
    },
});

