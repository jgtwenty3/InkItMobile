import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { router } from 'expo-router';
import { getClientById, deleteClient } from '@/lib/appwrite';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '@/components/CustomButton';
import EditClientModal from '@/components/EditClientModal'; // Import your existing EditClientModal

const ClientDetails = () => {
  const route = useRoute();
  const { clientId } = route.params as { clientId: string };
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const clientData = await getClientById(clientId);
        setClient(clientData);
      } catch (error) {
        setError('Failed to fetch client details');
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [clientId]);

  const handleDelete = async () => {
    try {
      await deleteClient(clientId);
      router.push('/clients');
    } catch (error) {
      console.error('Failed to delete client:', error.message);
    }
  };

  const handleEdit = () => {
    setIsModalVisible(true);
  };

  const handleSave = async (updatedClientData: any) => {
    try {
      setClient(updatedClientData);
      setIsModalVisible(false);
    } catch (error) {
      console.error('Failed to update client:', error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (!client) {
    return <Text style={styles.noClientText}>Client not found</Text>;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>;
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.clientText}>Full Name: {client.fullName}</Text>
        <Text style={styles.clientText}>Email: {client.email}</Text>
        <Text style={styles.clientText}>Phone Number: {client.phoneNumber}</Text>
        <Text style={styles.clientText}>City: {client.city}</Text>
        <Text style={styles.clientText}>State: {client.state}</Text>
        <Text style={styles.clientText}>Country: {client.country}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Edit Details"
          onPress={handleEdit}
          buttonStyle={[styles.button, styles.editButton]}
        />
        <CustomButton
          title="Delete"
          onPress={handleDelete}
          buttonStyle={[styles.button, styles.deleteButton]}
        />
      </View>

      
      <EditClientModal
        visible={isModalVisible}
        client={client}
        onClose={() => setIsModalVisible(false)}
        onSave={handleSave}
      />
    </SafeAreaView>
  );
};

export default ClientDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  innerContainer: {
    borderWidth: 2,
    borderColor: 'white',
    padding: 15,
    marginBottom: 20,
  },
  clientText: {
    color: 'white',
    fontSize: 18,
    marginVertical: 4,
    fontFamily: 'courier',
  },
  noClientText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'courier',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  editButton: {
    backgroundColor: 'black',
  },
  deleteButton: {
    backgroundColor: 'black',
  },
});
