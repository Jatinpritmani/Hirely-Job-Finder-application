import { FlatList, Modal, StyleSheet, View, Alert, useColorScheme } from 'react-native'
import React, { useRef, useState } from 'react'

// local imports
import { styles } from '../../themes'
import { Colors } from '@/constants/Colors'
import HText from '../common/HText'
import HButton from '../common/HButton'
import { moderateScale, months, years } from '../../constants/constants'

/**
 * Helper function that converts month/year into a comparable number.
 * For example, "Feb, 2023" becomes 2023 * 12 + indexOf("Feb") which lets you compare dates.
 */
const getComparableValue = (month, year) => {
    return Number(year) * 12 + months.indexOf(month);
};

const MonthYearPicker = ({ modalVisible, setModalVisible, setDate, minMonthYear, keyss }) => {
    const colorsScheme = useColorScheme();
    const closeModal = () => { setModalVisible(false); };

    const [currentMonth, setCurrentMonth] = useState('');
    const [currentYear, setCurrentYear] = useState('');


    const monthListRef = useRef(null);
    const yearListRef = useRef(null);

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

    const renderItem = ({ item }) => {
        return (
            <View style={localStyles.monthStyle}>
                <HText type="M14" align="center">
                    {item}
                </HText>
            </View>
        );
    };

    const onPressCancel = () => { closeModal(); };

    const onPressSet = () => {
        // If a minMonthYear (start date) is provided, do the validation.
        if (minMonthYear) {
            const [minMonth, minYear] = minMonthYear.split(", ").map((item, index) =>
                index === 1 ? item : item
            );

            const selectedValue = getComparableValue(currentMonth, currentYear);
            const minValue = getComparableValue(minMonth, minYear);

            if (selectedValue < minValue) {
                // Show an alert and do not set the date.
                Alert.alert("Invalid Date", "End date cannot be before the start date.");
                return;
            }
        }
        setDate(currentMonth + ', ' + currentYear);
        closeModal();
    };



    return (
        <Modal
            transparent
            visible={modalVisible}
            onRequestClose={closeModal}
            style={[localStyles.main, { backgroundColor: Colors[colorsScheme]?.transparent }]}
        >
            <View style={[localStyles.container, { backgroundColor: Colors[colorsScheme]?.transparent }]}>
                <View style={[localStyles.calendarView, { backgroundColor: Colors[colorsScheme]?.white }]}>
                    <View style={[styles.flexRow, { gap: moderateScale(30) }]}>
                        <FlatList
                            ref={monthListRef}
                            showsVerticalScrollIndicator={false}
                            data={months}
                            renderItem={renderItem}
                            style={{ height: moderateScale(50) }}
                            pagingEnabled
                            onViewableItemsChanged={onMonthViewableItemsChanged}
                            viewabilityConfig={viewabilityConfig}
                        />
                        <FlatList
                            ref={yearListRef}
                            showsVerticalScrollIndicator={false}
                            data={years}
                            renderItem={renderItem}
                            style={{ height: moderateScale(50) }}
                            pagingEnabled
                            onViewableItemsChanged={onYearViewableItemsChanged}
                            viewabilityConfig={viewabilityConfig}
                        />
                    </View>

                    <View style={localStyles.btnContainer}>
                        <HButton
                            onPress={onPressCancel}
                            textType={"S16"}
                            title={"Cancel"}
                            containerStyle={[localStyles.btnStyle]}
                            bgColor={Colors[colorsScheme]?.grayScale4}
                        />
                        <HButton
                            onPress={onPressSet}
                            textType={"S16"}
                            title={"Set"}
                            containerStyle={[localStyles.btnStyle]}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default MonthYearPicker;

const localStyles = StyleSheet.create({
    main: {
        ...styles.flex,
    },
    container: {
        ...styles.flex,
        ...styles.center,
    },
    calendarView: {
        borderRadius: moderateScale(10),
        ...styles.mh30,
        ...styles.p30,
        width: '80%',
        ...styles.center,
        ...styles.selfCenter,
    },
    monthStyle: {
        borderTopWidth: moderateScale(1),
        borderBottomWidth: moderateScale(1),
        ...styles.center,
        height: moderateScale(50),
    },
    btnContainer: {
        ...styles.flexRow,
        ...styles.mt15,
        gap: moderateScale(20),
    },
    btnStyle: {
        ...styles.flex,
        height: moderateScale(50),
    },
});
