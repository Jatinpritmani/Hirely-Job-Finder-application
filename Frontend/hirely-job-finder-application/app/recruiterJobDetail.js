import { Image, ScrollView, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'

// local imports
import { Colors } from '@/constants/Colors';
import HSafeAreaView from '../components/common/HSafeAreaView';
import HHeader from '../components/common/HHeader';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { styles } from '../themes';
import { BulletIcon, LeftWhiteArrowIcon, SavedJob, SavedJobBlue } from '../assets/svgs';
import { getJobTypeLabel, getLocationLabel, moderateScale } from '../constants/constants';
import HText from '../components/common/HText';
import HButton from '../components/common/HButton';
import apiRequest, { FILE_BASE_URL } from '../components/api';
import { APPLY_JOB, GET_ALL_JOBS, UNSAVE_JOB } from '../components/apiConstants';
import { useDispatch, useSelector } from 'react-redux';
import { getAllJobList } from '../context/actions/jobAction';
import images from '../assets/images';

/**
 * Component for displaying recruiter job details.
 */
const recruiterJobDetail = () => {
    const colorScheme = useColorScheme();
    const { jobDetail, index } = useLocalSearchParams()
    const dispatch = useDispatch()
    const [jobDetails, setJobDetails] = useState(JSON.parse(jobDetail))
    const [responsibilities, setResponsibilities] = useState()
    const [showReadMore, setShowReadMore] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const allJobList = useSelector(state => state.jobReducer.allJobList)
    const recruiterDetails = useSelector(state => state.userReducer.recruiterDetails)

    const currentUserDetail = useSelector(state => state.userReducer.currentUserDetail)

    const loading = useSelector(state => state.jobReducer.loading)

    useEffect(() => {
        const job = recruiterDetails?.jobDetails?.find(job => job.job_id === jobDetails?.job_id);
        setJobDetails(job)
        const sentencesArray = job?.requirenment?.split("\n");
        setResponsibilities(sentencesArray)
    }, [loading])

    /**
     * Handles the save job button press.
     */
    const onPressSave = async () => {
        if (jobDetails?.is_job_saved) {
            let payload = {
                saved_job_id: jobDetails?._id
            }
            try {
                let response = await apiRequest("POST", UNSAVE_JOB, payload);
                if (response?.code == 'HJFA_MS_OK_200' && !response?.error_status) {
                    dispatch(getAllJobList(currentUserDetail?.user_id))
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false)
            }
        } else {
            let payload = {
                recruiter_id: jobDetails?.recruiter_id,
                job_id: jobDetails?._id,
                job_seeker_id: currentUserDetail?.user_id,
                apply_type: "save_job",
            }
            try {
                let response = await apiRequest("POST", APPLY_JOB, payload);
                if (response?.code == 'HJFA_MS_OK_200' && !response?.error_status) {
                    dispatch(getAllJobList(currentUserDetail?.user_id))
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false)
            }
        }
    }

    /**
     * Handles the Read More button press.
     * Toggles the number of lines displayed for the job description.
     * */
    const toggleReadMore = () => {
        setExpanded(!expanded);
    };

    const handleTextLayout = (e) => {

        const { lines } = e.nativeEvent;
        if (lines.length > 3 && !showReadMore) {
            setShowReadMore(true);
        }
    };

    /**
     * Component for rendering the right icon in the header.
     */
    const RightIcon = () => {
        return (
            <TouchableOpacity onPress={onPressSave}>
                {jobDetails?.is_job_saved ? <SavedJobBlue width={moderateScale(24)} height={moderateScale(24)} /> : <SavedJob width={moderateScale(24)} height={moderateScale(24)} />}
            </TouchableOpacity>
        )
    }

    /**
     * Handles the back button press.
     */
    const goBack = () => { router.back() };

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

    useFocusEffect(
        useCallback(() => {
            const sentencesArray = jobDetails?.requirenment?.split("\n");
            setResponsibilities(sentencesArray)
            return () => { };
        }, [jobDetails])
    );

    return (
        <HSafeAreaView containerStyle={styles.ph0} style={localStyles.main}>
            <ScrollView showsVerticalScrollIndicator={false} >
                <View style={[localStyles.upperContainer, { backgroundColor: Colors[colorScheme]?.primary }]}>
                    <HHeader title="" isLeftIcon={<LeftIcon />} isHideBack={true} containerStyle={styles.ph20} />
                    <View style={[localStyles.imgStyle, { backgroundColor: Colors[colorScheme]?.white }]}>
                        <Image
                            source={jobDetails?.image?.originalname ? { uri: FILE_BASE_URL + jobDetails?.image?.originalname } : index % 2 == 0 ? images.fb : images.google}
                            style={localStyles.imgStyle}
                        />
                    </View>
                    <HText type="B24" align="center" style={styles.mt10} color={Colors[colorScheme]?.white}>
                        {jobDetails?.position}
                    </HText>
                    <HText type="M16" align="center" style={styles.mt10} color={Colors[colorScheme]?.white}>
                        {jobDetails?.company_name || ''}
                    </HText>
                    <View style={[styles.flexRow, styles.center, { gap: moderateScale(30) }]}>
                        <HText type="S16" align="center" style={styles.mt10} color={Colors[colorScheme]?.white}>
                            {jobDetails?.job_type ? `$${jobDetails?.salary}/year` : null}
                        </HText>
                        <HText type="S16" align="center" style={styles.mt10} color={Colors[colorScheme]?.white}>
                            {getLocationLabel(jobDetails?.location) || ''}
                        </HText>
                    </View>
                    <View style={[localStyles.labelStyle, { backgroundColor: Colors[colorScheme]?.white15 }]}>
                        <View style={[localStyles.triangleRight, { borderLeftColor: '#476c99' }]} />

                        <HText type="R12" style={[styles.ph20, styles.pv5]} color={Colors[colorScheme]?.white}>
                            {getJobTypeLabel(jobDetails?.job_type)}
                        </HText>
                        <View style={[localStyles.triangleShapeLeft, { borderRightColor: '#476c99' }]} />

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
                    <HText onTextLayout={handleTextLayout} type="R14" align='left' numberOfLines={expanded ? 0 : 3} color={Colors[colorScheme]?.grayScale7} style={styles.mt15}  >
                        {jobDetails?.summary}
                    </HText>
                    {showReadMore && (
                        <TouchableOpacity onPress={toggleReadMore} >
                            <HText type="L12" color={Colors[colorScheme]?.primary} style={styles.mt10} >
                                {expanded ? '...Read Less' : '...Read More'}
                            </HText>
                        </TouchableOpacity>
                    )}
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
            </ScrollView>
        </HSafeAreaView >
    )
}

export default recruiterJobDetail

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
        ...styles.selfCenter,
        flexDirection: 'row',
        alignItems: 'center',
    },
    triangleShapeLeft: {
        width: 0,
        height: 0,
        borderTopWidth: 20,
        borderBottomWidth: 20,
        borderRightWidth: 15,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
    },
    triangleRight: {
        width: 0,
        height: 0,
        borderTopWidth: 20,
        borderBottomWidth: 20,
        borderLeftWidth: 15,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
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