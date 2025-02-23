// library imports
import { BackHandler, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { router, useFocusEffect, useSegments } from 'expo-router';
import { Colors } from '@/constants/Colors'


// local imports
import HSafeAreaView from '../../components/common/HSafeAreaView'
import { styles } from '../../themes'
import HHeader from '../../components/common/HHeader'
import { Filter, LogoutIcon, NotificationIcon, Search } from '../../assets/svgs'
import { isUserRecruiter, moderateScale } from '../../constants/constants'
import { doLogout, getRecruiterDetail } from '../../context/actions/userActions';
import HText from '../../components/common/HText';
import { getAllJobList } from '../../context/actions/jobAction';
import JobCard from '../../components/screenComponents/JobCard';
import FeaturedJob from '../../components/screenComponents/FeaturedJob';
import HLoader from '../../components/common/HLoader';

const Home = () => {
    const colorsScheme = useColorScheme()
    const dispatch = useDispatch()
    const currentUserDetail = useSelector(state => state.userReducer.currentUserDetail)
    const allJobList = useSelector(state => state.jobReducer.allJobList)
    const recruiterDetails = useSelector(state => state.userReducer.recruiterDetails)
    const [recruiterDetailsData, setRecruiterDetailsData] = useState(null)
    const allJobloading = useSelector(state => state.jobReducer.loading)
    const loadingRecruiterDetai = useSelector(state => state.userReducer.loadingRecruiterDetai)


    useEffect(() => {
        const onBackPress = () => true; // Prevent back navigation
        BackHandler.addEventListener("hardwareBackPress", onBackPress);
        return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, []);

    useEffect(() => {
        if (recruiterDetails) {
            setRecruiterDetailsData(recruiterDetails)
        }

    }, [recruiterDetails])

    useFocusEffect(
        useCallback(() => {

            if (isUserRecruiter(currentUserDetail?.user_type)) {

                dispatch(getRecruiterDetail(currentUserDetail?.user_id))

            } else {

                dispatch(getAllJobList(currentUserDetail?.user_id))
            }
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
    const renderFeaturedJobItem = ({ item, index }) => {
        return (
            <FeaturedJob item={item} index={index} />
        )
    }

    const onPressSeeAllJobs = () => {
        router.push('allJobList')
    }

    const onPressSeeAllFeaturedJobs = () => {
        router.push('allFeaturedJobs')

    }


    if (allJobloading || loadingRecruiterDetai) {
        return <HLoader />;
    }

    return (
        <HSafeAreaView style={localStyles.main} >
            <HHeader
                isHideBack
                title="Hirely"
                isLeftIcon={<LeftIcon />}
                rightIcon={<RightIcon />}
                titleColor={Colors[colorsScheme]?.primary}
                titleType='B24'
            />
            <ScrollView contentContainerStyle={[styles.flexGrow1, styles.pv15]} showsVerticalScrollIndicator={false}>
                <View style={[styles.mt30, styles.flexRow]}>
                    <View style={[localStyles.searchBar, styles.itemsCenter, { width: '80%', backgroundColor: Colors[colorsScheme]?.grayScale8 }]}>
                        <Search />
                        <HText type="R14" style={styles.ml10} color={Colors[colorsScheme]?.subText}>
                            Search here
                        </HText>
                    </View>
                    <View style={[localStyles.searchBar, styles.ml10, styles.center, { width: '15%', backgroundColor: Colors[colorsScheme]?.grayScale8 }]}>
                        <Filter />
                    </View>
                </View>
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
                <TitleComponent title={isUserRecruiter(currentUserDetail?.user_type) ? 'your job posting' : 'Recommended Jobs'} onPressSeeAll={onPressSeeAllJobs} style={styles.mt30} />
                <FlatList
                    data={isUserRecruiter(currentUserDetail?.user_type) ? (recruiterDetailsData && recruiterDetailsData?.jobDetails?.slice(0, 2)) : (allJobList && allJobList.slice(0, 2))}
                    renderItem={renderRecomendedJobItem}
                    style={[styles.mt25]}
                    scrollEnabled={false}
                    showsHorizontalScrollIndicator={false}
                    nestedScrollEnabled={true}
                />
                <TitleComponent title={isUserRecruiter(currentUserDetail?.user_type) ? 'Recent People Applied' : 'Featured Jobs'} onPressSeeAll={onPressSeeAllFeaturedJobs} />
                <FlatList
                    data={isUserRecruiter(currentUserDetail?.user_type) ? recruiterDetailsData?.appliedJobDetails : allJobList}
                    renderItem={renderFeaturedJobItem}
                    style={[styles.mt25]}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    nestedScrollEnabled={true}
                />
            </ScrollView>
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
    },
    searchBar: {
        borderRadius: moderateScale(12),
        ...styles.pv15,
        ...styles.ph25,
        ...styles.flexRow
    }
})