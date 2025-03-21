import { Image, StyleSheet, useColorScheme, View } from 'react-native'
import React, { useRef, useState } from 'react'

// local imports
import { Colors } from '@/constants/Colors';
import HSafeAreaView from '../components/common/HSafeAreaView';
import HHeader from '../components/common/HHeader';
import { styles } from '../themes';
import { getLocationLabel, moderateScale } from '../constants/constants';
import HText from '../components/common/HText';
import { useLocalSearchParams } from 'expo-router';
import HInput from '../components/common/HInput';
import HButton from '../components/common/HButton';
import apiRequest, { FILE_BASE_URL } from '../components/api';
import { APPLY_JOB } from '../components/apiConstants';
import ApplySuccess from '../components/modals/applySuccess';
import { useSelector } from 'react-redux';
import { CheckMark } from '../assets/svgs';
import HKeyBoardAvoidWrapper from '../components/common/HKeyBoardAvoidWrapper';
import images from '../assets/images';

/**
 * This component renders the apply job screen.
 * It includes form fields for cover letter and resume selection.
 * It validates the input fields and handles the job application process.
 */
const applyJob = () => {
    const colorScheme = useColorScheme();
    const applySuccessSheetRef = useRef(null)
    const { jobDetail } = useLocalSearchParams()
    const currentUserDetail = useSelector(state => state.userReducer.currentUserDetail)
    const [jodDetails, setJobDetails] = useState(JSON.parse(jobDetail))
    const [coverLetter, setCoverLetter] = useState('')
    const [coverLetterErrorMessage, setCoverLetterErrorMessage] = useState('')

    /**
     * Updates the cover letter state and validates the input.
     * @param {string} text - The cover letter input.
     */
    const onChangeCoverLetter = (text) => {
        setCoverLetter(text);
        if (!text.length > 0) {
            setCoverLetterErrorMessage("*Please Enter a Cover Letter.");
        } else {
            setCoverLetterErrorMessage("");
        }
    };

    /**
     * Handles the Apply Now button press event.
     * Validates the input fields and handles the job application process.
     */
    const onPressApply = async (text) => {
        let payload = {
            recruiter_id: jodDetails?.recruiter_id,
            job_id: jodDetails?._id,
            job_seeker_id: currentUserDetail?.user_id,
            apply_type: "apply_job",
            status: "application_submitted",
            cover_letter: coverLetter || ''
        }
        try {
            let response = await apiRequest("POST", APPLY_JOB, payload);
            if (response?.code == 'HJFA_MS_OK_200' && !response?.error_status) {
                applySuccessSheetRef?.current?.show()
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <HSafeAreaView containerStyle={styles.ph0}>
            <HKeyBoardAvoidWrapper containerStyle={[styles.flexGrow1]} >
                <View style={{ backgroundColor: Colors[colorScheme]?.white }}>
                    <HHeader title="Apply Job" containerStyle={styles.ph20} />
                    <View style={localstyles.jobStyle}>
                        <View style={[localstyles.imgStyle, { backgroundColor: Colors[colorScheme]?.grayScale4 }]} >
                            <Image
                                source={jodDetails?.image?.originalname ? { uri: FILE_BASE_URL + jodDetails?.image?.originalname } : images.fb}
                                style={localstyles.imgStyle}
                            />
                        </View>
                        <View style={[styles.flex, styles.ml15]}>
                            <View style={styles.rowSpaceBetween}>
                                <HText type="S14">
                                    {jodDetails?.position}
                                </HText>
                                <HText type="M12">
                                    {jodDetails?.salary ? `$${jodDetails?.salary}/y` : ''}
                                </HText>
                            </View>
                            <View style={styles.rowSpaceBetween}>
                                <HText type="R12" style={{ opacity: 0.5 }}>
                                    {jodDetails?.company_name || 'Google'}
                                </HText>
                                <HText type="R12" color={Colors[colorScheme]?.grayScale7}>
                                    {getLocationLabel(jodDetails?.location) || ''}
                                </HText>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={[styles.mv30, styles.mh25]}>
                    <HText type="S16">
                        {'Select a resume'}
                    </HText>
                    <View style={[localstyles.resumeSelectStyle, { backgroundColor: Colors[colorScheme]?.white }]}>
                        <CheckMark />
                        <View>
                            <HText type="M10" align='center' color={Colors[colorScheme]?.white} style={[localstyles.desStyle, { backgroundColor: Colors[colorScheme]?.yellow }]}>
                                {currentUserDetail?.designation}
                            </HText>
                            <HText type="B12" align='center' >
                                {currentUserDetail?.user_name}
                            </HText>
                        </View>
                    </View>
                    <HText type="S16">
                        {'Cover Letter / Resume '}
                        <HText type="R16" color={Colors[colorScheme]?.subText}>
                            (Optional)
                        </HText>
                    </HText>
                    <HInput
                        _value={coverLetter}
                        // label="Job Description"
                        placeHolder="Write a cover letter......"
                        toGetTextFieldValue={onChangeCoverLetter}
                        _errorText={coverLetterErrorMessage}
                        required={true}
                        multiline
                        inputContainerStyle={[styles.mt15, { borderWidth: 0, backgroundColor: Colors[colorScheme]?.white }]}
                        inputBoxStyle={[styles.pv15, styles.ml15]}
                    />
                    <HButton
                        onPress={onPressApply}
                        textType={"S16"}
                        color={Colors[colorScheme]?.white}
                        title={"Apply Now"}
                        containerStyle={[styles.mv30,]}
                        bgColor={Colors[colorScheme]?.primary}
                    ></HButton>
                </View>
                <ApplySuccess SheetRef={applySuccessSheetRef} />
            </HKeyBoardAvoidWrapper>
        </HSafeAreaView>
    )
}

export default applyJob

const localstyles = StyleSheet.create({
    imgStyle: {
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(20),
    },
    jobStyle: {
        ...styles.mh30,
        ...styles.mv25,
        ...styles.flexRow
    },
    resumeSelectStyle: {
        ...styles.mv15,
        ...styles.ph15,
        ...styles.pv10,
        ...styles.selfStart,
        ...styles.rowCenter,
        gap: moderateScale(16),
        borderRadius: moderateScale(12),
    },
    desStyle: {
        ...styles.ph10,
        ...styles.pv5,
        borderRadius: moderateScale(6),
        ...styles.selfCenter
    }
})