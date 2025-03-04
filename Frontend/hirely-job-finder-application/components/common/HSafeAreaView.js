import { SafeAreaView, StyleSheet, useColorScheme, View } from 'react-native';
import React from 'react';
import { styles } from '../../themes';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/Colors';


const HSafeAreaView = ({ children, ...props }) => {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();


  return (
    <SafeAreaView {...props} style={[localStyles(colorScheme, insets, props.style).root]}>
      <View style={[localStyles(colorScheme, insets, props.style).container, props.containerStyle]}>

        {children}
      </View>
    </SafeAreaView>
  );
};

const localStyles = (colorScheme, insets, style) =>
  StyleSheet.create({
    root: {
      ...styles.flex,
      backgroundColor: Colors[colorScheme]?.background,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      ...style,
    },
    container: {
      ...styles.ph25,
      ...styles.flex,

    }
  });
export default HSafeAreaView