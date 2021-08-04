import * as React from "react";
import {FC} from "react";
import {View} from "react-native";
import SectorMemo from "./imgSector";
import {SectorGameType} from "../../redux/threeInLine-reduser";



type PropsType = {
    sector: SectorGameType
    heightSector:number
}
const Sector: FC<PropsType> = ({sector, heightSector}) => {
    const index = (sector.sectorState.x + sector.sectorState.y) % 2

    return <View style={{height: "100%", width: `100%`, backgroundColor: index ? "#11221122" : "#0000"}}>
        <SectorMemo sector={sector} heightSector={heightSector}/>
    </View>
}

export default React.memo(Sector)
