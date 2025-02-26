import {
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";

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
import { isTruthyString, isValidEmail } from "../utils/validator";
import { router } from "expo-router";
import { useSelector } from "react-redux";
import RegisterSuccess from "../components/modals/registerSuccess";
import { USER_REGISTER } from "../components/apiConstants";
import HKeyBoardAvoidWrapper from "../components/common/HKeyBoardAvoidWrapper";
import apiRequest from "../components/api";

const Register = () => {
    const registerSuccessSheetRef = useRef(null)

    const colorScheme = useColorScheme();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [companyName, setCompanyName] = useState("")
    const [isShowPassword, setIsShowPassword] = useState(true);
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(true);
    const [isNextDisabled, setIsNextDisabled] = useState(true);
    const [fullNameErrorMessage, setFullNameErrorMessage] = useState("");
    const [emailErrorMessage, setEmailErrorMessage] = useState("");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] =
        useState("");
    const [companyNameErrorMessage, setCompanyNameErrorMessage] = useState("")

    const [termsConditionChecked, setTermsConditionChecked] =
        useState(false);

    const currentUserType = useSelector(state => state.commonReducer.current_user_type)


    const onChangeFullName = (text) => {
        setFullName(text);
        if (!text.length > 0) {
            setFullNameErrorMessage("*Please Enter a Full Name");
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
    const onChangeCompanyName = (text) => {
        setCompanyName(text);
        if (!text.length > 0) {
            setCompanyNameErrorMessage("*Please Enter a Company Name");
        } else {
            setCompanyNameErrorMessage("");
        }
    };

    useEffect(() => {

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

    const onPressNext = async () => {
        if (!isTruthyString(fullName)) {
            setFullNameErrorMessage("*Please Enter a Full Name");

        }
        if (!isTruthyString(email)) {
            setEmailErrorMessage("*Please Enter E-Mail Address.");

        }
        if (!isValidEmail(email)) {
            setEmailErrorMessage("Please Enter a valid E-Mail.");
        }
        if (!isTruthyString(password)) {
            setPasswordErrorMessage("*Please Enter a Password");

        }
        if (!isTruthyString(confirmPassword)) {
            setConfirmPasswordErrorMessage("*Please Enter a Confirm Password");

        }
        if (confirmPassword?.length > 0 && password?.length > 0) {
            if (confirmPassword && password && confirmPassword != password) {
                setPasswordErrorMessage(`Password and Confirm Password dosen't match`)
                setConfirmPasswordErrorMessage(`Password and Confirm Password dosen't match`)
            } else {
                setPasswordErrorMessage(``)
                setConfirmPasswordErrorMessage(``)
            }
        }
        if (currentUserType == 'recruiter' && !isTruthyString(companyName)) {
            setCompanyNameErrorMessage("*Please Enter a Company Name");

        }
        if (!termsConditionChecked || !isTruthyString(fullName) || !isValidEmail(email) || !isTruthyString(email) || !isTruthyString(password) || !isTruthyString(confirmPassword) || (currentUserType === 'recruiter' && !isTruthyString(companyName))) {
            return
        }
        else {
            let userdetail = {
                user_email: email,
                user_password: password,
                user_name: fullName,
                user_type: currentUserType
            }
            if (currentUserType == 'job_seeker') {
                // route to complete profile if usertype is job_seeker
                router.push({
                    pathname: "/submitProfileDetail",
                    params: { userDetail: JSON.stringify(userdetail) },
                })
            }
            if (currentUserType == 'recruiter') {

                // APi call for user register with recruiter type
                try {
                    let response = await apiRequest("POST", USER_REGISTER, userdetail);
                    if (response?.code == 'HJFA_MS_OK_200' && !response?.error_status) {
                        registerSuccessSheetRef?.current?.show()

                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            }
        }

    };
    const onPressLogin = () => { router.push('login') };


    return (
        <HSafeAreaView style={localStyles.main}>
            <AuthHeader
                title="Registration"
                description={currentUserType == 'job_seeker' ? "Let’s Register. Apply to jobs!" : "Let’s Register. Start hiring top talent today!"}
            />
            <HKeyBoardAvoidWrapper containerStyle={[localStyles.inputContainer, styles.flexGrow1]} >
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
                {currentUserType == 'recruiter' &&
                    <HInput
                        _value={companyName}
                        label="Company Name"
                        placeHolder="Company Name"
                        toGetTextFieldValue={onChangeCompanyName}
                        _errorText={companyNameErrorMessage}
                        required={true}
                    />}

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
                    title={currentUserType == 'job_seeker' ? "Next" : "Register"}
                    containerStyle={[localStyles.btnStyle]}
                    bgColor={
                        isNextDisabled
                            ? Colors[colorScheme]?.grayScale5
                            : Colors[colorScheme]?.primary
                    }
                ></HButton>
            </HKeyBoardAvoidWrapper>
            <View style={localStyles.haventAccountContainer}>
                <HText
                    align={"center"}
                    color={Colors[colorScheme]?.grayScale6}
                    type="M14"
                >
                    Haven’t an account?
                </HText>
                <TouchableOpacity onPress={onPressLogin} >
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
            <RegisterSuccess SheetRef={registerSuccessSheetRef} />

        </HSafeAreaView>
    );
};

export default Register;

const localStyles = StyleSheet.create({
    main: {
        ...styles.ph20,
    },
    inputContainer: {
        ...styles.mt10,
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
});
