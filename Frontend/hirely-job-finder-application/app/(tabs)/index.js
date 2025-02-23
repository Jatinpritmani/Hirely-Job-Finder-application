// library imports
import { BackHandler, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native'
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
    const [recruiterSearchedJobs, setRecruiterSerchedJobs] = useState([])
    const debouncedSearchTerm = useDebounce(searchQuery, 300);

    const [filter, setFilter] = useState({
        filter_by_location: [],
        filter_by_salary: "",
        filter_by_job_type: []
    })

    const filtersheetRef = useRef(null)



    useEffect(() => {
        const onBackPress = () => true; // Prevent back navigation
        BackHandler.addEventListener("hardwareBackPress", onBackPress);
        return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, []);



    useEffect(() => {
        if (debouncedSearchTerm) {
            if (isUserRecruiter(currentUserDetail?.user_type)) {
                const lowerCaseSearchTerm = debouncedSearchTerm.toLowerCase();
                const filteredJobs = recruiterDetails?.jobDetails?.filter(job =>
                    job.position.toLowerCase().includes(lowerCaseSearchTerm) ||
                    job.location.toLowerCase().includes(lowerCaseSearchTerm) ||
                    job.summary?.toLowerCase().includes(lowerCaseSearchTerm) // Optional in case summary is missing
                );
                setRecruiterSerchedJobs(filteredJobs)
            }
            else {

                let data = {
                    "user_id": currentUserDetail?.user_id,
                    search: searchQuery,
                    filter_by_location: filter?.filter_by_location,
                    filter_by_salary: filter?.filter_by_salary,
                    filter_by_job_type: filter?.filter_by_job_type
                }

                dispatch(getAllJobListSearch(data))
            }

            // Trigger an API call or expensive operation
            console.log('Searching for:', debouncedSearchTerm);
        }
    }, [debouncedSearchTerm, filter]);

    useEffect(() => {
        if (filter?.filter_by_job_type?.length == 0 && filter?.filter_by_location?.length == 0 && filter?.filter_by_salary == "") {
            setIsSearch(false)
        }
        else {

            setIsSearch(true)
        }
        if (isUserRecruiter(currentUserDetail?.user_type)) {
            const lowerCaseSearchTerm = debouncedSearchTerm.toLowerCase();
            const filteredJobs = recruiterDetails?.jobDetails?.filter(job =>
                job.position.toLowerCase().includes(lowerCaseSearchTerm) ||
                job.location.toLowerCase().includes(lowerCaseSearchTerm) ||
                job.summary?.toLowerCase().includes(lowerCaseSearchTerm) // Optional in case summary is missing
            );
            setRecruiterSerchedJobs(filteredJobs)
        }
        else {
            let data = {
                "user_id": currentUserDetail?.user_id,
                search: searchQuery,
                filter_by_location: filter?.filter_by_location,
                filter_by_salary: filter?.filter_by_salary,
                filter_by_job_type: filter?.filter_by_job_type
            }

            dispatch(getAllJobListSearch(data))
        }

        // Trigger an API call or expensive operation
        console.log('Searching for:', debouncedSearchTerm);
    }, [filter])


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

    const onPressNotificationIcon = () => {
        router.push('/notification')
    }

    const LeftIcon = () => {
        return (

            <TouchableOpacity onPress={onPressNotificationIcon}>
                <NotificationIcon width={moderateScale(32)} height={moderateScale(32)} />
            </TouchableOpacity>
        )
    }

    const onPressLogout = () => {
        dispatch(doLogout())
        router.replace('start')
    }
    const onPressFilter = () => {
        filtersheetRef?.current?.show()
    }

    const onChangeSearchQuery = (text) => {
        if (text?.length > 0) {
            setIsSearch(true)
        }
        else {
            setIsSearch(false)
        }
        setSearchQuery(text)

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
    const onPressClearSearch = () => {
        setIsSearch(false)
        setSearchQuery('')
        setFilter({
            filter_by_location: [],
            filter_by_salary: "",
            filter_by_job_type: []
        })
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
                        {/* <HText type="R14" style={styles.ml10} color={Colors[colorsScheme]?.subText}>
                            Search here
                        </HText> */}
                    </View>
                    <TouchableOpacity onPress={onPressFilter} style={[localStyles.searchBar, styles.ml10, styles.center, { width: '15%', backgroundColor: Colors[colorsScheme]?.grayScale8 }]}>
                        <Filter />
                    </TouchableOpacity>
                </View>
                {isSearch ?
                    <>
                        <HText type="S14" style={[styles.mt20, { marginBottom: -moderateScale(10) }]}>
                            {`${isUserRecruiter(currentUserDetail?.user_type) ? recruiterSearchedJobs?.length : searchedJobs?.length || '0'} Jobs Found`}

                        </HText>
                        <FlatList
                            data={isUserRecruiter(currentUserDetail?.user_type) ? recruiterSearchedJobs : searchedJobs}
                            renderItem={renderRecomendedJobItem}
                            style={[styles.mt25]}
                            scrollEnabled={false}
                            showsHorizontalScrollIndicator={false}
                            nestedScrollEnabled={true}
                        />
                    </>
                    :
                    <>
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
                    </>
                }

            </ScrollView>

            <FilterSheet SheetRef={filtersheetRef} setFilter={setFilter} filter={filter} setIsSearch={setIsSearch} />

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