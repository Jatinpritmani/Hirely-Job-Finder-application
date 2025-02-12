import { Dimensions, Platform, StatusBar } from 'react-native';
import * as Device from 'expo-device';


let iPhoneX = screenHeight === 812 ? true : false;

// StatusBar Height
export const STATUSBAR_HEIGHT =
  Platform.OS === 'ios' ? (iPhoneX ? 44 : 22) : StatusBar.currentHeight;
export const screenHeight = Dimensions.get('window').height - STATUSBAR_HEIGHT;
export const screenWidth = Dimensions.get('window').width;
export const screenFullHeight = Dimensions.get('window').height;
export const isAndroid = Platform.OS === 'ios' ? false : true;

let sampleHeight = 812;
let sampleWidth = 375;

export const isShowLog = true;

// Check if device is Tablet
export const isTablet = () => {
  return Device.isTablet();
};

//Get Width of Screen
export function getWidth(value) {
  return (value / sampleWidth) * screenWidth;
}

//Get Height of Screen
export function getHeight(value) {
  return (value / sampleHeight) * screenHeight;
}
const scale = size => (screenWidth / sampleWidth) * size;

// Moderate Scale Function
export function moderateScale(size, factor = 0.5) {
  return size + (scale(size) - size) * factor;
}

// Check App Platform
export const checkPlatform = () => {
  if (Platform.OS === 'android') {
    return 'android';
  } else {
    return 'ios';
  }
};

export const isUserJobSeeker = (userType) => {
  if (userType == 'job_seeker') {
    return true
  } else {
    return false
  }
}
export const isUserRecruiter = (userType) => {
  if (userType == 'recruiter') {
    return true
  } else {
    return false
  }
}

export const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const years = Array.from({ length: 2025 - 1971 + 1 }, (_, i) => 2025 - i);
