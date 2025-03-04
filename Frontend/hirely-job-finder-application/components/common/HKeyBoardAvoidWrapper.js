// Library Imports
import React from 'react';
import { KeyboardAvoidingView, ScrollView } from 'react-native';

// Local Imports
import { styles } from '../../themes';
import { checkPlatform, moderateScale } from '../../constants/constants';

// KeyboardAvoidWrapper Component
const HKeyBoardAvoidWrapper = ({
  children,
  containerStyle,
  contentContainerStyle,
}) => {
  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={
        checkPlatform() === 'ios' ? moderateScale(10) : null
      }
      style={[styles.flex, containerStyle]}
      behavior={checkPlatform() === 'ios' ? 'padding' : null}>
      <ScrollView
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={contentContainerStyle}>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default HKeyBoardAvoidWrapper
