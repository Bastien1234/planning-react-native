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

    const [isLoading, setIsLoading] = useState(false);

    // If the user comes here without being logged in...get him tf out ! =)

    // if (userContext.loggedIn === false)
    //     navigation.navigate('Home');

    const team = userContext.team;

    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
    const [newPasswordValues, setNewPasswordValue] = useState({
        password: "",
        passwordConfirm: "",
        passwordCurrent: ""
    })

    const [toggleChangePassword, setToggleChangePassword] = useState(false);

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

        navigation.navigate("Login");
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

        setIsLoading(true);

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
                setIsLoading(false);
                setPasswordErrorMessage("Password Changed");
                setTimeout(() => {
                    setPasswordErrorMessage("");
                    setToggleChangePassword(false);
                }, 1000);
            }

            else {
                setIsLoading(false);
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

                <Pressable
                    onPress={()=> {
                        logout();
                    }}
                >
                    <Text style={{
                        fontSize: 25,
                        borderWidth: 2,
                        borderColor: "black",
                        borderRadius: 5,
                        padding: 10
                    }}>Logout</Text>
                </Pressable>

            </View>
            
            {
                isLoading === false ?

                <ScrollView>
                <Pressable 
                    onPress={() => setToggleChangePassword(!toggleChangePassword)}
                    style={{marginTop: 30, ...styles.inline}}>
                    <Image source={require('./../assets/icons/key.png')} style={styles.svg}/>
                    <Text style={styles.textInline}>Change Password</Text>
                </Pressable>

                {
                    toggleChangePassword === true ? 
                    <View>
                        <View style={styles.passwordView}>
                            <Text style={styles.passwordText}>Previous Password</Text>
                            <TextInput 
                                style={styles.passwordTextInput}
                                placeholder=""
                                secureTextEntry={true}
                                onChangeText={text => {
                                    setNewPasswordValue(previousData => {
                                        return {...previousData, passwordCurrent: text.toString()}
                                    })
                                }}
                            />
                        </View>

                        <View style={styles.passwordView}>
                            <Text style={styles.passwordText}>New Password</Text>
                            <TextInput 
                                style={styles.passwordTextInput}
                                placeholder=""
                                secureTextEntry={true}
                                onChangeText={text => {
                                    setNewPasswordValue(previousData => {
                                        return {...previousData, password: text.toString()}
                                    })
                                }}
                            />
                        </View>

                        <View style={styles.passwordView}>
                            <Text style={styles.passwordText}>Confirm New Password</Text>
                            <TextInput 
                                style={styles.passwordTextInput}
                                placeholder=""
                                secureTextEntry={true}
                                onChangeText={text => {
                                    setNewPasswordValue(previousData => {
                                        return {...previousData, passwordConfirm: text.toString()}
                                    })
                                }}
                            />
                        </View>

                        <Pressable 
                            style={styles.button}
                            onPress={() => {
                                changePassword(newPasswordValues.passwordCurrent, newPasswordValues.password, newPasswordValues.passwordConfirm)
                            }}
                            >
                            <Text style={styles.buttonText}>Submit</Text>
                        </Pressable>

                        <Text style={{color: "rgb(168, 66, 50)", marginTop: 15, fontSize: 15, alignSelf:"center"}}>{passwordErrorMessage}</Text>
                    </View>


                    : null
                }
                
                {
                    userContext.isAdmin === true ?

                    <Pressable style={styles.inline}>
                        <Image source={require('./../assets/icons/people.png')} style={styles.svg}/>
                        <Text style={styles.textInline}>Admin Panel</Text>
                    </Pressable>

                    : null
                }

                {
                    
                }
                
            </ScrollView>

            : 

            <ActivityIndicator size="large" color="rgb(110, 116, 170)" style={{paddingTop: 150}}/>

            }
            
            
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
        paddingLeft: 10,
        paddingRight: 10,
        justifyContent: "space-between",
        marginBottom: 20        
    },
    png: {
        height: 50,
        width: 50
    },
    svg: {
        height: 30,
        width: 30
    },
    inline: {
        display: "flex",
        flexDirection: "row",
        margin: 5,
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 5,
        padding: 10,
        alignItems: "center"
    },
    textInline: {
        fontSize: 18,
        marginLeft: 10,
    },
    passwordView: {
        margin: 5,
        marginLeft: 15,
        marginBottom: 10
    },
    passwordText: {
        fontSize: 15,
        marginBottom: 5
    },
    passwordTextInput: {
        height: 50,
        borderRadius: 10,
        backgroundColor: "rgb(209, 204, 203)",
        fontSize: 25,
        paddingLeft: 10,
    },
    button: {
        backgroundColor: "rgb(238, 247, 255)",
        width: 150,
        height: 45,
        display: "flex",
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "center",
        borderRadius: 10,
        marginTop: 10,
    },
    buttonText: {
        fontSize: 20
    },
})
