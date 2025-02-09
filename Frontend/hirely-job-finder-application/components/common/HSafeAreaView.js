import { SafeAreaView, StyleSheet, useColorScheme, View } from 'react-native';
import React from 'react';
import { styles } from '../../themes';

import { Colors } from '@/constants/Colors';


const HSafeAreaView = ({ children, ...props }) => {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView {...props} style={[localStyles(colorScheme, props.style).root]}>
      <View style={[localStyles(colorScheme, props.style).container, props.containerStyle]}>

        {children}
      </View>
    </SafeAreaView>
  );
};

const localStyles = (colorScheme, style) =>
  StyleSheet.create({
    root: {
      ...styles.flex,
      backgroundColor: Colors[colorScheme]?.background,
      ...style,
    },
    container: {
      ...styles.ph25,
      ...styles.flex,

    }
  });
export default HSafeAreaView