import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import Onboard from './src/screens/onboard';
import Verification from './src/screens/verification';
import Selfie from './src/screens/selfie';
import Store from './src/screens/store';
import Item from './src/screens/item';
import Optional from './src/screens/optional';
import ConfirmQr from './src/screens/qr';
import HelpType from './src/screens/helpType';
import BrowseRequests from './src/screens/browseRequests';
import ReqItem from './src/screens/reqItem';
import ThankYou from './src/screens/thankyou';


const Stack = createStackNavigator();


function MyStack() {
  return (
    <Stack.Navigator
      initialRouteName="Onboard"
    >
      <Stack.Screen 
        name="Onboard" 
        component={Onboard} 
        options={{ headerShown: false}} 
      />
      <Stack.Screen 
        name="Verification" 
        component={Verification} 
        options={{ headerShown: false}} 
      />
      <Stack.Screen 
        name="Selfie" 
        component={Selfie} 
        options={{ headerShown: false}} 
      />
      <Stack.Screen 
        name="Store" 
        component={Store} 
        options={{ headerShown: false}} 
      />
      <Stack.Screen 
      name="Item" 
      component={Item} 
      options={{ headerShown: false}} 
    />
    <Stack.Screen 
      name="Optional" 
      component={Optional} 
      options={{ headerShown: false}} 
    />
    <Stack.Screen 
      name="ConfirmQr" 
      component={ConfirmQr} 
      options={{ headerShown: false}} 
    />
    <Stack.Screen 
      name="HelpType" 
      component={HelpType} 
      options={{ headerShown: false}} 
    />
    <Stack.Screen 
      name="BrowseRequests" 
      component={BrowseRequests} 
      options={{ headerShown: false}} 
    />
    <Stack.Screen 
      name="ReqItem" 
      component={ReqItem} 
      options={{ headerShown: false}} 
    />
    <Stack.Screen 
      name="Thankyou" 
      component={ThankYou} 
      options={{ headerShown: false}} 
    />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}