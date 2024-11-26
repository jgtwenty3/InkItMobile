import React, {useState} from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CustomButton from './CustomButton';

import { useGlobalContext } from '@/app/context/GlobalProvider';
import { createClient } from '@/lib/appwrite';
import { router } from 'expo-router';
import FormField from './FormField';
import { SafeAreaView } from 'react-native-safe-area-context';

const AddClientModal = ({visible, onClose})=>{
    const {user} = useGlobalContext();
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fullName, setFulLName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [waiverSigned, setWaiverSigned] = useState(Boolean)
    const [notes, setNotes] = useState('');
    const [error, setError] = useState(null);

    const handleAddClient = async()=>{
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const clientData = {
                fullName,
                email,
                phoneNumber,
                city,
                state,
                country,
                waiverSigned,
                notes: [notes]

            }
            await createClient(clientData)
            
            router.push('/clients')
        } catch (error) {
            console.error('Failed to create client:', error);
            alert('Failed to add client.');
        } finally{
            setIsSubmitting(false)
        }
    }


   

    
      

    return(
        <Modal
        animationType='slide'
        transparent = {true}
        visible = {visible}
        onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>add new client</Text>
                    <Text style={styles.label}>full name:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="client name"
                        placeholderTextColor="#aaa"
                        value={fullName}
                        onChangeText={setFulLName}
                    />

                    <Text style={styles.label}>email:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="email"
                        placeholderTextColor="#aaa"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <Text style={styles.label}>phone:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="phone #"
                        placeholderTextColor="#aaa"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        />
                    <Text style={styles.label}>city:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="city"
                        placeholderTextColor="#aaa"
                        value={city}
                        onChangeText={setCity}
                        />
                    <Text style={styles.label}>state:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="state"
                        placeholderTextColor="#aaa"
                        value={state}
                        onChangeText={setState}
                        />
                    <Text style={styles.label}>country:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="country"
                        placeholderTextColor="#aaa"
                        value={country}
                        onChangeText={setCountry}
                        />
                    <Text style={styles.label}>notes:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="notes"
                        placeholderTextColor="#aaa"
                        value={notes}
                        onChangeText={setNotes}
                        />
                        {error && <Text style={styles.errorText}>{error}</Text>}
                        {loading && <ActivityIndicator size="small" color="#fff" />}
                    <View style={styles.buttonContainer}>
                    <CustomButton title="add client" onPress={handleAddClient} />
                    <CustomButton title="cancel" onPress={onClose} />
                </View>
                </View>
          

          
          

                
                
        </View>
     

            
        </Modal>
    )
}
const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '90%',
      maxWidth: 400,
      backgroundColor: 'black',
      borderRadius: 10,
      padding: 20,
      borderWidth: 2,
      borderColor: 'white',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 15,
      color: 'white',
      fontFamily: "courier"
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 'auto',
    },
    label: {
      fontSize: 16,
      marginBottom: 5,
      color: 'white',
      fontFamily: 'Courier',
    },
    addNewClientButton: {
      marginTop: 10,
      marginBottom: 10,
    },
    addNewClientText: {
      color: '#fff',
      textAlign: 'center',
      fontFamily:"courier"
    },
    input: {
      borderBottomWidth: 1,
      borderBottomColor: '#444',
      marginBottom: 10,
      padding: 5,
      color: 'white',
      fontFamily: 'Courier',
    },
    saveClientButton: {
      backgroundColor: 'black',
      padding: 10,
      marginTop: 10,
      borderRadius: 5,
      borderColor:"white",
      borderWidth:2
    },
    saveClientText: {
      color: '#fff',
      textAlign: 'center',
      fontFamily:"courier"
    },
    dropdown: {
      borderBottomWidth: 1,
      borderBottomColor: '#444',
      marginBottom: 10,
      padding: 5,
      color: 'white',
      fontFamily: 'Courier',
      backgroundColor: 'black',
    },
    dropdownText: {
      color: 'white',
      fontFamily: "Courier"
    },
    dropdownItem: {
      padding: 10,
      backgroundColor: 'black',
      color:"black"
    },
    errorText: {
      color: 'red',
      marginBottom: 10,
      fontSize: 14,
    },
  });

export default AddClientModal;
