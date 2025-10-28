import { Ionicons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AddMenuItemScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [video, setVideo] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets) {
      const newImages = result.assets.map(asset => asset.uri);
      setImages([...images, ...newImages]);
    }
  };

  const pickVideo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setVideo(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permissions');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      allowsEditing: true,
    });
    if (!result.canceled && result.assets[0]) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!name || !description || !price) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (images.length === 0 && !video) {
      Alert.alert('Error', 'Please add at least one image or video');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate upload
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      setIsUploading(false);
      Alert.alert('Success', 'Menu item uploaded successfully! Customers can now see it.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Menu Item</Text>
          <View style={{ width: 60 }} />
        </View>
        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Photos & Videos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {images.map((uri, index) => (
                <View key={index} style={styles.imagePreview}>
                  <Image source={{ uri }} style={styles.previewImage} />
                  <TouchableOpacity style={styles.removeBtn} onPress={() => removeImage(index)}>
                    <Ionicons name="close-circle" size={24} color="#FF6B6B" />
                  </TouchableOpacity>
                </View>
              ))}
              {images.length < 5 && (
                <TouchableOpacity style={styles.addMediaBtn} onPress={pickImage}>
                  <Ionicons name="images-outline" size={32} color="#00B386" />
                  <Text style={styles.addMediaText}>Add Photo</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.addMediaBtn} onPress={takePhoto}>
                <Ionicons name="camera-outline" size={32} color="#00B386" />
                <Text style={styles.addMediaText}>Take Photo</Text>
              </TouchableOpacity>
            </ScrollView>
            <TouchableOpacity style={styles.videoBtn} onPress={pickVideo}>
              <Ionicons name="videocam-outline" size={24} color="#666" />
              <Text style={styles.videoBtnText}>{video ? 'Change Video' : 'Add Video (Optional)'}</Text>
            </TouchableOpacity>
            {video && (
              <View style={styles.videoContainer}>
                <Video
                  source={{ uri: video }}
                  style={styles.videoPlayer}
                  useNativeControls
                  resizeMode={ResizeMode.COVER}
                  isLooping
                />
                <TouchableOpacity style={styles.removeVideoBtn} onPress={() => setVideo(null)}>
                  <Ionicons name="close-circle" size={24} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Food Name</Text>
            <TextInput style={styles.input} placeholder="e.g., Banku with Fish" value={name} onChangeText={setName} />
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Description</Text>
            <TextInput style={[styles.input, styles.textArea]} placeholder="Describe your delicious item..." value={description} onChangeText={setDescription} multiline numberOfLines={4} textAlignVertical="top" />
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Price (₵)</Text>
            <TextInput style={styles.input} placeholder="45.00" keyboardType="decimal-pad" value={price} onChangeText={setPrice} />
          </View>
          
          {/* Upload Button */}
          <View style={styles.uploadSection}>
            <TouchableOpacity
              style={[styles.uploadButton, isUploading && styles.uploadButtonDisabled]}
              onPress={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Ionicons name="cloud-upload-outline" size={24} color="#fff" />
                  <Text style={styles.uploadButtonText}>Uploading... {uploadProgress}%</Text>
                </>
              ) : (
                <>
                  <Ionicons name="cloud-upload" size={24} color="#fff" />
                  <Text style={styles.uploadButtonText}>Upload Menu Item</Text>
                </>
              )}
            </TouchableOpacity>
            {isUploading && (
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
              </View>
            )}
          </View>

          <View style={{ height: 30 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  keyboardView: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  saveButton: { fontSize: 16, fontWeight: 'bold', color: '#00B386' },
  content: { flex: 1 },
  section: { backgroundColor: '#fff', padding: 20, marginBottom: 1 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 10, padding: 15, fontSize: 16, color: '#333', backgroundColor: '#f8f9fa' },
  textArea: { height: 100 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  imagePreview: { marginRight: 10, position: 'relative' },
  previewImage: { width: 120, height: 120, borderRadius: 10 },
  removeBtn: { position: 'absolute', top: -5, right: -5, backgroundColor: '#fff', borderRadius: 12 },
  addMediaBtn: { width: 120, height: 120, borderRadius: 10, borderWidth: 2, borderColor: '#00B386', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa', marginRight: 10 },
  addMediaText: { marginTop: 5, fontSize: 12, color: '#00B386', textAlign: 'center' },
  videoBtn: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#e0e0e0', gap: 10, marginTop: 15 },
  videoBtnText: { fontSize: 14, color: '#666' },
  videoContainer: { position: 'relative', marginTop: 15, borderRadius: 10, overflow: 'hidden' },
  videoPlayer: { width: '100%', height: 200 },
  removeVideoBtn: { position: 'absolute', top: 10, right: 10, backgroundColor: '#fff', borderRadius: 12, padding: 5 },
  uploadSection: { backgroundColor: '#fff', padding: 20 },
  uploadButton: { backgroundColor: '#00B386', borderRadius: 15, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  uploadButtonDisabled: { backgroundColor: '#ccc' },
  uploadButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  progressBar: { marginTop: 15, height: 8, backgroundColor: '#e0e0e0', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#00B386', borderRadius: 4 },
});

