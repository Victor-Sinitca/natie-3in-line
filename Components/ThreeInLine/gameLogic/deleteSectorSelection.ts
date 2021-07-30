import {MapsGameType, SectorGameType} from "../../redux/threeInLine-reduser";


export const deleteSectorSelection =(Map: MapsGameType, sector: SectorGameType)=>{
    let map = [...Map]
    map[sector.sectorState.y] = [...Map[sector.sectorState.y]]
    map[sector.sectorState.y][sector.sectorState.x] = {...Map[sector.sectorState.y][sector.sectorState.x]}
    map[sector.sectorState.y][sector.sectorState.x].sectorState = {...Map[sector.sectorState.y][sector.sectorState.x].sectorState}
    map[sector.sectorState.y][sector.sectorState.x].sectorState.isFirstClick = false
    map[sector.sectorState.y][sector.sectorState.x].sectorState.isSelected = false
    return map
}
