import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { NavigationProp, useNavigation, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import UnlockRequestCard from '../components/UnlockRequestCard';
import { UnlockRequest } from '../types/unlockRequest';
import api from '../services/api';

interface Friend {
  user_id: number;
  friend_id: number;
  friend: {
    id: number;
    email: string;
    name: string;
  };
}

const HomePage = () => {
  const [unlockRequests, setUnlockRequests] = useState<UnlockRequest[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const fetchFriends = useCallback(async () => {
    try {
      const response = await api.get(`/friends/${global.currentUser.id}`);
      setFriends(response.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
      Alert.alert('Error', 'Failed to fetch friends. Please try again.');
    }
  }, []);

  const fetchUnlockRequests = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/unlocks/requests/${global.currentUser.id}`);
      const requests = response.data;
      
      console.log('Raw requests data:', requests);

      const flattenedRequests = requests.map(item => {
        console.log('Processing item:', item);
        
        return {
          id: item.unlockRequest.id,
          reason: item.unlockRequest.reason || 'No reason provided',
          timePeriod: parseInt(item.unlockRequest.timePeriod, 10) || 0,
          status: item.unlockRequest.status || 'Unknown',
          user: {
            name: item.unlockRequest.user.name || 'Unknown User'
          }
        };
      });

      console.log('Flattened requests:', flattenedRequests);
      setUnlockRequests(flattenedRequests);
    } catch (error) {
      console.error('Error fetching unlock requests:', error);
      Alert.alert('Error', 'Failed to fetch unlock requests. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchFriends();
    }, [fetchFriends])
  );

  useEffect(() => {
    if (friends.length > 0) {
      fetchUnlockRequests();
    }
  }, [friends, fetchUnlockRequests]);

  const handleRequestPress = (request: UnlockRequest) => {
    navigation.navigate('UnlockRequestDetail', { request });
  };

  const renderUnlockRequest = ({ item }: { item: UnlockRequest }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleRequestPress(item)}
    >
      <UnlockRequestCard
        name={item.user?.name || 'Unknown User'}
        reason={item.reason}
        timePeriod={item.timePeriod}
        status={item.status}
      />
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
          {loading ? (
            <Text style={styles.loadingText}>Loading requests...</Text>
          ) : unlockRequests.length > 0 ? (
            <FlatList
              data={unlockRequests}
              renderItem={renderUnlockRequest}
              keyExtractor={(item) => item.id.toString()}
              style={styles.feedList}
              refreshing={loading}
              onRefresh={fetchUnlockRequests}
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