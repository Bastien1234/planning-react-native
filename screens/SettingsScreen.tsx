import React, { useState, useContext, useEffect } from 'react'
import { StyleSheet, Text, View, Image, TextInput, Button, Pressable, ImageBackground, ActivityIndicator, ScrollView  } from 'react-native';
import { CardStyleInterpolators } from 'react-navigation-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContext } from 'react-navigation';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { UserContext } from '../context/UserContext';

import URL from '../utils/URL';

const backendUrl:string = URL;

const cssColors = {
    na: "rgb(255, 255, 153)",
    off: "",
    am: "rgb(153, 204, 255)",
    mid: "rgb(255, 153, 153)",
    pm: "rgb(255, 204, 153)",
    cp: "rgb(153, 255, 255)"
}

const planningOptions: string[] = ["am", "mid", "pm", "off", "cp"];
const weekList: string[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const monthList: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "Decemnber"];


const PlanningScreen = ({ navigation }) => {

    const { userContext, setUserContext } = useContext(UserContext);

    const [isLoading, setIsLoading] = useState(true);

    // If the user comes here without being logged in...get him tf out ! =)

    // if (userContext.loggedIn === false)
    //     navigation.navigate('Home');

    const team = userContext.team;

    const [changePasswordPage, setChangePasswordPage] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
    const [newPasswordValues, setNewPasswordValue] = useState({
        password: "",
        passwordConfirm: "",
        passwordCurrent: ""
    })

    // Logout function

    const setToken = async (value) => {
        try {
          await AsyncStorage.setItem('token', value)
        } catch (e) {
          console.log(e.message);
        }
    }

    const getToken = async (value) => {
        try {
            const returnValue = await AsyncStorage.getItem(value);
            return returnValue;
        } catch (e) {
            console.log("error when returning getToken, message : ", e.message);
        }
    }

    async function logout() {
        await setToken('logOut');

        setUserContext({
            loggedIn: false,
            isAdmin: false,
            firstName: "",
            lastName: "",
            email: "",
            team: "", 
            id: ""
        });
    }

    

    

    async function changePassword(passwordCurrent: string, password: string, passwordConfirm: string)
    {
        if (password !== passwordConfirm)
        {
            setPasswordErrorMessage("Password and confirm don't match moron !");
            return;
        }

        if (password === passwordCurrent)
        {
            setPasswordErrorMessage("Can't change for the same password stupid !");
            return;
        }

        let token = "Bearer ";
        try {
            let localToken = getToken('token');
            token += localToken;
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': token
              }

            const response = await axios.put(`${backendUrl}/api/v1/users/changePassword`, {
                passwordCurrent: newPasswordValues.passwordCurrent,
                password: newPasswordValues.password,
                passwordConfirm: newPasswordValues.passwordConfirm,
                email: userContext.email
            });

            if (response.status === 200)
            {
                setPasswordErrorMessage("Password Changed");
                setTimeout(() => {
                    setPasswordErrorMessage("");
                }, 500);
            }

            else {
                setPasswordErrorMessage("Something's wrong...");
            }
                
        } catch (e) {
            console.log(e.message)
        }
    }

    return (
        
        <SafeAreaView style={styles.globalContainer}>
            <View style={styles.header}>
            <Pressable
                onPress={() => navigation.navigate("Planning")}>
                <Image source={require('./../assets/icons/back.png')} style={styles.png}/>
            </Pressable>

            <Pressable>
                <Text>Logout</Text>
            </Pressable>

            </View>
            

            <Text>Settings Screen</Text>
            
        </SafeAreaView>
    )
}

export default PlanningScreen

const styles = StyleSheet.create({
    globalContainer: {
        flex: 1,
        backgroundColor: "rgb(235, 232, 231)",
    },
    header: {
        display: "flex",
        width: "100%",
        flexDirection: "row",
        height: 65,
        backgroundColor: "rgb(235, 232, 231)",
        justifyContent: "center"
    },
    png: {
        height: 50,
        width: 50
    }
})
