import { StyleSheet, useColorScheme, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Dropdown } from 'react-native-element-dropdown';

// local imports
import HSafeAreaView from '../../components/common/HSafeAreaView'
import HHeader from '../../components/common/HHeader'
import HInput from '../../components/common/HInput'
import { styles } from '../../themes'
import { isNumeric, jobTypes, locations, moderateScale } from '../../constants/constants'
import { DownArrow } from '../../assets/svgs';
import HText from '../../components/common/HText';
import typography from '../../themes/typography';
import { Colors } from '@/constants/Colors';
import HButton from '../../components/common/HButton';
import { isTruthyString } from '../../utils/validator';
import { router } from 'expo-router';
import { useSelector } from 'react-redux';
import HKeyBoardAvoidWrapper from '../../components/common/HKeyBoardAvoidWrapper';

/**
 * This component allows recruiters to create a new job post.
 * It includes form fields for position, salary, job type, location, and number of job openings.
 * It validates the input fields and navigates to the next screen upon successful validation.
 */
const createJob = () => {
    const [position, setPosition] = useState('')
    const [positionErrorMessage, setPositionErrorMessage] = useState("");
    const [salary, setSalary] = useState('')
    const [salaryErrorMessage, setSalaryErrorMessage] = useState("");
    const colorScheme = useColorScheme();

    const [SelectedJobType, setSelectedJobType] = useState(null);
    const [SelectedJobTypeErrorMessage, setSelectedJobTypeErrorMessage] = useState("");
    const [numOfJobOpening, setnumOfJobOpening] = useState(null);
    const [numOfJobOpeningErrorMessage, setNumOfJobOpeningErrorMessage] = useState("");
    const [SelectedLoaction, setSelectedLoaction] = useState(null);
    const [SelectedLocationErrorMessage, setSelectedLocationErrorMessage] = useState("");
    const [isNextDisabled, setIsNextDisabled] = useState(true);

    const currentUserDetail = useSelector(state => state.userReducer.currentUserDetail)

    /**
     * Effect to validate input fields and enable/disable the Next button.
     */
    useEffect(() => {
        if (SelectedJobType?.length > 0) {
            setSelectedJobTypeErrorMessage('')
        }
        if (SelectedLoaction?.length > 0) {
            setSelectedLocationErrorMessage('')
        }
        if (position?.length > 0 && salary?.length > 0 && SelectedJobType?.length > 0 && isNumeric(salary) && SelectedLoaction?.length > 0 && numOfJobOpening?.length > 0 && isNumeric(numOfJobOpening)) {
            setIsNextDisabled(false);
        } else {
            setIsNextDisabled(true);
        }
    }, [position, salary, SelectedJobType, SelectedLoaction, numOfJobOpening]);

    /**
     * Updates the position state and validates the input.
     * @param {string} text - The position input.
     */
    const onChangePosition = (text) => {
        setPosition(text);
        if (!text.length > 0) {
            setPositionErrorMessage("*Please Enter a Position.");
        } else {
            setPositionErrorMessage("");
        }
    };

    /**
     * Updates the salary state and validates the input.
     * @param {string} text - The salary input.
     */
    const onChangeSalary = (text) => {
        setSalary(text);
        if (!text.length > 0) {
            setSalaryErrorMessage("*Please Enter a Salary.");
        } else if (!isNumeric(text)) {
            setSalaryErrorMessage("*Please Enter a Valid Salary");
        }
        else {
            setSalaryErrorMessage("");
        }
    };

    /**
     * Updates the number of job openings state and validates the input.
     * @param {string} text - The number of job openings input.
     */
    const onChangeNumOfJobOpening = (text) => {
        setnumOfJobOpening(text);
        if (!text.length > 0) {
            setNumOfJobOpeningErrorMessage("*Please Enter a Number Of Job Openings.");
        } else if (!isNumeric(text)) {
            setNumOfJobOpeningErrorMessage("*Please Enter a Valid Number Of Job Openings.");
        }
        else {
            setNumOfJobOpeningErrorMessage("");
        }
    };

    /**
     * Handles the Next button press event.
     * Validates the input fields and navigates to the next screen if all fields are valid.
     */
    const onPressNext = () => {
        if (!isTruthyString(position)) {
            setPositionErrorMessage("*Please Enter a Position");

        }
        if (!isTruthyString(SelectedLoaction)) {
            setSelectedLocationErrorMessage("*Please Select a Location.");

        }
        if (!isTruthyString(salary)) {
            setSalaryErrorMessage("*Please Enter a Salary");

        }

        if (!isNumeric(salary)) {
            setSalaryErrorMessage("Please Enter a valid Salary.");
        }
        if (!isTruthyString(SelectedJobType)) {
            setSelectedJobTypeErrorMessage("*Please Select a Job Type.");

        }


        if (!isTruthyString(numOfJobOpening)) {
            setNumOfJobOpeningErrorMessage("*Please Enter a Number Of Job Openings.");

        }
        if (!isNumeric(numOfJobOpening)) {
            setNumOfJobOpeningErrorMessage("Please Enter a valid Number Of Job Openings.");
        }

        if (position?.length > 0 && salary?.length > 0 && SelectedJobType?.length > 0 && isNumeric(salary) && SelectedLoaction?.length > 0 && numOfJobOpening?.length > 0 && isNumeric(numOfJobOpening)) {

            let new_post = {
                recruiter_id: currentUserDetail?.user_id,
                position: position,
                location: SelectedLoaction,
                salary: salary,
                job_type: SelectedJobType,
                number_of_opening: numOfJobOpening
            }
            router.push({
                pathname: '/createPost',
                params: {
                    new_post: JSON.stringify(new_post)
                }
            })

            setIsNextDisabled(false);
        } else {
            setIsNextDisabled(true);
        }
    }
    return (
        <HSafeAreaView>

            <HHeader title="Create Post" />
            <HKeyBoardAvoidWrapper containerStyle={[localStyles.inputContainer, styles.flexGrow1]} >

                <View style={styles.mt40}>

                    <HInput
                        _value={position}
                        label="Position"
                        placeHolder="Position"
                        toGetTextFieldValue={onChangePosition}
                        _errorText={positionErrorMessage}
                        required={true}
                    />
                    <View style={localStyles.dropdownContainerStyle}>
                        <HText type={'S14'} style={localStyles.dropdownLabel}>
                            {'Location'}
                        </HText>
                        <Dropdown
                            style={[localStyles.dropdown, { borderColor: SelectedLocationErrorMessage ? Colors[colorScheme]?.danger : Colors[colorScheme]?.grayScale2 }]}
                            placeholderStyle={[localStyles.placeholderStyle, { color: Colors[colorScheme]?.grayScale2 }]}
                            itemTextStyle={[localStyles.itemTextStyle, { color: Colors[colorScheme]?.text }]}
                            selectedTextStyle={[localStyles.selectedTextStyle, { color: Colors[colorScheme]?.text }]}
                            data={locations}
                            labelField="label"
                            valueField="value"
                            placeholder={'Select Location'}
                            value={SelectedLoaction}
                            onChange={item => {
                                setSelectedLoaction(item.value);
                            }}
                            renderRightIcon={() => (
                                <DownArrow
                                    width={moderateScale(12)}
                                    height={moderateScale(15)}
                                />
                            )}
                        />
                        {SelectedLocationErrorMessage && <HText type={'R12'} style={[styles.mt5, styles.ml5]} color={Colors[colorScheme]?.danger}>
                            {SelectedLocationErrorMessage}
                        </HText>}
                    </View>
                    <HInput
                        _value={salary}
                        label="Salary"
                        placeHolder="Salary"
                        toGetTextFieldValue={onChangeSalary}
                        _errorText={salaryErrorMessage}
                        required={true}
                        keyboardType="numeric"
                    />

                    <View style={localStyles.dropdownContainerStyle}>
                        <HText type={'S14'} style={localStyles.dropdownLabel}>
                            {'Job type'}
                        </HText>
                        <Dropdown
                            style={[localStyles.dropdown, { borderColor: SelectedJobTypeErrorMessage ? Colors[colorScheme]?.danger : Colors[colorScheme]?.grayScale2 }]}
                            placeholderStyle={[localStyles.placeholderStyle, { color: Colors[colorScheme]?.grayScale2 }]}
                            itemTextStyle={[localStyles.itemTextStyle, { color: Colors[colorScheme]?.text }]}
                            selectedTextStyle={[localStyles.selectedTextStyle, { color: Colors[colorScheme]?.text }]}
                            data={jobTypes}
                            labelField="label"
                            valueField="value"
                            placeholder={'Select job type'}
                            value={SelectedJobType}
                            onChange={item => {
                                setSelectedJobType(item.value);
                            }}
                            renderRightIcon={() => (
                                <DownArrow
                                    width={moderateScale(12)}
                                    height={moderateScale(15)}
                                />
                            )}
                        />
                        {SelectedJobTypeErrorMessage && <HText type={'R12'} style={[styles.mt5, styles.ml5]} color={Colors[colorScheme]?.danger}>
                            {SelectedJobTypeErrorMessage}
                        </HText>}
                    </View>
                    <HInput
                        _value={numOfJobOpening}
                        label="Number Of Job Openinng"
                        placeHolder="Number Of Job Opening"
                        toGetTextFieldValue={onChangeNumOfJobOpening}
                        _errorText={numOfJobOpeningErrorMessage}
                        required={true}
                        keyboardType="numeric"
                    />

                    <HButton
                        // disabled={isNextDisabled}
                        onPress={onPressNext}
                        textType={"S16"}
                        color={
                            isNextDisabled
                                ? Colors[colorScheme]?.grayScale6
                                : Colors[colorScheme]?.white
                        }
                        title={"Next"}
                        containerStyle={[localStyles.btnStyle]}
                        bgColor={
                            isNextDisabled
                                ? Colors[colorScheme]?.grayScale5
                                : Colors[colorScheme]?.primary
                        }
                    ></HButton>
                </View>
            </HKeyBoardAvoidWrapper>

        </HSafeAreaView>
    )
}

export default createJob

const localStyles = StyleSheet.create({
    dropdownContainerStyle: {
        ...styles.mt15
    },
    dropdownLabel: {
        marginBottom: moderateScale(8)
    },
    dropdown: {
        ...styles.pv15,
        ...styles.ph25,
        borderWidth: moderateScale(1),
        borderRadius: moderateScale(12),
    },
    placeholderStyle: {
        ...typography.fontSizes.f14,
        ...typography.fontWeights.Regular,
    },
    itemTextStyle: {
        ...typography.fontSizes.f14,
        ...typography.fontWeights.Regular,
    },
    selectedTextStyle: {
        ...typography.fontSizes.f14,
        ...typography.fontWeights.Regular,
    },
    btnStyle: {
        ...styles.mt30,
        ...styles.mb30,
    }
})