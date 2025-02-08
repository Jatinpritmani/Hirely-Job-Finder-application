import { SafeAreaView, StyleSheet, useColorScheme } from 'react-native';
import React from 'react';
import { styles } from '../../themes';

import { Colors } from '@/constants/Colors';


const HSafeAreaView = ({ children, ...props }) => {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView {...props} style={[localStyles(colorScheme, props.style).root]}>
      {children}
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
  });
export default HSafeAreaView