import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, StyleSheet, Text, Image, View, FlatList, useWindowDimensions, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { getUserImages } from '@/lib/appwrite';
import { useGlobalContext } from '@/app/context/GlobalProvider';

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
      console.log("Fetched Images:", data);

      // Filter images based on appointmentId
      const filteredImages = data.filter((image: any) => {
        console.log("Checking image appointment:", image.appointment);
        const appointments = image.appointment || [];
        return appointments.some((appointment: any) => appointment.$id === appointmentId);
      });

      console.log("Filtered Images:", filteredImages);

      // Map the filtered images to match the ImageData interface
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

  const renderGridItem = ({ item }: { item: ImageData }) => (
    <TouchableOpacity onPress={() => handleImagePress(item)} style={styles.gridItem}>
      <Image source={{ uri: item.imageUrl }} style={styles.gridImage} />
    </TouchableOpacity>
  );

  const renderModalItem = ({ item }: { item: ImageData }) => (
    <View style={[styles.imageContainer, { width: width }]}>
      <Image source={{ uri: item.imageUrl }} style={styles.modalImage} />
    </View>
  );

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
          numColumns={3} // Adjust the number of columns in the grid
          contentContainerStyle={styles.grid}
        />
      )}

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
            initialScrollIndex={images.findIndex(image => image.id === selectedImage?.id)}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.modalGallery}
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

export default ReferenceImages;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: 'black', // To better display white text and images
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
    aspectRatio: 1, // Ensures square aspect ratio
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
    height: 300, // Adjust as needed
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
});
