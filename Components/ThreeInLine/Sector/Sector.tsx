import * as React from "react";
import {FC} from "react";
import {View} from "react-native";
import {deskStateType} from "../ThreeInLine";
import SectorMemo from "./imgSector";


export  type SectorGameType = {
    sectorState: {
        x: number,
        y: number,
        isSelected: boolean,
        isFirstClick: boolean,
        animateMove: {
            name: string,
        } | null,
        animateStart: boolean,
    },
    date: {
        color: "red" | "blue" | "black" | "green",
        state: number,
        isBum: boolean,
        score: number,
        addBonusSector: number,
        bonusSector: number,
    }
}
type PropsType = {
    sector: SectorGameType
    deskState: deskStateType
}
const Sector: FC<PropsType> = ({sector, deskState,}) => {
    const index = (sector.sectorState.x + sector.sectorState.y) % 2

    return <View style={{height: "100%", width: `100%`, backgroundColor: index ? "#11221122" : "#0000"}}>
        <SectorMemo sector={sector} deskState={deskState}/>
    </View>
}

export default React.memo(Sector)
