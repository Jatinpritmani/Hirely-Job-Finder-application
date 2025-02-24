import { Image, StyleSheet, TouchableOpacity, useColorScheme, View } from "react-native";

// local imports
import { styles } from "../../themes";
import HText from "../common/HText";
import { Colors } from '@/constants/Colors';
import { getJobTypeLabel, getLocationLabel, moderateScale } from "../../constants/constants";
import { router } from "expo-router";
import images from "../../assets/images";


const AppliedJobCard = ({ item, index, cardStyle, }) => {
    const colorScheme = useColorScheme();

    const onPressJob = () => {
        router.push({
            pathname: "/trackJob",
            params: { jobDetail: JSON.stringify(item), index: index }, // Pass parameters
        })
    }
    return (
        <TouchableOpacity onPress={onPressJob} style={[localStyles.card, { backgroundColor: Colors[colorScheme]?.white }, cardStyle]}>
            <View style={styles.rowCenter} >
                <View style={[localStyles.emptyView,]}>
                    <Image
                        source={index % 2 == 0 ? images.fb : images.google}
                        style={localStyles.emptyView}
                    />
                </View>
                <View style={[styles.flex, styles.ml15]}>
                    <HText type="S14">
                        {item?.position}
                    </HText>

                    <HText type="R12" style={{ opacity: 0.5 }}>
                        {item?.company_name || 'Google'}
                    </HText>
                </View>
                <View style={[styles.ph30, styles.pv5, { backgroundColor: Colors[colorScheme]?.yellow2, borderRadius: moderateScale(52) }]}>

                    <HText type="M14" color={Colors[colorScheme]?.white}>
                        Track
                    </HText>
                </View>

            </View>

        </TouchableOpacity>
    )
}

export default AppliedJobCard

const localStyles = StyleSheet.create({
    emptyView: {
        width: moderateScale(46),
        height: moderateScale(46),
        borderRadius: moderateScale(12),
    },
    card: {
        ...styles.pv15,
        ...styles.ph20,
        ...styles.mb20,
        borderRadius: moderateScale(12),

    },
});