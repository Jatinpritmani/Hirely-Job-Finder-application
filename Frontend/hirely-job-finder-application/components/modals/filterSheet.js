// Library import
import { StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import React from 'react';
import ActionSheet, { FlatList } from 'react-native-actions-sheet';
import { styles } from '../../themes';
import MultiSlider from "@ptomasroos/react-native-multi-slider";



// Local import
import { Colors } from '@/constants/Colors';
import { CrossIcon } from '../../assets/svgs';
import { jobTypes, locations, moderateScale, screenWidth } from '../../constants/constants';
import HText from '../common/HText';
import HButton from '../common/HButton';


export default function FilterSheet({ SheetRef, filter, setFilter, setIsSearch }) {
    const colorScheme = useColorScheme()
    const [multiSliderValue, setMultiSliderValue] = React.useState([0, 1000000]);


    const onPressApplyFilter = () => {
        setIsSearch(true)
        SheetRef?.current?.hide()
    };
    const onPressRemoveFilter = () => {
        setFilter({
            filter_by_location: [],
            filter_by_salary: "",
            filter_by_job_type: []
        })
        setIsSearch(false)
        SheetRef?.current?.hide()
    };


    const renderJobtype = ({ item, index }) => {
        const onPressJobType = () => {

            setFilter((prevFilter) => {
                const isSelected = prevFilter.filter_by_job_type?.includes(item.value);
                return {
                    ...prevFilter,
                    filter_by_job_type: isSelected
                        ? prevFilter.filter_by_job_type.filter(items => items !== item.value) // Remove if selected
                        : [...prevFilter.filter_by_job_type, item.value] // Add if not selected
                };
            });

        }
        let isSelected = filter.filter_by_job_type.includes(item.value)

        return (
            <TouchableOpacity onPress={onPressJobType} style={[localStyles.jobTypeView, { backgroundColor: isSelected ? Colors[colorScheme]?.yellow2 : Colors[colorScheme]?.grayScale1, }, isSelected && { borderWidth: 1, borderColor: Colors[colorScheme]?.yellow }]}>
                <HText type="M14" color={isSelected ? Colors[colorScheme]?.white : Colors[colorScheme]?.grayScale4}>
                    {item?.label}
                </HText>
            </TouchableOpacity>
        )
    }
    const renderLocation = ({ item, index }) => {
        const onPressLocation = () => {

            setFilter((prevFilter) => {
                const isSelected = prevFilter.filter_by_location?.includes(item.value);
                return {
                    ...prevFilter,
                    filter_by_location: isSelected
                        ? prevFilter.filter_by_location.filter(items => items !== item.value) // Remove if selected
                        : [...prevFilter.filter_by_location, item.value] // Add if not selected
                };
            });

        }
        let isSelected = filter.filter_by_location.includes(item.value)

        return (
            <TouchableOpacity onPress={onPressLocation} style={[localStyles.jobTypeView, { backgroundColor: isSelected ? Colors[colorScheme]?.yellow2 : Colors[colorScheme]?.grayScale1, }, isSelected && { borderWidth: 1, borderColor: Colors[colorScheme]?.yellow }]}>
                <HText type="M14" color={isSelected ? Colors[colorScheme]?.white : Colors[colorScheme]?.grayScale4}>
                    {item?.label}
                </HText>
            </TouchableOpacity>
        )
    }

    return (
        <ActionSheet
            closeOnPressBack={false}
            closeOnTouchBackdrop={false}
            closable={false}
            onTouchBackdrop={() => { }}
            ref={SheetRef}
            containerStyle={[
                localStyles.actionSheetContainer,
                { backgroundColor: Colors[colorScheme]?.white },
            ]}>
            <View style={styles.rowCenter}>

                <HText align={'center'} type="B18" color={Colors[colorScheme]?.headerColor} >
                    Filters
                </HText>
                <TouchableOpacity onPress={() => { SheetRef?.current?.hide() }} style={{ position: 'absolute', right: 0 }}>

                    <CrossIcon />
                </TouchableOpacity>
            </View>

            <View>
                <HText type="M14" color={Colors[colorScheme]?.subText} style={styles.mb15}>
                    Job Types
                </HText>
                <FlatList
                    data={jobTypes}
                    renderItem={renderJobtype}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            </View>
            <View style={styles.mt20}>
                <HText type="M14" color={Colors[colorScheme]?.subText} style={styles.mb15}>
                    Locations
                </HText>
                <FlatList
                    data={locations}
                    renderItem={renderLocation}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            </View>

            <HText type="M14" color={Colors[colorScheme]?.subText} style={[styles.mt20, styles.mb40]}>
                Salary Range
            </HText>
            <View>

                <MultiSlider
                    values={[multiSliderValue[0], multiSliderValue[1]]}
                    isMarkersSeparated={true}
                    min={0}
                    max={300000}
                    sliderLength={screenWidth - moderateScale(40)}
                    enableLabel={true}
                    valuePrefix='$'
                    step={10000}
                    onValuesChangeFinish={(item) => {
                        setMultiSliderValue(item)
                        setFilter((prevFilter) => {
                            return {
                                ...prevFilter,
                                filter_by_salary: item?.join('-')
                            }
                        }
                        )
                    }}
                    customLabel={(item) => {

                        return (
                            <View style={localStyles.labelContainer}>
                                {/* First Marker Label */}
                                <View style={[localStyles.label, { left: item?.oneMarkerLeftPosition }]}>
                                    <HText type="S18" style={styles.labelText}>${item?.oneMarkerValue}</HText>
                                </View>
                                {/* Second Marker Label */}
                                <View style={[localStyles.label, { left: item?.twoMarkerLeftPosition }]}>
                                    <HText type="S18" style={styles.labelText}>${item?.twoMarkerValue}</HText>
                                </View>
                            </View>
                        )
                    }}
                    trackStyle={{ backgroundColor: Colors[colorScheme]?.grayScale1, height: moderateScale(3) }}
                    selectedStyle={{ backgroundColor: Colors[colorScheme]?.grayScale4, height: moderateScale(3) }}
                    markerStyle={{ backgroundColor: Colors[colorScheme]?.grayScale4, height: moderateScale(24), width: moderateScale(24), borderRadius: moderateScale(12) }}
                />

            </View>
            <HButton
                onPress={onPressApplyFilter}
                textType={"S16"}
                title={"Apply Filter"}
                containerStyle={[localStyles.btnStyle]}
            ></HButton>

            <HButton
                onPress={onPressRemoveFilter}
                textType={"S16"}
                color={Colors[colorScheme]?.primary}
                title={"Remove Filter"}
                containerStyle={[localStyles.btnStyle, { borderWidth: moderateScale(1), borderColor: Colors[colorScheme]?.primary }]}
                bgColor={Colors[colorScheme]?.white}
            ></HButton>
        </ActionSheet>
    );
}

const localStyles = StyleSheet.create({
    actionSheetContainer: {
        ...styles.p20,
        height: '80%',
        borderTopLeftRadius: moderateScale(32),
        borderTopRightRadius: moderateScale(32),
    },
    btnStyle: {
        ...styles.mt15,
    },
    jobTypeView: {
        paddingHorizontal: moderateScale(16),
        paddingVertical: moderateScale(8),
        borderRadius: moderateScale(30),
        marginRight: moderateScale(16)
    },
    labelContainer: {
        position: "absolute",
        width: "100%",
        top: -30,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    label: {
        position: "absolute",
    },
});
