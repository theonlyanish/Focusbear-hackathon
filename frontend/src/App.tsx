import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from './screens/HomePage';
import InviteAccountabilityBuddyScreen from './screens/InviteAccountabilityBuddyScreen';
import RequestUnlockScreen from './screens/RequestUnlockScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FriendsScreen from './screens/FriendsScreen';

const Tab = createBottomTabNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Invite') {
              iconName = 'person-add';
            } else if (route.name === 'Unlock') {
              iconName = 'lock-open';
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomePage} />
        <Tab.Screen name="Friends" component={FriendsScreen} />
        <Tab.Screen name="Invite" component={InviteAccountabilityBuddyScreen} />
        <Tab.Screen name="Unlock" component={RequestUnlockScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;