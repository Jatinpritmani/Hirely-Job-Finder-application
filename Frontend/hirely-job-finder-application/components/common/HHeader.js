//library imports
import { StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import React from 'react';
import { router } from 'expo-router'

// local imports
import { styles } from '../../themes';
import HText from './HText';
import { moderateScale } from '../../constants/constants';
import { ArrowLeft, NotificationIcon } from '../../assets/svgs';
import { Colors } from '@/constants/Colors'




export default function HHeader(props) {
  const { title, onPressBack, rightIcon, isHideBack, isLeftIcon, containerStyle, titleType = 'B16', titleColor = Colors[colorsScheme]?.headerColor } = props;

  const goBack = () => { router.back() };
  const colorsScheme = useColorScheme()
  return (
    <View style={[localStyles.container, containerStyle]}>
      <View style={styles.rowCenter}>
        {!isHideBack && (
          <TouchableOpacity style={[localStyles.backBtnStyle, { borderColor: Colors[colorsScheme]?.borderColor2 }]} onPress={onPressBack || goBack}>
            <ArrowLeft />
          </TouchableOpacity>
        )}

        {!!isLeftIcon &&
          <View style={localStyles.leftIconStyle}>

            {isLeftIcon}
          </View>
        }

        <HText
          color={titleColor}
          numberOfLines={1}
          align={'center'}
          style={[localStyles.titleText]}
          type={titleType}>
          {title}
        </HText>

        <View style={localStyles.rightContainer}>
          {!!rightIcon && rightIcon}

        </View>

      </View>


    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    ...styles.mt25,

  },
  backBtnStyle: {
    position: 'absolute',
    width: moderateScale(42),
    height: moderateScale(42),
    ...styles.center,
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(21),
    left: 0
  },
  leftIconStyle: {
    left: 0,
    position: 'absolute',
  },
  rightContainer: {
    position: 'absolute',
    right: 0
  },
  titleText: {
    // marginLeft: moderateScale(54)
  },
});
