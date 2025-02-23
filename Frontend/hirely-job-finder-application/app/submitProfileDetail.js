import {
    FlatList,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";


// local imports
import HSafeAreaView from "../components/common/HSafeAreaView";
import { styles } from "../themes";
import HInput from "../components/common/HInput";
import HText from "../components/common/HText";
import HButton from "../components/common/HButton";
import { moderateScale } from "../constants/constants";
import { Colors } from "@/constants/Colors";
import MonthYearPicker from "../components/modals/monthYearPicker";
import { isTruthyString } from "../utils/validator";
import { TrashIcon } from "../assets/svgs";
import HHeader from "../components/common/HHeader";

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
    const [experience, setExperience] = useState([])

    const [startFromDate, setStartFromDate] = useState();
    const [startfromModal, setStartfromModal] = useState(false);
    const [startDateErrorMessage, setStartDateErrorMessage] = useState('')
    const [endDateErrorMessage, setEndDateErrorMessage] = useState('')
    const [endToDate, setEndToDate] = useState();
    const [endToModal, setendToModal] = useState(false);
    const { userDetail } = useLocalSearchParams();


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
            setCompanyLocationErrorMessage("*Please Enter a Company Location");
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

    useEffect(() => {
        if (startFromDate?.length > 0) {
            setStartDateErrorMessage('')
        }

    }, [startFromDate])
    useEffect(() => {
        if (endToDate?.length > 0) {
            setEndDateErrorMessage('')
        }

    }, [endToDate])


    const onPressNext = () => {
        if (!isTruthyString(about)) {
            setAboutErrorMessage("*Please Enter a About Youself.");

        }
        if (!isTruthyString(jobRole)) {
            setJobRoleErrorMessage("*Please Enter a Job Role ");

        }
        if (!isTruthyString(about) || !isTruthyString(jobRole)) {
            return
        } else {
            let userUpdatedDetail = {
                ...JSON.parse(userDetail),
                designation: jobRole,
                bio: about,
                experience: experience?.length > 0 ? experience : null
            }
            // add userDetail and pass it to upload cv file 
            router.push({
                pathname: "/uploadCV",
                params: { userDetail: JSON.stringify(userUpdatedDetail) }, // Pass parameters
            })
        }
    };
    const onPressAddExperince = () => {
        setIsShowExperienceFields(true)
    };

    const onPressConfirmAddExperience = () => {
        if (!isTruthyString(companyName)) {
            setCompanyNameErrorMessage("*Please Enter a Company Name");

        }
        if (!isTruthyString(experienceJobRole)) {
            setExperienceJobRoleErrorMessage("*Please Enter a Job Role At a Company");

        }
        if (!isTruthyString(companyLocation)) {
            setCompanyLocationErrorMessage("*Please Enter a Company Location");

        }
        if (!isTruthyString(startFromDate)) {
            setStartDateErrorMessage("*Please Enter a Start Date");

        }
        if (!isTruthyString(endToDate)) {
            setEndDateErrorMessage("*Please Enter a Start Date");

        }
        if (!isTruthyString(companyName) || !isTruthyString(experienceJobRole) || !isTruthyString(companyLocation) || !isTruthyString(startFromDate) || !isTruthyString(endToDate)) {
            return
        }
        else {
            let experience = {
                company_name: companyName,
                job_role: experienceJobRole,
                location: companyLocation,
                experience_from: startFromDate,
                experience_to: endToDate
            }
            setExperience(state => [...state, experience])
            setCompanyName('')
            setExperienceJobRole('')
            setCompanyLocation('')
            setStartFromDate('')
            setEndToDate('')
            setIsShowExperienceFields(false)

        }

        // setCom
    }

    const onPressStartDate = () => {
        setStartfromModal(true)
    }
    const onPressEndDate = () => {
        if (startFromDate) {

            setendToModal(true)
        }
    }


    // experience card render item
    const renderItem = ({ item, index }) => {
        return (
            <ExperienceCard item={item} index={index} experience={experience} setExperience={setExperience} />
        )
    }

    return (
        <HSafeAreaView containerStyle={styles.ph0} style={localStyles.main}>
            <HHeader
                title="Complete Your Profile"
                containerStyle={styles.ph20}
            />
            <View style={localStyles.innerContainer}>
                <ScrollView showsVerticalScrollIndicator={false} style={localStyles.inputContainer}>
                    <View >
                        <View style={styles.mh20}>
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
                        </View>
                        {experience?.length > 0 && (
                            <>
                                <HText type="S14" style={[styles.mt10, styles.mh20]}>
                                    Experiences
                                </HText>
                                <FlatList
                                    data={experience}
                                    renderItem={renderItem}
                                    style={styles.mt10}
                                />
                            </>
                        )}
                        {
                            isShowExperienceFields ? (
                                <View style={styles.mh20}>
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
                                        <View style={styles.flex}>
                                            <TouchableOpacity onPress={onPressStartDate} style={[localStyles.periodboxStyle, { borderColor: Colors[colorScheme]?.borderColor }]}>
                                                <HText type={'M14'}>
                                                    {startFromDate || 'Start Date'}
                                                </HText>
                                            </TouchableOpacity>
                                            {startDateErrorMessage && <HText type={'R12'} style={[localStyles.errorStyle, { color: Colors[colorScheme]?.danger }]}>
                                                {startDateErrorMessage}
                                            </HText>}
                                        </View>
                                        <View style={styles.flex}>

                                            <TouchableOpacity onPress={onPressEndDate} style={[localStyles.periodboxStyle, { borderColor: Colors[colorScheme]?.borderColor }]}>
                                                <HText type={'M14'} >
                                                    {endToDate || 'End Date'}
                                                </HText>
                                            </TouchableOpacity>
                                            {endDateErrorMessage && <HText type={'R12'} style={[localStyles.errorStyle, { color: Colors[colorScheme]?.danger }]}>
                                                {endDateErrorMessage}
                                            </HText>}
                                        </View>
                                    </View>
                                    <HButton
                                        onPress={onPressConfirmAddExperience}
                                        textType={"S16"}
                                        color={Colors[colorScheme]?.white}
                                        title={"Add Experience"}
                                        containerStyle={[localStyles.addExperienceBtnStyle,
                                        (startDateErrorMessage || endDateErrorMessage) && styles.mt10
                                        ]}
                                        bgColor={Colors[colorScheme]?.primary}
                                    ></HButton>
                                </View>
                            ) :
                                <HButton
                                    onPress={onPressAddExperince}
                                    textType={"S16"}
                                    color={Colors[colorScheme]?.grayScale6}
                                    title={"Add Experience"}
                                    containerStyle={[localStyles.addExperienceBtnStyle, {
                                        borderColor: Colors[colorScheme]?.primary, borderWidth: moderateScale(1),
                                        borderStyle: 'dashed',
                                        ...styles.mh20
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
                        <MonthYearPicker keyss='startdate' modalVisible={startfromModal} setModalVisible={setStartfromModal} setDate={setStartFromDate} />
                        <MonthYearPicker key='enddate' modalVisible={endToModal} setModalVisible={setendToModal} setDate={setEndToDate} minMonthYear={startFromDate} />
                    </View>
                </ScrollView>

            </View>
        </HSafeAreaView>
    );
};

const ExperienceCard = ({ item, index, experience, setExperience }) => {
    const colorScheme = useColorScheme();
    const onPressDeleteExperience = () => {
        setExperience(exp =>
            exp.filter((item, indexe) => indexe !== index)
        );

    }
    return (
        <View style={[localStyles.card, { backgroundColor: Colors[colorScheme]?.white, borderColor: Colors[colorScheme]?.borderColor }]}>
            <View style={styles.rowSpaceBetween}>
                <HText type="S14">
                    {item?.job_role}
                </HText>
                <HText type="M12">
                    {item?.location}
                </HText>
            </View>
            <View style={styles.rowSpaceBetween}>
                <HText type="S14">
                    {item?.company_name || 'Google'}
                </HText>
                <HText type="R12">
                    {item?.experience_from} - {item?.experience_to}
                </HText>
            </View>
            <TouchableOpacity onPress={onPressDeleteExperience} style={[localStyles.crossIcon, { backgroundColor: Colors[colorScheme]?.borderColor2 }]}>
                <TrashIcon width={moderateScale(20)} height={moderateScale(20)} />
            </TouchableOpacity>
        </View>
    )
}

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
        ...styles.mh20,

    },
    addExperienceBtnStyle: {
        ...styles.mt30,

    },
    experincePeriodStyle: {
        ...styles.mt20,
        ...styles.flexRow,
        gap: moderateScale(16),

    },
    periodboxStyle: {
        borderWidth: moderateScale(1),
        height: moderateScale(52),
        ...styles.center,
        borderRadius: moderateScale(12)
    },
    errorStyle: {
        ...styles.mv5,
        ...styles.ml5
    },
    card: {
        ...styles.pv10,
        ...styles.ph20,
        ...styles.mt10,
        ...styles.mh20,
        borderRadius: moderateScale(10),
        borderWidth: moderateScale(1)
    },
    crossIcon: {
        position: 'absolute',
        right: -moderateScale(7),
        top: -moderateScale(7),
        padding: moderateScale(3),
        borderRadius: moderateScale(10)
    }
});
