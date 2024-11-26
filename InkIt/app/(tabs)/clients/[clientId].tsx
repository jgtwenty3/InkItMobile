import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { router } from 'expo-router';
import { getClientById, deleteClient, updateClient } from '@/lib/appwrite';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '@/components/CustomButton';
import EditClientModal from '@/components/EditClientModal';
import AddNoteModal from '@/components/AddNotesModal';

const ClientDetails = () => {
  const route = useRoute();
  const { clientId } = route.params as { clientId: string };
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [isAddNoteModalVisible, setIsAddNoteModalVisible] = useState<boolean>(false);

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
    setIsEditModalVisible(true);
  };

  const handleSave = async (updatedClientData: any) => {
    try {
      setClient(updatedClientData);
      setIsEditModalVisible(false);
    } catch (error) {
      console.error('Failed to update client:', error.message);
    }
  };

  const handleAddNote = async (note: string) => {
    try {
      const updatedNotes = [...client.notes, note];
      const updatedClientData = { ...client, notes: updatedNotes };
      await updateClient(clientId, updatedClientData);
      setClient(updatedClientData);
      setIsAddNoteModalVisible(false);
    } catch (error) {
      console.error('Failed to add note:', error.message);
    }
  };

  const handleDeleteNote = async (noteIndex: number) => {
    try {
      const updatedNotes = client.notes.filter((_: string, index: number) => index !== noteIndex);
      const updatedClientData = { ...client, notes: updatedNotes };
      await updateClient(clientId, updatedClientData);
      setClient(updatedClientData);
    } catch (error) {
      console.error('Failed to delete note:', error.message);
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
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.innerContainer}>
          <Text style={styles.clientText}>full name: {client.fullName}</Text>
          <Text style={styles.clientText}>email: {client.email}</Text>
          <Text style={styles.clientText}>phone number: {client.phoneNumber}</Text>
          <Text style={styles.clientText}>city: {client.city}</Text>
          <Text style={styles.clientText}>state: {client.state}</Text>
          <Text style={styles.clientText}>country: {client.country}</Text>
          <Text style={styles.clientText}>waiver signed: {client.waiverSigned ? 'Yes' : 'No'}</Text>
          <Text style={styles.clientText}>last appointment:</Text>
          <Text style={styles.clientText}>next appointment:</Text>
        </View>
        <View>
          <Text style={styles.notesTitle}>notes:</Text>
          <FlatList
            data={client.notes}
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={({ item, index }) => (
              <View style={styles.noteContainer}>
                <TouchableOpacity
                  style={styles.deleteNoteButton}
                  onPress={() => handleDeleteNote(index)}
                >
                  <Text style={styles.deleteNoteButtonText}>x</Text>
                </TouchableOpacity>
                <Text style={styles.noteText}>{item}</Text>
              </View>
            )}
          />
        </View>
        <View style={styles.addButtonContainer}>
          <CustomButton
            style={styles.addButton}
            title="+"
            onPress={() => setIsAddNoteModalVisible(true)}
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Edit"
          onPress={handleEdit}
          buttonStyle={[styles.button, styles.editButton]}
        />
        <CustomButton
          title="Delete"
          onPress={handleDelete}
          buttonStyle={[styles.button, styles.deleteButton]}
        />
        <CustomButton
          title="Cancel"
          onPress={() => router.push('/clients')}
          buttonStyle={[styles.button, styles.cancelButton]}
        />
      </View>
      <EditClientModal
        visible={isEditModalVisible}
        client={client}
        onClose={() => setIsEditModalVisible(false)}
        onSave={handleSave}
      />
      <AddNoteModal
        visible={isAddNoteModalVisible}
        onClose={() => setIsAddNoteModalVisible(false)}
        onSave={handleAddNote}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  innerContainer: {
    borderWidth: 2,
    borderColor: 'white',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    maxWidth: 400,
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
  notesTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'courier',
    marginTop:50,
    marginLeft:2
  },
  noteContainer: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    position: 'relative',
    marginLeft:2,
  },
  noteText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'courier',
  },
  deleteNoteButton: {
    position: 'absolute',
    right: 1,
    paddingRight: 3,
    zIndex: 1,
  },
  deleteNoteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    
    backgroundColor: 'black', // Optional: match background color
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
  cancelButton: {
    backgroundColor: 'black',
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 1,
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
});

export default ClientDetails;
