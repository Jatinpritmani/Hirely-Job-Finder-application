import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useFocusEffect } from 'expo-router'
import { useSelector } from 'react-redux'

// local imports
import HSafeAreaView from '../../components/common/HSafeAreaView'
import HText from '../../components/common/HText'
import { styles } from '../../themes'
import apiRequest from '../../components/api'
import { GET_APPLIED_JOBS, GET_SAVED_JOBS } from '../../components/apiConstants'
import JobCard from '../../components/screenComponents/JobCard'
import EmptyListComponent from '../../components/common/EmptyListComponent'

const Saved = () => {
    const currentUserDetail = useSelector(state => state.userReducer.currentUserDetail)
    const [savedJobs, setSavedJobs] = useState([])
    const [refreshing, setRefreshing] = useState(false);

    useFocusEffect(
        useCallback(() => {
            getSavedJobs()
            return () => { };
        }, [])
    );

    const getSavedJobs = async () => {
        let payload = {
            user_id: currentUserDetail?.user_id
        }
        try {
            let response = await apiRequest("POST", GET_SAVED_JOBS, payload);
            if (response?.code == 'HJFA_MS_OK_200' && !response?.error_status) {
                setSavedJobs(response?.data || [])
            }
            else {
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
    const renderSavedJob = ({ item, index }) => {
        return (
            <JobCard item={item} index={index} isSavedCard={true} />
        )
    }
    const onRefresh = async () => {
        setRefreshing(true)
        await getSavedJobs()
        setRefreshing(false)
    }

    return (
        <HSafeAreaView>
            <HText type="S24" style={styles.mt30}>
                You saved {savedJobs?.length || 0} Jobs
            </HText>
            <FlatList
                data={savedJobs}
                renderItem={renderSavedJob}
                onRefresh={onRefresh}
                refreshing={refreshing}
                style={[styles.mt25]}
                ListEmptyComponent={<EmptyListComponent title={`You Don't have any saved Jobs.`} />}
                showsVerticalScrollIndicator={false}
            />
        </HSafeAreaView>
    )
}

export default Saved

const localStyles = StyleSheet.create({})