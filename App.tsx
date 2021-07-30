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
        paddingTop:20,
        height: Dimensions.get('window').height,
        width:Dimensions.get('window').width,
        flex: 5,
       /* backgroundColor: '#aa1919',*/
        alignItems: 'center',
        justifyContent:"flex-start",
    }
});
