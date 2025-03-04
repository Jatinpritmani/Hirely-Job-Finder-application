import { StyleSheet, View } from 'react-native'
import React from 'react'
import HText from './HText'
import { styles } from '../../themes'

const EmptyListComponent = ({ title }) => {
    return (
        <View style={[styles.flex, styles.center]}>
            <HText type="M14">{title}</HText>
        </View>
    )
}

export default EmptyListComponent

const localStyles = StyleSheet.create({})