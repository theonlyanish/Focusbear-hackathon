import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const InviteAccountabilityBuddyScreen = () => {
const [email, setEmail] = useState('');

const handleInvite = () => {
// TODO: Implement API call to send invitation
console.log('Inviting buddy:', email);
};

return (
<View style={styles.container}>
<Text style={styles.title}>Invite Accountability Buddy</Text>
<TextInput
style={styles.input}
placeholder="Enter buddy's email"
value={email}
onChangeText={setEmail}
keyboardType="email-address"
/>
<Button title="Send Invitation" onPress={handleInvite} />
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

export default InviteAccountabilityBuddyScreen;