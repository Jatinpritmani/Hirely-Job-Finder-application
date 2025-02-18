import { StyleSheet, TouchableOpacity, useColorScheme, View } from "react-native";
import { useSelector } from "react-redux";
import { router } from "expo-router";

// local imports
import { styles } from "../../themes";
import HText from "../common/HText";
import { Colors } from '@/constants/Colors';
import { getJobTypeLabel, getLocationLabel, isUserRecruiter, moderateScale } from "../../constants/constants";


const JobCard = ({ item, index, cardStyle, isSavedCard = false }) => {
    const colorScheme = useColorScheme();

    const currentUserDetail = useSelector(state => state.userReducer.currentUserDetail)

    const onPressJob = () => {
        if (isUserRecruiter(currentUserDetail?.user_type)) {
            router.push({
                pathname: "/recruiterJobDetail",
                params: { jobDetail: JSON.stringify(item) }, // Pass parameters
            })
        } else {
            router.push({
                pathname: "/jobDetail",
                params: { jobDetail: JSON.stringify(item) }, // Pass parameters
            })
        }

    }
    return (
        <TouchableOpacity onPress={onPressJob} style={[localStyles.card, { backgroundColor: Colors[colorScheme]?.white }, cardStyle]}>
            <View style={styles.rowCenter} >
                <View style={[localStyles.emptyView, { bordeColor: Colors[colorScheme]?.grayScale4, opacity: 0.3 }]}></View>
                <View style={[styles.flex, styles.ml15]}>
                    <View style={styles.rowSpaceBetween}>
                        <HText type="S14">
                            {item?.position}
                        </HText>
                        <HText type="M12">
                            {item?.salary ? `$${item?.salary}/y` : ''}
                        </HText>
                    </View>
                    <View style={styles.rowSpaceBetween}>
                        <HText type="R12" style={{ opacity: 0.5, ...styles.mt5 }}>
                            {isUserRecruiter(currentUserDetail?.user_type) ? item?.number_of_opening + ' positions' : item?.company_name || ''}
                        </HText>
                        <HText type="R12" color={Colors[colorScheme]?.grayScale7}>
                            {getLocationLabel(item?.location) || ''}
                        </HText>
                    </View>
                </View>

            </View>
            {isSavedCard &&
                <View style={[styles.rowSpaceBetween, styles.mt30]}>
                    <View style={[styles.ph30, styles.pv5, { backgroundColor: Colors[colorScheme]?.grayScale9, borderRadius: moderateScale(52) }]}>

                        <HText type="M14" color={Colors[colorScheme]?.grayScale4}>
                            Open
                        </HText>
                    </View>
                    <HText type="M12" >
                        {getJobTypeLabel(item?.job_type)}
                    </HText>
                </View>
            }
        </TouchableOpacity>
    )
}

export default JobCard

const localStyles = StyleSheet.create({
    emptyView: {
        width: moderateScale(46),
        height: moderateScale(46),
        borderWidth: moderateScale(1),
        borderRadius: moderateScale(12),
    },
    card: {
        ...styles.pv15,
        ...styles.ph20,
        ...styles.mb20,
        borderRadius: moderateScale(12),

    },
});