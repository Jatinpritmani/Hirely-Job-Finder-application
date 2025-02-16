import { Alert, StyleSheet, Text, useColorScheme, View } from "react-native";
import React, { useRef, useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import Toast from "react-native-toast-message";

// local imports
import { Colors } from "@/constants/Colors";
import HSafeAreaView from "../components/common/HSafeAreaView";
import { styles } from "../themes";
import HHeader from "../components/common/HHeader";
import HText from "../components/common/HText";
import { moderateScale } from "../constants/constants";
import HButton from "../components/common/HButton";
import { CrossIcon, DocumentIcon } from "../assets/svgs";
import { router, useLocalSearchParams } from "expo-router";
import apiRequest, { uploadFile } from "../components/api";
import { UPLOAD_RESUME, USER_REGISTER } from "../components/apiConstants";
import RegisterSuccess from "../components/modals/registerSuccess";
import { useSelector } from "react-redux";

const uploadCV = () => {
    const colorScheme = useColorScheme();
    const [isRegisterDisabled, setIsRegisterDisabled] = useState(true);
    const [selectedFile, setSelectedFile] = useState();
    const { userDetail, fromProfile } = useLocalSearchParams();
    const registerSuccessSheetRef = useRef(null)
    const currentUserDetail = useSelector(state => state.userReducer.currentUserDetail)

    // function to Register User 
    const onPressRegister = async () => {
        if (!selectedFile) {
            return
        }
        try {
            // api call for user register for user type job_seeker
            let response = await apiRequest("POST", USER_REGISTER, userDetail);
            if (response?.code == 'HJFA_MS_OK_200' && !response?.error_status) {
                // api call for file upload of resume for jobseeker
                try {
                    const uploadResponse = await uploadFile(
                        UPLOAD_RESUME,
                        selectedFile?.uri,
                        selectedFile?.mimeType,
                        selectedFile?.name,
                        { user_id: response?.data?.user_id }
                    );
                    if (uploadResponse?.code == 'HJFA_MS_OK_200' && !uploadResponse?.error_status) {

                        Toast.show({
                            type: 'success',
                            text1: 'Upload Successful',
                            text2: 'Your Resume has been uploaded.',
                        });
                        registerSuccessSheetRef?.current?.show()

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
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: response?.message || 'Something went wrong.',
                });
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    const onPressSave = async () => {
        if (!selectedFile) {
            return
        }
        // api call for file upload of resume for jobseeker
        try {
            const response = await uploadFile(
                UPLOAD_RESUME,
                selectedFile?.uri,
                selectedFile?.mimeType,
                selectedFile?.name,
                { user_id: currentUserDetail.user_id }
            );
            if (response?.code == 'HJFA_MS_OK_200' && !response?.error_status) {

                Toast.show({
                    type: 'success',
                    text1: 'Upload Successful',
                    text2: 'Your Resume has been uploaded.',
                });
                router.back()

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
    };



    // Function to pick pdf from files (mobile storage)
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
            setIsRegisterDisabled(false)
            return file; // Return file if needed for upload
        } catch (error) {
            console.error("Error picking file:", error);
            Alert.alert("Error", "Failed to pick a file.");
        }
    };

    return (
        <HSafeAreaView style={localStyles.main}>
            <HHeader title="Upload CV" />
            <HText type="S16" style={styles.mv25}>
                Resume or CV
            </HText>
            <View
                style={[
                    localStyles.uploadContainer,
                    { backgroundColor: Colors[colorScheme]?.white },
                ]}
            >
                <HText
                    type="S16"
                    align="center"
                    color={Colors[colorScheme]?.subText}
                    style={styles.mv25}
                >
                    Upload your CV or Resume and use it when you apply for jobs
                </HText>
                {selectedFile ? (
                    <View
                        style={[
                            localStyles.fileView,
                            { backgroundColor: Colors[colorScheme]?.grayScale1 },
                        ]}
                    >
                        <DocumentIcon />
                        <HText
                            type="M14"
                            align="center"
                            color={Colors[colorScheme]?.grayScale4}
                            style={styles.mh20}
                        >
                            {selectedFile?.name}
                        </HText>
                        <CrossIcon />
                    </View>
                ) : (
                    <View
                        style={[
                            localStyles.uploadTitle,
                            { backgroundColor: Colors[colorScheme]?.grayScale8 },
                        ]}
                    >
                        <HText
                            type="R14"
                            align="center"
                            color={Colors[colorScheme]?.grayScale4}
                            style={styles.mv25}
                        >
                            Upload a Doc/Docx/PDF
                        </HText>
                    </View>
                )}
                <HButton
                    onPress={pickPDF}
                    textType={"S16"}
                    bgColor={Colors[colorScheme]?.grayScale4}
                    title={"Upload"}
                    containerStyle={[localStyles.btnStyle]}
                ></HButton>
            </View>
            <HButton
                // disabled={isRegisterDisabled}
                onPress={fromProfile == 'true' ? onPressSave : onPressRegister}
                textType={"S16"}
                color={
                    isRegisterDisabled
                        ? Colors[colorScheme]?.grayScale6
                        : Colors[colorScheme]?.white
                }
                title={fromProfile == 'true' ? 'Save' : "Next"}
                containerStyle={[localStyles.registerBTnstyle]}
                bgColor={
                    isRegisterDisabled
                        ? Colors[colorScheme]?.grayScale5
                        : Colors[colorScheme]?.primary
                }
            ></HButton>
            <RegisterSuccess SheetRef={registerSuccessSheetRef} />
        </HSafeAreaView>
    );
};

export default uploadCV;

const localStyles = StyleSheet.create({
    main: {},
    uploadContainer: {
        borderWidth: moderateScale(1),
        borderRadius: moderateScale(24),
        borderStyle: "dashed",
        ...styles.center,
        ...styles.ph30,
        paddingVertical: moderateScale(40),
    },
    uploadTitle: {
        paddingHorizontal: moderateScale(50),
        borderRadius: moderateScale(12),
    },
    btnStyle: {
        ...styles.mt30,
        width: moderateScale(223),
        opacity: 0.8,
    },
    registerBTnstyle: {
        bottom: moderateScale(30),
        position: "absolute",
        width: "100%",
        ...styles.selfCenter,
    },
    fileView: {
        ...styles.ph20,
        ...styles.pv10,
        borderRadius: moderateScale(12),
        ...styles.rowSpaceBetween,
    },
});
