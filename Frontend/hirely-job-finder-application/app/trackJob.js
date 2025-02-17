import { StyleSheet, Text, useColorScheme, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { useLocalSearchParams } from 'expo-router';
import { useSelector } from 'react-redux';

// local imports
import { Colors } from '@/constants/Colors';
import HSafeAreaView from '../components/common/HSafeAreaView';
import HHeader from '../components/common/HHeader';
import { styles } from '../themes';
import { getLocationLabel, moderateScale } from '../constants/constants';
import HText from '../components/common/HText';

const trackJob = () => {
    const colorScheme = useColorScheme();


    const { jobDetail } = useLocalSearchParams()
    const currentUserDetail = useSelector(state => state.userReducer.currentUserDetail)

    const [jodDetails, setJobDetails] = useState(JSON.parse(jobDetail))


    return (
        <HSafeAreaView containerStyle={styles.ph0}>
            <View style={{ backgroundColor: Colors[colorScheme]?.white }}>
                <HHeader title="Apply Job" containerStyle={styles.ph20}
                />
                <View style={localstyles.jobStyle}>
                    <View style={[localstyles.imgStyle, { backgroundColor: Colors[colorScheme]?.grayScale4 }]} />
                    <View style={[styles.flex, styles.ml15]}>
                        <View style={styles.rowSpaceBetween}>
                            <HText type="S14">
                                {jodDetails?.position}
                            </HText>
                            <HText type="M12">
                                {jodDetails?.salary ? `$${jodDetails?.salary}/y` : ''}
                            </HText>
                        </View>
                        <View style={styles.rowSpaceBetween}>
                            <HText type="R12" style={{ opacity: 0.5 }}>
                                {jodDetails?.company_name || ''}
                            </HText>
                            <HText type="R12" color={Colors[colorScheme]?.grayScale7}>
                                {getLocationLabel(jodDetails?.location) || ''}
                            </HText>
                        </View>
                    </View>
                </View>


            </View>

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