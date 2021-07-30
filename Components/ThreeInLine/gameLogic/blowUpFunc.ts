
import {checkOnBonusScore} from "./isSectorInLine";
import {MapsGameType, SectorGameType} from "../../redux/threeInLine-reduser";


function blowUpSector(sector: SectorGameType) {
    sector.date.isBum = true
    sector.sectorState.isSelected=false
    sector.date.score = checkOnBonusScore(sector, 0)
    if (!sector.date.score) {
        sector.date.score = 20
    }
}



export const blowUpAllMap = (Map: MapsGameType,) => {
    let map = [...Map]
    for(let i=0; i<map.length; i++){
        map[i]=[...Map[i]]
    }
    for (let i = map.length - 1; i >= 0; i--) {
        for (let j = map[i].length - 1; j >= 0; j--) {
            map[i][j]={...Map[i][j]}
            blowUpSector(map[i][j])
        }
    }
    return map
}

export const blowUpBigCrosshair = (Map: MapsGameType, sector: SectorGameType) => {
    let map = [...Map]
    for (let i = map.length - 1; i >= 0; i--) {
        for (let j = map[i].length - 1; j >= 0; j--) {
            if ((i === sector.sectorState.y || j === sector.sectorState.x)
                || (i === sector.sectorState.y - 1 || j === sector.sectorState.x - 1)
                || (i === sector.sectorState.y + 1 || j === sector.sectorState.x + 1)) {
                map[i][j]={...Map[i][j]}
                blowUpSector(map[i][j])
            }
        }
    }
    return map


}
export const blowUpSelectedSectors = (Map: MapsGameType,sector1: SectorGameType, sector2: SectorGameType) => {
    let map = [...Map]
    map[sector1.sectorState.y][sector1.sectorState.x].date.isBum = true
    map[sector1.sectorState.y][sector1.sectorState.x].date.score = 200
    map[sector1.sectorState.y][sector1.sectorState.x].sectorState.isSelected=false
    for (let i = map.length - 1; i >= 0; i--) {
        for (let j = map[i].length - 1; j >= 0; j--) {
            if (map[i][j].date.state === sector2.date.state) {
                map[i][j]={...Map[i][j]}
                map[i][j].date.bonusSector = sector2.date.bonusSector
                blowUpSector(map[i][j])
            }
        }
    }
    return map
}

export const blowUpCrosshair = (Map: MapsGameType, sector: SectorGameType) => {
    let map = [...Map]
    for (let i = map.length - 1; i >= 0; i--) {
        for (let j = map[i].length - 1; j >= 0; j--) {
            if (i === sector.sectorState.y || j === sector.sectorState.x) {
                map[i][j]={...Map[i][j]}
                blowUpSector(map[i][j])
            }
        }
    }
    return map
}
