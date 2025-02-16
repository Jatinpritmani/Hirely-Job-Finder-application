import { StyleSheet, Text, useColorScheme, View } from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";

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

    return (
        <HSafeAreaView>
            <HHeader title="Create Post" />
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
        </HSafeAreaView>
    );
};

export default createPost;

const localStyles = StyleSheet.create({
    btnStyle: {
        ...styles.mt50,
    },
});
