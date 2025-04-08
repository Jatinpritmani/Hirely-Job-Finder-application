import axios from 'axios';
import Toast from 'react-native-toast-message';

// export const API_BASE_URL = 'http://192.168.29.187:4402/hjfa/';
export const API_BASE_URL = 'http://35.182.112.171:4402/hjfa/';



// iOS Simulator	http://localhost:4402
// Android Emulator	http://10.0.2.2:4402
// Physical Device	http://<your-local-IP>:4402


/// File Base Url 
// export const FILE_BASE_URL = 'http://192.168.29.187:4402/resumes/'  // use your machines IP here for real devices
export const FILE_BASE_URL = 'http://35.182.112.171:4402/resumes/'  // use your machines IP here for real devices


// Common API function 
const apiRequest = async (method = "GET", endpoint, data = {}, params = {}, headers = {}) => {
    try {
        const isFileUpload = data instanceof FormData; // Check if data is FormData
        console.log('isFileUpload', isFileUpload);
        console.log('data', data);
        console.log('endpoint', endpoint);
        console.log('params', params);
        console.log('headers', headers);
        console.log('method', method);
        console.log('API_BASE_URL', `${API_BASE_URL}${endpoint}`);

        const response = await axios({
            method,
            url: `${API_BASE_URL}${endpoint}`,
            data,
            params,
            headers: {
                'Content-Type': isFileUpload ? 'multipart/form-data' : 'application/json',
                ...headers, // Allow passing custom headers

            },
            timeout: 10000, // Optional timeout (10 seconds)
        });
        if (response?.data?.code == 'HJFA_MS_OK_200' && !response?.data?.error_status) {

            return response.data; // Return only the data
        }
        else {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error?.response?.data?.message || 'Something went wrong.',
            });


        }
    } catch (error) {
        console.error('API Error:', error);
        Toast.show({
            type: 'error',
            text1: 'Error',
            text2: error?.response?.data?.message || 'Something went wrong.',
        });
        throw error; // Rethrow for handling in calling function
    }
};

// Exported API functions
export const getRequest = (endpoint, params = {}) => apiRequest('GET', endpoint, {}, params);
export const postRequest = (endpoint, data = {}) => apiRequest('POST', endpoint, data);
export const putRequest = (endpoint, data = {}) => apiRequest('PUT', endpoint, data);
export const deleteRequest = (endpoint) => apiRequest('DELETE', endpoint);

// upload file function 
export const uploadFile = (endpoint, fileUri, fileType, fileName, extraData) => {
    const formData = new FormData();


    formData.append('file', {
        uri: fileUri,
        type: fileType,
        name: fileName,
    });
    Object.keys(extraData).forEach(key => {
        formData.append(key, extraData[key]);
    });
    console.log('formData',
        formData);
    console.log('endpoint', endpoint);
    console.log('fileUri', fileUri);


    return apiRequest('POST', endpoint, formData);
};


export default apiRequest;
