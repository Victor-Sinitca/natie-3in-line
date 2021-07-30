import {StatusBar} from 'expo-status-bar';
import React, {useState} from 'react';
import {StyleSheet, Text, View,Image} from 'react-native';
import {Button} from "react-native-web";
import {Provider} from "react-redux";
import store from "./Components/redux/redux-store";
import {ThreeInLineContainer} from "./Components/ThreeInLine/ThreeInLineContainer";
const sw2 = require(`./assets/img/G1.png`)
import sw1 from "./assets/img/G1.png"



const MyApp = () => {
    const [count, setCount] = useState(1)
    return (
        <View style={styles.container}>
            <Image style={styles.tinyLogo}
                   source = {sw1}/>
            <ThreeInLineContainer/>
           {/* <Text>
                <Text style={styles.buttonsTYLE}>
                    Hello!!!
                </Text>
                <Button title={count}
                        onPress={() => setCount(count + 1)}>
                </Button>
            </Text>*/}
            <StatusBar style="auto"/>
        </View>
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
        flex: 5,
       /* backgroundColor: '#aa1919',*/
        alignItems: 'center',
        justifyContent: 'top',
    },
    buttonsTYLE: {
        flex: 1,
        backgroundColor: "#143357",
    },
    tinyLogo: {
        width: 50,
        height: 50,
    },
});
