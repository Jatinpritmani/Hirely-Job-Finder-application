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



export const isNumeric = (str) => /^\d+$/.test(str);

console.log(isNumeric("12345")); // ✅ true
console.log(isNumeric("12.34")); // ❌ false
console.log(isNumeric("abc"));   // ❌ false
console.log(isNumeric(""));      // ❌ false




export const years = Array.from({ length: 2025 - 1971 + 1 }, (_, i) => 2025 - i);
export const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const jobTypes = [
  { id: 1, label: "Full-Time", value: "full_time" },
  { id: 2, label: "Part-Time", value: "part_time" },
  { id: 3, label: "Internship", value: "internship" },
  { id: 4, label: "Freelance", value: "freelance" },
  { id: 5, label: "Contract", value: "contract" },
  { id: 6, label: "Temporary", value: "temporary" },
  { id: 7, label: "Remote", value: "remote" },
  { id: 8, label: "Volunteer", value: "volunteer" },
];

export const locations = [
  { id: 1, label: "New York, USA", value: "new_york_usa" },
  { id: 2, label: "Los Angeles, USA", value: "los_angeles_usa" },
  { id: 3, label: "San Francisco, USA", value: "san_francisco_usa" },
  { id: 4, label: "Chicago, USA", value: "chicago_usa" },
  { id: 5, label: "London, UK", value: "london_uk" },
  { id: 6, label: "Manchester, UK", value: "manchester_uk" },
  { id: 7, label: "Berlin, Germany", value: "berlin_germany" },
  { id: 8, label: "Munich, Germany", value: "munich_germany" },
  { id: 9, label: "Toronto, Canada", value: "toronto_canada" },
  { id: 10, label: "Vancouver, Canada", value: "vancouver_canada" },
  { id: 11, label: "Sydney, Australia", value: "sydney_australia" },
  { id: 12, label: "Melbourne, Australia", value: "melbourne_australia" },
  { id: 13, label: "Tokyo, Japan", value: "tokyo_japan" },
  { id: 14, label: "Osaka, Japan", value: "osaka_japan" },
  { id: 15, label: "Bangalore, India", value: "bangalore_india" },
  { id: 16, label: "Mumbai, India", value: "mumbai_india" },
  { id: 17, label: "Paris, France", value: "paris_france" },
  { id: 18, label: "Lyon, France", value: "lyon_france" },
  { id: 19, label: "Dubai, UAE", value: "dubai_uae" },
  { id: 20, label: "Abu Dhabi, UAE", value: "abu_dhabi_uae" },
  { id: 21, label: "Singapore", value: "singapore" },
  { id: 22, label: "Hong Kong", value: "hong_kong" },
  { id: 23, label: "Seoul, South Korea", value: "seoul_south_korea" },
  { id: 24, label: "Mexico City, Mexico", value: "mexico_city_mexico" },
  { id: 25, label: "São Paulo, Brazil", value: "sao_paulo_brazil" },
];

export const getLocationLabel = (value) => {
  const location = locations.find((loc) => loc.value === value);
  return location ? location.label : "-";
};

export const getJobTypeLabel = (value) => {
  const jobType = jobTypes.find((job) => job.value === value);
  return jobType ? jobType.label : "-";
};