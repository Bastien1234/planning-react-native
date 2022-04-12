import React, { useState, useContext } from 'react'
import { StyleSheet, Text, View, TextInput, Button, Pressable, ImageBackground, ActivityIndicator  } from 'react-native';
import { CardStyleInterpolators } from 'react-navigation-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContext } from 'react-navigation';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { UserContext } from './../context/UserContext';

import URL from '../utils/URL';

const backendURL = `${URL}/api/v1/users/login`;


// import backgroundImage from '../assets/backgroundImages/mobile-background-image.jpg';

const LoginScreen = ({ navigation }) => {

    const { userContext, setUserContext } = useContext(UserContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errMessage, setErrMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Loggin existing user

    const storeToken = async (value) => {
        try {
          await AsyncStorage.setItem('token', value)
        } catch (e) {
          console.log(e.message);
        }
      }

    const signInOnClick = async () => {
        // Errors handled on front end
        if (email === "") {
            setErrMessage("Provide email");
            return;
        }  
        else if (password === "") {
            setErrMessage("Choose password");
            return;
        }
            
        // Try to log in with backend
        const bodyConfig = {
            email: email,
            password: password
        }

        try {
            setIsLoading(true);
            const response = await axios.post(backendURL, bodyConfig);
            if (response.status === 200) {
                // Send token
                await storeToken(response.data.token);
                const u = response.data.user;
                
                
                setUserContext({
                    loggedIn: true,
                    isAdmin: u.isAdmin,
                    firstName: u.firstName,
                    lastName: u.lastName,
                    team: u.team,
                    email: u.email,
                    id: u._id
                });

                setIsLoading(false)

                navigation.navigate("Planning");
            }
            
        } catch(e) {
            setErrMessage("Smthng went wrong");
            console.log("error message : " + e.message)
            setIsLoading(false);
        }

    }



    return (

        
        
        <SafeAreaView style={styles.globalContainer}>

        {
            (isLoading===true) ? <ActivityIndicator size="large" color="rgb(235, 232, 231)" style={{paddingTop: 150}}/> : 
              
            
            <View style={{flex:1}}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Planning Manager</Text>
                </View>

                {/* App */}
                <View style={styles.inputsContainer}>
                    <View style={styles.viewHolder}>
                        <Text style={styles.preTextInput}>Enter email</Text>
                        <TextInput 
                            style={styles.textInput} 
                            placeholder="" 
                            value={email}
                            onChangeText={setEmail}
                            />

                        <View style={{marginTop: 20}}></View>
                        <Text style={styles.preTextInput}>Enter password</Text>
                        <TextInput 
                            secureTextEntry={true}
                            style={styles.textInput} 
                            placeholder=""
                            value={password}
                            onChangeText={setPassword}
                            />

                        <View style={{marginTop: 30}}></View>


                        <Pressable style={styles.button}
                            onPress={() => signInOnClick()}
                        >
                            <Text style={styles.buttonText}>Sign In</Text>
                        </Pressable>
                        <Text style={{color: "rgb(168, 66, 50)", marginTop: 15, fontSize: 25}}>{errMessage}</Text>
                    </View>

                    {/* Separator */}
                    <View style={{paddingBottom: 30}}></View>

                    <View style={styles.viewHolder}>
                        <Text style={{ fontSize: 18 }}>New here ?</Text>

                        <Pressable style={styles.button}
                        onPress={()=> navigation.navigate("NewTeam")}>
                            <Text style={styles.buttonText}>Start New Team</Text>
                        </Pressable>

                    </View>
                </View>     
            </View>

        }
            
        </SafeAreaView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    globalContainer: {
        flex: 1,
        // backgroundColor: "rgb(110, 116, 170)",
        backgroundColor: "rgb(235, 232, 231)",
    },
    header: {
        display: "flex",
        height: 65,
        marginTop: 50,
        backgroundColor: "rgb(235, 232, 231)",
        justifyContent: "center"
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: "bold",
        color: "rgb(110, 116, 170)",
        // marginTop: 50,
        // marginBottom: 15,
        alignSelf: "center"
    },
    headerImage: {
        flex: 1,
        resizeMode: "center",
        justifyContent: 'center',
        opacity: 0.7
    },
    inputsContainer: {
        flex: 1,
        justifyContent: "space-between",
        marginTop: 50,
        marginBottom: 50,
    },
    viewHolder: {
        display: "flex",
        alignItems: "center"
    },
    preTextInput: {
        fontSize: 17,
        paddingLeft: 20,
        alignSelf: "flex-start",
    },
    button: {
        backgroundColor: "rgb(238, 247, 255)",
        width: 150,
        height: 45,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        marginTop: 10,
    },
    buttonText: {
        fontSize: 20
    },
    textInput: {
        display: "flex",
        // backgroundColor: "white",
        borderWidth: 1,
        borderLeftColor: "black",
        borderBottomColor: "black",
        borderTopColor: "rgb(235, 232, 231)",
        borderRightColor: "rgb(235, 232, 231)",
        width: "95%",
        marginTop: 5,
        borderRadius: 3,
        fontSize: 20,
    }
})
