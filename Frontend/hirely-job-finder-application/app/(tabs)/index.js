// library imports
import { BackHandler, FlatList, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { router, useFocusEffect } from 'expo-router';
import { Colors } from '@/constants/Colors'

// local imports
import HSafeAreaView from '../../components/common/HSafeAreaView'
import { styles } from '../../themes'
import HHeader from '../../components/common/HHeader'
import { CrossIcon, Filter, LogoutIcon, NotificationIcon, Search } from '../../assets/svgs'
import { isUserRecruiter, moderateScale } from '../../constants/constants'
import { doLogout, getRecruiterDetail } from '../../context/actions/userActions';
import HText from '../../components/common/HText';
import { getAllJobList, getAllJobListSearch } from '../../context/actions/jobAction';
import JobCard from '../../components/screenComponents/JobCard';
import FeaturedJob from '../../components/screenComponents/FeaturedJob';
import HLoader from '../../components/common/HLoader';
import typography from '../../themes/typography';
import { useDebounce } from '../../components/useDebounce';
import FilterSheet from '../../components/modals/filterSheet';
import apiRequest from '../../components/api';
import { LOGOUT } from '../../components/apiConstants';
import Toast from 'react-native-toast-message';
import { shuffleArray } from '../../utils/validator';

/**
 * This component renders the home screen with job listings.
 * It fetches job data based on the user type (recruiter or job seeker).
 * It also supports search and filter functionality.
 */
const Home = () => {
    const colorsScheme = useColorScheme()
    const dispatch = useDispatch()
    const currentUserDetail = useSelector(state => state.userReducer.currentUserDetail)
    const allJobList = useSelector(state => state.jobReducer.allJobList)
    const searchedJobs = useSelector(state => state.jobReducer.searchedJobs)
    const recruiterDetails = useSelector(state => state.userReducer.recruiterDetails)
    const [recruiterDetailsData, setRecruiterDetailsData] = useState(null)
    const allJobloading = useSelector(state => state.jobReducer.loading)
    const loadingRecruiterDetai = useSelector(state => state.userReducer.loadingRecruiterDetai)

    const [searchQuery, setSearchQuery] = useState('')
    const [isSearch, setIsSearch] = useState(false)
    const debouncedSearchTerm = useDebounce(searchQuery, 300);
    const [refreshing, setRefreshing] = useState(false);

    const [filter, setFilter] = useState({
        filter_by_location: [],
        filter_by_salary: "",
        filter_by_job_type: []
    })

    const filtersheetRef = useRef(null)

    /**
     * Effect to prevent back navigation.
     */
    useEffect(() => {
        const onBackPress = () => true; // Prevent back navigation
        BackHandler.addEventListener("hardwareBackPress", onBackPress);
        return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, []);

    /**
     * Effect to fetch job data based on search query and filters.
     */
    useEffect(() => {
        if (debouncedSearchTerm) {
            if (isUserRecruiter(currentUserDetail?.user_type)) {
                let data = {
                    "user_id": currentUserDetail?.user_id,
                    search: searchQuery,
                    filter_by_location: filter?.filter_by_location,
                    filter_by_salary: filter?.filter_by_salary,
                    filter_by_job_type: filter?.filter_by_job_type
                }
                dispatch(getAllJobListSearch(data))
            } else {
                let data = {
                    "user_id": currentUserDetail?.user_id,
                    search: searchQuery,
                    filter_by_location: filter?.filter_by_location,
                    filter_by_salary: filter?.filter_by_salary,
                    filter_by_job_type: filter?.filter_by_job_type
                }
                dispatch(getAllJobListSearch(data))
            }
        }
    }, [debouncedSearchTerm, filter]);

    /**
     * Effect to update search state based on filters.
     */
    useEffect(() => {
        if (filter?.filter_by_job_type?.length == 0 && filter?.filter_by_location?.length == 0 && filter?.filter_by_salary == "") {
            setIsSearch(false)
        } else {
            setIsSearch(true)
        }
        if (isUserRecruiter(currentUserDetail?.user_type)) {
            let data = {
                "user_id": currentUserDetail?.user_id,
                search: searchQuery,
                filter_by_location: filter?.filter_by_location,
                filter_by_salary: filter?.filter_by_salary,
                filter_by_job_type: filter?.filter_by_job_type
            }
            dispatch(getAllJobListSearch(data))
        } else {
            let data = {
                "user_id": currentUserDetail?.user_id,
                search: searchQuery,
                filter_by_location: filter?.filter_by_location,
                filter_by_salary: filter?.filter_by_salary,
                filter_by_job_type: filter?.filter_by_job_type
            }
            dispatch(getAllJobListSearch(data))
        }
    }, [filter])

    /**
     * Effect to update recruiter details data when recruiterDetails changes.
     */
    useEffect(() => {
        if (recruiterDetails) {
            setRecruiterDetailsData(recruiterDetails)
        }
    }, [recruiterDetails])

    /**
     * Focus effect to fetch all jobs when the screen is focused.
     */
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

    /**
     * Navigates to the notification screen.
     */
    const onPressNotificationIcon = () => {
        router.push('/notification')
    }

    /**
     * Renders the left icon in the header.
     */
    const LeftIcon = () => {
        return (
            <TouchableOpacity onPress={onPressNotificationIcon}>
                <NotificationIcon width={moderateScale(32)} height={moderateScale(32)} />
            </TouchableOpacity>
        )
    }

    /**
     * Logs out the user.
     */
    const onPressLogout = async () => {
        try {
            let payload = {
                "user_id": currentUserDetail?.user_id
            }
            let response = await apiRequest("POST", LOGOUT, payload);
            if (response?.code == 'HJFA_MS_OK_200' && !response?.error_status) {
                Toast.show({
                    type: "success",
                    text1: "Logged out successfully. See you soon!",
                });
                dispatch(doLogout())
                router.replace('login')
            }
        } catch (error) {
            console.error("Error logging out:", error);
        }
    }

    /**
     * Opens the filter sheet.
     */
    const onPressFilter = () => {
        filtersheetRef?.current?.show()
    }

    /**
     * Updates the search query state.
     * @param {string} text - The search query.
     */
    const onChangeSearchQuery = (text) => {
        if (text?.length > 0) {
            setIsSearch(true)
        } else {
            setIsSearch(false)
        }
        setSearchQuery(text)
    }

    /**
     * Renders the right icon in the header.
     */
    const RightIcon = () => {
        return (
            <TouchableOpacity onPress={onPressLogout}>
                <LogoutIcon width={moderateScale(24)} height={moderateScale(24)} />
            </TouchableOpacity>
        )
    }

    /**
     * Renders a recommended job item.
     * @param {Object} param0 - The job item and index.
     */
    const renderRecomendedJobItem = ({ item, index }) => {
        return (
            <JobCard item={item} index={index} />
        )
    }

    /**
     * Renders a featured job item.
     * @param {Object} param0 - The job item and index.
     */
    const renderFeaturedJobItem = ({ item, index }) => {
        return (
            <FeaturedJob item={item} index={index} />
        )
    }

    /**
     * Navigates to the all jobs list screen.
     */
    const onPressSeeAllJobs = () => {
        router.push('allJobList')
    }

    /**
     * Navigates to the all featured jobs screen.
     */
    const onPressSeeAllFeaturedJobs = () => {
        router.push('allFeaturedJobs')
    }

    /**
     * Clears the search query and filters.
     */
    const onPressClearSearch = () => {
        setIsSearch(false)
        setSearchQuery('')
        setFilter({
            filter_by_location: [],
            filter_by_salary: "",
            filter_by_job_type: []
        })
    }

    /**
     * Handles the pull-to-refresh functionality.
     */
    const onRefresh = () => {
        setRefreshing(true)
        if (isUserRecruiter(currentUserDetail?.user_type)) {
            let data = {
                "user_id": currentUserDetail?.user_id,
                search: searchQuery,
                filter_by_location: filter?.filter_by_location,
                filter_by_salary: filter?.filter_by_salary,
                filter_by_job_type: filter?.filter_by_job_type
            }
            dispatch(getAllJobListSearch(data))
        } else {
            let data = {
                "user_id": currentUserDetail?.user_id,
                search: searchQuery,
                filter_by_location: filter?.filter_by_location,
                filter_by_salary: filter?.filter_by_salary,
                filter_by_job_type: filter?.filter_by_job_type
            }
            dispatch(getAllJobListSearch(data))
        }
        setRefreshing(false)
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
            <ScrollView contentContainerStyle={[styles.flexGrow1, styles.pv15]}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                } showsVerticalScrollIndicator={false}>
                <View style={[styles.mt30, styles.flexRow]}>
                    <View style={[localStyles.searchBar, styles.itemsCenter, { backgroundColor: Colors[colorsScheme]?.grayScale8 }]}>
                        <Search />
                        <TextInput
                            value={searchQuery}
                            onChangeText={onChangeSearchQuery}
                            placeholder='Seach Here'
                            style={localStyles.searchInputstyle}
                            placeholderTextColor={Colors[colorsScheme]?.subText}
                        />
                        {searchQuery?.length > 0 && <TouchableOpacity onPress={onPressClearSearch} style={styles.itemsEnd}>
                            <CrossIcon />
                        </TouchableOpacity>}
                    </View>
                    <TouchableOpacity onPress={onPressFilter} style={[localStyles.searchBar, styles.ml10, styles.center, { width: '15%', backgroundColor: Colors[colorsScheme]?.grayScale8 }]}>
                        <Filter />
                    </TouchableOpacity>
                </View>
                {isSearch ?
                    <>
                        <HText type="S14" style={[styles.mt20, { marginBottom: -moderateScale(10) }]}>
                            {`${searchedJobs?.length || '0'} Jobs Found`}
                        </HText>
                        <FlatList
                            data={searchedJobs}
                            renderItem={renderRecomendedJobItem}
                            style={[styles.mt25]}
                            scrollEnabled={false}
                            showsHorizontalScrollIndicator={false}
                            nestedScrollEnabled={true}
                        />
                    </>
                    :
                    <>
                        <TitleComponent title={isUserRecruiter(currentUserDetail?.user_type) ? 'your job posting' : 'New Posting'} onPressSeeAll={onPressSeeAllJobs} style={styles.mt30} />
                        <FlatList
                            data={isUserRecruiter(currentUserDetail?.user_type) ? (recruiterDetailsData && recruiterDetailsData?.jobDetails?.slice(-2).reverse()) : (allJobList && allJobList)}
                            renderItem={renderRecomendedJobItem}
                            style={[styles.mt25]}
                            scrollEnabled={false}
                            showsHorizontalScrollIndicator={false}
                            nestedScrollEnabled={true}
                        />
                        <TitleComponent title={isUserRecruiter(currentUserDetail?.user_type) ? 'Recent People Applied' : 'Featured Jobs'} onPressSeeAll={onPressSeeAllFeaturedJobs} />
                        <FlatList
                            data={isUserRecruiter(currentUserDetail?.user_type) ? recruiterDetailsData?.appliedJobDetails?.reverse() : allJobList}
                            renderItem={renderFeaturedJobItem}
                            style={[styles.mt25]}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            nestedScrollEnabled={true}
                        />
                    </>
                }
            </ScrollView>
            <FilterSheet SheetRef={filtersheetRef} setFilter={setFilter} filter={filter} setIsSearch={setIsSearch} />
        </HSafeAreaView>
    )
}

/**
 * This component renders the title and "See all" button.
 * @param {Object} param0 - The title, onPressSeeAll function, and style.
 */
const TitleComponent = ({ title, onPressSeeAll, style }) => {
    const colorScheme = useColorScheme()
    return (
        <View style={[styles.rowSpaceBetween, style]}>
            <HText type="S16" style={styles.mt10}>
                {title}
            </HText>
            {title != 'Featured Jobs' && <TouchableOpacity onPress={onPressSeeAll}>
                <HText type="R14" style={styles.mt10} color={Colors[colorScheme]?.primary}>
                    {'See all >'}
                </HText>
            </TouchableOpacity>}
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
        ...styles.ph25,
        ...styles.flexRow,
        width: '80%',
        height: moderateScale(48)
    },
    searchInputstyle: {
        ...styles.ml10,
        ...typography.fontSizes.f14,
        ...typography.fontWeights.Regular,
        width: '85%'
    }
})