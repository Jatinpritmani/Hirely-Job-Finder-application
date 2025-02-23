import { ScrollView, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'

// local imports
import { Colors } from '@/constants/Colors';
import HSafeAreaView from '../components/common/HSafeAreaView';
import HHeader from '../components/common/HHeader';
import { router, useLocalSearchParams } from 'expo-router';
import { styles } from '../themes';
import { LeftWhiteArrowIcon, } from '../assets/svgs';
import { moderateScale } from '../constants/constants';
import HText from '../components/common/HText';
import HButton from '../components/common/HButton';
import { useSelector } from 'react-redux';
import ExperienceCard from '../components/screenComponents/ExperienceCard';

const jobSeekerDetail = () => {
    const colorScheme = useColorScheme();
    const { jobseekerDetail } = useLocalSearchParams()
    const [jobSeekerData, setJobSeekerData] = useState(JSON.parse(jobseekerDetail))
    const allJobList = useSelector(state => state.jobReducer.allJobList)


    const currentUserDetail = useSelector(state => state.userReducer.currentUserDetail)

    const loading = useSelector(state => state.jobReducer.loading)

    useEffect(() => {

        setJobSeekerData(JSON.parse(jobseekerDetail))
    }, [])




    const goBack = () => { router.back() };

    const onPressResume = () => {

    }

    const LeftIcon = () => {
        return (

            <TouchableOpacity onPress={goBack}>
                <LeftWhiteArrowIcon width={moderateScale(24)} height={moderateScale(24)} />
            </TouchableOpacity>
        )
    }

    const onPressSeeAllExperience = () => {
        router.push("allExperience")
    }


    return (

        <HSafeAreaView containerStyle={styles.ph0} style={localStyles.main}>
            <ScrollView showsVerticalScrollIndicator={false} >
                <View style={[localStyles.upperContainer, { backgroundColor: Colors[colorScheme]?.grayScale4 }]}>
                    <HHeader title="" isLeftIcon={<LeftIcon />} isHideBack={true} containerStyle={styles.ph20}
                    />
                    <View style={[localStyles.imgStyle, { backgroundColor: Colors[colorScheme]?.white }]}>

                    </View>
                    <HText type="B24" align="center" style={styles.mt10} color={Colors[colorScheme]?.white}>
                        {jobSeekerData?.user_name}
                    </HText>
                    <HText type="M16" align="center" style={styles.mt10} color={Colors[colorScheme]?.white}>
                        {jobSeekerData?.designation}
                    </HText>
                </View>

                <View style={localStyles.bottomContainer}>
                    <View style={{ borderBottomWidth: 1, borderColor: Colors[colorScheme]?.borderColor }} >

                        <HText type="M14" align='left' color={Colors[colorScheme]?.primary} style={{ width: '20%', paddingBottom: moderateScale(10), borderBottomWidth: moderateScale(2), borderColor: Colors[colorScheme]?.primary }}>
                            {'Profile'}
                        </HText>
                    </View>
                    <HText type="S16" align='left' color={Colors[colorScheme]?.headerColor} style={styles.mt25}  >
                        {'Resume'}
                    </HText>

                    <TouchableOpacity onPress={onPressResume} style={[localStyles.cvContainer, { backgroundColor: Colors[colorScheme]?.white }]}>
                        <View style={styles.rowSpaceBetween}>
                            <View style={[localStyles.cvText, { backgroundColor: Colors[colorScheme]?.grayScale4 }]}>
                                <HText type="M10" color={Colors[colorScheme]?.white} >
                                    {'CV'}

                                </HText>

                            </View>
                            <View>
                                <HText type="B12" align='center' >
                                    {jobSeekerData.user_name}

                                </HText>
                                <HText type="R12" align='center' color={Colors[colorScheme]?.subText}>
                                    {jobSeekerData.designation}

                                </HText>
                            </View>
                            <View style={[localStyles.cvText, { backgroundColor: Colors[colorScheme]?.grayScale4 }]}>
                                <HText type="M10" color={Colors[colorScheme]?.white} >
                                    {'PDF'}

                                </HText>

                            </View>
                        </View>
                        <HText type="L12" numberOfLines={3} color={Colors[colorScheme]?.subText} style={styles.mt10} >
                            {jobSeekerData.bio}

                        </HText>
                    </TouchableOpacity>
                    <>
                        <View style={localStyles.resumeContainerStyle}>
                            <HText type="S16" color={Colors[colorScheme]?.headerColor} style={styles.mt10}>
                                {'Experience'}

                            </HText>
                            <TouchableOpacity onPress={onPressSeeAllExperience} style={styles.mt10}>

                                <HText type="R12" color={Colors[colorScheme]?.grayScale4} >
                                    {'See all'}

                                </HText>
                            </TouchableOpacity>


                        </View>

                        <ExperienceCard item={jobSeekerData?.experience[0]} isShowDelete={false} cardStyle={localStyles.experiencecardStyle} />
                    </>
                    <HButton
                        onPress={() => { }}
                        textType={"S16"}
                        color={Colors[colorScheme]?.white}
                        title={"Review Application"}
                        containerStyle={[styles.mv30,]}
                        bgColor={Colors[colorScheme]?.primary}
                    ></HButton>
                    <HButton
                        onPress={() => { }}
                        textType={"S16"}
                        color={Colors[colorScheme]?.primary}
                        title={"Reject Application"}
                        containerStyle={[styles.mb20, { borderWidth: moderateScale(1), borderColor: Colors[colorScheme]?.primary }]}
                        bgColor={Colors[colorScheme]?.white}
                    ></HButton>
                </View>

            </ScrollView>

        </HSafeAreaView >
    )
}

export default jobSeekerDetail

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
        paddingBottom: moderateScale(60)
    },
    bottomContainer: {
        ...styles.pv25,
        ...styles.ph25,
    },
    cvContainer: {
        ...styles.mt10,
        ...styles.pv10,
        ...styles.ph25,
        borderRadius: moderateScale(12),
    },
    cvText: {
        ...styles.selfStart,
        ...styles.ph10,
        borderRadius: moderateScale(12)
    },
    experiencecardStyle: {
        ...styles.mh0,
        borderWidth: 0
    },
    resumeContainerStyle: {
        ...styles.mt45,
        ...styles.rowSpaceBetween
    },
})