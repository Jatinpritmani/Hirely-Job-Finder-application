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
import apiRequest from "../components/api";
import { CREATE_JOB_POST } from "../components/apiConstants";
import HKeyBoardAvoidWrapper from "../components/common/HKeyBoardAvoidWrapper";
import HText from "../components/common/HText";
import { moderateScale } from "../constants/constants";

const createPost = () => {
    const { new_post } = useLocalSearchParams();

    const colorScheme = useColorScheme();

    const [jobDescription, setJobDescription] = useState("");
    const [jobDescriptionErrorMessage, setJobDescriptionErrorMessage] =
        useState("");

    const [responsibilities, setResponsibilities] = useState("");
    const [responsibilitiesErrorMessage, setResponsibilitiesErrorMessage] =
        useState("");
    const [isNextDisabled, setIsNextDisabled] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);


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

        if (isTruthyString(jobDescription) && isTruthyString(responsibilities)) {
            let new_post_payload = {
                ...JSON.parse(new_post),
                summary: jobDescription,
                requirenment: responsibilities,
            };
            setIsLoading(true);
            try {
                let response = await apiRequest(
                    "POST",
                    CREATE_JOB_POST,
                    new_post_payload
                );
                if (response?.code == "HJFA_MS_OK_200" && !response?.error_status) {
                    Toast.show({
                        type: "success",
                        text1: "Job Created Successfully!",
                        text2: "Your job posting has been published.",
                    });
                    router.replace("(tabs)");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const onChangeJobDescription = (text) => {
        setJobDescription(text);
        if (!text.length > 0) {
            setJobDescriptionErrorMessage("*Please Enter a Job Description.");
        } else {
            setJobDescriptionErrorMessage("");
        }
    };

    const onChangeResponsibilities = (text) => {
        setResponsibilities(text);
        if (!text.length > 0) {
            setResponsibilitiesErrorMessage("*Please Enter Responsibilities.");
        } else {
            setResponsibilitiesErrorMessage("");
        }
    };


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
            setSelectedImage(file.uri);
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

                {/* <View>
                    <HText style={[styles.mt15, styles.mb5]} type={'S14'} >
                        {'Choose Image'}
                    </HText>
                    <TouchableOpacity onPress={onPressImagePicker} style={[localStyles.imagePicker, { borderColor: Colors[colorScheme]?.borderColor }]}>
                        <HText type={'S14'}  >
                            {selectedImage ? "Selected Image" : 'Select Image'}
                        </HText>
                        {selectedImage && <Image
                            source={{ uri: selectedImage }}
                            style={localStyles.imageView}
                        />}
                    </TouchableOpacity>
                </View> */}
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
