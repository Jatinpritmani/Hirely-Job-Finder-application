import { router } from "expo-router";
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";
import Swiper from "react-native-swiper";



// local imports
import HText from "../components/common/HText";
import HSafeAreaView from "../components/common/HSafeAreaView";
import HButton from "../components/common/HButton";
import { styles } from "@/themes";
import images from "../assets/images";
import { getHeight, moderateScale, screenWidth } from "@/constants/constants";
import { Colors } from "@/constants/Colors";
import { useRef, useState } from "react";

export default function Onboarding() {
    const colorScheme = useColorScheme();
    const swiperRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

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

    const onPressGetStarted = () => {
        router.replace("start");
    };

    const onPressNext = () => {
        swiperRef?.current?.scrollTo(currentIndex + 1);
    };

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

