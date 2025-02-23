import { StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'
import moment from "moment";

// local imports
import HText from '../common/HText'
import { moderateScale } from '../../constants/constants'
import { styles } from '../../themes'
import { READ_NOTIFICAITONS } from '../apiConstants';
import { router } from 'expo-router';
import apiRequest from '../api';

const NotificationCard = ({ item, index }) => {
    const colorsScheme = useColorScheme()


    const readNotificaiton = async () => {
        // if (!item?.is_read) {

        //     let data = {
        //         "notification_id": item?.notification_id
        //     }
        //     try {
        //         let response = await apiRequest("POST", READ_NOTIFICAITONS, data);
        //         console.log(response);

        //         if (response?.code == 'HJFA_MS_OK_200' && !response?.error_status) {

        //         }
        //         else {

        //         }
        //     } catch (error) {
        //         console.error("Error fetching data:", error);
        //     }
        // }
        if (item?.type == "job_posted") {
            router.push({
                pathname: "/jobDetail",
                params: { jobDetail: JSON.stringify(item) }, // Pass parameters
            })
        }
        if (item?.type == "status_update") {
            router.push({
                pathname: "/trackJob",
                params: { jobDetail: JSON.stringify(item) }, // Pass parameters
            })
        }
    }
    return (
        <TouchableOpacity onPress={readNotificaiton} style={localStyles.main}>
            <View style={[localStyles.imageStyle, { backgroundColor: Colors[colorsScheme]?.subText }]}>

            </View>
            <View>

                <HText type="R14" style={styles.flex} color={Colors[colorsScheme]?.subText}>{item?.message}</HText>
                <View style={styles.flexRow}>
                    <HText type={item?.is_read ? "R14" : "M14"} color={item?.is_read ? Colors[colorsScheme]?.subText : Colors[colorsScheme]?.text}>{moment(item?.createdAt).fromNow()}</HText>
                    {!item?.is_read ? <View style={[localStyles.unreadStyle, { backgroundColor: Colors[colorsScheme]?.primary }]}></View > : null}
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default NotificationCard

const localStyles = StyleSheet.create({
    main: {
        ...styles.flexRow,
        gap: moderateScale(12),
        ...styles.mb15,
    },
    imageStyle: {
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(20)
    },
    unreadStyle: {
        width: moderateScale(8),
        height: moderateScale(8),
        ...styles.selfCenter,
        borderRadius: moderateScale(4),
        ...styles.ml5
    }
})