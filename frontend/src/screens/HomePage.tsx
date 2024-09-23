import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import UnlockRequestCard from '../components/UnlockRequestCard';
//import { YourRequestType } from '../types'; 

// Mock data for unlock requests 
const mockUnlockRequests = [
  { id: '1', name: 'John Doe', reason: 'Emergency call', duration: 3600 },
  { id: '2', name: 'Jane Smith', reason: 'Work deadline', duration: 7200 },
];

const HomePage = () => {
  const [unlockRequests, setUnlockRequests] = useState(mockUnlockRequests);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleRequestPress = (request: YourRequestType) => {
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Welcome to Focusbear</Text>
          <Text style={styles.subtitle}>Stay focused and accountable!</Text>
        </View>
        
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
    justifyContent: 'space-between',
  },
  headerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFA500',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  feedContainer: {
    flex: 1,
  },
  feedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#FFA500',
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
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderColor: '#FFA500',
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#FFA500',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
});

export default HomePage;