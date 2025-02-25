import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import React from 'react'

// local import
import { Colors } from '@/constants/Colors';
import images from '../../assets/images';
import { getJobTypeLabel, getLocationLabel, isUserRecruiter, moderateScale } from '../../constants/constants';
import { styles } from '../../themes';
import HText from '../common/HText';
import { router } from 'expo-router';
import { useSelector } from 'react-redux';


const FeaturedJob = ({ item, index, isVertical = false }) => {
    const colorScheme = useColorScheme();
    const currentUserDetail = useSelector(state => state.userReducer.currentUserDetail)

    const onPressJob = () => {
        if (isUserRecruiter(currentUserDetail?.user_type)) {
            router.push({
                pathname: "/jobSeekerDetail",
                params: { jobseekerDetail: JSON.stringify(item), index: index }, // Pass parameters
            })
        } else {
            router.push({
                pathname: "/jobDetail",
                params: { jobDetail: JSON.stringify(item), index: index }, // Pass parameters
            })
        }
    }
    return (
        <TouchableOpacity onPress={onPressJob} style={[localstyles.main, { backgroundColor: index % 2 == 0 ? Colors[colorScheme]?.primary : Colors[colorScheme]?.primary1, }, isVertical && styles.mb15, isUserRecruiter(currentUserDetail?.user_type) && { height: moderateScale(170) }]}>
            <ImageBackground
                source={images.jobBackground}
                style={localstyles.imageStyle}
                imageStyle={{ opacity: 0.1 }}
            >
                <View style={[styles.flexRow, { gap: moderateScale(16) }]}>
                    <View style={[localstyles.logo, { backgroundColor: Colors[colorScheme]?.white }]} >
                        <Image
                            source={isUserRecruiter(currentUserDetail?.user_type) ? index % 2 == 0 ? images.profileImage1 : index % 1 == 0 ? images.profileImage2 : images.profileImage3 : index % 2 == 0 ? images.fb : images.google}
                            style={localstyles.profileImageStyle}
                        />
                    </View>
                    <View style={styles.justifyCenter}>
                        <HText type="S16" color={Colors[colorScheme]?.white}>
                            {isUserRecruiter(currentUserDetail?.user_type) ? item?.user_name : item?.position}
                        </HText>
                        <HText type="M14" color={Colors[colorScheme]?.white} style={isUserRecruiter(currentUserDetail?.user_type) && { opacity: 0.75 }}>
                            {isUserRecruiter(currentUserDetail?.user_type) ? item?.designation : item?.company_name}
                        </HText>
                    </View>

                </View>
                {isUserRecruiter(currentUserDetail?.user_type) ?
                    <View style={styles.rowSpaceBetween}>

                        {/* <View style={[localstyles.labelStyle, { backgroundColor: Colors[colorScheme]?.white15 }]}>

                            <HText type="R12" color={Colors[colorScheme]?.white}>
                                {'See Resume'}
                            </HText>
                        </View>
                        <View style={[localstyles.labelStyle, { borderWidth: moderateScale(1), borderColor: Colors[colorScheme]?.grayScale7 }]}>

                            <HText type="R12" color={Colors[colorScheme]?.white}>
                                {'See Profile'}
                            </HText>
                        </View> */}
                    </View>
                    :
                    <>
                        <View style={[localstyles.labelStyle, { backgroundColor: Colors[colorScheme]?.white15, }]}>

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
                    </>}
            </ImageBackground>

        </TouchableOpacity>
    )
}

export default FeaturedJob

const localstyles = StyleSheet.create({
    main: {
        ...styles.ml10,
        borderRadius: moderateScale(24),
        height: moderateScale(186)
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
    profileImageStyle: {
        width: moderateScale(46),
        height: moderateScale(46),
        borderRadius: moderateScale(12),
        ...styles.selfCenter
    },
    labelStyle: {
        ...styles.mt25,
        ...styles.ph15,
        ...styles.pv5,
        ...styles.selfStart,
        borderRadius: moderateScale(50)
    }
})