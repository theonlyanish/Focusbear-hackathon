import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';

const EmergencyUnlockScreen = () => {
  const [reason, setReason] = useState('');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: '',
    });
  }, [navigation]);

  const handleRequest = async () => {
    const timePeriod = hours * 3600 + minutes * 60; // Convert to seconds
    try {
      await api.post('/unlocks', {
        userId: global.currentUser.id,
        reason,
        timePeriod,
      });
      Alert.alert('Success', 'Unlock request sent successfully');
      navigation.navigate('LockScreen', { pendingRequest: { reason, duration: timePeriod } });
    } catch (error) {
      console.error('Failed to send unlock request:', error);
      Alert.alert('Error', 'Failed to send unlock request. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Emergency Unlock Request</Text>
        <TextInput
          style={styles.input}
          placeholder="Reason for unlock"
          value={reason}
          onChangeText={setReason}
          multiline
          numberOfLines={2}
        />
        <Text style={styles.durationLabel}>Duration:</Text>
        <View style={styles.pickerContainer}>
          <View style={styles.pickerWrapper}>
            <View style={styles.pickerBackground}>
              <Picker
                selectedValue={hours}
                onValueChange={(itemValue) => setHours(itemValue)}
                style={styles.picker}
              >
                {[...Array(5)].map((_, i) => (
                  <Picker.Item key={i} label={i.toString().padStart(2, '0')} value={i} />
                ))}
              </Picker>
            </View>
            <Text style={styles.pickerLabel}>Hours</Text>
          </View>
          <View style={styles.pickerWrapper}>
            <View style={styles.pickerBackground}>
              <Picker
                selectedValue={minutes}
                onValueChange={(itemValue) => setMinutes(itemValue)}
                style={styles.picker}
              >
                {[...Array(60)].map((_, i) => (
                  <Picker.Item key={i} label={i.toString().padStart(2, '0')} value={i} />
                ))}
              </Picker>
            </View>
            <Text style={styles.pickerLabel}>Minutes</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleRequest}>
          <Text style={styles.buttonText}>Send Request</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    height: 60,
    textAlignVertical: 'top',
  },
  durationLabel: {
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
  pickerBackground: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  picker: {
    width: 100,
    height: 150,
  },
  pickerLabel: {
    marginTop: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EmergencyUnlockScreen;