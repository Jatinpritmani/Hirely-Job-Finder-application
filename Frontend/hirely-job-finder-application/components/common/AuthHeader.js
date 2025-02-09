import { StyleSheet, Text, useColorScheme, View } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'

// local import 
import HText from '../common/HText'
import { moderateScale } from '../../constants/constants'
import { styles } from '../../themes'

const AuthHeader = ({ title, description }) => {
    const colorScheme = useColorScheme()
    return (
        <View style={localStyles.main}>
            <HText type="S24" color={Colors[colorScheme]?.headerColor}>{title}</HText>
            <HText type="R14" color={Colors[colorScheme]?.headerColor} style={{ opacity: 0.4 }}>{description}</HText>
        </View>
    )
}

export default AuthHeader

const localStyles = StyleSheet.create({
    main: {
        ...styles.mt50,
    }
})