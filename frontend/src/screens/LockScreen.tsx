import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';

interface LockScreenRouteParams {
  pendingRequest?: boolean;
}

type RouteParams = {
  pendingRequest?: boolean;
};

const LockScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [isLocked, setIsLocked] = useState(true);
  const [remainingTime, setRemainingTime] = useState(0);
  const [pendingRequest, setPendingRequest] = useState<boolean | null>(null);

  useEffect(() => {
    const params = route.params as RouteParams;
    if (params?.pendingRequest) {
      setPendingRequest(params.pendingRequest);
      // Clear the parameter to prevent re-applying on screen focus
      navigation.setParams({ pendingRequest: undefined } as any);
    }
  }, [route.params?.pendingRequest]);

  useEffect(() => {
    let timer;
    if (!isLocked && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setIsLocked(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLocked, remainingTime]);

  const handleEmergencyUnlock = () => {
    navigation.navigate('EmergencyUnlock');
  };

  // Mock function to simulate approval from the other side
  const simulateApproval = () => {
    if (pendingRequest) {
      setIsLocked(false);
      setRemainingTime(pendingRequest.duration);
      setPendingRequest(null);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Icon 
        name={isLocked ? 'lock' : 'lock-open'} 
        size={100} 
        color={isLocked ? '#4CAF50' : '#FFA500'} 
      />
      <Text style={styles.lockText}>
        {isLocked ? 'You are locked' : 'Temporarily unlocked'}
      </Text>
      {!isLocked && (
        <Text style={styles.timerText}>
          Time remaining: {formatTime(remainingTime)}
        </Text>
      )}
      {isLocked && !pendingRequest && (
        <TouchableOpacity style={styles.button} onPress={handleEmergencyUnlock}>
          <Text style={styles.buttonText}>Emergency Unlock</Text>
        </TouchableOpacity>
      )}
      {pendingRequest && (
        <View style={styles.pendingContainer}>
          <Text style={styles.pendingText}>Unlock request pending</Text>
          <Text style={styles.pendingDetails}>
            Reason: {pendingRequest.reason}
          </Text>
          <Text style={styles.pendingDetails}>
            Duration: {formatTime(pendingRequest.duration)}
          </Text>
        </View>
      )}
      {!isLocked && (
        <Text style={styles.unlockMessage}>You can now use your device</Text>
      )}
      
      {/* Temporary button to simulate approval (remove in production) */}
      {pendingRequest && (
        <TouchableOpacity style={styles.simulateButton} onPress={simulateApproval}>
          <Text style={styles.simulateButtonText}>Simulate Approval</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  lockText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
  },
  timerText: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FF6347',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  unlockMessage: {
    fontSize: 18,
    color: '#4CAF50',
    marginTop: 20,
  },
  simulateButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  simulateButtonText: {
    color: 'white',
    fontSize: 14,
  },
  pendingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  pendingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFA500',
    marginBottom: 10,
  },
  pendingDetails: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default LockScreen;