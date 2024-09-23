import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface UnlockRequestCardProps {
  name?: string;
  reason?: string;
  timePeriod?: number;
  status?: string;
}

const UnlockRequestCard: React.FC<UnlockRequestCardProps> = ({ name, reason, timePeriod, status }) => {
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{name || 'Unknown User'} requests an unlock</Text>
      <Text style={styles.reason}>Reason: {reason || 'No reason provided'}</Text>
      <Text style={styles.timePeriod}>Duration: {formatDuration(timePeriod)}</Text>
      <Text style={styles.status}>Status: {status || 'Unknown'}</Text>
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
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  reason: {
    fontSize: 16,
    marginBottom: 4,
  },
  timePeriod: {
    fontSize: 16,
    marginBottom: 4,
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UnlockRequestCard;
