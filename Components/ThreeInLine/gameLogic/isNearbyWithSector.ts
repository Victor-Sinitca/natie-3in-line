import {SectorGameType} from "../../redux/threeInLine-reduser";


export const isNearbyWithSector = (selectSector: SectorGameType |null, sector: SectorGameType) => {
    return ((selectSector?.sectorState.x === sector.sectorState.x - 1 && selectSector?.sectorState.y === sector.sectorState.y)
        || (selectSector?.sectorState.x === sector.sectorState.x + 1 && selectSector?.sectorState.y === sector.sectorState.y)
        || (selectSector?.sectorState.y === sector.sectorState.y - 1 && selectSector?.sectorState.x === sector.sectorState.x)
        || (selectSector?.sectorState.y === sector.sectorState.y + 1 && selectSector?.sectorState.x === sector.sectorState.x)
    )
}
