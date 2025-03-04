import { FlatList, Image, StyleSheet, useColorScheme, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useSelector } from 'react-redux';

// local imports
import { Colors } from '@/constants/Colors';
import HSafeAreaView from '../components/common/HSafeAreaView';
import HHeader from '../components/common/HHeader';
import { styles } from '../themes';
import { visibleStatus, getLocationLabel, moderateScale } from '../constants/constants';
import HText from '../components/common/HText';
import apiRequest, { FILE_BASE_URL } from '../components/api';
import { GET_APPLIED_JOBS } from '../components/apiConstants';
import images from '../assets/images';
import StatusHistory from '../components/screenComponents/StatusHistory';

/**
 * This component renders the track job screen.
 * It displays the details of the applied job and its current status.
 */
const trackJob = () => {
    const colorScheme = useColorScheme();
    const { jobDetail, index } = useLocalSearchParams()
    const currentUserDetail = useSelector(state => state.userReducer.currentUserDetail)
    const [jodDetails, setJobDetails] = useState(JSON.parse(jobDetail))
    const [appliedJobData, setAppliedJobData] = useState()
    const [refreshing, setRefreshing] = useState(false)

    /**
     * Focus effect to fetch applied job details when the screen is focused.
     */
    useFocusEffect(
        useCallback(() => {
            getAppliedJobs()
            return () => { };
        }, [])
    );

    /**
     * Fetches the details of the applied job based on the user ID and applied job ID.
     */
    const getAppliedJobs = async () => {
        let payload = {
            user_id: currentUserDetail?.user_id,
            applied_job_id: jodDetails?.applied_job_id
        }

        try {
            let response = await apiRequest("POST", GET_APPLIED_JOBS, payload);
            if (response?.code == 'HJFA_MS_OK_200' && !response?.error_status) {
                setAppliedJobData(response?.data && response?.data[0])
            } else {
                console.error("Error fetching applied job details:", response?.message);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const onRefresh = async () => {
        setRefreshing(true)
        await getAppliedJobs()
        setRefreshing(false)
    }

    const renderStatusItem = ({ item, index }) => {
        return (
            <StatusHistory item={item} index={index} statushistoryList={appliedJobData?.status_history} />
        )
    }

    return (
        <HSafeAreaView containerStyle={styles.ph0}>
            <View style={{ backgroundColor: Colors[colorScheme]?.white }}>
                <HHeader title="Track Job" containerStyle={styles.ph20} />
                <View style={localstyles.jobStyle}>
                    <View style={[localstyles.imgStyle, { backgroundColor: Colors[colorScheme]?.grayScale4 }]} >
                        <Image
                            source={appliedJobData?.image?.originalname ? { uri: FILE_BASE_URL + appliedJobData?.image?.originalname } : index % 2 == 0 ? images.fb : images.google}
                            style={localstyles.imgStyle}
                        />
                    </View>
                    <View style={[styles.flex, styles.ml15]}>
                        <View style={styles.rowSpaceBetween}>
                            <HText type="S14">
                                {appliedJobData?.position}
                            </HText>
                            <HText type="M12">
                                {appliedJobData?.salary ? `$${appliedJobData?.salary}/y` : ''}
                            </HText>
                        </View>
                        <View style={styles.rowSpaceBetween}>
                            <HText type="R12" style={{ opacity: 0.5 }}>
                                {appliedJobData?.company_name || 'Google'}
                            </HText>
                            <HText type="R12" color={Colors[colorScheme]?.grayScale7}>
                                {getLocationLabel(appliedJobData?.location) || 'USA'}
                            </HText>
                        </View>
                    </View>
                </View>
            </View>
            <View style={[styles.m25]}>
                <HText type="S16">
                    Track Application
                </HText>
            </View>
            <FlatList
                data={visibleStatus}
                renderItem={renderStatusItem}
                style={styles.mh25}
                refreshing={refreshing}
                onRefresh={onRefresh}
            />
        </HSafeAreaView>
    )
}




export default trackJob

const localstyles = StyleSheet.create({
    imgStyle: {
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(20),
    },
    jobStyle: {
        ...styles.mh30,
        ...styles.mv25,
        ...styles.flexRow
    }
})