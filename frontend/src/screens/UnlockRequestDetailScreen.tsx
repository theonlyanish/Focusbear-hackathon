import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

type UnlockRequestDetailScreenRouteProp = RouteProp<RootStackParamList, 'UnlockRequestDetail'>;

interface Props {
  route: UnlockRequestDetailScreenRouteProp;
}

const UnlockRequestDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { request } = route.params;

  const handleAccept = async () => {
    try {
      await unlockService.respondToUnlockRequest(request.id, global.currentUser.id, 'accepted');
      Alert.alert('Success', 'Unlock request accepted');
      navigation.goBack();
    } catch (error) {
      console.error('Error accepting unlock request:', error);
      Alert.alert('Error', 'Failed to accept unlock request');
    }
  };

  const handleReject = async () => {
    try {
      await unlockService.respondToUnlockRequest(request.id, global.currentUser.id, 'rejected');
      Alert.alert('Success', 'Unlock request rejected');
      navigation.goBack();
    } catch (error) {
      console.error('Error rejecting unlock request:', error);
      Alert.alert('Error', 'Failed to reject unlock request');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Unlock Request</Text>
        <View style={styles.card}>
          <Text style={styles.name}>{request.user.name}</Text>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Reason:</Text>
            <Text style={styles.value}>{request.reason}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Duration:</Text>
            <Text style={styles.value}>{`${Math.floor(request.timePeriod / 3600)}h ${(request.timePeriod % 3600) / 60}m`}</Text>
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