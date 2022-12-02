import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './app/home';
import ProfileScreen from './app/account';
import SigninScreen from './app/signin';
import SplashScreen from './app/splash';
import CategoriesScreen from './app/categories';
import AddCategoryScreen from './app/add-category';
import AddTransactionScreen from './app/add-transaction';
import TransactionDetailScreen from './app/transaction-detail';
import PieScreen from './app/pie';
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="splash"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="splash" component={SplashScreen} />
        <Stack.Screen name="signin" component={SigninScreen} />
        <Stack.Screen name="home" component={HomeScreen} />
        <Stack.Screen name="account" component={ProfileScreen} />
        <Stack.Screen name="categories" component={CategoriesScreen} />
        <Stack.Screen name="addCategory" component={AddCategoryScreen} />
        <Stack.Screen
          name="transactionDetail"
          component={TransactionDetailScreen}
        />
        <Stack.Screen name="addTransaction" component={AddTransactionScreen} />
        <Stack.Screen name="pie" component={PieScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
