import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface FriendCardProps {
  name: string;
}

const FriendCard: React.FC<FriendCardProps> = ({ name }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FriendCard;
