import {MapsGameType} from "../../redux/threeInLine-reduser";


export const deleteAnimationNameInMap = (Map: MapsGameType, sectors: Array<{ i: number, j: number }>) => {
    let map = [...Map]
    for (let i = 0; i < map.length; i++) {
        map[i] = [...Map[i]]
    }

    for (let n = 0; n < sectors.length; n++) {
        let sector = sectors[n]
        map[sector.i][sector.j] = {...Map[sector.i][sector.j]}
        map[sector.i][sector.j].sectorState = {...Map[sector.i][sector.j].sectorState}
        map[sector.i][sector.j].sectorState.animateMove = null
    }
    return map
}
