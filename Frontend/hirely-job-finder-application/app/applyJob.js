import { Alert, Image, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native'
import React, { useRef, useState } from 'react'
import * as DocumentPicker from "expo-document-picker";
import Toast from "react-native-toast-message";


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
import apiRequest, { FILE_BASE_URL, uploadFile } from '../components/api';
import { APPLY_JOB, UPLOAD_COVER_LETTER } from '../components/apiConstants';
import ApplySuccess from '../components/modals/applySuccess';
import { useSelector } from 'react-redux';
import { CheckMark, CrossIcon, DocumentIcon, FileUpload } from '../assets/svgs';
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
    const [selectedFile, setSelectedFile] = useState();


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
    console.log('====================================');
    console.log('jodDetails', jodDetails);
    console.log('====================================');
    /**
     * Handles the Apply Now button press event.
     * Validates the input fields and handles the job application process.
     */
    const onPressApply = async (text) => {
        if (!selectedFile) {
            Toast.show({
                type: "error",
                text1: "Please Select Cover Letter.",
            });
            return
        }

        let payload = {
            recruiter_id: jodDetails?.recruiter_id,
            job_id: jodDetails?._id,
            job_seeker_id: currentUserDetail?.user_id,
            apply_type: "apply_job",
            status: "application_submitted",
            cover_letter: coverLetter || ''
        }

        try {
            let apiresponse = await apiRequest("POST", APPLY_JOB, payload);
            if (apiresponse?.code == 'HJFA_MS_OK_200' && !apiresponse?.error_status) {
                console.log('====================================');
                console.log('response', apiresponse);
                console.log('==================selectedFile==================', selectedFile);
                try {
                    const response = await uploadFile(
                        UPLOAD_COVER_LETTER,
                        selectedFile?.uri,
                        selectedFile?.mimeType,
                        selectedFile?.name,
                        { application_id: apiresponse?.data?.application_id }
                    );
                    if (response?.code == 'HJFA_MS_OK_200' && !response?.error_status) {

                        Toast.show({
                            type: 'success',
                            text1: 'Upload Successful',
                            text2: 'Your Cover Letter has been uploaded.',
                        });
                        applySuccessSheetRef?.current?.show()

                    }
                    else {
                        Toast.show({
                            type: 'error',
                            text1: 'Upload Failed',
                            text2: 'Failed to Upload your Resume.',
                        });
                    }
                } catch (error) {
                    console.error('Upload Error:', error);
                }

            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false)
        }
    };

    /**
         * Function to pick a PDF file from the device storage.
         * Sets the selected file and updates the state.
         */
    const pickPDF = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "application/pdf", // Only allow PDF files
                copyToCacheDirectory: false, // Optional: avoid unnecessary copies
            });

            if (result.canceled) {
                console.log("User canceled file selection");
                return;
            }

            const file = result.assets[0]; // Access selected file details
            console.log("Selected File:", file);
            setSelectedFile(file);
            return file; // Return file if needed for upload
        } catch (error) {
            console.error("Error picking file:", error);
            Alert.alert("Error", "Failed to pick a file.");
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
                    <View style={[styles.flexRow, styles.flex]}>
                        <HInput
                            _value={coverLetter}
                            // label="Job Description"
                            placeHolder="Write a cover letter......"
                            toGetTextFieldValue={onChangeCoverLetter}
                            _errorText={coverLetterErrorMessage}
                            required={true}
                            multiline
                            inputContainerStyle={[styles.mt15, { borderWidth: 0, backgroundColor: Colors[colorScheme]?.white, width: '88%' }]}
                            inputBoxStyle={[styles.pv15, styles.ml15]}
                        />
                        <TouchableOpacity onPress={pickPDF} style={[localstyles.uploadFileContainer, { backgroundColor: Colors[colorScheme]?.white }]}>
                            <FileUpload />
                            <HText type='R10' style={styles.mt10} align='center' color={Colors[colorScheme]?.primary}>
                                Upload
                                File
                            </HText>
                        </TouchableOpacity>
                    </View>

                    {selectedFile &&
                        <View
                            style={[
                                localstyles.fileView,
                                { backgroundColor: Colors[colorScheme]?.grayScale1 },
                            ]}
                        >
                            <DocumentIcon />
                            <HText
                                type="M14"
                                align="center"
                                color={Colors[colorScheme]?.grayScale4}
                                style={[{ width: '70%' }]}
                            >
                                {selectedFile?.name}
                            </HText>
                            <TouchableOpacity style={styles.p5} onPress={() => setSelectedFile(null)}>
                                <CrossIcon />
                            </TouchableOpacity>
                        </View>
                    }
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
    },
    uploadFileContainer: {
        ...styles.center,
        ...styles.flex,
        ...styles.mt15,
        marginLeft: moderateScale(-20),
        ...styles.p5,
        borderRadius: moderateScale(12),
    },
    fileView: {
        ...styles.mt15,
        ...styles.ph20,
        ...styles.pv10,
        borderRadius: moderateScale(12),
        ...styles.rowSpaceBetween,
    },
})