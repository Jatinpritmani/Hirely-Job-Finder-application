// library import
import { StyleSheet, useColorScheme, View } from 'react-native'
import React from 'react'
import moment from 'moment';


// local import 
import HText from '../common/HText';
import { Colors } from '@/constants/Colors';
import { CheckMark, CheckMarkGray, OfferLetter, OfferLetterBlue, RejectIcon, UnCheckedMark } from '../../assets/svgs';
import { visibleStatus, getHeight, moderateScale } from '../../constants/constants';
import { styles } from '../../themes';



const StatusHistory = ({ item, index, statushistoryList }) => {
    const colorScheme = useColorScheme();

    let isCompleted = statushistoryList?.some(itm => itm.status == item?.status)

    let halfCompleted = false
    if (item.status == 'screening_interview') {
        halfCompleted = statushistoryList?.some(itm => itm.status == 'screening_interview')
        if (statushistoryList?.some(itm => itm.status == 'screening_interview_success')) {
            halfCompleted = false
            isCompleted = true
        }
    }
    if (item.status == 'final_interview') {
        halfCompleted = statushistoryList?.some(itm => itm.status == 'final_interview')
        if (statushistoryList?.some(itm => itm.status == 'final_interview_success')) {
            halfCompleted = false
            isCompleted = true
        }
    }
    console.log(statushistoryList?.some(itm => itm.status == 'rejected'), statushistoryList, item.status, `statushistoryList?.some(itm => itm.status != 'rejected')`);

    if (!statushistoryList?.find(itm => itm.status == 'rejected') && item.status == 'rejected') {
        return null
    }
    console.log('====================================');
    console.log(item, isCompleted, statushistoryList?.find(itm => itm.status == item?.status));
    console.log('====================================');
    let currentStatus = statushistoryList?.find(itm => itm.status == item?.status)

    return (
        <View style={localStyles.main}>
            <View>
                {halfCompleted ? <CheckMarkGray width={moderateScale(20)} height={moderateScale(20)} /> : isCompleted ? item?.status == 'offer_letter' ? <OfferLetterBlue width={moderateScale(20)} height={moderateScale(20)} /> : item?.status == 'rejected' ? <RejectIcon width={moderateScale(20)} height={moderateScale(20)} /> : <CheckMark width={moderateScale(20)} height={moderateScale(20)} /> : <UnCheckedMark width={moderateScale(20)} height={moderateScale(20)} />}
                {index != visibleStatus?.length - 1 && <View style={[localStyles.path, { backgroundColor: isCompleted ? item?.status == 'rejected' ? Colors[colorScheme]?.red280 : Colors[colorScheme]?.primary : Colors[colorScheme]?.grayScale2 }]}>
                </View>}
            </View>
            <View>
                <HText type="M14">{item?.label}</HText>
                {currentStatus ? <HText type="R12" color={Colors[colorScheme]?.grayScale6}>{moment(currentStatus?.updated_at).local().format("DD/MM/YY hh:mm A")}</HText> : null}
            </View>
        </View>
    )
}

export default StatusHistory

const localStyles = StyleSheet.create({
    main: {
        ...styles.flexRow,
        gap: moderateScale(24),
    },
    path: {
        height: getHeight(45),
        width: moderateScale(2),
        ...styles.selfCenter
    }
})