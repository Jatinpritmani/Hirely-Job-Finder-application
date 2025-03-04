// library imports
import { FlatList, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocalSearchParams } from 'expo-router'

// local imports
import ExperienceCard from '../components/screenComponents/ExperienceCard'
import HSafeAreaView from '../components/common/HSafeAreaView'
import { styles } from '../themes'
import { getUserDetail } from '../context/actions/userActions'
import HLoader from '../components/common/HLoader'
import HHeader from '../components/common/HHeader'
import EmptyListComponent from '../components/common/EmptyListComponent'

/**
 * This component renders a list of all experiences for a user.
 * It fetches experience data based on the user type (job seeker).
 * It also supports pull-to-refresh functionality.
 */
const allExperience = () => {
    const currentUserDetail = useSelector(state => state.userReducer.currentUserDetail)
    const loading = useSelector(state => state.userReducer.loading)
    const dispatch = useDispatch()
    const jobSeekerDetails = useLocalSearchParams()?.jobSeekerDetails && JSON.parse(useLocalSearchParams()?.jobSeekerDetails) || []
    const fromJobSeeker = JSON.parse(useLocalSearchParams()?.fromJobSeeker) || false

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
     * Handles the pull-to-refresh functionality.
     */
    const onRefresh = () => {
        setRefreshing(true);
        dispatch(getUserDetail(currentUserDetail?.user_id))
    }

    /**
     * Renders an experience card.
     * @param {Object} param0 - The experience item and index.
     */
    const renderItem = ({ item, index }) => {
        return (
            <ExperienceCard item={item} index={index} isShowDelete={false} cardStyle={localStyles.experiencecardStyle} />
        )
    }

    if (isLoading) {
        return <HLoader />
    }

    return (
        <HSafeAreaView>
            <HHeader title="Experiences" />
            <FlatList
                onRefresh={onRefresh}
                refreshing={refreshing}
                data={fromJobSeeker ? jobSeekerDetails : currentUserDetail?.experience}
                renderItem={renderItem}
                style={styles.mt10}
                ListEmptyComponent={<EmptyListComponent title={`No Experience.`} />}
            />
        </HSafeAreaView>
    )
}

export default allExperience

const localStyles = StyleSheet.create({
    experiencecardStyle: {
        ...styles.mh0,
        borderWidth: 0
    }
})