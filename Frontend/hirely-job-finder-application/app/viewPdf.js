// import React, { useCallback, useState } from 'react';
// import { View, ActivityIndicator, Platform, Alert } from 'react-native';
// import { WebView } from 'react-native-webview';
// import * as FileSystem from 'expo-file-system';
// import * as MediaLibrary from 'expo-media-library';
// import { useSelector } from 'react-redux';
// import { useFocusEffect } from 'expo-router';
// import { shareAsync } from 'expo-sharing';
// import * as Linking from 'expo-linking';


// // Local Imports
// import HSafeAreaView from '../components/common/HSafeAreaView';
// import HLoader from '../components/common/HLoader';
// import { API_BASE_URL } from '../components/api';
// import { GET_RESUME } from '../components/apiConstants';

// export default function viewPdf() {
//     const currentUserDetail = useSelector(state => state.userReducer.currentUserDetail);
//     const [pdfUri, setPdfUri] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useFocusEffect(
//         useCallback(() => {
//             fetchAndSavePdf();
//             return () => { };
//         }, [currentUserDetail])
//     );

//     const openPdf = async (fileUri) => {
//         console.log(fileUri);

//         const supported = await Linking.canOpenURL(fileUri);
//         if (supported) {
//             await Linking.openURL(fileUri);
//         } else {
//             console.error("Don't know how to open URI: " + fileUri);
//         }
//     };

//     // const fetchAndSavePdf = async () => {
//     //     try {
//     //         if (!currentUserDetail?.user_id || !currentUserDetail?.user_name) {
//     //             throw new Error('User details are missing');
//     //         }

//     //         // Request storage permission
//     //         const { status } = await MediaLibrary.requestPermissionsAsync();
//     //         if (status !== 'granted') {
//     //             Alert.alert("Permission Required", "Please allow access to storage in settings.");
//     //             setLoading(false);
//     //             return;
//     //         }

//     //         console.log('Fetching PDF from API...');

//     //         const sanitizedUserName = currentUserDetail.user_name.replace(/\s+/g, '_');
//     //         const fileName = `${sanitizedUserName}_${currentUserDetail.user_id}_resume.pdf`;
//     //         const fileUri = FileSystem.documentDirectory + fileName;

//     //         const apiUrl = `${API_BASE_URL}${GET_RESUME}?user_id=${currentUserDetail.user_id}`;

//     //         const result = await FileSystem.downloadAsync(
//     //             apiUrl,
//     //             fileUri,
//     //             {
//     //                 headers: {
//     //                     "Content-Type": "application/pdf"
//     //                 }
//     //             }
//     //         );

//     //         if (result.status !== 200) {
//     //             throw new Error(`Failed to fetch PDF. Status: ${result.status}`);
//     //         }

//     //         console.log('PDF downloaded successfully:', result.uri);

//     //         // Save to public storage
//     //         await saveToPublicStorage(result.uri, fileName, "application/pdf");
//     //     } catch (error) {
//     //         console.error('Error fetching PDF:', error);
//     //         setLoading(false);
//     //         Alert.alert("Error", "Failed to download PDF.");
//     //     }
//     // };


//     const fetchAndSavePdf = async () => {
//         try {
//             if (!currentUserDetail?.user_id || !currentUserDetail?.user_name) {
//                 throw new Error('User details are missing');
//             }

//             console.log('Fetching PDF from API...');

//             const sanitizedUserName = currentUserDetail.user_name.replace(/\s+/g, '_');
//             const fileName = `${sanitizedUserName}_${currentUserDetail.user_id}_resume.pdf`;
//             const fileUri = FileSystem.documentDirectory + fileName;

//             const apiUrl = `${API_BASE_URL}${GET_RESUME}?user_id=${currentUserDetail.user_id}`;

//             const result = await FileSystem.downloadAsync(apiUrl, fileUri, {
//                 headers: { "Content-Type": "application/pdf" }
//             });

//             if (result.status !== 200) {
//                 throw new Error(`Failed to fetch PDF. Status: ${result.status}`);
//             }

//             console.log('PDF downloaded successfully:', result.uri);

//             // Convert PDF to base64
//             const base64 = await FileSystem.readAsStringAsync(result.uri, {
//                 encoding: FileSystem.EncodingType.Base64,
//             });

//             openPdf(result.uri)
//             // Embed base64 PDF in WebView
//             setPdfUri(result.uri);
//             setLoading(false);

//         } catch (error) {
//             console.error('Error fetching PDF:', error);
//             setLoading(false);
//             Alert.alert("Error", "Failed to download PDF.");
//         }
//     };


//     const saveToPublicStorage = async (uri, filename, mimetype) => {
//         try {
//             if (Platform.OS === "android") {
//                 console.log(uri, "======uri");

//                 // Save to internal app storage instead of public storage
//                 setPdfUri(uri);
//                 shareAsync(uri);
//             } else {
//                 const asset = await MediaLibrary.createAssetAsync(uri);
//                 await MediaLibrary.createAlbumAsync("Download", asset, false);
//                 setPdfUri(asset.uri);
//             }
//         } catch (error) {
//             console.error('Error moving file:', error);
//             Alert.alert("Error", "Failed to save file.");
//         } finally {
//             setLoading(false);
//         }
//     };


//     if (loading) {
//         return <HLoader />;
//     }

//     return (
//         <HSafeAreaView>
//             {/* {pdfUri ? ( */}
//             {/* <WebView source={{ uri: pdfUri }} style={{ flex: 1 }} originWhitelist={['*']} /> */}
//             {/* // ) : (
//             //     <View><ActivityIndicator size="large" /></View>
//             // )} */}
//         </HSafeAreaView>
//     );
// }

import React, { useCallback, useState } from 'react';
import { View, ActivityIndicator, Alert, Platform, Button } from 'react-native';
import { useFocusEffect } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import { useSelector } from 'react-redux';
import * as Linking from 'expo-linking';
import * as Sharing from 'expo-sharing';

// Local Imports
import HSafeAreaView from '../components/common/HSafeAreaView';
import HLoader from '../components/common/HLoader';
import { API_BASE_URL } from '../components/api';
import { GET_RESUME } from '../components/apiConstants';

export default function ViewPdf() {
    const currentUserDetail = useSelector(state => state.userReducer.currentUserDetail);
    const [fileUri, setFileUri] = useState(null);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            downloadPdf();
        }, [currentUserDetail])
    );

    const downloadPdf = async () => {
        try {
            if (!currentUserDetail?.user_id || !currentUserDetail?.user_name) {
                throw new Error('User details are missing');
            }
            console.log('Fetching PDF from API...');

            const sanitizedUserName = currentUserDetail.user_name.replace(/\s+/g, '_');
            const fileName = `${sanitizedUserName}_${currentUserDetail.user_id}_resume.pdf`;
            const localUri = FileSystem.documentDirectory + fileName;
            const apiUrl = `${API_BASE_URL}${GET_RESUME}?user_id=${currentUserDetail.user_id}`;

            const result = await FileSystem.downloadAsync(apiUrl, localUri, {
                headers: { "Content-Type": "application/pdf" }
            });

            if (result.status !== 200) {
                throw new Error(`Failed to fetch PDF. Status: ${result.status}`);
            }

            console.log('PDF downloaded successfully:', result.uri);
            setFileUri(result.uri);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching PDF:', error);
            setLoading(false);
            Alert.alert("Error", "Failed to download PDF.");
        }
    };

    const openFile = async () => {
        if (!fileUri) return;
        if (await Sharing.isAvailableAsync()) {
            // This will open the native share sheet so the user can choose an app to open or save the PDF.
            await Sharing.shareAsync(fileUri);
        } else {
            // Fallback using Linking to open the file
            const supported = await Linking.canOpenURL(fileUri);
            if (supported) {
                await Linking.openURL(fileUri);
            } else {
                Alert.alert("Error", "No app available to open the PDF.");
            }
        }
    };

    if (loading) {
        return <HLoader />;
    }

    return (
        <HSafeAreaView style={{ flex: 1, padding: 16 }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Button title="Open PDF" onPress={openFile} />
            </View>
        </HSafeAreaView>
    );
}
