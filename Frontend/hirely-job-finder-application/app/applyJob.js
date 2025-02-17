import { StyleSheet, Text, useColorScheme, View } from 'react-native'
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
import { isTruthyString } from '../utils/validator';
import HButton from '../components/common/HButton';
import apiRequest from '../components/api';
import { APPLY_JOB } from '../components/apiConstants';
import ApplySuccess from '../components/modals/applySuccess';
import { useSelector } from 'react-redux';

const applyJob = () => {
    const colorScheme = useColorScheme();
    const applySuccessSheetRef = useRef(null)


    const { jobDetail } = useLocalSearchParams()
    const currentUserDetail = useSelector(state => state.userReducer.currentUserDetail)

    const [jodDetails, setJobDetails] = useState(JSON.parse(jobDetail))
    const [coverLetter, setCoverLetter] = useState('')
    const [coverLetterErrorMessage, setCoverLetterErrorMessage] = useState('')

    const onChangeCoverLetter = (text) => {
        setCoverLetter(text);
        if (!text.length > 0) {
            setCoverLetterErrorMessage("*Please Enter a Cover Letter.");
        } else {
            setCoverLetterErrorMessage("");
        }
    };
    const onPressApply = async (text) => {
        if (!isTruthyString(coverLetter)) {
            setCoverLetterErrorMessage('*Please Enter a Cover Letter.')
        } else {
            let payload = {
                recruiter_id: jodDetails?.recruiter_id,
                job_id: jodDetails?._id,
                job_seeker_id: currentUserDetail?.user_id,
                apply_type: "apply_job",
                status: "application_submitted",
                cover_letter: coverLetter
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
        }
    };

    return (
        <HSafeAreaView containerStyle={styles.ph0}>
            <View style={{ backgroundColor: Colors[colorScheme]?.white }}>
                <HHeader title="Apply Job" containerStyle={styles.ph20}
                />
                <View style={localstyles.jobStyle}>
                    <View style={[localstyles.imgStyle, { backgroundColor: Colors[colorScheme]?.grayScale4 }]} />
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
                                {jodDetails?.company_name || ''}
                            </HText>
                            <HText type="R12" color={Colors[colorScheme]?.grayScale7}>
                                {getLocationLabel(jodDetails?.location) || ''}
                            </HText>
                        </View>
                    </View>
                </View>


            </View>
            <View style={[styles.mv30, styles.mh25]}>
                {/* <HText type="S16">
                    {'Select a resume'}
                </HText>
                <View>

                </View> */}
                <HText type="S16">
                    {'Cover Later / Resume '}

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
    }

})