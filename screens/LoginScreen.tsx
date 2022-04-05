import React, { useState } from 'react'
import { StyleSheet, Text, View, SafeAreaView, TextInput, Button, Pressable, ImageBackground } from 'react-native'
import { CardStyleInterpolators } from 'react-navigation-stack';

import backgroundImage from '../assets/backgroundImages/mobile-background-image.jpg';

const LoginScreen = ({ navigator }) => {

    const [memberDetails, setMemberDetails] = useState({
        email: "",
        password: ""
    })
    return (
        <SafeAreaView style={styles.globalContainer}>
            {/* Header */}
            {/* <View style={styles.header}>
                <ImageBackground source={backgroundImage} style={styles.headerImage}>
                    <Text style={styles.headerTitle}>Planning Manager</Text>
                    <Text style={styles.headerSubtitle}>Your solution for managing your teams</Text>
                </ImageBackground>
                


            </View> */}

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Hey !</Text>
                <Text style={styles.headerSubtitle}>Your are not logged in</Text>
                <Text style={styles.headerSubtitle}>Sign up or loggin to enjoy the show</Text>
            </View>

            {/* App */}
            <View style={styles.inputsContainer}>
                <View style={styles.viewHolder}>
                    <Text style={styles.title}>I'm a member</Text>
                    <TextInput style={styles.textInput} placeholder="enter email" />
                    <TextInput style={styles.textInput} placeholder="enter password"/>

                    <Pressable style={styles.button}>
                        <Text style={styles.buttonText}>Sign In</Text>
                    </Pressable>
                </View>

                {/* Separator */}
                <View style={{paddingBottom: 30}}></View>

                <View style={styles.viewHolder}>
                    <Text style={styles.title}>New here ?</Text>

                    <Pressable style={styles.button}>
                        <Text style={styles.buttonText}>Start New Team</Text>
                    </Pressable>
                </View>
            </View>
            
        </SafeAreaView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    globalContainer: {
        flex: 1,
        backgroundColor: "rgb(110, 116, 170)",
    },
    header: {
        display: "flex",
        height: 180,
    },
    headerTitle: {
        fontSize: 25,
        fontWeight: "bold",
        color: "rgb(235, 232, 231)",
        marginTop: 50,
        marginBottom: 15,
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
        justifyContent: "flex-start",
        marginTop: 50
    },
    viewHolder: {
        display: "flex",
        alignItems: "center"
    },
    title: {
        fontSize: 30
    },
    button: {
        backgroundColor: "rgb(238, 247, 255)",
        width: 150,
        display: "flex",
        alignItems: "center",
        borderRadius: 10,
        marginTop: 5,
    },
    buttonText: {
        fontSize: 20
    },
    textInput: {
        display: "flex",
        backgroundColor: "white",
        width: 200,
        marginTop: 5,
        borderRadius: 5,
        fontSize: 20
    }
})
