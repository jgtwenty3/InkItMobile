import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native'; // For route parameters

// Assuming you have a function to fetch client details
import { getClientById } from '@/lib/appwrite';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '@/components/CustomButton';

const ClientDetails = () => {
  const route = useRoute();
  const { clientId } = route.params as { clientId: string };
  console.log(clientId, "clilent id")
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
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
      {client ? (
        <View style = {styles.innerContainer}>
          <Text style={styles.clientText}>Full Name: {client.fullName}</Text>
          <Text style={styles.clientText}>Email: {client.email}</Text>
          <Text style={styles.clientText}>Phone Number: {client.phoneNumber}</Text>
          <Text style={styles.clientText}>City: {client.city}</Text>
          <Text style={styles.clientText}>State: {client.state}</Text>
          <Text style={styles.clientText}>Country: {client.country}</Text>
          <Text style={styles.clientText}>Last Appointment: </Text>
          <Text style={styles.clientText}>NextAppointment: </Text>
          <Text style={styles.clientText}>Country: {client.country}</Text>
        </View>
      ) : (
        <Text style={styles.noClientText}>Client not found</Text>
      )}
      
      <View>
        <CustomButton
        title = "edit details"
        
        buttonStyle = {styles.mt20}
        
        />
      </View>
    </SafeAreaView>
  );
};

export default ClientDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 15,
    alignItems:'center',
    justifyContent:'center'
  },
  mt20: {
    marginTop: 20,
    justifyContent:"center"
  },
  innerContainer:{
    borderWidth:2,
    borderColor:'white',
    padding:15
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
});
