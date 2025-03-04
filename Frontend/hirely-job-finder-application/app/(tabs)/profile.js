// library import
import { Image, RefreshControl, ScrollView, StyleSheet, Text, Touchable, TouchableOpacity, useColorScheme, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { router, useFocusEffect } from 'expo-router'
import * as WebBrowser from 'expo-web-browser';

// local imports 
import HSafeAreaView from '../../components/common/HSafeAreaView'
import HHeader from '../../components/common/HHeader'
import images from '../../assets/images'
import { isUserJobSeeker, isUserRecruiter, moderateScale } from '../../constants/constants'
import { styles } from '../../themes'
import HText from '../../components/common/HText'
import { Colors } from '@/constants/Colors';
import ExperienceCard from '../../components/screenComponents/ExperienceCard'
import { getUserDetail } from '../../context/actions/userActions'
import HLoader from '../../components/common/HLoader'
import { API_BASE_URL } from '../../components/api';
import { GET_RESUME } from '../../components/apiConstants';

/**
 * This component renders the profile of the current user.
 * It displays user details, resume, and experiences.
 * It also supports pull-to-refresh functionality.
 */
const Profile = () => {
    const currentUserDetail = useSelector(state => state.userReducer.currentUserDetail)
    const loading = useSelector(state => state.userReducer.loading)
    const colorScheme = useColorScheme();
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false);

    /**
     * Effect to update loading state when loading changes.
     */
    useEffect(() => {
        setIsLoading(loading)
        setRefreshing(loading)
    }, [loading])

    /**
     * Focus effect to fetch user details when the screen is focused.
     */
    useFocusEffect(
        useCallback(() => {
            dispatch(getUserDetail(currentUserDetail?.user_id))
            return () => { }
        }, [])
    );

    /**
     * Handles the pull-to-refresh functionality.
     */
    const onRefresh = () => {
        setRefreshing(true);
        dispatch(getUserDetail(currentUserDetail?.user_id))
    }

    /**
     * Navigates to the all experiences screen.
     */
    const onPressSeeAllExperience = () => {
        router.push({
            pathname: "/allExperience",
            params: { fromJobSeeker: 'false', jobSeekerDetails: null },
        })
    }

    /**
     * Opens the resume in a web browser.
     */
    const onPressResume = async () => {
        await WebBrowser.openBrowserAsync(`${API_BASE_URL}${GET_RESUME}?user_id=${currentUserDetail.user_id}`);
    }

    /**
     * Navigates to the upload CV screen.
     */
    const onPressReupload = () => {
        router.push({
            pathname: "/uploadCV",
            params: { fromProfile: 'true' },
        })
    }

    if (isLoading) {
        return <HLoader />
    }

    return (
        <HSafeAreaView >
            <HHeader title="" />
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <Image
                    source={images.profileImage1}
                    style={localStyles.profileImageStyle}
                />
                <HText type="S22" align='center' style={styles.mt10}>
                    {currentUserDetail.user_name}
                </HText>
                <HText type="R12" align='center' color={Colors[colorScheme]?.subText}>
                    {currentUserDetail.designation}
                </HText>

                {isUserJobSeeker(currentUserDetail?.user_type) &&
                    <>
                        <HText type="B16" align='center' style={styles.mt30}>
                            {currentUserDetail.total_job_applied}
                        </HText>

                        <HText type="R12" align='center' color={Colors[colorScheme]?.subText} style={styles.mt10}>
                            {'Applied'}
                        </HText>
                    </>
                }
                {isUserRecruiter(currentUserDetail?.user_type) &&
                    <>
                        <HText type="B16" align='center' style={styles.mt30}>
                            {currentUserDetail.company_name || 'Google'}
                        </HText>
                        <HText type="R12" align='center' color={Colors[colorScheme]?.subText} style={styles.mt10}>
                            {'Company Name'}
                        </HText>
                    </>}
                {isUserJobSeeker(currentUserDetail?.user_type) &&
                    <>
                        <View style={localStyles.resumeContainerStyle}>
                            <HText type="S16" color={Colors[colorScheme]?.headerColor} style={styles.mt10}>
                                {'Resume'}
                            </HText>
                            <TouchableOpacity onPress={onPressReupload}>
                                <HText type="R12" color={Colors[colorScheme]?.grayScale4} style={styles.mt10}>
                                    {'Re-upload'}
                                </HText>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={onPressResume} style={[localStyles.cvContainer, { backgroundColor: Colors[colorScheme]?.white }]}>
                            <View style={styles.rowSpaceBetween}>
                                <View style={[localStyles.cvText, { backgroundColor: Colors[colorScheme]?.primary1 }]}>
                                    <HText type="M10" color={Colors[colorScheme]?.white} >
                                        {'CV'}
                                    </HText>
                                </View>
                                <View>
                                    <HText type="B12" align='center' >
                                        {currentUserDetail.user_name}
                                    </HText>
                                    <HText type="R12" align='center' color={Colors[colorScheme]?.subText}>
                                        {currentUserDetail.designation}
                                    </HText>
                                </View>
                                <View style={[localStyles.cvText, { backgroundColor: Colors[colorScheme]?.red80 }]}>
                                    <HText type="M10" color={Colors[colorScheme]?.white} >
                                        {'PDF'}
                                    </HText>
                                </View>
                            </View>
                            <HText type="L12" numberOfLines={3} color={Colors[colorScheme]?.subText} style={styles.mt10} >
                                {currentUserDetail.bio}
                            </HText>
                        </TouchableOpacity>
                    </>}
                {(isUserJobSeeker(currentUserDetail?.user_type) && currentUserDetail?.experience) &&
                    (
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
                            <ExperienceCard item={currentUserDetail?.experience[0]} isShowDelete={false} cardStyle={localStyles.experiencecardStyle} />
                        </>
                    )
                }
            </ScrollView>
        </HSafeAreaView>
    )
}

export default Profile

const localStyles = StyleSheet.create({
    profileImageStyle: {
        width: moderateScale(104),
        height: moderateScale(104),
        borderRadius: moderateScale(52),
        ...styles.selfCenter
    },
    resumeContainerStyle: {
        ...styles.mt45,
        ...styles.rowSpaceBetween
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
    }
})