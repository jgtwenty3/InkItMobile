import { ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchInput from '@/components/SearchInput';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '@/components/CustomButton';
import { useGlobalContext } from '@/app/context/GlobalProvider';
import { getUserClients } from '@/lib/appwrite';

const Clients = () => {
  const { user } = useGlobalContext();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsData = await getUserClients(user.$id);
        setClients(clientsData);
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
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
      <ScrollView style={styles.innerContainer}>
        <SearchInput />
        {clients.length > 0 ? (
          clients.map((client: any) => (
            <View key={client.$id} style={styles.clientCard}>
              <Text style={styles.clientText}>{client.fullName}</Text>
              <Text style={styles.clientText}>{client.email}</Text>
            
              {/* Add more client details here */}
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
    </SafeAreaView>
  );
};

export default Clients;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
  },
  innerContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
  },
  text: {
    fontFamily: 'courier',
    color: 'white',
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
    fontSize: 16,
    fontFamily: 'courier'
  },
  noClientsText: {
    color: 'white',
    textAlign: 'center',
    fontFamily:"courier",
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  mt20: {
    marginTop: 20,
  },
});
