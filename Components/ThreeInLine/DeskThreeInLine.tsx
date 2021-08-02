import * as React from "react";
import {FC} from "react";
import {Sector, SectorGameType} from "./Sector/Sector";
import {Dimensions, StyleSheet, Text, View,} from "react-native";
import {deskStateType} from "./ThreeInLine";

export type MapsGameType = Array<Array<SectorGameType>>
type PropsType = {
    deskState: deskStateType
    isEndTurn: boolean
    userMap: MapsGameType
    returnMouseDown: (sector: SectorGameType) => void
    returnMouseUp: (sector: SectorGameType) => void
    returnMouseOver: (sector: SectorGameType) => void
    selectSector: SectorGameType | null


}
const DeskThreeInLine: FC<PropsType> = ({
                                            userMap, deskState, returnMouseDown, selectSector,
                                            returnMouseUp, returnMouseOver, isEndTurn,
                                        }) => {

    const returnMapRow = (a: Array<SectorGameType>) => {
        return a.map((b) =>
            <View key={b.sectorState.x}
                  style={styles.cell}
                 /* style={{height: deskState.length, width: deskState.length}}*/

            >
                <Sector returnMouseDown={returnMouseDown}
                        returnMouseUp={returnMouseUp}
                        returnMouseOver={returnMouseOver}
                        key={b.sectorState.x * 10 + b.sectorState.y}
                        sector={b}
                        deskState={deskState}
                />
            </View>
        )
    }

    const map = userMap.map((a: Array<SectorGameType>) => {
            return <View key={a[0].sectorState.y}
                         style={styles.row}

            >
                {returnMapRow(a)}
            </View>
        }
    )
    return (
        <View style={[styles.main,{aspectRatio:userMap[0].length/userMap.length,}]}>
            {map}
        </View>
    )
}
const styles = StyleSheet.create({
    row:{
        flex:1,
        /*height:`100%`,*/
        flexDirection: "row",

    },
    cell:{
        flex:1,
        height:"100%",
        width:"100%",
    },
    main: {
        /*flex:1,*/

        /*height:500,*/
        /*width: "100%",*/
       /* minHeight:`auto`,*/
        /*height: "auto",
        width: "auto",*/
        flexDirection: "column",
        backgroundColor:`#9eeaea`
        /*shadowColor: "blue",
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 10,
        shadowRadius: 10,
        elevation:10,
        backgroundColor:"#0000"*/
    }
});


export default DeskThreeInLine
