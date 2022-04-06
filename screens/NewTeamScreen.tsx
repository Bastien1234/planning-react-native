import React, { useState } from 'react'
import { StyleSheet, Text, View, TextInput, Button, Pressable, ImageBackground } from 'react-native'
import { CardStyleInterpolators } from 'react-navigation-stack';
import { SafeAreaView } from 'react-native-safe-area-context';


// import backgroundImage from '../assets/backgroundImages/mobile-background-image.jpg';

const NewTeamScreen = ({ navigation }) => {

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
                <Text style={styles.headerTitle}>Create New Team</Text>
            </View>

            {/* App */}
            <View style={styles.inputsContainer}>
                <View style={styles.viewHolder}>
                    <Text style={styles.preTextInput}>Enter email</Text>
                    <TextInput style={styles.textInput} placeholder="" />

                    <View style={{marginTop: 20}}></View>
                    <Text style={styles.preTextInput}>Enter password</Text>
                    <TextInput style={styles.textInput} placeholder=""/>

                    <View style={{marginTop: 30}}></View>


                    <Pressable style={styles.button}>
                        <Text style={styles.buttonText}>Sign In</Text>
                    </Pressable>
                </View>

                <View style={styles.viewHolder}>
                    <Pressable style={styles.button}
                    onPress={() => {navigation.navigate("Login")}}>
                        <Text style={styles.buttonText}>Go back</Text>
                    </Pressable>
                </View>
            </View>
            
        </SafeAreaView>
    )
}

export default NewTeamScreen;

const styles = StyleSheet.create({
    globalContainer: {
        flex: 1,
        backgroundColor: "rgb(110, 116, 170)",
    },
    header: {
        display: "flex",
        height: 65,
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
        justifyContent: "center",
        borderRadius: 10,
        marginTop: 10,
    },
    buttonText: {
        fontSize: 20
    },
    textInput: {
        display: "flex",
        backgroundColor: "white",
        width: "95%",
        marginTop: 5,
        borderRadius: 5,
        fontSize: 20
    }
})
