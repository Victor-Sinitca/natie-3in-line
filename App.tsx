import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {Dimensions, StyleSheet, Text, View,SafeAreaView} from 'react-native';
import {Provider} from "react-redux";
import store from "./Components/redux/redux-store";
import {ThreeInLineContainer} from "./Components/ThreeInLine/ThreeInLineContainer";

const sw2 = require(`./assets/img/G1.png`)


const MyApp = () => {
    return (
        <SafeAreaView  style={styles.container}>
            <ThreeInLineContainer/>
            <StatusBar style="auto"/>
        </SafeAreaView >
    );
}


export default function App() {
    return (
            <Provider store={store}>
                <MyApp/>
            </Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        /*height: Dimensions.get('window').height,
        width:Dimensions.get('window').width,*/
        paddingTop:20,
        backgroundColor: '#e8b9b9',
        alignItems: 'center',
        justifyContent:"flex-start",
    }
});
