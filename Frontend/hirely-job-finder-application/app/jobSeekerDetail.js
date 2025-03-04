import { Image, ScrollView, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import * as WebBrowser from 'expo-web-browser';

// local imports
import { Colors } from '@/constants/Colors';
import HSafeAreaView from '../components/common/HSafeAreaView';
import HHeader from '../components/common/HHeader';
import { router, useLocalSearchParams } from 'expo-router';
import { styles } from '../themes';
import { LeftWhiteArrowIcon, } from '../assets/svgs';
import { allStatus, isUserRecruiter, moderateScale } from '../constants/constants';
import HText from '../components/common/HText';
import HButton from '../components/common/HButton';
import { useDispatch, useSelector } from 'react-redux';
import ExperienceCard from '../components/screenComponents/ExperienceCard';
import apiRequest, { API_BASE_URL } from '../components/api';
import { GET_RESUME, STATUS_UPDATE } from '../components/apiConstants';
import images from '../assets/images';
import { getRecruiterDetail } from '../context/actions/userActions';
import HLoader from '../components/common/HLoader';

/**
 * This component renders the job seeker detail screen.
 * It displays the job seeker's profile, resume, and experiences.
 */
const jobSeekerDetail = () => {
    const colorScheme = useColorScheme();
    const dispatch = useDispatch()

    const { jobseekerDetail, index } = useLocalSearchParams()
    const [jobSeekerData, setJobSeekerData] = useState(JSON.parse(jobseekerDetail))
    const allJobList = useSelector(state => state.jobReducer.allJobList)
    const currentUserDetail = useSelector(state => state.userReducer.currentUserDetail)
    const loading = useSelector(state => state.jobReducer.loading)
    const [currentStatus, setCurrentStatus] = useState()
    const [nextStatus, setNextStatus] = useState()
    const [loader, setLoader] = useState(false)
    const recruiterDetails = useSelector(state => state.userReducer.recruiterDetails)



    /**
     * Effect to update job seeker data when jobseekerDetail changes.
     */
    useEffect(() => {

        setJobSeekerData(JSON.parse(jobseekerDetail))
        getNextStatus(JSON.parse(jobseekerDetail)?.status)
    }, [jobseekerDetail,])

    useEffect(() => {
        let job = recruiterDetails?.appliedJobDetails?.find(item => item?.applied_job_id == JSON.parse(jobseekerDetail)?.applied_job_id)
        setJobSeekerData(job)
        getNextStatus(job?.status)

    })



    /**
     * Handles the back button press.
     */
    const goBack = () => { router.back() };

    /**
     * Opens the resume in a web browser.
     */
    const onPressResume = async () => {
        await WebBrowser.openBrowserAsync(`${API_BASE_URL}${GET_RESUME}?user_id=${jobSeekerData._id}`);
    }

    /**
     * Component for rendering the left icon in the header.
     */
    const LeftIcon = () => {
        return (
            <TouchableOpacity onPress={goBack}>
                <LeftWhiteArrowIcon width={moderateScale(24)} height={moderateScale(24)} />
            </TouchableOpacity>
        )
    }

    /**
     * Navigates to the all experiences screen.
     */
    const onPressSeeAllExperience = () => {
        router.push({
            pathname: "/allExperience",
            params: { fromJobSeeker: 'true', jobSeekerDetails: JSON.stringify(jobSeekerData?.experience) },
        })
    }

    /**
     * function to get Next Status
     */
    const getNextStatus = (currentStatus) => {
        const index = allStatus.findIndex(item => item.status === currentStatus);
        setCurrentStatus(allStatus[index])
        index !== -1 && index < allStatus.length - 1 ? setNextStatus(allStatus[index + 1]) : setNextStatus(null);
    };

    /**
     * job status update API Call Function
     */
    const onPressJobStatusUpdate = async () => {
        let payload = {
            applied_job_id: jobSeekerData.applied_job_id,
            status: nextStatus?.status
        }
        setLoader(true)
        try {
            let response = await apiRequest("POST", STATUS_UPDATE, payload);
            if (response?.code === 'HJFA_MS_OK_200' && !response?.error_status) {
                dispatch(getRecruiterDetail(currentUserDetail?.user_id))

            } else {
            }
        } catch (error) {
            console.error("Error fetching data:", error);

        } finally {
            setLoader(false)

        }
    }

    /**
     * job status update API Call Function
     */
    const onPressJobStatuReject = async () => {
        let payload = {
            applied_job_id: jobSeekerData.applied_job_id,
            status: 'rejected'
        }
        setLoader(true)
        try {
            let response = await apiRequest("POST", STATUS_UPDATE, payload);
            if (response?.code === 'HJFA_MS_OK_200' && !response?.error_status) {
                dispatch(getRecruiterDetail(currentUserDetail?.user_id))

            } else {
            }
        } catch (error) {
            console.error("Error fetching data:", error);

        } finally {
            setLoader(false)

        }
    }

    if (loader) {
        return <HLoader />;
    }
    return (
        <HSafeAreaView containerStyle={styles.ph0} style={localStyles.main}>
            <ScrollView showsVerticalScrollIndicator={false} >
                <View style={[localStyles.upperContainer, { backgroundColor: Colors[colorScheme]?.primary }]}>
                    <HHeader title="" isLeftIcon={<LeftIcon />} isHideBack={true} containerStyle={styles.ph20} />
                    <View style={[localStyles.imgStyle, { backgroundColor: Colors[colorScheme]?.white }]}>
                        <Image
                            source={isUserRecruiter(currentUserDetail?.user_type) ? index % 2 == 0 ? images.profileImage1 : index % 1 == 0 ? images.profileImage2 : images.profileImage3 : index % 2 == 0 ? images.fb : images.google}
                            style={localStyles.imgStyle}
                        />
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
                            <View style={[localStyles.cvText, { backgroundColor: Colors[colorScheme]?.primary1 }]}>
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
                            <View style={[localStyles.cvText, { backgroundColor: Colors[colorScheme]?.red80 }]}>
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
                    {nextStatus &&
                        <>
                            <HButton
                                onPress={onPressJobStatusUpdate}
                                textType={"S16"}
                                color={Colors[colorScheme]?.white}
                                title={currentStatus?.label}
                                containerStyle={[styles.mv30,]}
                                bgColor={Colors[colorScheme]?.primary}
                            ></HButton>
                            <HButton
                                onPress={onPressJobStatuReject}
                                textType={"S16"}
                                color={Colors[colorScheme]?.primary}
                                title={"Reject Application"}
                                containerStyle={[styles.mb20, { borderWidth: moderateScale(1), borderColor: Colors[colorScheme]?.primary }]}
                                bgColor={Colors[colorScheme]?.white}
                            ></HButton>

                        </>}
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