import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import api from '../services/api';
import { lockService } from '../services/api';

interface UnlockRequestDetailScreenProps {
  request: {
    id: number;
    user: {
      id: number;
      name: string;
    };
    reason: string;
    timePeriod: number;
  };
}

type UnlockRequestDetailScreenRouteProp = RouteProp<
  { UnlockRequestDetail: UnlockRequestDetailScreenProps },
  'UnlockRequestDetail'
>;

const UnlockRequestDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<UnlockRequestDetailScreenRouteProp>();
  const { request } = route.params;

  const handleAccept = async () => {
    try {
      console.log('Accepting unlock request:', request.id, 'for user:', global.currentUser.id);
      const response = await api.post(`/unlocks/${request.id}/accept`, { friendId: global.currentUser.id });
      console.log('Unlock request acceptance response:', response.data);

      if (response.data === 'accepted' && request.user?.id) {
        const currentTime = new Date();
        const unlockedUntil = new Date(currentTime.getTime() + request.timePeriod * 1000);
        await lockService.updateLockStatus(request.user.id, false, unlockedUntil);
      }
      await api.post(`/unlocks/${request.id}/accept`, { friendId: global.currentUser.id });
      Alert.alert('Success', 'Unlock request accepted');
      
      // Fetch updated lock status
      const updatedStatus = await lockService.getLockStatus(request.user?.id);
      console.log('Updated lock status:', updatedStatus);

      // You might want to update your app's global state here with the new lock status

      navigation.goBack();
    } catch (error) {
      console.error('Error accepting unlock request:', error);
      Alert.alert('Error', 'Failed to accept unlock request');
    }
  };
  
  const handleReject = async () => {
    try {
      await api.post(`/unlocks/${request.id}/reject`, { friendId: global.currentUser.id });
      Alert.alert('Success', 'Unlock request rejected');
      navigation.goBack();
    } catch (error) {
      console.error('Error rejecting unlock request:', error);
      Alert.alert('Error', 'Failed to reject unlock request');
    }
  };
  
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Unlock Request</Text>
        <View style={styles.card}>
          <Text style={styles.name}>{request.user?.name || 'Unknown User'}</Text>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Reason:</Text>
            <Text style={styles.value}>{request.reason}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Duration:</Text>
            <Text style={styles.value}>{formatDuration(request.timePeriod)}</Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={handleAccept}>
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.rejectButton]} onPress={handleReject}>
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  value: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UnlockRequestDetailScreen;