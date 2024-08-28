import { Modal, TextInput, StyleSheet, View, Text, Switch } from 'react-native';
import React, { useState } from 'react';
import CustomButton from '@/components/CustomButton';
import { updateClient } from '@/lib/appwrite';

const EditClientModal = ({ client, visible, onClose, onSave }: { client: any; visible: boolean; onClose: () => void; onSave: (updatedClient: any) => void }) => {
  const [form, setForm] = useState({
    fullName: client.fullName,
    email: client.email,
    phoneNumber: client.phoneNumber,
    city: client.city,
    state: client.state,
    country: client.country,
    waiverSigned: client.waiverSigned,
    notes:client.notes,
  });

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prevForm) => ({ ...prevForm, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const updatedClient = await updateClient(client.$id, form);
      onSave(updatedClient);
      onClose();
    } catch (error) {
      console.error('Failed to update client:', error.message);
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>edit client details</Text>
          <TextInput
            style={styles.input}
            value={form.fullName}
            onChangeText={(text) => handleChange('fullName', text)}
            placeholder="full name"
          />
          <TextInput
            style={styles.input}
            value={form.email}
            onChangeText={(text) => handleChange('email', text)}
            placeholder="email"
          />
          <TextInput
            style={styles.input}
            value={form.phoneNumber}
            onChangeText={(text) => handleChange('phoneNumber', text)}
            placeholder="phone number"
          />
          <TextInput
            style={styles.input}
            value={form.city}
            onChangeText={(text) => handleChange('city', text)}
            placeholder="city"
          />
          <TextInput
            style={styles.input}
            value={form.state}
            onChangeText={(text) => handleChange('state', text)}
            placeholder="state"
          />
          <TextInput
            style={styles.input}
            value={form.country}
            onChangeText={(text) => handleChange('country', text)}
            placeholder="country"
          />
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>waiver signed:</Text>
            <Switch
              value={form.waiverSigned}
              onValueChange={(value) => handleChange('waiverSigned', value)}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={form.waiverSigned ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
          <View style={styles.buttonContainer}>
            <CustomButton title="save" onPress={handleSave} />
            <CustomButton title="cancel" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditClientModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'black',
    padding: 20,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: 'white',
    fontFamily:"courier"
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: 'white',
    borderRadius: 5,
    fontFamily:"courier"
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  toggleLabel: {
    color: 'white',
    marginRight: 10,
    fontSize: 16,
    fontFamily:"courier"
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
});
