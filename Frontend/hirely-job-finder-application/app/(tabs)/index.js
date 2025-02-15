// library imports
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors'


// local imports
import HSafeAreaView from '../../components/common/HSafeAreaView'
import { styles } from '../../themes'
import HHeader from '../../components/common/HHeader'
import { LogoutIcon, NotificationIcon } from '../../assets/svgs'
import { moderateScale } from '../../constants/constants'
import { doLogout } from '../../context/actions/userActions';

const Home = () => {
    const colorsScheme = useColorScheme()
    const dispatch = useDispatch()

    const LeftIcon = () => {
        return (

            <View>
                <NotificationIcon width={moderateScale(32)} height={moderateScale(32)} />
            </View>
        )
    }

    const onPressLogout = () => {
        dispatch(doLogout())
        router.replace('start')
    }
    const RightIcon = () => {
        return (

            <TouchableOpacity onPress={onPressLogout}>
                <LogoutIcon width={moderateScale(24)} height={moderateScale(24)} />
            </TouchableOpacity>
        )
    }
    return (
        <HSafeAreaView style={localStyles.main}>
            <HHeader
                isHideBack
                title="Hirely"
                isLeftIcon={<LeftIcon />}
                rightIcon={<RightIcon />}
                titleColor={Colors[colorsScheme]?.primary}
                titleType='B24'
            />
        </HSafeAreaView>
    )
}

export default Home

const localStyles = StyleSheet.create({
    main: {}
})