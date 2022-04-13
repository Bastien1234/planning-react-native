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


const PlanningScreen = ({ navigation:any }) => {

    const { userContext, setUserContext } = useContext(UserContext);

    const [isLoading, setIsLoading] = useState(true);

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
    const [showSideBar, setShowSideBar] = useState(false);

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
        setIsLoading(false);
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

    // For changing shift

    const [userChangingShift, setUserChangingShift] = useState("");
    const [shiftChanging, setShiftChanging] = useState("");
    const [dayChanging, setDayChanging] = useState("");

    const SideView = () => {

        return (<View style={{
            left: 0,
            top: 0,
            height: "100%",
            width: 200,
            position: "absolute",
            backgroundColor: "rgb(110, 116, 170)",
            paddingTop: 50,
            paddingLeft: 15,
            zIndex: 1000,
        }}>
            <Text style={{fontSize: 25, fontWeight: "bold"}}>Changing shift</Text>
            <Text style={{fontSize: 15, marginTop: 15, marginBottom: 15}}>For user : {userChangingShift}</Text>
            <View>
                {
                    planningOptions.map(shiftElement => {
                        return (
                        <Pressable onPress={() => {
                            setShiftChanging(shiftElement);
                            setNewShift(shiftElement, userChangingShift, dayChanging);
                            setShowSideBar(false);
                            usersReload();

                        }}>
                            <Text style={{
                                fontSize: 25,
                                borderWidth: 1,
                                borderRadius: 5,
                                width: 50,
                                textAlign: "center",
                                marginBottom: 3,
                                backgroundColor: cssColors[shiftElement] !== "" ? cssColors[shiftElement] : "rgb(235, 232, 231)"
                            }}>{shiftElement}</Text>
                        </Pressable>
                        )
                    })
                }
            </View>
            <Pressable onPress={() => setShowSideBar(false)}>
                <Text style={{fontSize: 25, fontWeight: "bold", marginTop: 20}}>Close</Text>
            </Pressable>
        </View>)
    }

    return (
        
        <SafeAreaView style={styles.globalContainer}>

        {
            (isLoading===true) ? <ActivityIndicator size="large" color="rgb(110, 116, 170)" style={{paddingTop: 150}}/> : 
              
            <View style={{flex:1}}>
                {/* Header */}
                <View style={styles.header}>
                    <Pressable style={{alignSelf: "flex-end", marginRight: 15}}>
                        <Image source={require('./../assets/icons/settings.png')} style={styles.svg}/>
                    </Pressable>
                </View>
 
                {/* Month title */}
                <View style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    height: 50,
                    alignItems: "center",
                    marginTop: 15,
                    marginBottom: 15,
                }}>
                    <Image source={require('./../assets/icons/left-arrow.png')} style={{...styles.svg, marginRight: 15}}/>
                    <Text style={{fontSize: 30, fontWeight: "bold"}}>{monthState}</Text>
                    <Image source={require('./../assets/icons/right-arrow.png')} style={{...styles.svg, marginLeft: 15}}/>

                </View>

                {/* Main Planning Box */}
                <View style ={{
                    // flex: 1,
                    paddingTop: 20,
                    paddingBottom: 20,
                    paddingLeft: 10,
                    paddingRight: 10,
                    backgroundColor: "rgb(235, 232, 231)",

                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    
                    elevation: 5,
                }}>
                <ScrollView horizontal={true} style={{
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 5,
                    },
                    shadowOpacity: 0.34,
                    shadowRadius: 6.27,
                    
                    elevation: 10,
                }}>
                    <View>
                        <Text style={{...styles.user, opacity: 0}}>" "</Text>
                        {
                            users.map((el, idx) => {
                                // Returning users list for the given team
                                return(<Text style={styles.user}>{el.firstName} {el.lastName.slice(0, 1)}</Text>)
                            })
                        }
                    </View>
                    <View style={{flexDirection: "row"}}>
                    {
                        monthIndexDayArray.map((day, idx) => {
                            return (
                            // Planning Box
                                <View>
                                    <Text style={{backgroundColor: isWeekEnd[idx], ...styles.case}}>{day.substring(8, 10)}</Text>
                                    {
                                        db.map(user =>
                                            user.shifts.map(shft=> 
                                                shft.indexDay === day ?
                                                <Pressable onPress={() => {
                                                    if (userContext.isAdmin === true )
                                                    {
                                                    setUserChangingShift(user.email);
                                                    setDayChanging(shft.indexDay);
                                                    setShowSideBar(true);
                                                    }
                                                }}>
                                                    <Text style={{...styles.case, backgroundColor: cssColors[shft.shift] !== "" ? cssColors[shft.shift] : null}}>{shft.shift}</Text>
                                                </Pressable>
                                                : null
                                            ))
                                    }
                                </View>)
                        })
                    }
                    </View>
                </ScrollView>
                </View>

                {/* Side pop up for changing shift */}
                {
                    showSideBar ? <SideView /> : null
                }
                
                
                
            </View>

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
    svg: {
        height: 30,
        width: 30
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
    },
    user: {
        fontSize: 20,
        height: 30,
        // backgroundColor: "rgb(110, 116, 170)",
        borderRadius: 5,
        marginBottom: 2,
        // alignSelf: "flex-end",
        justifyContent: "center",
        overflow: "hidden", // Fixing border radius not working
        borderWidth: 1,
        textAlign: "right",
        paddingRight: 5

    },
    case: {
        fontSize: 20,
        marginLeft: 5,
        marginBottom: 2,
        alignSelf: "center",
        justifyContent: "center",
        borderRadius: 5,
        width: 37,
        textAlign: "center",
        height: 30,
        overflow: "hidden" // Fixing border radius not working
    }
})
