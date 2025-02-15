// library import
import React from 'react';
import { View, StyleSheet, ActivityIndicator, useColorScheme } from 'react-native';

// local imports
import { styles } from '../../themes';
import { Colors } from '@/constants/Colors';


const HLoader = () => {
  const colorScheme = useColorScheme();

  return (
    <View style={localStyles.vwMainStyle}>
      <ActivityIndicator size="large" color={Colors[colorScheme]?.primary} />
    </View>
  );
};

const localStyles = StyleSheet.create({
  vwMainStyle: {
    ...styles.flex,
    ...styles.center,
  },
});

export default React.memo(HLoader);
