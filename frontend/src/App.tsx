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

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={HomePage} />
    <Stack.Screen name="UnlockRequestDetail" component={UnlockRequestDetailScreen} options={{ title: 'Unlock Request' }} />
  </Stack.Navigator>
);

const LockStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Lock" component={LockScreen} />
    <Stack.Screen name="EmergencyUnlock" component={EmergencyUnlockScreen} />
  </Stack.Navigator>
);

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
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
            return <Icon name={iconName ?? ''} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Home' }} />
        <Tab.Screen name="Friends" component={FriendsScreen} />
        <Tab.Screen name="LockTab" component={LockStack} options={{ title: 'Lock' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
