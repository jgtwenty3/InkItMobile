import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, StyleSheet, Text, Image, View, FlatList, useWindowDimensions, Modal, TouchableOpacity } from 'react-native';
import { addImageToCollection, getUserImages, uploadImage, deleteImage } from '@/lib/appwrite';
import { useGlobalContext } from '@/app/context/GlobalProvider';
import CustomButton from './CustomButton';
import * as ImagePicker from "expo-image-picker";

interface ImageData {
  id: string;
  imageUrl: string;
  appointment: string;
  client: string;
}

const ReferenceImages = ({ appointmentId }: { appointmentId: string }) => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { user } = useGlobalContext();
  const { width } = useWindowDimensions();

  const fetchImages = useCallback(async () => {
    try {
      const data = await getUserImages(user.$id);

      const filteredImages = data.filter((image: any) => {
        const appointments = image.appointment || [];
        return appointments.some((appointment: any) => appointment.$id === appointmentId);
      });

      const formattedImages = filteredImages.map((image: any) => ({
        id: image.$id,
        imageUrl: image.imageUrl,
        appointment: image.appointment,
        client: image.client,
      }));

      setImages(formattedImages);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  }, [appointmentId, user.$id]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleImagePress = (image: ImageData) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      await deleteImage(imageId);
      setImages(images.filter(image => image.id !== imageId));
      console.log('Image deleted successfully');
    } catch (error) {
      console.error('Failed to delete image:', error);
    }
  };

  const renderGridItem = ({ item }: { item: ImageData }) => (
    <View style={styles.gridItem}>
      <TouchableOpacity onPress={() => handleImagePress(item)} style={styles.imageContainer}>
        <Image source={{ uri: item.imageUrl }} style={styles.gridImage} resizeMode="cover" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteImage(item.id)}>
        <Text style={styles.deleteButtonText}>X</Text>
      </TouchableOpacity>
    </View>
  );

  const renderModalItem = ({ item }: { item: ImageData }) => (
    <View style={[styles.imageContainer, { width: width }]}>
      <Image source={{ uri: item.imageUrl }} style={styles.modalImage} />
    </View>
  );

  const uriToBlob = async (uri: string): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new Error('Failed to convert URI to Blob'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      const blob = await uriToBlob(uri);
      const fileName = uri.split('/').pop() || `image_${Date.now()}.jpg`;
      const mimeType = result.assets[0].type || 'image/jpeg';

      let formData = new FormData();
      formData.append('fileId', 'unique()');
      formData.append('file', blob, fileName);

      try {
        const file = await uploadImage(uri);
        const userId = user?.$id || 'anonymous';

        await addImageToCollection(file.$id, userId, appointmentId);
        await fetchImages();
      } catch (err) {
        console.error('Failed to upload image:', err);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Reference Images:</Text>
      {images.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No images available for this appointment.</Text>
        </View>
      ) : (
        <FlatList
          data={images}
          renderItem={renderGridItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.grid}
        />
      )}
      <View style={styles.addButtonContainer}>
        <CustomButton style={styles.addButton} title="+" onPress={pickImage} />
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <FlatList
            data={images}
            renderItem={renderModalItem}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            initialScrollIndex={Math.max(0, images.findIndex(image => image.id === selectedImage?.id))}
            getItemLayout={(data, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.modalGallery}
            onScrollToIndexFailed={(info) => {
              console.warn(`Failed to scroll to index: ${info.index}, trying again...`);
              setTimeout(() => {
                if (images.length > 0) {
                  info?.flatListRef?.scrollToIndex({ index: info.index, animated: true });
                }
              }, 100); // Retry after a delay
            }}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: 'black',
    position: 'relative',
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: "courier",
    color: "white",
  },
  grid: {
    flexGrow: 1,
  },
  gridItem: {
    flex: 1,
    margin: 5,
    aspectRatio: 1,
    borderColor: 'gray',
    borderWidth: 1,
  },
  gridImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  emptyText: {
    fontSize: 16,
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  modalGallery: {
    flexGrow: 1,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    height: 300,
    width: '100%',
    borderRadius: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1,
  },
  addButton: {
    backgroundColor: '#81b0ff',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor:"gray",
    padding: 5,
    borderRadius: 15,
    zIndex: 2,
  },
  deleteButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 12,
  },
  imageContainer: {
    position: 'relative',
  },
});

export default ReferenceImages;
