import React from 'react'
import { StyleSheet, Text, View, SafeAreaView, Button } from 'react-native'

const HomeScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.main}>
            <Text>Home</Text>
            <Button title="coucou" 
            onPress={() => {navigation.navigate("Login")}}
            />
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
    
})
