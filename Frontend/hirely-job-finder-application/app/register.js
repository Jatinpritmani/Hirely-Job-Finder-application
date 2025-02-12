import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Toast from "react-native-toast-message";

// local imports
import HSafeAreaView from "../components/common/HSafeAreaView";
import { styles } from "../themes";
import AuthHeader from "../components/common/AuthHeader";
import { EyeIconDark, EyeIconLight, TickSquare, TickSquareChecked } from "../assets/svgs";
import HInput from "../components/common/HInput";
import HText from "../components/common/HText";
import HButton from "../components/common/HButton";
import { moderateScale } from "../constants/constants";
import { Colors } from "@/constants/Colors";
import { isValidEmail } from "../utils/validator";
import { router } from "expo-router";

const Register = () => {
    const colorScheme = useColorScheme();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isShowPassword, setIsShowPassword] = useState(true);
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(true);
    const [isNextDisabled, setIsNextDisabled] = useState(true);
    const [fullNameErrorMessage, setFullNameErrorMessage] = useState("");
    const [emailErrorMessage, setEmailErrorMessage] = useState("");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] =
        useState("");
    const [termsConditionChecked, setTermsConditionChecked] =
        useState(false);

    const onChangeFullName = (text) => {
        setFullName(text);
        if (!text.length > 0) {
            setFullNameErrorMessage("*Please Enter a Password");
        } else {
            setFullNameErrorMessage("");
        }
    };
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
    const onChangeConfirmPassword = (text) => {
        setConfirmPassword(text);
        if (!text.length > 0) {
            setConfirmPasswordErrorMessage("*Please Enter a Confirm Password");
        } else {
            setConfirmPasswordErrorMessage("");
        }
    };

    useEffect(() => {
        if (confirmPassword != password) {
            setPasswordErrorMessage(`Password and Confirm Password dosen't match`)
            setConfirmPasswordErrorMessage(`Password and Confirm Password dosen't match`)
        } else {
            setPasswordErrorMessage(``)
            setConfirmPasswordErrorMessage(``)
        }
        if (fullName?.length > 0 && email?.length > 0 && password?.length > 0 && isValidEmail(email) && confirmPassword?.length > 0 && confirmPassword == password) {
            setIsNextDisabled(false);
        } else {
            setIsNextDisabled(true);
        }
    }, [email, password, confirmPassword, fullName]);

    const passwordHideIcon = () => {
        return (
            <TouchableOpacity onPress={() => setIsShowPassword(!isShowPassword)}>
                {!isShowPassword ? <EyeIconDark /> : <EyeIconLight />}
            </TouchableOpacity>
        );
    };
    const confirmPasswordHideIcon = () => {
        return (
            <TouchableOpacity
                onPress={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
            >
                {!isShowConfirmPassword ? <EyeIconDark /> : <EyeIconLight />}
            </TouchableOpacity>
        );
    };

    const onPressNext = () => {
        router.push('submitProfileDetail')
    };
    const onPressLogin = () => { router.back() };


    return (
        <HSafeAreaView style={localStyles.main}>
            <AuthHeader
                title="Registration"
                description={"Let’s Register. Apply to jobs!"}
            />
            <View style={localStyles.innerContainer}>
                <ScrollView style={localStyles.inputContainer}>
                    <HInput
                        _value={fullName}
                        label="Full Name"
                        placeHolder="Full Name"
                        toGetTextFieldValue={onChangeFullName}
                        _errorText={fullNameErrorMessage}
                        required={true}
                    />
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
                    <HInput
                        _value={confirmPassword}
                        label="Confirm Password"
                        placeHolder="Confirm Password"
                        _isSecure={isShowConfirmPassword}
                        toGetTextFieldValue={onChangeConfirmPassword}
                        rightAccessory={confirmPasswordHideIcon}
                        _errorText={confirmPasswordErrorMessage}
                        required={true}
                    />

                    <TouchableOpacity onPress={() => setTermsConditionChecked(!termsConditionChecked)} style={localStyles.termsConditionBtnStyle}>
                        {termsConditionChecked ? <TickSquareChecked /> : <TickSquare />}
                        <HText
                            color={Colors[colorScheme]?.grayScale4}
                            type="R12"
                            style={styles.flex}
                        >
                            By creating an account, you agree to our
                            <HText
                                color={Colors[colorScheme]?.primary}
                                type="M12"
                            >
                                {' Terms '}
                            </HText> and
                            <HText
                                color={Colors[colorScheme]?.primary}
                                type="M12"
                            >
                                {' Conditions '}
                            </HText>
                        </HText>
                    </TouchableOpacity>

                    <HButton
                        // disabled={isNextDisabled}
                        onPress={onPressNext}
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
                </ScrollView>
                <View style={localStyles.haventAccountContainer}>
                    <HText
                        align={"center"}
                        color={Colors[colorScheme]?.grayScale6}
                        type="M14"
                    >
                        Haven’t an account?
                    </HText>
                    <TouchableOpacity onPress={onPressLogin} style={localStyles.registerBtnStyle}>
                        <HText
                            align={"center"}
                            style={styles.ml5}
                            color={Colors[colorScheme]?.primary}
                            type="M14"
                        >
                            Login
                        </HText>
                    </TouchableOpacity>
                </View>
            </View>
        </HSafeAreaView>
    );
};

export default Register;

const localStyles = StyleSheet.create({
    main: {
        ...styles.ph20,
    },
    innerContainer: {
        ...styles.justifyBetween,
        ...styles.flex,
    },
    inputContainer: {
        ...styles.mt30,
    },
    termsConditionBtnStyle: {
        marginTop: moderateScale(26),
        ...styles.rowSpaceAround,
        gap: moderateScale(16),
        ...styles.flex
    },
    btnStyle: {
        ...styles.mt30,
    },
    haventAccountContainer: {
        ...styles.rowCenter,
        ...styles.mb20,
    },
    registerBtnStyle: {},
});
