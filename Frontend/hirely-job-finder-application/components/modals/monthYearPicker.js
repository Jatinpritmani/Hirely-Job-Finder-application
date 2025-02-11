import { FlatList, Modal, StyleSheet, Text, useColorScheme, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

// local imports
import { styles } from '../../themes'
import { Colors } from '@/constants/Colors'
import HText from '../common/HText'
import HButton from '../common/HButton'
import { moderateScale, months, years } from '../../constants/constants'


const MonthYearPicker = ({ modalVisible, setModalVisible, setDate, minMonthYear }) => {
    const colorsScheme = useColorScheme()
    const closeModal = () => { setModalVisible(false) }

    const [currentMonth, setCurrentMonth] = useState('')
    const [currentYear, setCurrentYear] = useState('')

    const [isMonthListReady, setIsMonthListReady] = useState(false);
    const [isYearListReady, setIsYearListReady] = useState(false);

    const monthListRef = useRef(null)
    const yearListRef = useRef(null)

    const onMonthViewableItemsChanged = ({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentMonth(viewableItems[0].item);
        }
    };
    const onYearViewableItemsChanged = ({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentYear(viewableItems[0].item);
        }
    };

    const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };


    const renderItem = ({ item, index }) => {
        return (
            <View style={localStyles.monthStyle}>

                <HText type="M14" align="center">
                    {item}
                </HText>
            </View>

        )
    }

    const onPressCancel = () => { closeModal() }
    const onPressSet = () => { setDate(currentMonth + ', ' + currentYear), closeModal() }

    useEffect(() => {
        console.log(isMonthListReady)
        if (minMonthYear && isMonthListReady && isYearListReady) {
            console.log(minMonthYear);
            const [month, year] = minMonthYear.split(", ").map((item, index) => index === 1 ? Number(item) : item);
            console.log(month, year);
            // Find the index of month and year in the arrays
            const monthIndex = months.indexOf(month);
            const yearIndex = years.indexOf(year);
            console.log(monthIndex, yearIndex, monthListRef);

            if (monthIndex !== -1 && monthListRef.current) {
                monthListRef.current.scrollToIndex({ index: monthIndex, animated: true });
            }

            if (yearIndex !== -1 && yearListRef.current) {
                yearListRef.current.scrollToIndex({ index: yearIndex, animated: true });
            }
        }

    }, [minMonthYear, isMonthListReady, isYearListReady])


    return (
        <Modal transparent visible={modalVisible} onRequestClose={closeModal} style={[localStyles.main, { backgroundColor: Colors[colorsScheme]?.transparent }]}>
            <View style={[localStyles.container, { backgroundColor: Colors[colorsScheme]?.transparent }]}>
                <View style={[localStyles.calendarView, { backgroundColor: Colors[colorsScheme]?.white }]}>

                    <View style={[styles.flexRow, { gap: moderateScale(30) }]}>

                        <FlatList
                            ref={monthListRef}
                            showsVerticalScrollIndicator={false}
                            data={months}
                            renderItem={renderItem}
                            style={{ height: moderateScale(50), }}
                            pagingEnabled
                            onViewableItemsChanged={onMonthViewableItemsChanged}
                            viewabilityConfig={viewabilityConfig}
                            onLayout={() => setIsMonthListReady(true)} // Ensures FlatList is ready

                        />
                        <FlatList
                            ref={yearListRef}
                            showsVerticalScrollIndicator={false}
                            data={years}
                            renderItem={renderItem}
                            style={{ height: moderateScale(50), }}
                            pagingEnabled
                            onViewableItemsChanged={onYearViewableItemsChanged}
                            viewabilityConfig={viewabilityConfig}
                            onLayout={() => setIsYearListReady(true)} // Ensures FlatList is ready

                        />

                    </View>

                    <View style={localStyles.btnContainer}>
                        <HButton
                            onPress={onPressCancel}
                            textType={"S16"}

                            title={"Cancel"}
                            containerStyle={[localStyles.btnStyle]}
                            bgColor={Colors[colorsScheme]?.grayScale4}
                        ></HButton>
                        <HButton
                            onPress={onPressSet}
                            textType={"S16"}

                            title={"Set"}
                            containerStyle={[localStyles.btnStyle]}
                        ></HButton>
                    </View>
                </View>
            </View>
        </Modal >
    )
}

export default MonthYearPicker

const localStyles = StyleSheet.create({
    main: {
        ...styles.flex,
    },
    container: {
        ...styles.flex,
        ...styles.center
    },
    calendarView: {
        borderRadius: moderateScale(10),
        ...styles.mh30,
        ...styles.p30,
        width: '80%',
        // ...styles.flexRow,
        ...styles.center,
        ...styles.selfCenter,
    },
    monthStyle: {
        borderTopWidth: moderateScale(1),
        borderBottomWidth: moderateScale(1),
        ...styles.center,
        height: moderateScale(50)
    },
    btnContainer: {
        ...styles.flexRow,
        ...styles.mt15,
        gap: moderateScale(20)
    },
    btnStyle: {
        ...styles.flex,
        height: moderateScale(50)
    }
})