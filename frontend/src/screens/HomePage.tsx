import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import UnlockRequestCard from '../components/UnlockRequestCard';

// Mock data for unlock requests (replace with actual data fetching logic)
const mockUnlockRequests = [
  { id: '1', name: 'John Doe', reason: 'Emergency call', duration: 3600 },
  { id: '2', name: 'Jane Smith', reason: 'Work deadline', duration: 7200 },
];

const HomePage = () => {
  const [unlockRequests, setUnlockRequests] = useState(mockUnlockRequests);
  const navigation = useNavigation();

  const handleRequestPress = (request) => {
    navigation.navigate('UnlockRequestDetail', { request });
  };

  const renderUnlockRequest = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleRequestPress(item)}
    >
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardSubtitle}>Tap to view details</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Focusbear</Text>
      <Text style={styles.subtitle}>Stay focused and accountable!</Text>
      
      <View style={styles.feedContainer}>
        <Text style={styles.feedTitle}>Unlock Requests</Text>
        {unlockRequests.length > 0 ? (
          <FlatList
            data={unlockRequests}
            renderItem={renderUnlockRequest}
            keyExtractor={(item) => item.id}
            style={styles.feedList}
          />
        ) : (
          <Text style={styles.noRequestsText}>No new requests</Text>
        )}
      </View>
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  feedContainer: {
    flex: 1,
  },
  feedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  feedList: {
    flex: 1,
  },
  noRequestsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
});

export default HomePage;