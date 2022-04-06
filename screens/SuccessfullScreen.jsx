import React, { useState, useContext } from 'react'
import { StyleSheet, Text, View, TextInput, Button, Pressable, ImageBackground } from 'react-native'
import { CardStyleInterpolators } from 'react-navigation-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContext } from 'react-navigation';

import { UserContext } from '../context/UserContext';


// import backgroundImage from '../assets/backgroundImages/mobile-background-image.jpg';

const LoginScreen = ({ navigation }) => {

    const { userContext, setUserContext } = useContext(UserContext);
    
    return (
        <SafeAreaView>
            <Text>SUCCESSFULLY LOOGED IN !</Text>
            <Text>First name : {userContext.firstName}</Text>            
        </SafeAreaView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
})
