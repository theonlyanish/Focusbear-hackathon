import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import UnlockRequestCard from '../components/UnlockRequestCard';

// Mock data for unlock requests 
const mockUnlockRequests = [
  { id: '1', name: 'Kent denial', reason: 'I was kidnapped by the mafia' },
  { id: '2', name: 'Jane Smith', reason: 'Work deadline' },
];

const HomePage = () => {
  const [unlockRequests, setUnlockRequests] = useState(mockUnlockRequests);

  const renderUnlockRequest = ({ item }) => (
    <UnlockRequestCard name={item.name} reason={item.reason} />
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
});

export default HomePage;