import { FlatList, StyleSheet, } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useFocusEffect } from 'expo-router'
import { useSelector } from 'react-redux'

// local imports
import HSafeAreaView from '../../components/common/HSafeAreaView'
import HText from '../../components/common/HText'
import { styles } from '../../themes'
import apiRequest from '../../components/api'
import { GET_APPLIED_JOBS } from '../../components/apiConstants'
import EmptyListComponent from '../../components/common/EmptyListComponent'
import AppliedJobCard from '../../components/screenComponents/appliedJobCard'

/**
 * This component renders a list of jobs that the user has applied to.
 * It fetches applied job data based on the user ID.
 * It also supports pull-to-refresh functionality.
 */
const appliedJobs = () => {
    const currentUserDetail = useSelector(state => state.userReducer.currentUserDetail)
    const [appliedJobsdata, setAppliedJobsdata] = useState([])
    const [refreshing, setRefreshing] = useState(false);

    /**
     * Focus effect to fetch applied jobs when the screen is focused.
     */
    useFocusEffect(
        useCallback(() => {
            getSavedJobs()
            return () => { };
        }, [])
    );

    /**
     * Fetches applied jobs based on the user ID.
     */
    const getSavedJobs = async () => {
        let payload = {
            user_id: currentUserDetail?.user_id
        }
        try {
            let response = await apiRequest("POST", GET_APPLIED_JOBS, payload);
            if (response?.code == 'HJFA_MS_OK_200' && !response?.error_status) {
                setAppliedJobsdata(response?.data || [])
            }
            else {
                console.error("Error fetching applied jobs:", response?.message);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    /**
     * Renders an applied job card.
     * @param {Object} param0 - The job item and index.
     */
    const renderSavedJob = ({ item, index }) => {
        return (
            <AppliedJobCard item={item} index={index} isSavedCard={true} />
        )
    }

    /**
     * Handles the pull-to-refresh functionality.
     */
    const onRefresh = async () => {
        setRefreshing(true)
        await getSavedJobs()
        setRefreshing(false)
    }

    return (
        <HSafeAreaView>
            <HText type="S24" style={styles.mt30}>
                You applied in {appliedJobsdata?.length || 0} Jobs
            </HText>
            <FlatList
                data={appliedJobsdata?.reverse()}
                renderItem={renderSavedJob}
                onRefresh={onRefresh}
                refreshing={refreshing}
                style={[styles.mt25]}
                ListEmptyComponent={<EmptyListComponent title={`You Don't have any applied Jobs.`} />}
                showsVerticalScrollIndicator={false}
            />
        </HSafeAreaView>
    )
}

export default appliedJobs

const localStyles = StyleSheet.create({})