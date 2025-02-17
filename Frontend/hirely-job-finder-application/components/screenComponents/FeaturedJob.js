import { ImageBackground, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import React from 'react'

// local import
import { Colors } from '@/constants/Colors';
import images from '../../assets/images';
import { getJobTypeLabel, getLocationLabel, moderateScale } from '../../constants/constants';
import { styles } from '../../themes';
import HText from '../common/HText';
import { router } from 'expo-router';


const FeaturedJob = ({ item, index }) => {
    const colorScheme = useColorScheme();
    const onPressJob = () => {
        router.push({
            pathname: "/jobDetail",
            params: { jobDetail: JSON.stringify(item) }, // Pass parameters
        })
    }
    return (
        <TouchableOpacity onPress={onPressJob} style={[localstyles.main, { backgroundColor: index % 2 == 0 ? Colors[colorScheme]?.grayScale4 : Colors[colorScheme]?.grayScale9, opacity: index % 2 == 0 ? 0.8 : 1 }]}>
            <ImageBackground
                source={images.jobBackground}
                style={localstyles.imageStyle}
                imageStyle={{ opacity: 0.1 }}
            >
                <View style={[styles.flexRow, { gap: moderateScale(16) }]}>
                    <View style={[localstyles.logo, { backgroundColor: Colors[colorScheme]?.white }]} />
                    <View style={styles.justifyCenter}>
                        <HText type="S16" color={Colors[colorScheme]?.white}>
                            {item?.position}
                        </HText>
                        <HText type="M14" color={Colors[colorScheme]?.white}>
                            {item?.company_name}
                        </HText>
                    </View>

                </View>
                <View style={[localstyles.labelStyle, { backgroundColor: Colors[colorScheme]?.grayScale9 }]}>

                    <HText type="R12" color={Colors[colorScheme]?.white}>
                        {getJobTypeLabel(item?.job_type)}
                    </HText>
                </View>
                <View style={[styles.mt25, styles.rowSpaceBetween]}>
                    <HText type="M14" color={Colors[colorScheme]?.white}>
                        {item?.job_type ? `$${item?.salary}/year` : null}
                    </HText>
                    <HText type="M14" color={Colors[colorScheme]?.white}>
                        {getLocationLabel(item?.location) || ''}
                    </HText>
                </View>
            </ImageBackground>

        </TouchableOpacity>
    )
}

export default FeaturedJob

const localstyles = StyleSheet.create({
    main: {
        ...styles.ml10,
        borderRadius: moderateScale(24)
    },
    imageStyle: {
        width: moderateScale(280),
        height: moderateScale(186),
        ...styles.p25
    },
    logo: {
        width: moderateScale(46),
        height: moderateScale(46),
        borderRadius: moderateScale(12)
    },
    labelStyle: {
        ...styles.mt25,
        ...styles.ph15,
        ...styles.pv5,
        ...styles.selfStart,
        borderRadius: moderateScale(50)
    }
})