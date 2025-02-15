import React, { useCallback, useState } from 'react';
import { View, ActivityIndicator, Platform, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { useSelector } from 'react-redux';
import { useFocusEffect } from 'expo-router';
import { shareAsync } from 'expo-sharing';

// Local Imports
import HSafeAreaView from '../components/common/HSafeAreaView';
import HLoader from '../components/common/HLoader';
import { API_BASE_URL } from '../components/api';
import { GET_RESUME } from '../components/apiConstants';

export default function viewPdf() {
    const currentUserDetail = useSelector(state => state.userReducer.currentUserDetail);
    const [pdfUri, setPdfUri] = useState(null);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            fetchAndSavePdf();
            return () => { };
        }, [currentUserDetail])
    );

    const fetchAndSavePdf = async () => {
        try {
            if (!currentUserDetail?.user_id || !currentUserDetail?.user_name) {
                throw new Error('User details are missing');
            }

            // Request storage permission
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission Required", "Please allow access to storage in settings.");
                setLoading(false);
                return;
            }
            console.log('====================================');
            console.log(API_BASE_URL);
            console.log('====================================');

            const sanitizedUserName = currentUserDetail.user_name.replace(/\s+/g, '_');
            const fileName = `${sanitizedUserName}_${currentUserDetail.user_id}_resume.pdf`;
            const fileUri = FileSystem.documentDirectory + fileName;

            const result = await FileSystem.downloadAsync(
                ``,
                FileSystem.documentDirectory + fileName,
                {
                    headers: {
                        "MyHeader": "MyValue"
                    }
                }
            );

            // Save to public storage
            await saveToPublicStorage(fileUri, fileName, "application/pdf");
        } catch (error) {
            console.error('Error fetching PDF:', error);
            setLoading(false);
            Alert.alert("Error", "Failed to download PDF.");
        }
    };

    const saveToPublicStorage = async (uri, filename, mimetype) => {
        try {
            if (Platform.OS === "android") {
                const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
                if (permissions.granted) {
                    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
                    await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, filename, mimetype)
                        .then(async (newUri) => {
                            await FileSystem.writeAsStringAsync(newUri, base64, { encoding: 'base64' });
                            setPdfUri(newUri);
                        })
                        .catch((e) => console.log("Error saving file:", e));
                } else {
                    shareAsync(uri);
                }
            } else {
                const asset = await MediaLibrary.createAssetAsync(uri);
                await MediaLibrary.createAlbumAsync("Download", asset, false);
                setPdfUri(asset.uri);
            }
        } catch (error) {
            console.error('Error moving file:', error);
            Alert.alert("Error", "Failed to save file.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <HLoader />;
    }

    return (
        <HSafeAreaView>
            {pdfUri ? (
                <WebView source={{ uri: pdfUri }} style={{ flex: 1 }} />
            ) : (
                <View><ActivityIndicator size="large" /></View>
            )}
        </HSafeAreaView>
    );
}
