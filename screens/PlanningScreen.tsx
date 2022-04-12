import React, { useState, useContext, useEffect } from 'react'
import { StyleSheet, Text, View, TextInput, Button, Pressable, ImageBackground, ActivityIndicator  } from 'react-native';
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


const PlanningScreen = ({ navigation:any }) => {

    const { userContext, setUserContext } = useContext(UserContext);

    const [isLoading, setIsLoading] = useState(false);

    // If the user comes here without being logged in...get him tf out ! =)

    // if (userContext.loggedIn === false)
    //     navigation.navigate('Home');

    const team = userContext.team;

    // Different Elements to show user

    enum PageElements {
        planning,
        userProfile
    }

    const [currentElement, setCurrentElement] = useState(PageElements.planning);
    const [changePasswordPage, setChangePasswordPage] = useState(false);
    const [popUpPosition, setPopUpPosition] = useState({x:null, y:null});
    const [showPopUp, setShowPopUp] = useState(false);
    const [currentRequestor, setCurrentRequestor] = useState("nobodyyy");
    const [currentIndexDay, setCurrentIndexDay] = useState("noDayYet");
    const [monthState, setMonthState] = useState("");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
    const [newPasswordValues, setNewPasswordValue] = useState({
        password: "",
        passwordConfirm: "",
        passwordCurrent: ""
    })

    // Refreshthe page, just like in useEffect
    async function usersReload() {
        const result = await axios.get(`${backendUrl}/api/v1/users/getAllUsers/` + team);
        const filteredResults = result.data.data;
        const names:any = [];
        filteredResults.forEach(el => names.push({firstName: el.firstName, lastName: el.lastName}))
        setUsers(names);
        setDb(filteredResults);
        let workingMonth = (monthList[new Date().getMonth()])
        setMonthState(workingMonth);
    }

    


    // Calendar Logic --------------------------------
    var now = new Date();

    function daysInThisMonth() {
        
        return new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
      }

    const daysInCurrentMonth = daysInThisMonth();
    const currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth()+1;
    if (currentMonth < 10)
      currentMonth = `0${currentMonth}`;
    else
      currentMonth = `${currentMonth}`;
    let monthDaysArray = [];
    for (let i=1; i<=daysInCurrentMonth; i++) {
        monthDaysArray.push(i);
    }
    let monthIndexDayArray = [];
    for (let i=1; i<=daysInCurrentMonth; i++) {
        var newI;
        if (i < 10) {
            newI = `0${i}`;
        }
        else
        {
            newI = `${i}`;
        }
        
        monthIndexDayArray.push(`${currentYear}-${currentMonth}-${newI}`);
    }

    let isWeekEnd = [];
    for (let i=1; i<=daysInCurrentMonth; i++)
    {
        let day = new Date(now.getFullYear(), now.getMonth(), i).getDay();
        day === 6 || day === 0 ? isWeekEnd.push("rgb(75, 219, 130)") : isWeekEnd.push(0);
    }

    console.log(isWeekEnd);


    const [users, setUsers] = useState([]);
    const [db, setDb] = useState([]);

    useEffect(() => {
        generateMonth();
    }, [])

    // End of calendar logic ----------------------------------------


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

    // Generate month
    async function generateMonth() {
        let date = new Date();
        let team = userContext.team;
        let month = date.getMonth()
        let year = date.getFullYear();
        let token = "Bearer ";

        try {
            let localToken = await getToken('token');
            token += localToken;
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': token
              }

            const response = await axios.post(`${backendUrl}/api/v1/users/generateMonth`, {
                team,
                month,
                year
            }, { headers: headers });

            if (response.status === 200) //
            {
                
        
                usersReload();
            }
                
        } catch (e) {
            console.log(e.message)
        }

        
    }

    async function setNewShift(option: String, currentRequestor: String, currentIndexDay: String) {
        let token = "Bearer ";
        try {
            let localToken = getToken('token');
            token += localToken;
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': token
              }

            const response = await axios.post(`${backendUrl}/api/v1/users/requestChangeShift`, {
                requestor: currentRequestor,
                newShift: option,
                indexDay: currentIndexDay
            }, { headers: headers });

            if (response.status === 200)
            {
                usersReload();
            }
                
        } catch (e) {
            console.log(e.message)
        }
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

        {
            (isLoading===true) ? <ActivityIndicator size="large" color="rgb(235, 232, 231)" style={{paddingTop: 150}}/> : 
              
            <View style={{flex:1}}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={{alignSelf: "flex-end"}}>Profile</Text>
                </View>

                <Text>{monthState}</Text>

                {/* Main Planning Box */}
                <View style={{overflow: "scroll", flexDirection:"row"}}>
                    <View>
                        <Text>User</Text>
                        {
                            users.map((el, idx) => {
                                // Returning users list for the given team
                                return(<Text>{el.firstName} {el.lastName.slice(0, 1)}</Text>)
                            })
                        }
                    </View>
                    <View style={{flexDirection: "row"}}>
                    {
                        monthIndexDayArray.map((day, idx) => {
                            return (
                            // Planning Box
                                <View>
                                    <Text style={{backgroundColor: isWeekEnd[idx]}}>{day.substring(8, 10)}</Text>
                                </View>)
                        })
                    }
                    </View>
                </View>
            </View>

        }
            
        </SafeAreaView>
    )
}

export default PlanningScreen

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
