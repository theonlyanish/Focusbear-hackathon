import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LogBox } from 'react-native';

import LoginScreen from './screens/LoginScreen';
import HomePage from './screens/HomePage';
import FriendsScreen from './screens/FriendsScreen';
import LockScreen from './screens/LockScreen';
import EmergencyUnlockScreen from './screens/EmergencyUnlockScreen';
import UnlockRequestDetailScreen from './screens/UnlockRequestDetailScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Home') {
          iconName = 'home';
        } else if (route.name === 'Friends') {
          iconName = 'people';
        } else if (route.name === 'Lock') {
          iconName = 'lock';
        }
        return <Icon name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={HomePage} />
    <Tab.Screen name="Friends" component={FriendsScreen} />
    <Tab.Screen name="Lock" component={LockScreen} options={{ headerShown: false }} />
  </Tab.Navigator>
);

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="EmergencyUnlock" component={EmergencyUnlockScreen} options={{ headerShown: true, title: 'Emergency Unlock' }} />
        <Stack.Screen name="UnlockRequestDetail" component={UnlockRequestDetailScreen} options={{ headerShown: true, title: 'Unlock Request' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
