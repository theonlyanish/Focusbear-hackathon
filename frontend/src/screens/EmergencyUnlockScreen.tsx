import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const EmergencyUnlockScreen = () => {
  const [reason, setReason] = useState('');
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('0');
  const navigation = useNavigation();

  const handleSendRequest = () => {
    if (reason.trim() === '') {
      Alert.alert('Error', 'Please provide a reason for the unlock request.');
      return;
    }

    const durationInSeconds = parseInt(hours) * 3600 + parseInt(minutes) * 60;
    if (durationInSeconds === 0) {
      Alert.alert('Error', 'Please select a duration for the unlock request.');
      return;
    }

    // In a real app, you'd send this request to your backend
    console.log('Sending unlock request:', { reason, durationInSeconds });
    
    // Navigate back to the LockScreen with the pending request info
    navigation.navigate('Lock', { 
      pendingRequest: { 
        reason, 
        duration: durationInSeconds 
      } 
    });
  };

  const generatePickerItems = (max: number) => {
    return Array.from({ length: max + 1 }, (_, i) => (
      <Picker.Item key={i} label={i.toString().padStart(2, '0')} value={i.toString()} />
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emergency Unlock Request</Text>
      <TextInput
        style={styles.input}
        placeholder="Reason for unlock"
        value={reason}
        onChangeText={setReason}
        multiline
      />
      <Text style={styles.label}>Duration:</Text>
      <View style={styles.pickerContainer}>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={hours}
            onValueChange={(itemValue) => setHours(itemValue)}
            style={styles.picker}
          >
            {generatePickerItems(23)}
          </Picker>
          <Text style={styles.pickerLabel}>Hours</Text>
        </View>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={minutes}
            onValueChange={(itemValue) => setMinutes(itemValue)}
            style={styles.picker}
          >
            {generatePickerItems(59)}
          </Picker>
          <Text style={styles.pickerLabel}>Minutes</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSendRequest}>
        <Text style={styles.buttonText}>Send Request</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  pickerWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  picker: {
    width: 100,
    height: 150,
  },
  pickerLabel: {
    marginTop: 5,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EmergencyUnlockScreen;