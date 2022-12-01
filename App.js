import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './app/home';
import ProfileScreen from './app/account';
import SigninScreen from './app/signin';
import SplashScreen from './app/splash';
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
      initialRouteName="splash"
      screenOptions={{ headerShown: false}}
      >
        <Stack.Screen
          name="home"
          component={HomeScreen}
        />
      <Stack.Screen
          name="signin"
          component={SigninScreen}
        />
        <Stack.Screen
          name="account"
          component={ProfileScreen}
        />
        <Stack.Screen
          name="splash"
          component={SplashScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
