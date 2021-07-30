import {MapsGameType, SectorGameType} from "../../redux/threeInLine-reduser";


export const replaceSectors =(Map: MapsGameType, firstSector: SectorGameType, secondSector: SectorGameType)=>{
    let map = [...Map]
    let i = firstSector.sectorState.y, j = firstSector.sectorState.x;
    let I = secondSector.sectorState.y, J = secondSector.sectorState.x;
    map[i] = [...Map[i]]
    map[I] = [...Map[I]]
    map[i][j] = {...Map[i][j]}
    map[I][J] = {...Map[I][J]}
    map[i][j].sectorState = {...Map[i][j].sectorState}
    map[I][J].sectorState = {...Map[I][J].sectorState}
    map[i][j].sectorState.isSelected = false
    map[I][J].sectorState.isSelected = false
    map[i][j].sectorState.isFirstClick = false
    map[I][J].sectorState.isFirstClick = false

    map[i][j].date = {...secondSector.date}
    map[I][J].date = {...firstSector.date}


    return map
}
