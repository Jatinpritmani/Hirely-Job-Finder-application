//Library Imports
import React from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';

//Local Imports
import { styles } from '../../themes';
import HText from './HText';

import { moderateScale } from '@/constants/constants';
import { Colors } from '@/constants/Colors';


export default function HButton({
  title,
  textType,
  color,
  onPress,
  containerStyle,
  style,
  icon = null,
  frontIcon = null,
  children,
  bgColor = null,
  isLoading = false,
  ...props
}) {
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity
      style={[
        localStyle.btnContainer,
        styles.rowCenter,
        containerStyle,
        bgColor
          ? { backgroundColor: bgColor }
          : { backgroundColor: Colors[colorScheme]?.primary },
      ]}
      disabled={isLoading}
      onPress={onPress}
      {...props}>
      {/* If Icon Added In Button Front Side */}
      {frontIcon}
      {isLoading && (
        <ActivityIndicator
          size="large"
          color={Colors[colorScheme]?.white}
          style={{ marginRight: moderateScale(20), }}
        />
      )}
      {/* Text In Button */}
      <HText type={textType ? textType : 'S16'} style={style} color={color ? color : Colors[colorScheme]?.white}>
        {title}
      </HText>
      {/* If Icon Added In Button Back Side */}
      {icon}
      {children}
    </TouchableOpacity>
  );
}

const localStyle = StyleSheet.create({
  btnContainer: {
    height: moderateScale(56),
    borderRadius: moderateScale(12),
  },
});
