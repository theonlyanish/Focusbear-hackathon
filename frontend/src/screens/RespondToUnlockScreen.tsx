import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const RespondToUnlockRequestScreen = ({ route }) => {
const { requesterId, reason, requestedDuration } = route.params;
const [allowedDuration, setAllowedDuration] = useState(requestedDuration.toString());

const handleAccept = () => {
// handle accept for unlock
console.log('Accepting unlock request:', { requesterId, allowedDuration });
};

const handleReject = () => {
// handle reject
console.log('Rejecting unlock request:', { requesterId });
};

return (
<View style={styles.container}>
<Text style={styles.title}>Unlock Request</Text>
<Text>Requester: {requesterId}</Text>
<Text>Reason: {reason}</Text>
<Text>Requested Duration: {requestedDuration} minutes</Text>
<TextInput
style={styles.input}
placeholder="Allowed duration (in minutes)"
value={allowedDuration}
onChangeText={setAllowedDuration}
keyboardType="numeric"
/>
<View style={styles.buttonContainer}>
<Button title="Accept" onPress={handleAccept} />
<Button title="Reject" onPress={handleReject} color="red" />
</View>
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
buttonContainer: {
flexDirection: 'row',
justifyContent: 'space-around',
},
});

export default RespondToUnlockRequestScreen;