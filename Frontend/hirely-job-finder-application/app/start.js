import { ImageBackground, StyleSheet, Text, useColorScheme, View } from 'react-native'
import { router } from "expo-router";

import React, { createRef, useState } from 'react'
import images from '../assets/images'
import { isUserJobSeeker, isUserRecruiter, moderateScale, screenHeight, screenWidth } from '../constants/constants'
import { Colors } from '@/constants/Colors'
import HText from '../components/common/HText'
import { styles } from '../themes'
import HButton from '../components/common/HButton'
import { CheckMark, UnCheckedMark } from '../assets/svgs'

const start = () => {
    const colorScheme = useColorScheme()
    const [userType, setUserType] = useState('')

    const onPressUserType = (userType) => {
        setUserType(userType)
        if (userType == 'job_seeker') {

        }
        else if (userType == 'recruiter') {

        }
        router.replace('login')
    }

    return (
        <View style={styles.flex}>

            <ImageBackground source={images.gradientStart} style={localStyles.imageStyle}>
                <View style={localStyles.titleStyle}>
                    <HText type="S40" color={Colors[colorScheme]?.white} >
                        Hirely
                    </HText>

                </View>

                <View style={[localStyles.bottomSheetView, { backgroundColor: Colors[colorScheme]?.white }]}>
                    <HText type='S14' color={Colors[colorScheme]?.subText}>
                        What are you looking for ?
                    </HText>
                    <View style={localStyles.btnContainer}>
                        <HButton onPress={() => onPressUserType('job_seeker')} textType={'S12'} frontIcon={isUserJobSeeker(userType) ? <CheckMark width={moderateScale(20)} height={moderateScale(20)} /> : <UnCheckedMark width={moderateScale(20)} height={moderateScale(20)} />} color={Colors[colorScheme]?.text} title={'I want Job'} containerStyle={[localStyles.btnStyle, { borderColor: isUserJobSeeker(userType) ? Colors[colorScheme]?.primary : Colors[colorScheme]?.borderColor }]} bgColor={Colors[colorScheme]?.white} ></HButton>
                        <HButton onPress={() => onPressUserType('recruiter')} textType={'S12'} frontIcon={isUserRecruiter(userType) ? <CheckMark width={moderateScale(20)} height={moderateScale(20)} /> : <UnCheckedMark width={moderateScale(20)} height={moderateScale(20)} />} color={Colors[colorScheme]?.text} title={'I want Employee'} containerStyle={[localStyles.btnStyle, { borderColor: isUserRecruiter(userType) ? Colors[colorScheme]?.primary : Colors[colorScheme]?.borderColor }]} bgColor={Colors[colorScheme]?.white}></HButton>
                    </View>
                </View>
            </ImageBackground >
        </View >

    )
}

export default start

const localStyles = StyleSheet.create({
    imageStyle: {
        width: screenWidth,
        height: screenHeight,
    },
    titleStyle: {
        // ...styles.justifyCenter,
        ...styles.flex,
        ...styles.itemsCenter,
        marginTop: '70%',
    },
    bottomSheetView: {
        borderTopEndRadius: moderateScale(32),
        borderTopStartRadius: moderateScale(32),
        height: '30%',
        width: '100%',
        bottom: 0,
        position: 'absolute',
        ...styles.center,
        ...styles.p20,
    },
    btnContainer: {
        gap: moderateScale(25),
        ...styles.flexRow,
        ...styles.mt30
    },
    btnStyle: {
        width: screenWidth / 2 - moderateScale(30),
        paddingHorizontal: moderateScale(16),
        borderWidth: moderateScale(1),
        gap: moderateScale(10),
        ...styles.justifyStart
    },
})