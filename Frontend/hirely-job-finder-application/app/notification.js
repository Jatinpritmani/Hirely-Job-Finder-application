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

const notification = () => {

    const currentUserDetail = useSelector(state => state.userReducer.currentUserDetail)
    const [jobNotificatioData, setJobNotificationData] = useState([])
    const [statusNotificatioData, setStatusNotificationData] = useState([])

    useFocusEffect(
        useCallback(() => {
            getAllNotifications()
            return () => { };
        }, [])
    );

    const getAllNotifications = async () => {
        let data = {
            "user_id": currentUserDetail?.user_id
        }
        try {
            let response = await apiRequest("POST", GET_NOTIFICAITONS, data);
            if (response?.code == 'HJFA_MS_OK_200' && !response?.error_status) {
                console.log('====================================');
                console.log(response);
                console.log('====================================');

                const jobNotifications = response?.data?.filter(item => item.type === "job_posted");
                const statusNotifications = response?.data?.filter(item => item.type === "status_update");

                setJobNotificationData(jobNotifications);
                setStatusNotificationData(statusNotifications);
            }
            else {

            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }

    }

    const renderNotificaiton = ({ item, index }) => {
        return (
            <NotificationCard item={item} index={index} />
        )
    }

    return (
        <HSafeAreaView>
            <HHeader title={'Notification'} />

            <FlatList
                data={jobNotificatioData}
                renderItem={renderNotificaiton}
                showsVerticalScrollIndicator={false}
                style={styles.mt15}
                ListHeaderComponent={() => {
                    return (
                        <>
                            {jobNotificatioData?.length > 0 && <HText type={'S14'} style={styles.mb25}>
                                {'New activity'}
                            </HText>}</>
                    )
                }}
                ListFooterComponent={() => {
                    return (
                        <>
                            {statusNotificatioData?.length > 0 && <HText type={'S14'} style={styles.mt25}>
                                {'Applications'}
                            </HText>}
                            <FlatList
                                data={statusNotificatioData}
                                renderItem={renderNotificaiton}
                                showsVerticalScrollIndicator={false}
                                style={styles.mt15}
                            /></>
                    )
                }}
            />

        </HSafeAreaView>
    )
}

export default notification

const localStyles = StyleSheet.create({})