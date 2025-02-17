// library imports
import { FlatList, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { router, useFocusEffect } from 'expo-router';
import { Colors } from '@/constants/Colors'


// local imports
import HSafeAreaView from '../../components/common/HSafeAreaView'
import { styles } from '../../themes'
import HHeader from '../../components/common/HHeader'
import { LogoutIcon, NotificationIcon } from '../../assets/svgs'
import { isUserRecruiter, moderateScale } from '../../constants/constants'
import { doLogout } from '../../context/actions/userActions';
import HInput from '../../components/common/HInput';
import HText from '../../components/common/HText';
import { getAllJobList } from '../../context/actions/jobAction';
import JobCard from '../../components/screenComponents/JobCard';

const Home = () => {
    const colorsScheme = useColorScheme()
    const dispatch = useDispatch()
    const currentUserDetail = useSelector(state => state.userReducer.currentUserDetail)
    const allJobList = useSelector(state => state.jobReducer.allJobList)
    const loading = useSelector(state => state.jobReducer.loading)


    useFocusEffect(
        useCallback(() => {
            dispatch(getAllJobList(currentUserDetail?.user_id))
            return () => { }
        }, [])
    );

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
    const renderRecomendedJobItem = ({ item, index }) => {
        return (
            <JobCard item={item} index={index} />
        )
    }
    return (
        <HSafeAreaView style={localStyles.main} containerStyle={styles.flex0}>
            <HHeader
                isHideBack
                title="Hirely"
                isLeftIcon={<LeftIcon />}
                rightIcon={<RightIcon />}
                titleColor={Colors[colorsScheme]?.primary}
                titleType='B24'
            />
            {/* <HInput
                _value={jobDescription}
                label="Job Description"
                placeHolder="Job Description"
                toGetTextFieldValue={onChangeJobDescription}
                _errorText={jobDescriptionErrorMessage}
                required={true}
                multiline
                inputBoxStyle={[styles.pv15, styles.ml15]}
            />      */}

            <TitleComponent title={isUserRecruiter(currentUserDetail?.user_type) ? 'your job posting' : 'Recommended Jobs'} onPressSeeAll={() => { }} style={styles.mt30} />
            <FlatList
                data={allJobList.slice(0, 2)}
                renderItem={renderRecomendedJobItem}
                style={[styles.mt25]}
            />
            <TitleComponent title={isUserRecruiter(currentUserDetail?.user_type) ? 'Recent People Applied' : 'Featured Jobs'} onPressSeeAll={() => { }} />

        </HSafeAreaView>
    )
}

const TitleComponent = ({ title, onPressSeeAll, style }) => {
    const colorScheme = useColorScheme()

    return (
        <View style={[styles.rowSpaceBetween, style]}>
            <HText type="S16" style={styles.mt10}>
                {title}

            </HText>
            <TouchableOpacity onPress={onPressSeeAll}>
                <HText type="R14" style={styles.mt10} color={Colors[colorScheme]?.subText}>
                    {'See all'}

                </HText>
            </TouchableOpacity>
        </View>
    )
}

export default Home

const localStyles = StyleSheet.create({
    main: {
        ...styles.flex
    }
})