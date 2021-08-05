import {FC} from "react";
import {Button, Text, View} from "react-native";
import * as React from "react";

type GemsChangeButtonsType = {
    gemsCount:number,
    changeCountGems:(value:boolean)=>void
}

const GemsChangeButtons: FC<GemsChangeButtonsType> =  ({gemsCount,changeCountGems}) => {
    return (
        <View style={{flex: 1}}>
            <Text>камней: {gemsCount}</Text>
            <View style={{flexDirection: "row"}}>
                <View style={{flex: 1, padding: 5}}>
                    <Button title="+" disabled={gemsCount > 7}
                            onPress={() => {
                                changeCountGems(true)
                            }}/>
                </View>
                <View style={{flex: 1, padding: 5}}>
                    <Button title="-" disabled={gemsCount < 5}
                            onPress={() => {
                                changeCountGems(false)
                            }}/>
                </View>
            </View>
        </View>
    )
}
export default React.memo(GemsChangeButtons)
