import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import InviteAccountabilityBuddyScreen from './screens/InviteAccountabilityBuddyScreen';
import AcceptInvitationScreen from './screens/AcceptInvitationScreen';
import RequestUnlockScreen from './screens/RequestUnlockScreen';
import RespondToUnlockRequestScreen from './screens/RespondToUnlockRequestScreen';

const Stack = createStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="InviteBuddy" component={InviteAccountabilityBuddyScreen} />
        <Stack.Screen name="AcceptInvitation" component={AcceptInvitationScreen} />
        <Stack.Screen name="RequestUnlock" component={RequestUnlockScreen} />
        <Stack.Screen name="RespondToUnlock" component={RespondToUnlockRequestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;