import {
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";
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
import { moderateScale } from "../constants/constants";
import { Colors } from "@/constants/Colors";
import { isTruthyString, isValidEmail } from "../utils/validator";
import { USER_LOGIN } from "../components/apiConstants";
import apiRequest from "../components/api";
import { getUserDetail } from "../context/actions/userActions";
import AsyncStorage from "@react-native-async-storage/async-storage";

const login = () => {
    const colorScheme = useColorScheme();
    const dispatch = useDispatch()
    const [email, setEmail] = useState("darsil.pansuriya@gmail.com");
    const [password, setPassword] = useState("dp7685..");
    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");
    const [isShowPassword, setIsShowPassword] = useState(true);
    const [isLoginDisabled, setIsLoginDisabled] = useState(true);
    const [emailErrorMessage, setEmailErrorMessage] = useState("");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false)

    const currentUserType = useSelector(state => state.commonReducer.current_user_type)
    const currentUserDetail = useSelector(state => state.userReducer)

    const isUserLoggedIn = useSelector(state => state.userReducer.isUserLoggedIn)

    useEffect(() => {
        if (email?.length > 0 && password?.length > 0 && isValidEmail(email)) {
            setIsLoginDisabled(false);
        } else {
            setIsLoginDisabled(true);
        }
    }, [email, password]);

    useEffect(() => {

        if (isUserLoggedIn) {
            // router.replace('/(tabs)')
            router.push('/(tabs)')
            // router.setParams({ screen: "(tabs)" });
        }
    }, [isUserLoggedIn])



    const onChangeEmail = (text) => {
        setEmail(text);
        if (!isValidEmail(text)) {
            let message =
                !text?.length > 0
                    ? "*Please Enter a E-Mail."
                    : "Please Enter a valid E-Mail.";
            setEmailErrorMessage(message);
        } else {
            setEmailErrorMessage("");
        }
    };
    const onChangePassword = (text) => {
        setPassword(text);
        if (!text.length > 0) {
            setPasswordErrorMessage("*Please Enter a Password");
        } else {
            setPasswordErrorMessage("");
        }
    };
    const onPressRegister = () => {
        router.push('start')
    }



    const passwordHideIcon = () => {
        return (
            <TouchableOpacity onPress={() => setIsShowPassword(!isShowPassword)}>
                {!isShowPassword ? <EyeIconDark /> : <EyeIconLight />}
            </TouchableOpacity>
        );
    };

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
        }
        else {
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
    const onPressForgotPassword = () => {
        if (email?.length > 0 && isValidEmail(email)) {

            router.push({
                pathname: 'forgotPassword',
                params: {
                    mail: email
                }
            })
        } else if (email?.length == 0) {
            setEmailErrorMessage('*Please Enter a E-Mail.')
        }
        else if (!isValidEmail(email)) {
            setEmailErrorMessage('Please Enter a valid E-Mail.')
        }
    };

    return (
        <HSafeAreaView style={localStyles.main}>
            <AuthHeader
                title="Welcome Back"
                description={currentUserType == 'job_seeker' ? "Let’s Login. Apply to jobs!" : "Let’s Login. Start hiring top talent today!"}
            />
            <View style={localStyles.innerContainer}>
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

                    {/* <TouchableOpacity onPress={onPressForgotPassword} style={localStyles.forgotPasswordBtnStyle}>
                        <HText
                            align={"right"}
                            color={Colors[colorScheme]?.grayScale4}
                            type="M14"
                        >
                            Forgot Password?
                        </HText>
                    </TouchableOpacity> */}

                    <HButton
                        // disabled={isLoginDisabled}
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
            </View>
        </HSafeAreaView>
    );
};

export default login;

const localStyles = StyleSheet.create({
    main: {
        // ...styles.ph20,
    },
    innerContainer: {
        ...styles.justifyBetween,
        ...styles.flex,
    },
    inputContainer: {
        ...styles.mt10,
    },
    forgotPasswordBtnStyle: {
        marginTop: moderateScale(12),
        ...styles.selfEnd,
    },
    btnStyle: {
        ...styles.mt30,
    },
    haventAccountContainer: {
        ...styles.rowCenter,
        ...styles.mb20,
    },
});
