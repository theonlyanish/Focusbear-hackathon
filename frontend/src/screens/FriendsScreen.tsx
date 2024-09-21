import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import FriendCard from '../components/FriendCard';
import InviteCard from '../components/InviteCard';
import InviteFriendCard from '../components/InviteFriendCard';
import Banner from '../components/Banner';

// Mock data (replace with actual data fetching logic)
const mockFriends = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
];

const mockInvites = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com' },
];

const mockPotentialFriends = [
  { id: '1', name: 'Charlie Brown', email: 'charlie@example.com' },
  { id: '2', name: 'Diana Prince', email: 'diana@example.com' },
  { id: '3', name: 'Ethan Hunt', email: 'ethan@example.com' },
];

const FriendsScreen = () => {
  const [friends, setFriends] = useState(mockFriends);
  const [invites, setInvites] = useState(mockInvites);
  const [potentialFriends, setPotentialFriends] = useState(mockPotentialFriends);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [showBanner, setShowBanner] = useState(false);
  const [pendingInvites, setPendingInvites] = useState([]);

  useEffect(() => {
    if (showBanner) {
      const timer = setTimeout(() => setShowBanner(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showBanner]);

  const renderFriend = ({ item }) => <FriendCard name={item.name} />;
  const renderInvite = ({ item }) => <InviteCard name={item.name} email={item.email} />;
  const renderPotentialFriend = ({ item }) => (
    <InviteFriendCard
      name={item.name}
      email={item.email}
      isSelected={selectedFriends.includes(item.id)}
      isPending={pendingInvites.includes(item.id)}
      onSelect={() => toggleFriendSelection(item.id)}
    />
  );

  const toggleFriendSelection = (id) => {
    if (!pendingInvites.includes(id)) {
      setSelectedFriends(prev => 
        prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
      );
    }
  };

  const inviteFriends = () => {
    console.log('Inviting friends:', selectedFriends);
    // Implement your invite logic here
    setPendingInvites([...pendingInvites, ...selectedFriends]);
    setSelectedFriends([]);
    setShowBanner(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>My Circle</Text>
        
        {friends.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Friends</Text>
            <FlatList
              data={friends}
              renderItem={renderFriend}
              keyExtractor={(item) => item.id}
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
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.noItemsText}>No invites</Text>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Invite Friends to be Your Accountability Buddy</Text>
          <FlatList
            data={potentialFriends}
            renderItem={renderPotentialFriend}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
        
        <TouchableOpacity 
          style={[styles.inviteButton, selectedFriends.length === 0 && styles.disabledButton]} 
          onPress={inviteFriends}
          disabled={selectedFriends.length === 0}
        >
          <Text style={styles.inviteButtonText}>Invite Friends</Text>
        </TouchableOpacity>
      </ScrollView>
      {showBanner && <Banner message="Invites sent successfully!" />}
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noItemsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  inviteButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  inviteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});

export default FriendsScreen;