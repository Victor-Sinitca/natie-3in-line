import {MapsGameType, SectorGameType} from "../../redux/threeInLine-reduser";


export const SetIsFirstClickSector =(map: MapsGameType, sector: SectorGameType)=>{
    let newMap = [...map]
    let i=sector.sectorState.y, j = sector.sectorState.x
    newMap[i][j].sectorState.isFirstClick = true
    return newMap
}
