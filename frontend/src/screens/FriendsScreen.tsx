import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, ActivityIndicator, SafeAreaView } from 'react-native';
import FriendCard from '../components/FriendCard';
import InviteCard from '../components/InviteCard';
import InviteFriendCard from '../components/InviteFriendCard';
import { inviteService, userService } from '../services/api';

const FriendsScreen = () => {
  const [friends, setFriends] = useState([]);
  const [invites, setInvites] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [friendsData, invitesData, usersData] = await Promise.all([
        inviteService.getInvites(1), // Replace 1 with the actual user ID
        inviteService.getInvites(1), // Replace 1 with the actual user ID
        userService.getUsers(),
      ]);
      setFriends(friendsData);
      setInvites(invitesData);
      setUsers(usersData);
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (userId) => {
    try {
      await inviteService.sendInvite(1, userId); // Replace 1 with the actual user ID
      // Update the UI to reflect the sent invite
      setUsers(users.filter(user => user.id !== userId));
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } catch (err) {
      console.error('Failed to send invite:', err);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const renderInvite = ({ item }) => (
    <InviteCard
      name={item.name}
      email={item.email}
      onAccept={() => handleAcceptInvite(item.id)}
      onReject={() => handleRejectInvite(item.id)}
    />
  );

  const renderUser = ({ item }) => (
    <InviteFriendCard
      name={item.name}
      email={item.email}
      isSelected={selectedUsers.includes(item.id)}
      isPending={false}
      onSelect={() => toggleUserSelection(item.id)}
    />
  );

  const inviteFriends = () => {
    selectedUsers.forEach(handleInvite);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#FFA500" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>My Circle</Text>
        
        <View style={[styles.section, styles.invitesSection]}>
          <Text style={styles.sectionTitle}>Invites</Text>
          {invites.length > 0 ? (
            <FlatList
              data={invites}
              renderItem={renderInvite}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.noItemsText}>No invites</Text>
          )}
        </View>
        
        <View style={[styles.section, styles.inviteFriendsSection]}>
          <Text style={styles.sectionTitle}>Invite Friends to be Your Accountability Buddy</Text>
          <FlatList
            data={users}
            renderItem={renderUser}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </View>
        
        <TouchableOpacity 
          style={[styles.inviteButton, selectedUsers.length === 0 && styles.disabledButton]} 
          onPress={inviteFriends}
          disabled={selectedUsers.length === 0}
        >
          <Text style={styles.inviteButtonText}>Invite Friends</Text>
        </TouchableOpacity>
      </ScrollView>
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFA500',
  },
  section: {
    marginBottom: 20,
  },
  invitesSection: {
    flex: 1, // Takes up 1/3 of the screen
    marginBottom: 40, // Add extra space below the Invites section
  },
  inviteFriendsSection: {
    flex: 2, // Takes up 2/3 of the screen
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFA500',
  },
  noItemsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  inviteButton: {
    backgroundColor: '#FFE0B2', // Lighter shade of orange
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  inviteButtonText: {
    color: '#FFA500', // Orange text
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
  errorText: {
    fontSize: 16,
    color: '#FF6347',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default FriendsScreen;