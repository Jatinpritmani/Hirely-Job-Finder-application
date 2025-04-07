import { StyleSheet, TouchableOpacity, useColorScheme, View } from "react-native";
import React, { useEffect, useState } from "react";
import { router } from 'expo-router'
import { useDispatch, useSelector } from 'react-redux';

// local imports
import HSafeAreaView from "../components/common/HSafeAreaView";
import { styles } from "../themes";
import AuthHeader from "../components/common/AuthHeader";
import { EyeIconDark, EyeIconLight } from "../assets/svgs";
import HInput from "../components/common/HInput";
import HText from "../components/common/HText";
import HButton from "../components/common/HButton";
import { Colors } from "@/constants/Colors";
import { isTruthyString, isValidEmail } from "../utils/validator";
import { USER_LOGIN } from "../components/apiConstants";
import apiRequest from "../components/api";
import { getUserDetail } from "../context/actions/userActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HKeyBoardAvoidWrapper from "../components/common/HKeyBoardAvoidWrapper";

/**
 * This component renders the login screen.
 * It includes form fields for email and password.
 * It validates the input fields and handles the login process.
 */
const login = () => {
    const colorScheme = useColorScheme();
    const dispatch = useDispatch()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isShowPassword, setIsShowPassword] = useState(true);
    const [isLoginDisabled, setIsLoginDisabled] = useState(true);
    const [emailErrorMessage, setEmailErrorMessage] = useState("");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false)

    const currentUserType = useSelector(state => state.commonReducer.current_user_type)
    const isUserLoggedIn = useSelector(state => state.userReducer.isUserLoggedIn)

    /**
     * Effect to validate input fields and enable/disable the Login button.
     */
    useEffect(() => {
        if (email?.length > 0 && password?.length > 0 && isValidEmail(email)) {
            setIsLoginDisabled(false);
        } else {
            setIsLoginDisabled(true);
        }
    }, [email, password]);

    /**
     * Effect to navigate to the home screen if the user is already logged in.
     */
    useEffect(() => {
        if (isUserLoggedIn) {
            router.push('/(tabs)')
        }
    }, [isUserLoggedIn])

    /**
     * Updates the email state and validates the input.
     * @param {string} text - The email input.
     */
    const onChangeEmail = (text) => {
        setEmail(text);
        if (!isValidEmail(text)) {
            let message = !text?.length > 0 ? "*Please Enter a E-Mail." : "Please Enter a valid E-Mail.";
            setEmailErrorMessage(message);
        } else {
            setEmailErrorMessage("");
        }
    };

    /**
     * Updates the password state and validates the input.
     * @param {string} text - The password input.
     */
    const onChangePassword = (text) => {
        setPassword(text);
        if (!text.length > 0) {
            setPasswordErrorMessage("*Please Enter a Password");
        } else {
            setPasswordErrorMessage("");
        }
    };

    /**
     * Navigates to the registration screen.
     */
    const onPressRegister = () => {
        router.push('start')
    }

    /**
     * Renders the password hide/show icon.
     */
    const passwordHideIcon = () => {
        return (
            <TouchableOpacity onPress={() => setIsShowPassword(!isShowPassword)}>
                {!isShowPassword ? <EyeIconDark /> : <EyeIconLight />}
            </TouchableOpacity>
        );
    };

    /**
     * Handles the Login button press event.
     * Validates the input fields and handles the login process.
     */
    const onPressLogin = async () => {
        let pushToken = await AsyncStorage.getItem('pushToken');
        if (!isTruthyString(email)) {
            setEmailErrorMessage("*Please Enter E-Mail Address.");
        }
        if (!isValidEmail(email)) {
            setEmailErrorMessage("Please Enter a valid E-Mail.");
        }
        if (!isTruthyString(password)) {
            setPasswordErrorMessage("*Please Enter a Password");
        }
        if (!isValidEmail(email) || !isTruthyString(email) || !isTruthyString(password)) {
            return
        } else {
            setIsLoading(true)
            let login_cred = {
                user_email: email,
                user_password: password,
                fcm_token: pushToken
            }
            // api call for login 
            try {
                let response = await apiRequest("POST", USER_LOGIN, login_cred);
                if (response?.code == 'HJFA_MS_OK_200' && !response?.error_status) {
                    dispatch(getUserDetail(response?.data?.user_id))
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false)
            }
        }
    };

    return (
        <HSafeAreaView >
            <HKeyBoardAvoidWrapper containerStyle={[localStyles.inputContainer, styles.flexGrow1]} >
                <AuthHeader
                    title="Welcome Back"
                    description={currentUserType == 'job_seeker' ? "Let’s Login. Apply to jobs!" : "Let’s Login. Start hiring top talent today!"}
                />


                <View style={localStyles.inputContainer}>
                    <HInput
                        _value={email}
                        label="Email Address"
                        placeHolder="E-Mail"
                        toGetTextFieldValue={onChangeEmail}
                        _errorText={emailErrorMessage}
                        required={true}
                    />
                    <HInput
                        _value={password}
                        label="Password"
                        placeHolder="Password"
                        _isSecure={isShowPassword}
                        toGetTextFieldValue={onChangePassword}
                        rightAccessory={passwordHideIcon}
                        _errorText={passwordErrorMessage}
                        required={true}
                    />
                    <HButton
                        isLoading={isLoading}
                        onPress={onPressLogin}
                        textType={"S16"}
                        color={
                            isLoginDisabled
                                ? Colors[colorScheme]?.grayScale6
                                : Colors[colorScheme]?.white
                        }
                        title={"Login"}
                        containerStyle={[localStyles.btnStyle]}
                        bgColor={
                            isLoginDisabled
                                ? Colors[colorScheme]?.grayScale5
                                : Colors[colorScheme]?.primary
                        }
                    ></HButton>
                </View>
            </HKeyBoardAvoidWrapper>
            <View style={localStyles.haventAccountContainer}>
                <HText
                    align={"center"}
                    color={Colors[colorScheme]?.grayScale6}
                    type="M14"
                >
                    Haven’t an account?
                </HText>
                <TouchableOpacity onPress={onPressRegister} >
                    <HText
                        align={"center"}
                        style={styles.ml5}
                        color={Colors[colorScheme]?.primary}
                        type="M14"
                    >
                        Register
                    </HText>
                </TouchableOpacity>
            </View>
        </HSafeAreaView>
    );
};

export default login;

const localStyles = StyleSheet.create({
    inputContainer: {
        ...styles.mt10,
    },
    btnStyle: {
        ...styles.mt30,
    },
    haventAccountContainer: {
        ...styles.rowCenter,
        ...styles.mb20,
    },
});
