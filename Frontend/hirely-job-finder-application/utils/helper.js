import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';

const downloadFile = async (url, body, filename = 'file.pdf') => {
    try {
        console.log('Downloading file...', url);

        // Send POST request
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        // Convert response to blob
        const blob = await response.blob();

        // Get file path
        const fileUri = FileSystem.documentDirectory + filename;

        // Convert Blob to Base64 for saving
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        return new Promise((resolve, reject) => {
            reader.onloadend = async () => {
                try {
                    const base64 = reader.result.split(',')[1]; // Extract Base64 data
                    await FileSystem.writeAsStringAsync(fileUri, base64, {
                        encoding: FileSystem.EncodingType.Base64,
                    });
                    console.log('File saved at:', fileUri);
                    resolve(fileUri);
                } catch (error) {
                    console.error('Error saving file:', error);
                    reject(null);
                }
            };
            reader.onerror = reject;
        });
    } catch (error) {
        console.error('Error downloading file:', error);
        return null;
    }
};

const openFile = async (fileUri) => {
    try {
        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
            data: fileUri,
            type: 'application/pdf',
        });
    } catch (error) {
        console.error('Error opening file:', error);
    }
};

export { downloadFile, openFile };
