import 'react-native-gesture-handler';  
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import HomePage from './screens/HomePage';
import FriendsScreen from './screens/FriendsScreen';
import LockScreen from './screens/LockScreen';
import EmergencyUnlockScreen from './screens/EmergencyUnlockScreen';
import UnlockRequestDetailScreen from './screens/UnlockRequestDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomePage} />
    <Stack.Screen name="UnlockRequestDetail" component={UnlockRequestDetailScreen} options={{ title: 'Unlock Request' }} />
  </Stack.Navigator>
);

const FriendsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Friends" component={FriendsScreen} />
  </Stack.Navigator>
);

const LockStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Lock" component={LockScreen} />
    <Stack.Screen name="EmergencyUnlock" component={EmergencyUnlockScreen} options={{ title: 'Emergency Unlock' }} />
  </Stack.Navigator>
);

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'HomeMain') {
              iconName = 'home';
            } else if (route.name === 'Friends') {
              iconName = 'people';
            } else if (route.name === 'Lock') {
              iconName = 'lock';
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#FFA500',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: { backgroundColor: '#FFFFFF' },
          headerShown: false,
        })}
      >
        <Tab.Screen name="HomeMain" component={HomeStack} />
        <Tab.Screen name="Friends" component={FriendsStack} />
        <Tab.Screen name="Lock" component={LockStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
