import * as React from "react";
import {FC} from "react";
import {Sector, SectorGameType} from "./Sector/Sector";
import {Text, View,} from "react-native";
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
    const shadowStyle = {
        shadowColor: "blue",
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 10,
        shadowRadius: 10,
        elevation:10,
    }

    const returnMapRow = (a: Array<SectorGameType>) => {
        return a.map((b) =>
            <View key={b.sectorState.x} style={{height: deskState.length, width: deskState.length}}>
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
            return <View key={a[0].sectorState.y} style={{flexDirection: "row", height: 50}}>
                {returnMapRow(a)}
            </View>
        }
    )
    return (
        <View style={{
            height: "auto",
            width: "auto",
            flexDirection: "column",
            ...shadowStyle,
        }}>
            {map}
        </View>
    )
}


export default DeskThreeInLine
