import { moderateScale } from "../constants/constants";

// App Font-Family:
const fontWeights = {
  Regular: {
    fontFamily: 'Poppins-Regular',
  },
  Medium: {
    fontFamily: 'Poppins-Medium',
  },
  SemiBold: {
    fontFamily: 'Poppins-SemiBold',
  },
  Bold: {
    fontFamily: 'Poppins-Bold',
  },
  Light: {
    fontFamily: 'Poppins-Light'
  }
};

// App font sizes:
const fontSizes = {
  f8: {
    fontSize: moderateScale(8),
  },
  f10: {
    fontSize: moderateScale(10),
  },
  f12: {
    fontSize: moderateScale(12),
  },
  f14: {
    fontSize: moderateScale(14),
  },
  f16: {
    fontSize: moderateScale(16),
  },
  f18: {
    fontSize: moderateScale(18),
  },
  f20: {
    fontSize: moderateScale(20),
  },
  f22: {
    fontSize: moderateScale(20),
  },
  f24: {
    fontSize: moderateScale(24),
  },
  f26: {
    fontSize: moderateScale(26),
  },
  f28: {
    fontSize: moderateScale(28),
  },
  f30: {
    fontSize: moderateScale(30),
  },
  f32: {
    fontSize: moderateScale(32),
  },
  f34: {
    fontSize: moderateScale(34),
  },
  f35: {
    fontSize: moderateScale(35),
  },
  f36: {
    fontSize: moderateScale(36),
  },
  f40: {
    fontSize: moderateScale(40),
  },
  f46: {
    fontSize: moderateScale(46),
  },
};

const typography = { fontWeights, fontSizes };

export default typography;
