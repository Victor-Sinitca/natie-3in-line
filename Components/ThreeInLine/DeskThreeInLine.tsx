import * as React from "react";
import {FC} from "react";
import Sector, {SectorGameType} from "./Sector/Sector";
import {StyleSheet, View,} from "react-native";
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
    return (
        <View style={[styles.main, {aspectRatio: userMap[0].length / userMap.length,}]}>
            {userMap.map((a: Array<SectorGameType>) =>
                <View key={a[0].sectorState.y} style={styles.row}>
                    {a.map((b) =>
                        <View key={b.sectorState.x} style={styles.cell}>
                            <Sector returnMouseDown={returnMouseDown}
                                    returnMouseUp={returnMouseUp}
                                    returnMouseOver={returnMouseOver}
                                    key={b.sectorState.x * 10 + b.sectorState.y}
                                    sector={b}
                                    deskState={deskState}
                            />
                        </View>
                    )}
                </View>
            )}
        </View>
    )
}
const styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: "row",

    },
    cell: {
        flex: 1,
        height: "100%",
        width: "100%",
    },
    main: {
        /*height:"100%",*/
        flexDirection: "column",
        backgroundColor: `#9eeaea`
    }
});


export default React.memo(DeskThreeInLine)
