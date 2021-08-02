import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {Provider} from "react-redux";
import store from "./Components/redux/redux-store";
import ThreeInLineContainer from "./Components/ThreeInLine/ThreeInLineContainer";


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
        paddingTop:20,
        backgroundColor: '#e8b9b9',
        alignItems: 'center',
        justifyContent:"flex-start",
    }
});
