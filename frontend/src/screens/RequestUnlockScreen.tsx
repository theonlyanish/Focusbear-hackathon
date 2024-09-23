import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const RequestUnlockScreen = () => {
const [reason, setReason] = useState('');
const [duration, setDuration] = useState('');

const handleRequest = () => {
//Implement API call to request unlock
console.log('Requesting unlock:', { reason, duration });
};

return (
<View style={styles.container}>
<Text style={styles.title}>Request Emergency Unlock</Text>
<TextInput
style={styles.input}
placeholder="Reason for unlock"
value={reason}
onChangeText={setReason}
multiline
/>
<TextInput
style={styles.input}
placeholder="Unlock duration (in minutes)"
value={duration}
onChangeText={setDuration}
keyboardType="numeric"
/>
<Button title="Request Unlock" onPress={handleRequest} />
</View>
);
};

const styles = StyleSheet.create({
container: {
flex: 1,
padding: 20,
justifyContent: 'center',
},
title: {
fontSize: 24,
fontWeight: 'bold',
marginBottom: 20,
},
input: {
borderWidth: 1,
borderColor: '#ccc',
padding: 10,
marginBottom: 20,
},
});

export default RequestUnlockScreen;