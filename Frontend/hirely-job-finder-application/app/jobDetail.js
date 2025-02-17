import { ScrollView, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native'
import React, { useCallback, useState } from 'react'

// local imports
import { Colors } from '@/constants/Colors';
import HSafeAreaView from '../components/common/HSafeAreaView';
import HHeader from '../components/common/HHeader';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { styles } from '../themes';
import { BulletIcon, LeftWhiteArrowIcon, SavedJob } from '../assets/svgs';
import { getJobTypeLabel, getLocationLabel, moderateScale } from '../constants/constants';
import HText from '../components/common/HText';
import HButton from '../components/common/HButton';

const jobDetail = () => {
    const colorScheme = useColorScheme();
    const { jobDetail } = useLocalSearchParams()
    const [jobDetails, setJobDetails] = useState(JSON.parse(jobDetail))
    const [responsibilities, setResponsibilities] = useState()

    const onPressSave = () => { }
    const RightIcon = () => {
        return (

            <TouchableOpacity onPress={onPressSave}>
                <SavedJob width={moderateScale(24)} height={moderateScale(24)} />
            </TouchableOpacity>
        )
    }
    const goBack = () => { router.back() };

    const LeftIcon = () => {
        return (

            <TouchableOpacity onPress={goBack}>
                <LeftWhiteArrowIcon width={moderateScale(24)} height={moderateScale(24)} />
            </TouchableOpacity>
        )
    }
    useFocusEffect(
        useCallback(() => {

            const sentencesArray = jobDetails?.requirenment.split("\n");

            setResponsibilities(sentencesArray)
            return () => { };
        }, [jobDetails])
    );

    const onPressApplyNow = () => {
        router.push({
            pathname: "/applyJob",
            params: { jobDetail: JSON.stringify(jobDetails) }, // Pass parameters
        })
    }
    return (

        <HSafeAreaView containerStyle={styles.ph0} style={localStyles.main}>
            <ScrollView showsVerticalScrollIndicator={false} >
                <View style={[localStyles.upperContainer, { backgroundColor: Colors[colorScheme]?.grayScale4 }]}>
                    <HHeader title="" isLeftIcon={<LeftIcon />} isHideBack={true} rightIcon={<RightIcon />} containerStyle={styles.ph20}
                    />
                    <View style={[localStyles.imgStyle, { backgroundColor: Colors[colorScheme]?.white }]}>

                    </View>
                    <HText type="B24" align="center" style={styles.mt10} color={Colors[colorScheme]?.white}>
                        {jobDetails?.position}
                    </HText>
                    <HText type="M16" align="center" style={styles.mt10} color={Colors[colorScheme]?.white}>
                        {jobDetails?.company_name}
                    </HText>
                    <View style={[styles.flexRow, styles.selfCenter, { gap: moderateScale(30) }]}>
                        <HText type="S16" align="center" style={styles.mt10} color={Colors[colorScheme]?.white}>
                            {jobDetails?.job_type ? `$${jobDetails?.salary}/year` : null}
                        </HText>
                        <HText type="B24" align="center" style={styles.mt10} color={Colors[colorScheme]?.white}>
                            {getLocationLabel(jobDetails?.location) || ''}
                        </HText>
                    </View>
                    <View style={[localStyles.labelStyle, { backgroundColor: Colors[colorScheme]?.grayScale9 }]}>

                        <HText type="R12" color={Colors[colorScheme]?.white}>
                            {getJobTypeLabel(jobDetails?.job_type)}
                        </HText>
                    </View>
                </View>

                <View style={localStyles.bottomContainer}>
                    <View style={{ borderBottomWidth: 1, borderColor: Colors[colorScheme]?.borderColor }} >

                        <HText type="M14" align='left' color={Colors[colorScheme]?.primary} style={{ width: '20%', paddingBottom: moderateScale(10), borderBottomWidth: moderateScale(2), borderColor: Colors[colorScheme]?.primary }}>
                            {'Summary'}
                        </HText>
                    </View>
                    <HText type="S16" align='left' color={Colors[colorScheme]?.headerColor} style={styles.mt25}  >
                        {'Job Description'}
                    </HText>
                    <HText type="R14" align='left' numberOfLines={3} color={Colors[colorScheme]?.grayScale7} style={styles.mt15}  >
                        {jobDetails?.summary}
                    </HText>
                    <HText type="S16" align='left' color={Colors[colorScheme]?.headerColor} style={styles.mt25}  >
                        {'Responsibilities'}
                    </HText>
                    {responsibilities && responsibilities?.map((item, index) => {
                        return (
                            <View style={[styles.flexRow, styles.itemsCenter, styles.mb15, index == 0 && styles.mt15]} >
                                <View style={[styles.selfStart, styles.mt10, styles.mr10]}>
                                    <BulletIcon />
                                </View>
                                <HText type="R14" align='left' numberOfLines={3} color={Colors[colorScheme]?.grayScale7}   >
                                    {item}
                                </HText>
                            </View>
                        )
                    })}
                </View>
                {!jobDetails?.is_job_applied && <HButton
                    onPress={onPressApplyNow}
                    textType={"S16"}
                    color={Colors[colorScheme]?.white}
                    title={"Apply Now"}
                    containerStyle={[styles.mv30, styles.mh25]}
                    bgColor={Colors[colorScheme]?.primary}
                ></HButton>}

            </ScrollView>

        </HSafeAreaView >
    )
}

export default jobDetail

const localStyles = StyleSheet.create({
    main: {
        ...styles.ph20
    },
    imgStyle: {
        width: moderateScale(80),
        height: moderateScale(80),
        borderRadius: moderateScale(40),
        ...styles.selfCenter
    },
    labelStyle: {
        ...styles.mb30,
        ...styles.mt25,
        ...styles.ph15,
        ...styles.pv5,
        ...styles.selfCenter,
        borderRadius: moderateScale(50)
    },
    upperContainer: {
        borderBottomEndRadius: moderateScale(32),
        borderBottomStartRadius: moderateScale(32),
    },
    bottomContainer: {
        ...styles.pv25,
        ...styles.ph25,

    }
})