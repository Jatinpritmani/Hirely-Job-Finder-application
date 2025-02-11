//library imports 
import { Image, StyleSheet, Text, useColorScheme, View } from 'react-native'
import React from 'react'

// local imports
import HSafeAreaView from '../components/common/HSafeAreaView'
import { styles } from '../themes'
import HHeader from '../components/common/HHeader'
import images from '../assets/images'
import { Colors } from "@/constants/Colors";

import { getHeight, moderateScale } from '../constants/constants'
import HText from '../components/common/HText'
import { Mail } from '../assets/svgs'
import { useLocalSearchParams } from 'expo-router'
import HButton from '../components/common/HButton'

const forgotPassword = ({ params }) => {
    const colorScheme = useColorScheme();
    const { mail } = useLocalSearchParams()

    const onPressContinue = () => { }


    return (
        <HSafeAreaView style={localStyles.main}>
            <HHeader title="Forgot Password" />
            <Image source={images.forgotPassword} resizeMode='contain' style={localStyles.imgStyle} />
            <HText type='R12' align={'center'} color={Colors[colorScheme]?.grayScale7} style={styles.mt30}>
                Calm down, you can still reset your password.{'\n'}
                Please choose where we can contact you.
            </HText>
            <View style={[localStyles.mailContainer, { borderColor: Colors[colorScheme]?.grayScale5 }]}>
                <Mail />
                <View style={{ marginLeft: moderateScale(24) }}>
                    <HText type='R12' color={Colors[colorScheme]?.grayScale7} >
                        Via E-mail
                    </HText>
                    <HText type='S14'  >
                        {mail}
                    </HText>
                </View>
            </View>
            <HButton
                onPress={onPressContinue}
                textType={"S16"}

                title={"Continue"}
                containerStyle={[localStyles.btnStyle]}
            ></HButton>
        </HSafeAreaView >
    )
}

export default forgotPassword

const localStyles = StyleSheet.create({
    main: {
        ...styles.ph20,
        ...styles.flex,
    },
    imgStyle: {
        width: moderateScale(260),
        height: getHeight(260),
        ...styles.selfCenter,

    },
    mailContainer: {
        ...styles.mt25,
        ...styles.flexRow,
        borderWidth: moderateScale(1),
        paddingVertical: moderateScale(12),
        paddingHorizontal: moderateScale(24),
        borderRadius: moderateScale(12)
    },
    btnStyle: {
        marginTop: moderateScale(206)
    }
})