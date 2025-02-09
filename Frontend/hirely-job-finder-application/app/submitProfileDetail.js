import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import MonthPicker from 'react-native-month-year-picker';


// local imports
import HSafeAreaView from "../components/common/HSafeAreaView";
import { styles } from "../themes";
import AuthHeader from "../components/common/AuthHeader";
import { EyeIconDark, EyeIconLight, TickSquare, TickSquareChecked } from "../assets/svgs";
import HInput from "../components/common/HInput";
import HText from "../components/common/HText";
import HButton from "../components/common/HButton";
import { moderateScale } from "../constants/constants";
import { Colors } from "@/constants/Colors";
import { isValidEmail } from "../utils/validator";
import { router } from "expo-router";

const SubmitPforileDetail = () => {
    const colorScheme = useColorScheme();
    const [about, setAbout] = useState("");
    const [jobRole, setJobRole] = useState("");
    const [isNextDisabled, setIsNextDisabled] = useState(true);
    const [aboutErrorMessage, setAboutErrorMessage] = useState("");
    const [jobRoleErrorMessage, setJobRoleErrorMessage] = useState("");
    const [isShowExperienceFields, setIsShowExperienceFields] = useState(false)
    const [companyName, setCompanyName] = useState('')
    const [companyNameErrorMessage, setCompanyNameErrorMessage] = useState('')
    const [experienceJobRole, setExperienceJobRole] = useState('')
    const [experienceJobRoleErrorMessage, setExperienceJobRoleErrorMessage] = useState("");
    const [companyLocation, setCompanyLocation] = useState('')
    const [companyLocationErrorMessage, setCompanyLocationErrorMessage] = useState("");


    const [startFrom, setStartFrom] = useState(new Date());
    const [show, setShow] = useState(false);
    const showPicker = useCallback((value) => setShow(value), []);


    const onValueChange = useCallback(
        (event, newDate) => {
            const selectedDate = newDate || date;

            showPicker(false);
            setStartFrom(selectedDate);
        },
        [startFrom, showPicker],
    );

    const onChangeabout = (text) => {
        setAbout(text);
        if (!text.length > 0) {
            setAboutErrorMessage("*Please Enter a about yourself");
        } else {
            setAboutErrorMessage("");
        }
    };
    const onChangeJobRole = (text) => {
        setJobRole(text);
        if (!text.length > 0) {
            setJobRoleErrorMessage("*Please Enter a Password");
        } else {
            setJobRoleErrorMessage("");
        }
    };
    const onChangeCompanyName = (text) => {
        setCompanyName(text);
        if (!text.length > 0) {
            setCompanyNameErrorMessage("*Please Enter a Company Name");
        } else {
            setCompanyNameErrorMessage("");
        }
    };
    const onChangeExperienceJobRole = (text) => {
        setExperienceJobRole(text);
        if (!text.length > 0) {
            setExperienceJobRoleErrorMessage("*Please Enter a Job Role At a Company");
        } else {
            setExperienceJobRoleErrorMessage("");
        }
    };
    const onChangeCompanyLocation = (text) => {
        setCompanyLocation(text);
        if (!text.length > 0) {
            setCompanyLocationErrorMessage("*Please Enter a Password");
        } else {
            setCompanyLocationErrorMessage("");
        }
    };





    useEffect(() => {
        if (about?.length > 0 && jobRole?.length > 0) {
            setIsNextDisabled(false);
        } else {
            setIsNextDisabled(true);
        }
    }, [jobRole, about]);



    const onPressNext = () => {
        router.push('submitProfileDetail')
    };
    const onPressAddExperince = () => {
        setIsShowExperienceFields(true)
    };

    const onPressConfirmAddExperience = () => {

    }


    return (
        <HSafeAreaView style={localStyles.main}>
            <AuthHeader
                title="Complete Your Profile"
                description={"Tell us more about yourself and your experience! "}
            />
            <View style={localStyles.innerContainer}>
                <ScrollView showsVerticalScrollIndicator={false} style={localStyles.inputContainer}>
                    <HInput
                        _value={about}
                        label="About"
                        placeHolder="About Yourself"
                        toGetTextFieldValue={onChangeabout}
                        _errorText={aboutErrorMessage}
                        required={true}
                        multiline
                    />
                    <HInput
                        _value={jobRole}
                        label="Job Role"
                        placeHolder="Job Role"
                        toGetTextFieldValue={onChangeJobRole}
                        _errorText={jobRoleErrorMessage}
                        required={true}
                    />
                    {
                        isShowExperienceFields ? (
                            <>
                                <HInput
                                    _value={companyName}
                                    label="Company Name"
                                    placeHolder="Company Name"
                                    toGetTextFieldValue={onChangeCompanyName}
                                    _errorText={companyNameErrorMessage}
                                    required={true}
                                />
                                <HInput
                                    _value={experienceJobRole}
                                    label="Job Role At Company"
                                    placeHolder="Job Role At Company"
                                    toGetTextFieldValue={onChangeExperienceJobRole}
                                    _errorText={experienceJobRoleErrorMessage}
                                    required={true}
                                />
                                <HInput
                                    _value={companyLocation}
                                    label="Company Location"
                                    placeHolder="Comapny Location"
                                    toGetTextFieldValue={onChangeCompanyLocation}
                                    _errorText={companyLocationErrorMessage}
                                    required={true}
                                />
                                <View style={localStyles.experincePeriodStyle}>
                                    <View style={[localStyles.periodboxStyle, { borderColor: Colors[colorScheme]?.borderColor }]}>
                                        <HText type={'M14'}>
                                            Start Date
                                        </HText>
                                    </View>
                                    <View style={[localStyles.periodboxStyle, { borderColor: Colors[colorScheme]?.borderColor }]}>
                                        <HText type={'M14'}>
                                            End Date
                                        </HText>
                                    </View>
                                </View>
                                <HButton
                                    onPress={onPressConfirmAddExperience}
                                    textType={"S16"}
                                    color={Colors[colorScheme]?.white}
                                    title={"Add Experience"}
                                    containerStyle={[localStyles.addExperienceBtnStyle,]}
                                    bgColor={Colors[colorScheme]?.primary}
                                ></HButton>
                            </>
                        ) :
                            <HButton
                                onPress={onPressAddExperince}
                                textType={"S16"}
                                color={Colors[colorScheme]?.grayScale6}
                                title={"Add Experience"}
                                containerStyle={[localStyles.addExperienceBtnStyle, {
                                    borderColor: Colors[colorScheme]?.primary, borderWidth: moderateScale(1),
                                    borderStyle: 'dashed'
                                }]}
                                bgColor={Colors[colorScheme]?.background}
                            ></HButton>
                    }




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
                </ScrollView>
            </View>
            {show && (
                <MonthPicker
                    onChange={onValueChange}
                    value={startFrom}
                />
            )}
        </HSafeAreaView>
    );
};

export default SubmitPforileDetail;

const localStyles = StyleSheet.create({
    main: {
        ...styles.ph20,
    },
    innerContainer: {
        ...styles.justifyBetween,
        ...styles.flex,
    },
    inputContainer: {
        ...styles.mt30,
    },
    btnStyle: {
        ...styles.mt30,
    },
    addExperienceBtnStyle: {
        ...styles.mt30,

    },
    experincePeriodStyle: {
        ...styles.mt30,
        ...styles.flexRow,
        gap: moderateScale(16)
    },
    periodboxStyle: {
        borderWidth: moderateScale(1),
        height: moderateScale(52),
        ...styles.center,
        ...styles.flex,
        borderRadius: moderateScale(12)
    }
});
