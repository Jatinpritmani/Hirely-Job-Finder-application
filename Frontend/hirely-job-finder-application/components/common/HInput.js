// library import
import React from 'react';
import { StyleSheet, View, TextInput, useColorScheme } from 'react-native';

// local imports
import { getHeight, moderateScale } from '../../constants/constants';
import { styles } from '../../themes';
import typography from '../../themes/typography';
import HText from './HText';
import { Colors } from '@/constants/Colors';

export default HInput = props => {
  let {
    _value,
    label,
    inputContainerStyle,
    inputBoxStyle,
    toGetTextFieldValue,
    placeHolder,
    keyBoardType,
    _onFocus,
    _onBlur,
    _errorText,
    _autoFocus,
    _isSecure,
    _maxLength,
    _editable = true,
    autoCapitalize,
    required = false,
    labelStyle,
    multiline,
    errorStyle,
    fieldRef,
    showError = true,
    rightAccessory,
  } = props;

  const colorScheme = useColorScheme();

  // Change Text Input Value
  const onChangeText = val => {
    toGetTextFieldValue(val);
  };


  return (
    <View >
      {label && (
        <View style={[localStyle.labelContainer, labelStyle]}>
          <View style={styles.flexRow}>
            <HText style={localStyle.labelText} type={'S14'}>
              {label}
            </HText>
            {required && <HText type={'S14'} style={{ color: Colors[colorScheme]?.danger }}>{' *'}</HText>}
          </View>
        </View>
      )}
      <View
        style={[
          localStyle.inputContainer,
          {
            borderColor: _errorText ? Colors[colorScheme]?.danger : Colors[colorScheme]?.grayScale2,
            height: multiline ? getHeight(136) : getHeight(52),
          },
          inputContainerStyle,
        ]}>
        <TextInput
          ref={fieldRef}
          secureTextEntry={_isSecure}
          value={_value}
          maxLength={_maxLength}
          defaultValue={_value}
          autoFocus={_autoFocus}
          autoCorrect={false}
          autoCapitalize={autoCapitalize}
          placeholderTextColor={Colors[colorScheme]?.grayScale2}
          onChangeText={onChangeText}
          keyboardType={keyBoardType}
          multiline={multiline}
          editable={_editable}
          onFocus={_onFocus}
          onBlur={_onBlur}
          placeholder={placeHolder}
          style={[
            localStyle.inputBox,
            { color: Colors[colorScheme]?.headerColor },
            { height: multiline ? getHeight(136) : getHeight(50) },
            inputBoxStyle,
            _editable == false && { color: Colors[colorScheme]?.grayScale2 },
          ]}
          {...props}
        />
        {/* Right Icon And Content Inside TextInput */}
        <View style={[styles.mr15]}>
          {rightAccessory ? rightAccessory() : null}
        </View>
      </View>
      {/* Error Text Message Of Input */}
      {!!_errorText?.length ? (
        <HText
          type={'r12'}
          style={{
            ...localStyle.errorText,
            ...errorStyle,
            color: Colors[colorScheme]?.danger,
          }}>
          {_errorText}
        </HText>
      ) : null}

      {_maxLength && showError && _value?.length > _maxLength ? (
        <HText style={{ ...localStyle.errorText, ...errorStyle }}>
          It should be maximum {_maxLength} character
        </HText>
      ) : null}
    </View>
  );
};

const localStyle = StyleSheet.create({
  labelText: {
    textAlign: 'left',
  },
  inputBox: {
    ...typography.fontSizes.f14,
    ...typography.fontWeights.Medium,
    ...styles.ph10,
    ...styles.flex,
  },
  inputContainer: {
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(12),
    ...styles.rowSpaceBetween,
    width: '100%',
  },
  labelContainer: {
    ...styles.mt15,
    ...styles.rowSpaceBetween,
    marginBottom: moderateScale(8)
  },
  errorText: {
    textAlign: 'left',
    ...styles.mt5,
    ...styles.ml10,
  },
});
