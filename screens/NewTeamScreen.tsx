import React, { useState } from 'react'
import { StyleSheet, Text, View, TextInput, Button, Pressable, ImageBackground, ActivityIndicator } from 'react-native'
import { CardStyleInterpolators } from 'react-navigation-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

import URL from './../utils/URL';
const backendUrl = `${URL}/api/v1/users/signup`;

const NewTeamScreen = ({ navigation }) => {

    const [ isLoading, setIsLoading ] = useState(false);
    const [ bottomMessage, setBottomMessage ] = useState("");

    const [newTeamData, setNewTeamData] = useState({
        firstName: "",
        lastName: "",
        isAdmin: true,
        daysOff: [6, 0],
        email: "",
        team: "",
        password: "",
        confirmPassword: ""
    })

    async function sendForm() {
        try {
            const response = await axios.post(backendUrl, newTeamData);
            if (response.data.status === 'success') {
                setBottomMessage(`Welcome to the show, ${newTeamData.firstName} !`);
                setTimeout(() => {
                    navigation.navigate("Login"); // Try to log in directly please sir
                }, 600)
            }
            
        } catch (e) {
            console.log(`Error from axios : ${e.message}`);
            setBottomMessage("Problem problem...");
        }
        
    }

    

    return (
        <SafeAreaView style={styles.globalContainer}>

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Create New Team</Text>
            </View>

            {
                (isLoading===false) ? 
            
            <View style={styles.inputsContainer}>
                
                <View style={styles.line}>
                    <Text style={styles.preTextInput}>First Name</Text>
                    <TextInput 
                        style={styles.textInput} 
                        placeholder=""
                        secureTextEntry={false}
                        onChangeText={text => {
                            setNewTeamData(previousData => {
                                return { ...previousData, firstName: text}})}} />
                </View>

                <View style={styles.line}>
                    <Text style={styles.preTextInput}>Last Name</Text>
                    <TextInput 
                        style={styles.textInput} 
                        placeholder=""
                        secureTextEntry={false}
                        onChangeText={text => {
                            setNewTeamData(previousData => {
                                return { ...previousData, lastName: text}})}} />
                </View>

                <View style={styles.line}>
                    <Text style={styles.preTextInput}>Email</Text>
                    <TextInput 
                        style={styles.textInput} 
                        placeholder=""
                        secureTextEntry={false}
                        onChangeText={text => {
                            setNewTeamData(previousData => {
                                return { ...previousData, email: text.toString().toLowerCase()}})}} />
                </View>

                <View style={styles.line}>
                    <Text style={styles.preTextInput}>Password</Text>
                    <TextInput 
                        style={styles.textInput} 
                        placeholder=""
                        secureTextEntry={true}
                        onChangeText={text => {
                            setNewTeamData(previousData => {
                                return { ...previousData, password: text}})}} />
                </View>

                <View style={styles.line}>
                    <Text style={styles.preTextInput}>Confirm Password</Text>
                    <TextInput 
                        style={styles.textInput} 
                        placeholder=""
                        secureTextEntry={true}
                        onChangeText={text => {
                            setNewTeamData(previousData => {
                                return { ...previousData, confirmPassword: text}})}} />
                </View>

                <View style={styles.line}>
                    <Text style={styles.preTextInput}>Team Name</Text>
                    <TextInput 
                        style={styles.textInput} 
                        placeholder=""
                        secureTextEntry={false}
                        onChangeText={text => {
                            setNewTeamData(previousData => {
                                return { ...previousData, team: text}
                            }) 
                                console.log(newTeamData)}} />
                </View>

                <Text style={{color: "rgb(168, 66, 50)", marginTop: 15, fontSize: 25, alignSelf:"center"}}>{bottomMessage}</Text>

                <Pressable style={styles.button}
                    onPress={sendForm}>
                        <Text style={styles.buttonText}>Submit</Text>
                </Pressable>


                <View style={styles.viewHolder}>
                    <Pressable style={styles.button}
                    onPress={() => {navigation.navigate("Login")}}>
                        <Text style={styles.buttonText}>Go back</Text>
                    </Pressable>
                </View>

                
            </View> 
            :
            <ActivityIndicator size="large" color="rgb(235, 232, 231)" style={{paddingTop: 150}}/>
            
        }
            
        </SafeAreaView>
    )
}

export default NewTeamScreen;

const styles = StyleSheet.create({
    globalContainer: {
        flex: 1,
        backgroundColor: "rgb(235, 232, 231)",
    },
    line: {
        // flex:1,
        // marginBottom: 1,
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
    headerSubtitle: {
        fontSize: 17,
        fontWeight: "bold",
        color: "rgb(235, 232, 231)",
        marginBottom: 10,
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
        alignSelf: "center",
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
        alignSelf: "center",
    }
})
