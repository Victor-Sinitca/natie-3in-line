import {MapsGameType, SectorGameType} from "../../redux/threeInLine-reduser";


export const deleteSectorSelection =(Map: MapsGameType, sector: SectorGameType)=>{
    let map = [...Map]
    let i = sector.sectorState.y
    let j = sector.sectorState.x
    map[i] = [...Map[i]]
    map[i][j] = {...Map[i][j]}
    map[i][j].sectorState = {...Map[i][j].sectorState}
    map[i][j].sectorState.isFirstClick = false
    map[i][j].sectorState.isSelected = false
    return map
}
