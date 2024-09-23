import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

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
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Friends') {
          iconName = focused ? 'people' : 'people-outline';
        } else if (route.name === 'Lock') {
          iconName = focused ? 'lock-closed' : 'lock-closed-outline';
        }
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: 'blue',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={HomePage} options={{ headerShown: false }}/>
    <Tab.Screen name="Friends" component={FriendsScreen} options={{ headerShown: false }}/>
    <Tab.Screen name="Lock" component={LockScreen} options={{ headerShown: false }} />
  </Tab.Navigator>
);

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerBackTitleVisible: false,
          headerTitleAlign: 'center',
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="EmergencyUnlock" component={EmergencyUnlockScreen} options={{ headerTitle: 'Emergency Unlock' }} />
        <Stack.Screen name="UnlockRequestDetail" component={UnlockRequestDetailScreen} options={{ headerShown: true, title: 'Unlock Request' }} />
      </Stack.Navigator>
      </NavigationContainer>
  );
}

export default App;