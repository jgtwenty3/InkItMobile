import React, { useState } from 'react';
import { SafeAreaView, Text, View, StyleSheet, Switch, Platform } from 'react-native';
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';
import { createClient } from '@/lib/appwrite';
import { router } from 'expo-router';
import { useGlobalContext } from '@/app/context/GlobalProvider';

const AddClient = () => {
  const { user } = useGlobalContext();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    city: '',
    state: '',
    country: '',
    waiverSigned: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true);
    try {
      await createClient(form);
      resetForm(); // Reset the form after successful submission
      router.push('/clients'); // Redirect to the clients page after successful creation
    } catch (error) {
      console.error('Failed to create client:', error.message);
      alert('Failed to add client.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = () => {
    setForm({ ...form, waiverSigned: !form.waiverSigned });
  };

  const resetForm = () => {
    setForm({
      fullName: '',
      email: '',
      phoneNumber: '',
      city: '',
      state: '',
      country: '',
      waiverSigned: false,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Add New Client</Text>
      <View style={styles.formContainer}>
        <FormField
          title="Full Name"
          value={form.fullName}
          handleChangeText={(text) => setForm({ ...form, fullName: text })}
          placeholder="Enter full name"
          otherStyles={styles.formField}
        />
        <FormField
          title="Email"
          value={form.email}
          handleChangeText={(text) => setForm({ ...form, email: text })}
          placeholder="Enter email"
          otherStyles={styles.formField}
        />
        <FormField
          title="Phone Number"
          value={form.phoneNumber}
          handleChangeText={(text) => setForm({ ...form, phoneNumber: text })}
          placeholder="Enter phone number"
          otherStyles={styles.formField}
        />
        <FormField
          title="City"
          value={form.city}
          handleChangeText={(text) => setForm({ ...form, city: text })}
          placeholder="Enter city"
          otherStyles={styles.formField}
        />
        <FormField
          title="State"
          value={form.state}
          handleChangeText={(text) => setForm({ ...form, state: text })}
          placeholder="Enter state"
          otherStyles={styles.formField}
        />
        <FormField
          title="Country"
          value={form.country}
          handleChangeText={(text) => setForm({ ...form, country: text })}
          placeholder="Enter country"
          otherStyles={styles.formField}
        />
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>Waiver Signed:</Text>
          <Switch
            value={form.waiverSigned}
            onValueChange={handleToggle}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={form.waiverSigned ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Add Client"
          onPress={handleSubmit}
          buttonStyle={styles.customButton}
        />
        <CustomButton
          title="Cancel"
          onPress={() => {
            resetForm(); // Reset the form on cancel
            router.push('/clients');
          }}
          buttonStyle={styles.customButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    padding: Platform.OS === 'ios' ? 20 : 15, // Adjust padding based on platform
  },
  title: {
    fontFamily: 'Courier',
    color: 'white',
    fontSize: Platform.OS === 'ios' ? 24 : 20, // Adjust font size for tablet and mobile
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 600, // Maximum width for larger screens (e.g., tablets)
    paddingHorizontal: 20,
  },
  formField: {
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  toggleLabel: {
    color: 'white',
    fontFamily: 'Courier',
    fontSize: 16,
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 600, // Maximum width for larger screens
    paddingHorizontal: 20,
  },
  customButton: {
    width: '48%',
    paddingVertical: 12,
    fontFamily: 'Courier',
    fontSize: 16,
  },
});

export default AddClient;
