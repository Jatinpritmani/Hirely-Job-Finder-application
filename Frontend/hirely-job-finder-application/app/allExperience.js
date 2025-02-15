// library imports
import { FlatList, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// local imports
import ExperienceCard from '../components/screenComponents/ExperienceCard'
import HSafeAreaView from '../components/common/HSafeAreaView'
import { styles } from '../themes'
import { getUserDetail } from '../context/actions/userActions'
import HLoader from '../components/common/HLoader'
import HHeader from '../components/common/HHeader'

const allExperience = () => {
    const currentUserDetail = useSelector(state => state.userReducer.currentUserDetail)
    const loading = useSelector(state => state.userReducer.loading)
    const dispatch = useDispatch()

    const [isLoading, setIsLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        setIsLoading(loading)
        setRefreshing(loading)
    }, [loading])

    const onRefresh = () => {
        setRefreshing(true);
        dispatch(getUserDetail(currentUserDetail?.user_id))

    }


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
                data={currentUserDetail?.experience}
                renderItem={renderItem}
                style={styles.mt10}
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