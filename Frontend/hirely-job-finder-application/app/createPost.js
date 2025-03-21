import { Image, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";

// local import
import { Colors } from "@/constants/Colors";
import HSafeAreaView from "../components/common/HSafeAreaView";
import HHeader from "../components/common/HHeader";
import HInput from "../components/common/HInput";
import { styles } from "../themes";
import HButton from "../components/common/HButton";
import { isTruthyString } from "../utils/validator";
import apiRequest, { uploadFile } from "../components/api";
import { CREATE_JOB_POST, UPLOAD_IMAGE } from "../components/apiConstants";
import HKeyBoardAvoidWrapper from "../components/common/HKeyBoardAvoidWrapper";
import HText from "../components/common/HText";
import { moderateScale } from "../constants/constants";

/**
 * This component allows recruiters to create a new job post.
 * It includes form fields for job description, responsibilities, and image upload.
 * It validates the input fields and handles the job post creation process.
 */
const createPost = () => {
    const { new_post } = useLocalSearchParams();
    const colorScheme = useColorScheme();
    const [jobDescription, setJobDescription] = useState("");
    const [jobDescriptionErrorMessage, setJobDescriptionErrorMessage] = useState("");
    const [responsibilities, setResponsibilities] = useState("");
    const [responsibilitiesErrorMessage, setResponsibilitiesErrorMessage] = useState("");
    const [isNextDisabled, setIsNextDisabled] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState();

    /**
     * Effect to validate input fields and enable/disable the Next button.
     */
    useEffect(() => {
        if (jobDescription?.length > 0) {
            setJobDescriptionErrorMessage("");
        }
        if (responsibilities?.length > 0) {
            setResponsibilitiesErrorMessage("");
        }
        if (jobDescription?.length > 0 && responsibilities?.length > 0) {
            setIsNextDisabled(false);
        } else {
            setIsNextDisabled(true);
        }
    }, [jobDescription, responsibilities]);

    /**
     * Handles the Next button press event.
     * Validates the input fields and handles the job post creation process.
     */
    const onPressNext = async () => {
        if (!isTruthyString(jobDescription)) {
            setJobDescriptionErrorMessage("*Please Enter a Job Description.");
        } else {
            setJobDescriptionErrorMessage("");
        }
        if (!isTruthyString(responsibilities)) {
            setResponsibilitiesErrorMessage("*Please Enter Responsibilities.");
        } else {
            setResponsibilitiesErrorMessage("");
        }
        if (!selectedImage) {
            Toast.show({
                type: "error",
                text1: "Please Select Image",
            });
            return
        }
        if (isTruthyString(jobDescription) && isTruthyString(responsibilities) && selectedImage) {
            let new_post_payload = {
                ...JSON.parse(new_post),
                summary: jobDescription,
                requirenment: responsibilities,
            };
            setIsLoading(true);
            try {
                let response = await apiRequest("POST", CREATE_JOB_POST, new_post_payload);
                if (response?.code == "HJFA_MS_OK_200" && !response?.error_status) {
                    try {
                        const uploadResponse = await uploadFile(
                            UPLOAD_IMAGE,
                            selectedImage?.uri,
                            selectedImage?.mimeType,
                            selectedImage?.fileName,
                            { job_id: response?.data?.job_id }
                        );
                        if (uploadResponse?.code == 'HJFA_MS_OK_200' && !uploadResponse?.error_status) {
                            Toast.show({
                                type: "success",
                                text1: "Job Created Successfully!",
                                text2: "Your job posting has been published.",
                            });
                            router.replace("(tabs)");
                        } else {
                            Toast.show({
                                type: 'error',
                                text1: 'Upload Failed',
                                text2: 'Failed to Upload your image.',
                            });
                        }
                    } catch (error) {
                        console.error('Upload Error:', error);
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    /**
     * Updates the job description state and validates the input.
     * @param {string} text - The job description input.
     */
    const onChangeJobDescription = (text) => {
        setJobDescription(text);
        if (!text.length > 0) {
            setJobDescriptionErrorMessage("*Please Enter a Job Description.");
        } else {
            setJobDescriptionErrorMessage("");
        }
    };

    /**
     * Updates the responsibilities state and validates the input.
     * @param {string} text - The responsibilities input.
     */
    const onChangeResponsibilities = (text) => {
        setResponsibilities(text);
        if (!text.length > 0) {
            setResponsibilitiesErrorMessage("*Please Enter Responsibilities.");
        } else {
            setResponsibilitiesErrorMessage("");
        }
    };

    /**
     * Opens the image picker to select an image.
     */
    const onPressImagePicker = async () => {
        // Ask for permissions
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permission Required", "Please grant camera roll permissions.");
            return;
        }

        // Open image picker
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const file = result.assets[0];
            setSelectedImage(file);
        }
    };

    return (
        <HSafeAreaView>
            <HHeader title="Create Post" />
            <HKeyBoardAvoidWrapper containerStyle={[localStyles.inputContainer, styles.flexGrow1]} >
                <View style={styles.mt50}>
                    <HInput
                        _value={jobDescription}
                        label="Job Description"
                        placeHolder="Job Description"
                        toGetTextFieldValue={onChangeJobDescription}
                        _errorText={jobDescriptionErrorMessage}
                        required={true}
                        multiline
                        inputBoxStyle={[styles.pv15, styles.ml15]}
                    />
                    <HInput
                        _value={responsibilities}
                        label="Responsibilities"
                        placeHolder="Responsibilities"
                        toGetTextFieldValue={onChangeResponsibilities}
                        _errorText={responsibilitiesErrorMessage}
                        required={true}
                        multiline
                        inputBoxStyle={[styles.pv15, styles.ml15]}
                    />
                </View>
                <View>
                    <HText style={[styles.mt15, styles.mb5]} type={'S14'} >
                        {'Choose Image'}
                    </HText>
                    <TouchableOpacity onPress={onPressImagePicker} style={[localStyles.imagePicker, { borderColor: Colors[colorScheme]?.borderColor }]}>
                        <HText type={'S14'}  >
                            {selectedImage ? "Selected Image" : 'Select Image'}
                        </HText>
                        {selectedImage && <Image
                            source={{ uri: selectedImage?.uri }}
                            style={localStyles.imageView}
                        />}
                    </TouchableOpacity>
                </View>
                <HButton
                    // disabled={isNextDisabled}
                    onPress={onPressNext}
                    isLoading={isLoading}
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
            </HKeyBoardAvoidWrapper>
        </HSafeAreaView>
    );
};

export default createPost;

const localStyles = StyleSheet.create({
    btnStyle: {
        ...styles.mt50,
        ...styles.mb30,
    },
    imagePicker: {
        ...styles.p20,
        borderWidth: moderateScale(1),
        borderRadius: moderateScale(12)
    },
    imageView: {
        width: moderateScale(46),
        height: moderateScale(46),
        borderRadius: moderateScale(12),
    },
});
