import React, { useState, useContext, useEffect } from 'react'
import { StyleSheet, Text, View, Image, TextInput, Button, Pressable, ImageBackground, ActivityIndicator, ScrollView  } from 'react-native';
import { CardStyleInterpolators } from 'react-navigation-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContext } from 'react-navigation';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { UserContext } from '../context/UserContext';

import URL from '../utils/URL';

const AddUser = React.memo(({setTeamMembers, addUserToggle, setAddUserToggle} ) => {

    const {userContext, setUserContext} = useContext(UserContext);
    console.log('render add user')

    const serverURL: string = `${URL}/api/v1/users/signup`;
    const usersUrl: string = `${URL}/api/v1/users/getAllUsers/`;
    const team: string = userContext.team;
    const getUrl = usersUrl + team

    const [bottomMessage, setBottomMessage] = useState("");

    interface UserInputs {
        firstName: string,
        lastName: string,
        isAdmin: boolean,
        daysOff: [number, number],
        email: string,
        team: string,
        password: string,
        confirmPassword: string 
    }

    const defaultSettings: UserInputs = {
        "firstName": "",
        "lastName": "",
        "isAdmin": false,
        "daysOff": [1, 2],
        "email": "",
        "team": userContext.team,
        "password": "",
        "confirmPassword": ""
    }

    const [newUserData, setNewUserData] = useState(defaultSettings);
    const [daysOff, setDaysOff] = useState([]);

    async function addNewUser() {
        console.log("calling add new user function");
        try {
            // create proper array for days off
            const postResponse = await axios.post(serverURL, newUserData);

            // Set new users list
            const response = await axios.get(getUrl);
            const users = response.data.data;
            setTeamMembers(users);
            setBottomMessage("");

            setAddUserToggle(!addUserToggle);


        } catch (e) {
            setBottomMessage("Sorry, wrong inputs");
            console.log(e.message)        
        }
    }

    return (
        <View>
            <Text style={{
                marginTop: 35,
                alignSelf: "center",
                fontSize: 20,
                marginBottom: 15
            }}>Let's add a new user</Text>

            <View style={styles.passwordView}>
                <Text style={styles.passwordText}>First Name</Text>
                <TextInput 
                    style={styles.passwordTextInput}
                    placeholder=""
                    secureTextEntry={false}
                    onChangeText={text => {
                        setNewUserData(previousData => {
                            return {...previousData, firstName: text.toString()}
                        })
                    }}
                />
            </View>

            <View style={styles.passwordView}>
                <Text style={styles.passwordText}>Last Name</Text>
                <TextInput 
                    style={styles.passwordTextInput}
                    placeholder=""
                    secureTextEntry={false}
                    onChangeText={text => {
                        setNewUserData(previousData => {
                            return {...previousData, lastName: text.toString()}
                        })
                    }}
                />
            </View>

            <View style={styles.passwordView}>
                <Text style={styles.passwordText}>Email</Text>
                <TextInput 
                    style={styles.passwordTextInput}
                    placeholder=""
                    secureTextEntry={false}
                    onChangeText={text => {
                        setNewUserData(previousData => {
                            return {...previousData, email: text.toString()}
                        })
                    }}
                />
            </View>

            <View style={styles.passwordView}>
                <Text style={styles.passwordText}>Password</Text>
                <TextInput 
                    style={styles.passwordTextInput}
                    placeholder=""
                    secureTextEntry={true}
                    onChangeText={text => {
                        setNewUserData(previousData => {
                            return {...previousData, password: text.toString()}
                        })
                    }}
                />
            </View>

            <View style={styles.passwordView}>
                <Text style={styles.passwordText}>Confirm Password</Text>
                <TextInput 
                    style={styles.passwordTextInput}
                    placeholder=""
                    secureTextEntry={true}
                    onChangeText={text => {
                        setNewUserData(previousData => {
                            return {...previousData, confirmPassword: text.toString()}
                        })
                    }}
                />
            </View>
            
            <View style={styles.passwordView}>
                <Text>Days off</Text>
                <Picker
                    selectedValue={daysOff}
                    onValueChange={(itemValue, itemIndex) =>
                        {let arrayOfDaysOff: number[] = [];
                        arrayOfDaysOff[0] = itemValue.substring(0, 1);
                        arrayOfDaysOff[1] = itemValue.substring(1, 2);
                        setNewUserData({...newUserData, daysOff: arrayOfDaysOff});}
                    }>
                    <Picker.Item label="Monday Tuesday" value="12" />
                    <Picker.Item label="Tuesday Wednesday" value="23" />
                    <Picker.Item label="Wednesday Thursday" value="34" />
                    <Picker.Item label="Thursday Friday" value="45" />
                    <Picker.Item label="Friday Saturday" value="56" />
                    <Picker.Item label="Saturday Sunday" value="60" />
                    <Picker.Item label="Sunday Monday" value="01" />
                </Picker>
            </View>

            <Pressable 
                style={styles.button}
                onPress={addNewUser}
                >
                <Text style={styles.buttonText}>Submit</Text>
            </Pressable>

            <Text style={{color: "rgb(168, 66, 50)", marginTop: 15, fontSize: 25, alignSelf:"center"}}>{bottomMessage}</Text>
            
        </View>
    )
});

export default AddUser

const styles = StyleSheet.create({
    globalContainer: {
        flex: 1,
        backgroundColor: "rgb(235, 232, 231)",
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
