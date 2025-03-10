import { StyleSheet } from 'react-native';

import flex from './flex';
import margin from './margin';
import { getHeight, moderateScale } from '../constants/constants';

// App Common Styles
export default StyleSheet.create({
  mainContainer: {
    ...flex.flex,
  },
  innerContainer: {
    paddingHorizontal: moderateScale(20),
    ...margin.mt20,
  },
  generalTitleText: {
    fontSize: moderateScale(24),
  },
  underLineText: {
    textDecorationLine: 'underline',
  },
  horizontalLine: {
    height: getHeight(10),
    width: '100%',
  },
  shadowStyle: {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  capitalizeTextStyle: {
    textTransform: 'capitalize',
  },
});
