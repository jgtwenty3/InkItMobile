import { ScrollView, StyleSheet, Text, View, ActivityIndicator, Modal, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchBar } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '@/components/CustomButton';
import { useGlobalContext } from '@/app/context/GlobalProvider';
import { getUserClients } from '@/lib/appwrite';
import { Link } from 'expo-router';

const Clients = () => {
  const { user } = useGlobalContext();
  const [clients, setClients] = useState<any[]>([]);
  const [filteredClients, setFilteredClients] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCities, setSelectedCities] = useState<Set<string>>(new Set());
  const [cities, setCities] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsData = await getUserClients(user.$id);
        setClients(clientsData);
        setFilteredClients(clientsData);

        // Extract unique cities
        const citySet = new Set(clientsData.map((client: any) => client.city));
        setCities(Array.from(citySet));
      } catch (error) {
        setError('Failed to fetch clients');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.$id) {
      fetchClients();
    }
  }, [user]);

  useEffect(() => {
    let updatedClients = clients;

    // Filter by search query
    if (searchQuery) {
      updatedClients = updatedClients.filter(client =>
        client.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by selected cities
    if (selectedCities.size > 0) {
      updatedClients = updatedClients.filter(client => selectedCities.has(client.city));
    }

    setFilteredClients(updatedClients);
  }, [searchQuery, selectedCities, clients]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCityFilterChange = (city: string) => {
    setSelectedCities(prev => {
      const updatedCities = new Set(prev);
      if (updatedCities.has(city)) {
        updatedCities.delete(city);
      } else {
        updatedCities.add(city);
      }
      return updatedCities;
    });
  };

  const openFilterModal = () => {
    setModalVisible(true);
  };

  const closeFilterModal = () => {
    setModalVisible(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchFilterContainer}>
          <SearchBar
            placeholder="search name..."
            onChangeText={handleSearch}
            value={searchQuery}
            containerStyle={styles.searchBarContainer}
            inputContainerStyle={styles.searchBarInputContainer}
            inputStyle={styles.searchBarInput}
          />
          <TouchableOpacity onPress={openFilterModal} style={styles.filterButton}>
            <Text style={styles.filterButtonText}>city filter</Text>
          </TouchableOpacity>
        </View>
      <ScrollView style={styles.innerContainer}>
        
        {filteredClients.length > 0 ? (
          filteredClients.map((client: any) => (
            <View key={client.$id} style={styles.clientCard}>
              <Text style={styles.clientText}>{client.fullName}</Text>
              <Text style={styles.clientText}>{client.email}</Text>
              <Text style={styles.clientText}>{client.city}, {client.state}</Text>
              <Link href={`/clients/${client.$id}`} style={styles.detailsText}>More...</Link>
            </View>
          ))
        ) : (
          <Text style={styles.noClientsText}>No clients found</Text>
        )}
      </ScrollView>
      <View>
        <CustomButton
          title="Add a New Client"
          onPress={() => navigation.navigate('AddClient')} 
          buttonStyle={styles.mt20}
        />
      </View>

      {/* Filter Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={closeFilterModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Cities</Text>
            {cities.map(city => (
              <TouchableOpacity
                key={city}
                onPress={() => handleCityFilterChange(city)}
                style={styles.modalOption}
              >
                <Text style={styles.modalOptionText}>
                  {city}
                  {selectedCities.has(city) ? ' (Selected)' : ''}
                </Text>
              </TouchableOpacity>
            ))}
            <CustomButton
              title="Close"
              onPress={closeFilterModal}
              buttonStyle={styles.mt20}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
  },
  searchFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  searchBarContainer: {
    backgroundColor: 'black',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    flex: 1,
    marginRight: 10,
  },
  searchBarInputContainer: {
    backgroundColor: 'black',
  },
  searchBarInput: {
    color: 'white',
    fontFamily: 'courier',
  },
  filterButton: {
    backgroundColor: 'black',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'white',
    padding: 10,
    alignItems: 'center',
    flexShrink: 1,
  },
  filterButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'courier',
  },
  clientCard: {
    backgroundColor: 'black',
    borderRadius: 8,
    borderColor: 'white',
    borderWidth: 2,
    padding: 16,
    marginVertical: 8,
  },
  clientText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'courier',
    marginBottom: 2,
  },
  detailsText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'courier',
  },
  noClientsText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  mt20: {
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: 'black',
    borderRadius: 8,
    margin: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: 'white',
  },
  modalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'courier',
  },
  modalOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  modalOptionText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'courier',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default Clients;
