import { StyleSheet, Text, useColorScheme, View } from 'react-native'
import React, { useState } from 'react'

// local imports 
import { Colors } from "@/constants/Colors";
import HSafeAreaView from '../components/common/HSafeAreaView';
import { styles } from '../themes';
import HHeader from '../components/common/HHeader';
import HText from '../components/common/HText';
import { moderateScale } from '../constants/constants';
import HButton from '../components/common/HButton';


const uploadCV = () => {
    const colorScheme = useColorScheme();
    const [isRegisterDisabled, setIsRegisterDisabled] = useState(false)

    const onPressUpload = () => {

    }
    const onPressRegister = () => {

    }

    return (
        <HSafeAreaView style={localStyles.main}>
            <HHeader title="Upload CV" />
            <HText type="S16" style={styles.mv25}>
                Resume or CV
            </HText>
            <View style={[localStyles.uploadContainer, { backgroundColor: Colors[colorScheme]?.white }]}>
                <HText type="S16" align="center" color={Colors[colorScheme]?.subText} style={styles.mv25}>

                    Upload your CV or Resume and use it when you apply for jobs
                </HText>
                <View style={[localStyles.uploadTitle, { backgroundColor: Colors[colorScheme]?.grayScale8 }]}>
                    <HText type="R14" align="center" color={Colors[colorScheme]?.grayScale4} style={styles.mv25}>

                        Upload a Doc/Docx/PDF
                    </HText>
                </View>
                <HButton
                    onPress={onPressUpload}
                    textType={"S16"}
                    bgColor={Colors[colorScheme]?.grayScale4}
                    title={"Upload"}
                    containerStyle={[localStyles.btnStyle]}>

                </HButton>
            </View>
            <HButton
                disabled={isRegisterDisabled}
                onPress={onPressRegister}
                textType={"S16"}
                color={
                    isRegisterDisabled
                        ? Colors[colorScheme]?.grayScale6
                        : Colors[colorScheme]?.white
                }
                title={"Next"}
                containerStyle={[localStyles.registerBTnstyle]}
                bgColor={
                    isRegisterDisabled
                        ? Colors[colorScheme]?.grayScale5
                        : Colors[colorScheme]?.primary
                }
            ></HButton>

        </HSafeAreaView>
    )
}

export default uploadCV

const localStyles = StyleSheet.create({
    main: {

    },
    uploadContainer: {
        borderWidth: moderateScale(1),
        borderRadius: moderateScale(24),
        borderStyle: "dashed",
        ...styles.center,
        ...styles.ph30,
        paddingVertical: moderateScale(40)
    },
    uploadTitle: {
        paddingHorizontal: moderateScale(50),
        borderRadius: moderateScale(12),

    },
    btnStyle: {
        ...styles.mt30,
        width: moderateScale(223),
        opacity: 0.8
    },
    registerBTnstyle: {
        bottom: moderateScale(30),
        position: 'absolute',
        width: '100%',
        ...styles.selfCenter
    }
})