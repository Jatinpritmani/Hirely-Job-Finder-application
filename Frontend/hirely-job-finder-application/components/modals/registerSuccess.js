// Library import
import { StyleSheet, useColorScheme, View } from 'react-native';
import React from 'react';
import ActionSheet from 'react-native-actions-sheet';
import { styles } from '../../themes';

// Local import
import { Colors } from '@/constants/Colors';
import { RegisterSuccessIcon } from '../../assets/svgs';
import { moderateScale } from '../../constants/constants';
import HText from '../common/HText';
import HButton from '../common/HButton';
import { router } from 'expo-router';


export default function RegisterSuccess({ SheetRef }) {
    const colorScheme = useColorScheme()

    const onPressLogin = () => {
        SheetRef?.current?.hide()
        router.replace('login')

    };
    const onPressReturnToHomePage = () => {
        SheetRef?.current?.hide()
        router.replace('start')
    };

    return (
        <ActionSheet
            closeOnPressBack={false}
            closeOnTouchBackdrop={false}
            closable={false}
            onTouchBackdrop={() => { }}
            ref={SheetRef}
            containerStyle={[
                localStyles.actionSheetContainer,
                { backgroundColor: Colors[colorScheme]?.white },
            ]}>
            <View style={[styles.selfCenter, styles.mt40]}>

                <RegisterSuccessIcon />
            </View>
            <HText align={'center'} type="B18" color={Colors[colorScheme]?.headerColor} style={styles.mt25}>
                Registration Success
            </HText>
            <HText align={'center'} type="R12" color={Colors[colorScheme]?.grayScale7} style={styles.mt10}>
                Congratulation! Your registration is successful. We have send you an email to verify your account.
            </HText>
            <HButton
                onPress={onPressLogin}
                textType={"S16"}
                color={Colors[colorScheme]?.white}
                title={"Login"}
                containerStyle={[localStyles.btnStyle, styles.mt45]}
                bgColor={Colors[colorScheme]?.primary}
            ></HButton>

        </ActionSheet>
    );
}

const localStyles = StyleSheet.create({
    actionSheetContainer: {
        ...styles.p20,
        height: '60%',
        borderTopLeftRadius: moderateScale(32),
        borderTopRightRadius: moderateScale(32),
    },
    btnStyle: {
        ...styles.mt15,
    },
});
