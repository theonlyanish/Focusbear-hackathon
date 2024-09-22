import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, ActivityIndicator, SafeAreaView, Alert } from 'react-native';
import FriendCard from '../components/FriendCard';
import InviteCard from '../components/InviteCard';
import InviteFriendCard from '../components/InviteFriendCard';
import { inviteService, userService, friendService } from '../services/api';
import axios from 'axios';
import { User } from '../types/User';


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
      const currentUserId = global.currentUser.id;
      console.log('Fetching data for user ID:', currentUserId);
      
      const [friendsData, invitesData, usersData] = await Promise.all([
        friendService.getFriends(currentUserId),
        inviteService.getInvites(currentUserId),
        userService.getUsers(),
      ]);
      
      console.log('Friends data:', friendsData);
      console.log('Invites data:', invitesData);
      console.log('Users data:', usersData);
      
      setFriends(friendsData.map(friend => ({
        id: friend.friend.id,
        name: friend.friend.name,
        email: friend.friend.email
      })));
      //setInvites(invitesData);
      setInvites(invitesData.map(invite => ({
        id: invite.id,
        name: invite.user.name,
        email: invite.user.email,
        userId: invite.user.id
      })));
      const potentialFriends = usersData.filter(user => 
        user.id !== currentUserId && 
        !friendsData.some(friend => friend.friend.id === user.id) &&
        !invitesData.some(invite => invite.friend_id === user.id)
      );
      setUsers(potentialFriends);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    try {
      for (const userId of selectedUsers) {
        await inviteService.sendInvite(global.currentUser.id, userId);
      }
      Alert.alert('Success', 'Invitations sent successfully');
      setSelectedUsers([]);
      fetchData(); // Refresh the data
    } catch (err) {
      console.error('Failed to send invites:', err);
      Alert.alert('Error', 'Failed to send invitations. Please try again.');
    }
  };

  const handleAcceptInvite = async (inviteId) => {
    try {
      await inviteService.acceptInvite(inviteId, global.currentUser.id);
      const acceptedInvite = invites.find(invite => invite.id === inviteId);
      const inviter = users.find(user => user.id === acceptedInvite.user_id);
      setFriends([...friends, inviter]);
      setInvites(invites.filter(invite => invite.id !== inviteId));
      setUsers(users.filter(user => user.id !== acceptedInvite.user_id));
    } catch (err) {
      console.error('Failed to accept invite:', err);
      Alert.alert('Error', 'Failed to accept invitation. Please try again.');
    }
  };

  const handleRejectInvite = async (inviteId) => {
    try {
      await inviteService.rejectInvite(inviteId, global.currentUser.id);
      Alert.alert('Success', 'Invitation rejected');
      fetchData(); // Refresh the data
    } catch (err) {
      console.error('Failed to reject invite:', err);
      Alert.alert('Error', 'Failed to reject invitation. Please try again.');
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const renderFriend = ({ item }) => <FriendCard name={item.name} />;
  
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

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>My Circle</Text>
        
        {friends.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Friends</Text>
            <FlatList
              data={friends}
              renderItem={renderFriend}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}
        
        <View style={styles.section}>
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
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Invite Friends</Text>
          <FlatList
            data={users}
            renderItem={renderUser}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
      
      {selectedUsers.length > 0 && (
        <TouchableOpacity style={styles.sendInvitationButton} onPress={handleInvite}>
          <Text style={styles.sendInvitationButtonText}>
            Send Invitation ({selectedUsers.length})
          </Text>
        </TouchableOpacity>
      )}
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
  sendInvitationButton: {
    backgroundColor: '#FFA500',
    padding: 15,
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  sendInvitationButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: '#FF6347',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default FriendsScreen;