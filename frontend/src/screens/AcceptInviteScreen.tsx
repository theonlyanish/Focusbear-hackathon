import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const AcceptInvitationScreen = ({ route }) => {
const { inviterId } = route.params;

const handleAccept = () => {
// backend connection to handle accept
console.log('Accepting invitation from:', inviterId);
};

const handleDecline = () => {
//backend connection to decline invite
console.log('Declining invitation from:', inviterId);
};

return (
<View style={styles.container}>
<Text style={styles.title}>Accountability Buddy Invitation</Text>
<Text>You've been invited to be an accountability buddy!</Text>
<View style={styles.buttonContainer}>
<Button title="Accept" onPress={handleAccept} />
<Button title="Decline" onPress={handleDecline} color="red" />
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
buttonContainer: {
flexDirection: 'row',
justifyContent: 'space-around',
marginTop: 20,
},
});

export default AcceptInvitationScreen;