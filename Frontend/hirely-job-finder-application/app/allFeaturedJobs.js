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

const allFeaturedJobs = () => {
    const currentUserDetail = useSelector(state => state.userReducer.currentUserDetail)
    const allJobListData = useSelector(state => state.jobReducer.allJobList)
    const recruiterDetails = useSelector(state => state.userReducer.recruiterDetails)

    const dispatch = useDispatch()

    const allJobloading = useSelector(state => state.jobReducer.loading)
    const loadingRecruiterDetai = useSelector(state => state.userReducer.loadingRecruiterDetai)

    const [refreshing, setRefreshing] = useState(false);
    const [recruiterDetailsData, setRecruiterDetailsData] = useState(null)

    useEffect(() => {
        if (recruiterDetails) {
            setRecruiterDetailsData(recruiterDetails)
        }

    }, [recruiterDetails])


    useFocusEffect(
        useCallback(() => {
            getAllJobs()
            return () => { };
        }, [])
    );


    const getAllJobs = async () => {
        if (isUserRecruiter(currentUserDetail?.user_type)) {

            dispatch(getRecruiterDetail(currentUserDetail?.user_id))

        } else {

            dispatch(getAllJobList(currentUserDetail?.user_id))
        }
    }
    const renderJobCard = ({ item, index }) => {
        return (
            <FeaturedJob item={item} index={index} isVertical={true} />
        )
    }
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