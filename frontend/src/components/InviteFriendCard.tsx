import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface InviteFriendCardProps {
  name: string;
  email: string;
  isSelected: boolean;
  isPending: boolean;
  onSelect: () => void;
}

const InviteFriendCard: React.FC<InviteFriendCardProps> = ({ name, email, isSelected, isPending, onSelect }) => {
  return (
    <TouchableOpacity 
      style={[
        styles.card, 
        isSelected && styles.selectedCard,
        isPending && styles.pendingCard
      ]} 
      onPress={onSelect}
      disabled={isPending}
    >
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>
      {isPending && (
        <View style={styles.pendingStatus}>
          <Text style={styles.pendingText}>Pending</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedCard: {
    backgroundColor: '#e6f7ff',
    borderColor: '#1890ff',
    borderWidth: 1,
  },
  pendingCard: {
    opacity: 0.6,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  pendingStatus: {
    backgroundColor: '#ffa500',
    borderRadius: 4,
    padding: 4,
  },
  pendingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default InviteFriendCard;