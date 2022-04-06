import { StatusBar } from 'expo-status-bar';
import React, { useState, useContext, useMemo } from "react";
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import 'react-native-gesture-handler';

import { UserContext, UserState } from './context/UserContext';

import LoginScreen from './screens/LoginScreen.jsx';
import NewTeamScreen from './screens/NewTeamScreen';
import SuccessfullScreen from './screens/SuccessfullScreen';

const StackNavigator = createStackNavigator(
  {
    Login : LoginScreen,
    NewTeam: NewTeamScreen,
    Successfull: SuccessfullScreen
  },
  {
    initialRouteName: "Login",
    headerMode: "none"
  }
)

const Routes = createAppContainer(StackNavigator);

export default function App() {

  const [userContext, setUserContext] = useState(null);

  const value = useMemo(() => ({ userContext, setUserContext }), [userContext, setUserContext]);


  return (
    <UserContext.Provider value={value}>
      <Routes />
    </UserContext.Provider>
    
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
