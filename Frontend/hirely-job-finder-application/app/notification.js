import { StyleSheet, View, FlatList } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useFocusEffect } from 'expo-router'
import { useSelector } from 'react-redux'

// local imports
import HSafeAreaView from '../components/common/HSafeAreaView'
import HHeader from '../components/common/HHeader'
import apiRequest from '../components/api'
import { GET_NOTIFICAITONS } from '../components/apiConstants'
import NotificationCard from '../components/screenComponents/NotificationCard'
import { styles } from '../themes'
import HText from '../components/common/HText'
import EmptyListComponent from '../components/common/EmptyListComponent'
import { isUserRecruiter } from '../constants/constants'

/**
 * This component renders the notifications screen.
 * It fetches notifications based on the user type (recruiter or job seeker).
 * It also supports pull-to-refresh functionality.
 */
const notification = () => {
    const currentUserDetail = useSelector(state => state.userReducer.currentUserDetail)
    const [jobNotificatioData, setJobNotificationData] = useState([])
    const [statusNotificatioData, setStatusNotificationData] = useState([])
    const [jobApplicationNotificationData, setJobApplicationNotificationData] = useState([])
    const [refreshing, setRefreshing] = useState(false)

    /**
     * Focus effect to fetch notifications when the screen is focused.
     */
    useFocusEffect(
        useCallback(() => {
            getAllNotifications()
            return () => { };
        }, [])
    );

    /**
     * Fetches notifications based on the user type.
     */
    const getAllNotifications = async () => {
        let data = {}
        if (isUserRecruiter(currentUserDetail?.user_type)) {
            data = {
                "recruiter_id": currentUserDetail?.user_id
            }
        } else {
            data = {
                "user_id": currentUserDetail?.user_id
            }
        }
        try {
            let response = await apiRequest("POST", GET_NOTIFICAITONS, data);
            if (response?.code == 'HJFA_MS_OK_200' && !response?.error_status) {
                const jobNotifications = response?.data?.filter(item => item.type === "job_posted");
                const statusNotifications = response?.data?.filter(item => item.type === "status_update");
                const jobApplicationNotification = response?.data?.filter(item => item.type === "job_application");

                setJobNotificationData(jobNotifications);
                setStatusNotificationData(statusNotifications);
                setJobApplicationNotificationData(jobApplicationNotification);
            }
            else {
                console.error("Error fetching notifications:", response?.message);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    /**
     * Handles the pull-to-refresh functionality.
     */
    const onRefresh = async () => {
        setRefreshing(true)
        await getAllNotifications()
        setRefreshing(false)
    }

    /**
     * Renders a notification card.
     * @param {Object} param0 - The notification item and index.
     */
    const renderNotificaiton = ({ item, index }) => {
        return (
            <NotificationCard item={item} index={index} />
        )
    }

    return (
        <HSafeAreaView>
            <HHeader title={'Notification'} />
            <FlatList
                data={jobNotificatioData?.reverse()}
                renderItem={renderNotificaiton}
                showsVerticalScrollIndicator={false}
                style={styles.mt15}
                onRefresh={onRefresh}
                refreshing={refreshing}
                ListHeaderComponent={() => {
                    return (
                        <>
                            {jobNotificatioData?.length > 0 && <HText type={'S14'} style={styles.mb25}>
                                {'New activity'}
                            </HText>}
                        </>
                    )
                }}
                ListFooterComponent={() => {
                    return (
                        <>
                            {statusNotificatioData?.length > 0 && <HText type={'S14'} style={styles.mt25}>
                                {'Applications'}
                            </HText>}
                            <FlatList
                                data={statusNotificatioData?.reverse()}
                                renderItem={renderNotificaiton}
                                showsVerticalScrollIndicator={false}
                                style={styles.mt15}
                            />
                            {isUserRecruiter(currentUserDetail?.user_type) && <>
                                {statusNotificatioData?.length > 0 && <HText type={'S14'} style={styles.mt25}>
                                    {'Applications'}
                                </HText>}
                                <FlatList
                                    data={jobApplicationNotificationData?.reverse()}
                                    renderItem={renderNotificaiton}
                                    showsVerticalScrollIndicator={false}
                                    style={styles.mt15}
                                />
                            </>}
                        </>
                    )
                }}
                ListEmptyComponent={() => {
                    return (!jobApplicationNotificationData?.length && !statusNotificatioData?.length && !jobNotificatioData?.length) && <EmptyListComponent title={`You have no new notifications at this time.`} />
                }}
            />
        </HSafeAreaView>
    )
}

export default notification

const localStyles = StyleSheet.create({})