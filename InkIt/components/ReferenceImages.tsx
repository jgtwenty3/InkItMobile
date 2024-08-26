import { SafeAreaView, StyleSheet, Text, View, Image } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { getUserImages } from '@/lib/appwrite';
import { useGlobalContext } from '@/app/context/GlobalProvider';
import Gallery from "react-native-awesome-gallery";

interface ImageData {
  id: string;
  imageUrl: string;
  appointment: string; // Adjust based on actual types
  client: string; // Adjust based on actual types
}

const ReferenceImages = ({ appointmentId }: { appointmentId: string }) => {
  const [images, setImages] = useState<ImageData[]>([]);
  const { user } = useGlobalContext();

  const fetchImages = useCallback(async () => {
    try {
      const data = await getUserImages(user.$id);
      
      console.log('Appointment ID:', appointmentId); // Log the appointmentId being used
      console.log('Fetched Data:', data); // Log the fetched data
  
      // Check each image's appointment field
      data.forEach((image: ImageData) => {
        console.log(`Image ID: ${image.id}, Appointment: ${image.appointment}`);
        if (!image.appointment || image.appointment.length === 0) {
          console.warn(`Image ID: ${image.id} has an empty or undefined appointment field.`);
        }
      });
  
      // Filter images based on appointmentId, ignoring images with empty appointment arrays
      const filteredImages = data.filter((image: ImageData) => 
        Array.isArray(image.appointment) && image.appointment.includes(appointmentId)
      );
  
      console.log('Filtered Images:', filteredImages); // Log the filtered images
  
      setImages(filteredImages);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  }, [appointmentId, user.$id]);
  

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Reference Images:</Text>
      <Gallery
        data={images}
        keyExtractor={(item) => item.id} // Use unique id for keyExtractor
        renderItem={({ item }) => (
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
        )}
      />
    </SafeAreaView>
  );
};

export default ReferenceImages;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: "courier",
    color: "white",
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 10,
  },
});
