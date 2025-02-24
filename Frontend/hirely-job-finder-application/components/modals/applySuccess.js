// Library import
import { Image, StyleSheet, useColorScheme, View } from 'react-native';
import React, { memo, useState } from 'react';
import ActionSheet from 'react-native-actions-sheet';
import { styles } from '../../themes';

// Local import
import { Colors } from '@/constants/Colors';
import { ApplySuccessIcon } from '../../assets/svgs';
import { moderateScale } from '../../constants/constants';
import HText from '../common/HText';
import HButton from '../common/HButton';
import { router } from 'expo-router';


export default function ApplySuccess({ SheetRef }) {
    const colorScheme = useColorScheme()

    const onPressTeackJobs = () => {
        SheetRef?.current?.hide()
        router.replace('appliedJobs')
        // router.push({
        //     pathname: "/trackJob",
        //     params: { jobDetail: JSON.stringify(item) }, // Pass parameters
        // })

    };
    const onPressBrowseJobs = () => {
        SheetRef?.current?.hide()
        router.replace('(tabs)')
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

                <ApplySuccessIcon />
            </View>
            <HText align={'center'} type="B18" color={Colors[colorScheme]?.headerColor} style={styles.mt25}>
                Applied Successfully
            </HText>
            <HText align={'center'} type="R12" color={Colors[colorScheme]?.grayScale7} style={styles.mt10}>
                You have successfully applied for a job.
            </HText>
            <HButton
                onPress={onPressTeackJobs}
                textType={"S16"}
                color={Colors[colorScheme]?.white}
                title={"Track Job"}
                containerStyle={[localStyles.btnStyle, styles.mt45]}
                bgColor={Colors[colorScheme]?.primary}
            ></HButton>
            <HButton
                onPress={onPressBrowseJobs}
                textType={"S16"}
                color={Colors[colorScheme]?.primary}
                title={"Browse Jobs"}
                containerStyle={[localStyles.btnStyle, { borderWidth: moderateScale(1), borderColor: Colors[colorScheme]?.primary }]}
                bgColor={Colors[colorScheme]?.white}
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
