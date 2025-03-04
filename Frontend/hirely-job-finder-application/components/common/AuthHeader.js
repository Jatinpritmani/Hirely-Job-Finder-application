import { StyleSheet, useColorScheme, View } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'

// local import 
import HText from '../common/HText'
import { styles } from '../../themes'

const AuthHeader = ({ title, description, style }) => {
    const colorScheme = useColorScheme()
    return (
        <View style={[localStyles.main, style]}>
            <HText type="S24" color={Colors[colorScheme]?.headerColor}>{title}</HText>
            <HText type="R14" color={Colors[colorScheme]?.headerColor} style={[styles.mt10, { opacity: 0.4 }]}>{description}</HText>
        </View>
    )
}

export default AuthHeader

const localStyles = StyleSheet.create({
    main: {
        ...styles.mt50,
    }
})