//library imports
import { StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import React from 'react';
import { router } from 'expo-router'

// local imports
import { styles } from '../../themes';
import HText from './HText';
import { moderateScale } from '../../constants/constants';
import { ArrowLeft } from '../../assets/svgs';
import { Colors } from '@/constants/Colors'


export default function HHeader(props) {
  const { title, onPressBack, rightIcon, isHideBack, isLeftIcon } = props;

  const goBack = () => { router.back() };
  const colorsScheme = useColorScheme()
  return (
    <View style={[localStyles.container]}>
      <View style={styles.rowCenter}>
        {!isHideBack && (
          <TouchableOpacity style={[localStyles.backBtnStyle, { borderColor: Colors[colorsScheme]?.borderColor2 }]} onPress={onPressBack || goBack}>
            <ArrowLeft />
          </TouchableOpacity>
        )}
        {!!isLeftIcon && isLeftIcon}

        <HText
          color={Colors[colorsScheme]?.headerColor}
          numberOfLines={1}
          align={'center'}
          style={[localStyles.titleText]}
          type={'B16'}>
          {title}
        </HText>

      </View>

      {!!rightIcon && rightIcon}
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    ...styles.mt25,
    ...styles.rowSpaceBetween,

  },
  backBtnStyle: {
    width: moderateScale(42),
    height: moderateScale(42),
    ...styles.center,
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(21),
  },
  titleText: {
    marginLeft: moderateScale(54)
  },
});
