import {FC} from "react";
import {Button, Text, View} from "react-native";
import * as React from "react";

type FieldChangeButtonsType = {
    label: string,
    addLine: (value: "x" | "y") => void,
    takeAwayLine: (value: "x" | "y") => void,
    nameValue: "x" | "y",
    value: number
}

const FieldChangeButtons: FC<FieldChangeButtonsType> =  ({label, addLine, takeAwayLine, nameValue, value}) => {
    return (
        <View style={{flex: 1}}>
            <Text> {label} </Text>
            <View style={{flexDirection: "row"}}>
                <View style={{flex: 1, padding: 5}}>
                    <Button title="+" onPress={() => {
                        addLine(nameValue)
                    }} disabled={value >= 15}/>
                </View>
                <View style={{flex: 1, padding: 5}}>
                    <Button title="-" onPress={() => {
                        takeAwayLine(nameValue)
                    }} disabled={value < 6}/>
                </View>
            </View>
        </View>
    )
}
export default React.memo(FieldChangeButtons)
