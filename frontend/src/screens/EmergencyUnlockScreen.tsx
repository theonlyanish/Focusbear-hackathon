import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation'; // You might need to create this file if it doesn't exist
import api from '../services/api';
import { formatTime } from '../utils/timeUtils';
import { UnlockRequest } from '../types/unlockRequest';

const EmergencyUnlockScreen = () => {
  const [reason, setReason] = useState('');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [timer, setTimer] = useState(0);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: '',
    });
    checkAcceptedRequests();
  }, [navigation]);

  const checkAcceptedRequests = async () => {
    try {
      const response = await api.get(`/unlocks/requests/${global.currentUser.id}`);
      const acceptedRequest = response.data.find((req: UnlockRequest) => req.status === 'accepted');
      if (acceptedRequest) {
        startTimer(acceptedRequest.timePeriod);
      }
    } catch (error) {
      console.error('Error checking accepted requests:', error);
    }
  };

  const startTimer = (duration: number) => {
    setTimer(duration);
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

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
        {timer > 0 ? (
          <Text style={styles.timerText}>Time remaining: {formatTime(timer)}</Text>
        ) : (
          <>
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
          </>
        )}
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
  timerText: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default EmergencyUnlockScreen;