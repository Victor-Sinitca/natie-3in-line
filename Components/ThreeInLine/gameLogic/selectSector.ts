import {MapsGameType, SectorGameType} from "../../redux/threeInLine-reduser";


export const selectSectorFunc =(map: MapsGameType, sector: SectorGameType)=>{
    let newMap = [...map]
    newMap[sector.sectorState.y] = [...map[sector.sectorState.y]]
    newMap[sector.sectorState.y][sector.sectorState.x] = {...map[sector.sectorState.y][sector.sectorState.x]}
    newMap[sector.sectorState.y][sector.sectorState.x].sectorState = {...map[sector.sectorState.y][sector.sectorState.x].sectorState}
    newMap[sector.sectorState.y][sector.sectorState.x].sectorState.isSelected = true
    return newMap
}
