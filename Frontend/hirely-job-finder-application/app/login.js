import {
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router } from 'expo-router'

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
import { isValidEmail } from "../utils/validator";

const login = () => {
    const colorScheme = useColorScheme();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isShowPassword, setIsShowPassword] = useState(true);
    const [isLoginDisabled, setIsLoginDisabled] = useState(true);
    const [emailErrorMessage, setEmailErrorMessage] = useState("");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

    useEffect(() => {
        if (email?.length > 0 && password?.length > 0 && isValidEmail(email)) {
            setIsLoginDisabled(false);
        } else {
            setIsLoginDisabled(true);
        }
    }, [email, password]);

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
        router.push('register')
    }



    const passwordHideIcon = () => {
        return (
            <TouchableOpacity onPress={() => setIsShowPassword(!isShowPassword)}>
                {!isShowPassword ? <EyeIconDark /> : <EyeIconLight />}
            </TouchableOpacity>
        );
    };

    const onPressLogin = () => { };
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
                description={"Let’s log in. Apply to jobs!"}
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

                    <TouchableOpacity onPress={onPressForgotPassword} style={localStyles.forgotPasswordBtnStyle}>
                        <HText
                            align={"right"}
                            color={Colors[colorScheme]?.grayScale4}
                            type="M14"
                        >
                            Forgot Password?
                        </HText>
                    </TouchableOpacity>

                    <HButton
                        disabled={isLoginDisabled}
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
        ...styles.ph20,
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
