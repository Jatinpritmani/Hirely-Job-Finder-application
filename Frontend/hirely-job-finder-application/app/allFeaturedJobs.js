import { FlatList, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useFocusEffect } from 'expo-router'
import { useDispatch, useSelector } from 'react-redux'

// local imports
import HSafeAreaView from '../components/common/HSafeAreaView'
import { styles } from '../themes'
import EmptyListComponent from '../components/common/EmptyListComponent'
import { isUserRecruiter } from '../constants/constants'
import { getAllJobList } from '../context/actions/jobAction'
import { getRecruiterDetail } from '../context/actions/userActions'
import HLoader from '../components/common/HLoader'
import HHeader from '../components/common/HHeader'
import FeaturedJob from '../components/screenComponents/FeaturedJob'

/**
 * This component renders a list of all featured jobs.
 * It fetches job data based on the user type (recruiter or job seeker).
 * It also supports pull-to-refresh functionality.
 */
const allFeaturedJobs = () => {
    const currentUserDetail = useSelector(state => state.userReducer.currentUserDetail)
    const allJobListData = useSelector(state => state.jobReducer.allJobList)
    const recruiterDetails = useSelector(state => state.userReducer.recruiterDetails)

    const dispatch = useDispatch()

    const allJobloading = useSelector(state => state.jobReducer.loading)
    const loadingRecruiterDetai = useSelector(state => state.userReducer.loadingRecruiterDetai)

    const [refreshing, setRefreshing] = useState(false);
    const [recruiterDetailsData, setRecruiterDetailsData] = useState(null)

    /**
     * Effect to update recruiter details data when recruiterDetails changes.
     */
    useEffect(() => {
        if (recruiterDetails) {
            setRecruiterDetailsData(recruiterDetails)
        }
    }, [recruiterDetails])

    /**
     * Focus effect to fetch all jobs when the screen is focused.
     */
    useFocusEffect(
        useCallback(() => {
            getAllJobs()
            return () => { };
        }, [])
    );

    /**
     * Fetches all jobs based on the user type.
     */
    const getAllJobs = async () => {
        if (isUserRecruiter(currentUserDetail?.user_type)) {
            dispatch(getRecruiterDetail(currentUserDetail?.user_id))
        } else {
            dispatch(getAllJobList(currentUserDetail?.user_id))
        }
    }

    /**
     * Renders a featured job card.
     * @param {Object} param0 - The job item and index.
     */
    const renderJobCard = ({ item, index }) => {
        return (
            <FeaturedJob item={item} index={index} isVertical={true} />
        )
    }

    /**
     * Handles the pull-to-refresh functionality.
     */
    const onRefresh = async () => {
        setRefreshing(true)
        await getAllJobs()
        setRefreshing(false)
    }

    if (allJobloading || loadingRecruiterDetai) {
        return <HLoader />;
    }

    return (
        <HSafeAreaView>
            <HHeader title={isUserRecruiter(currentUserDetail?.user_type) ? 'All Applicants' : 'All Featured Jobs'} />
            <FlatList
                data={isUserRecruiter(currentUserDetail?.user_type) ? recruiterDetailsData?.appliedJobDetails?.reverse() : allJobListData?.reverse()}
                renderItem={renderJobCard}
                onRefresh={onRefresh}
                refreshing={refreshing}
                style={[styles.mt25]}
                ListEmptyComponent={<EmptyListComponent title={isUserRecruiter(currentUserDetail?.user_type) ? `You Don't have Jobs Posting.` : `Currently No Jobs Here`} />}
                showsVerticalScrollIndicator={false}
            />
        </HSafeAreaView>
    )
}

export default allFeaturedJobs

const localStyles = StyleSheet.create({})