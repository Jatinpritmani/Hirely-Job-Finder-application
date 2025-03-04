import { StyleSheet, TouchableOpacity, useColorScheme, View } from "react-native";

// local imports
import { styles } from "../../themes";
import HText from "../common/HText";
import { Colors } from '@/constants/Colors';
import { TrashIcon } from "../../assets/svgs";
import { moderateScale } from "../../constants/constants";


const ExperienceCard = ({ item, index, experience, setExperience, isShowDelete = true, cardStyle }) => {
    const colorScheme = useColorScheme();
    const onPressDeleteExperience = () => {
        setExperience(exp =>
            exp.filter((item, indexe) => indexe !== index)
        );

    }
    return (
        <View style={[localStyles.card, { backgroundColor: Colors[colorScheme]?.white, borderColor: Colors[colorScheme]?.borderColor }, cardStyle]}>
            <View style={styles.rowSpaceBetween}>
                <HText type="S14">
                    {item?.job_role}
                </HText>
                <HText type="M12">
                    {item?.location}
                </HText>
            </View>
            <View style={styles.rowSpaceBetween}>
                <HText type="R12" style={{ opacity: 0.5 }}>
                    {item?.company_name || 'Google'}
                </HText>
                <HText type="R12" color={Colors[colorScheme]?.grayScale7}>
                    {item?.experience_from} - {item?.experience_to}
                </HText>
            </View>
            {isShowDelete && <TouchableOpacity onPress={onPressDeleteExperience} style={[localStyles.crossIcon, { backgroundColor: Colors[colorScheme]?.borderColor2 }]}>
                <TrashIcon width={moderateScale(20)} height={moderateScale(20)} />
            </TouchableOpacity>}
        </View>
    )
}

export default ExperienceCard

const localStyles = StyleSheet.create({
    card: {
        ...styles.pv10,
        ...styles.ph20,
        ...styles.mt10,
        ...styles.mh20,
        borderRadius: moderateScale(10),
        borderWidth: moderateScale(1)
    },
    crossIcon: {
        position: 'absolute',
        right: -moderateScale(7),
        top: -moderateScale(7),
        padding: moderateScale(3),
        borderRadius: moderateScale(10)
    }
});