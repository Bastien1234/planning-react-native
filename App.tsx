import { StatusBar } from 'expo-status-bar';
import React from "react";
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import 'react-native-gesture-handler';

import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';

const StackNavigator = createStackNavigator(
  {
    Home : HomeScreen,
    Login: LoginScreen
  },
  {
    initialRouteName: "Home",
    headerMode: "none"
  }
)

const Routes = createAppContainer(StackNavigator);

export default function App() {
  return (
    <Routes />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
