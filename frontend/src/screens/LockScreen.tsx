import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { unlockService } from '../services/api';

const LockScreen = () => {
  const [unlockRequests, setUnlockRequests] = useState([]);

  useEffect(() => {
    fetchUnlockRequests();
  }, []);

  const fetchUnlockRequests = async () => {
    try {
      const requests = await unlockService.getUnlockRequests(global.currentUser.id);
      setUnlockRequests(requests);
    } catch (error) {
      console.error('Error fetching unlock requests:', error);
      Alert.alert('Error', 'Failed to fetch unlock requests');
    }
  };

  const handleAcceptUnlock = async (unlockRequestId) => {
    try {
      await unlockService.acceptUnlockRequest(unlockRequestId);
      Alert.alert('Success', 'Unlock request accepted');
      fetchUnlockRequests(); // Refresh the list
    } catch (error) {
      console.error('Error accepting unlock request:', error);
      Alert.alert('Error', 'Failed to accept unlock request');
    }
  };

  const handleRejectUnlock = async (unlockRequestId) => {
    try {
      await unlockService.rejectUnlockRequest(unlockRequestId);
      Alert.alert('Success', 'Unlock request rejected');
      fetchUnlockRequests(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting unlock request:', error);
      Alert.alert('Error', 'Failed to reject unlock request');
    }
  };

  const renderUnlockRequest = ({ item }) => (
    <View style={styles.requestItem}>
      <Text>{item.requesterName} wants to unlock your phone</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.acceptButton]}
          onPress={() => handleAcceptUnlock(item.id)}
        >
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.rejectButton]}
          onPress={() => handleRejectUnlock(item.id)}
        >
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unlock Requests</Text>
      {unlockRequests.length > 0 ? (
        <FlatList
          data={unlockRequests}
          renderItem={renderUnlockRequest}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <Text style={styles.noRequestsText}>No unlock requests</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  requestItem: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noRequestsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default LockScreen;