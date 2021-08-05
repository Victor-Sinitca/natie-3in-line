import {AnyBaseActionType, InferActionsTypes} from "./redux-store";
import {Dispatch} from "redux";
import {replaceSectors} from "../ThreeInLine/gameLogic/replaceSectors";
import {isSectorInLine} from "../ThreeInLine/gameLogic/isSectorInLine";
import {findBonusBumFunc} from "../ThreeInLine/gameLogic/findBonusBumFunc";
import {deleteSectorSelection} from "../ThreeInLine/gameLogic/deleteSectorSelection";
import {selectSectorFunc} from "../ThreeInLine/gameLogic/selectSector";
import {
    blowUpAllMap,
    blowUpBigCrosshair,
    blowUpCrosshair,
    blowUpSelectedSectors
} from "../ThreeInLine/gameLogic/blowUpFunc";
import {boomFunc1, setAnimationCSS1} from "../ThreeInLine/gameLogic/boomFunc1";
import {deleteAnimationNameInMap} from "../ThreeInLine/gameLogic/deleteAnimationNameInMap";



export type MapsGameType = Array<Array<SectorGameType>>
export  type SectorGameType = {
    sectorState: {
        x: number,
        y: number,
        isSelected: boolean,
        isFirstClick: boolean,
        animateMove: {
           /* name: string,*/
            animateObject:{
                i:number,
                j:number,
                shiftI:number,
                shiftJ:number,
                fall:boolean,
                shift:boolean
            }
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
export type deskStateType = {
    x: number, y: number, length: number
}


let initialState = {
    map: null as null | MapsGameType,
    deskState: {x: 10 as number, y: 7 as number, length: 50 as number},
    gemsCount: 5 as number,
    prevMap: null as null | MapsGameType,
    score: 0 as number,
    addScore: 0 as number,
    isDevMode: false as boolean,
    selectSector: null as null | SectorGameType,
    isEndTurn: false as boolean,
    isBoom: false as boolean,
    animationCount: 0 as number,
    animationCountEnd: {
        count: 0 as number,
        sectors: [] as Array<{ i: number, j: number }>
    }
}

type initialStateType = typeof initialState
const threeInLineReducer = (state = initialState as initialStateType, action: ActionType): initialStateType => {
    switch (action.type) {
        case "threeInLine_SET_ADD_SCORE":
            return {
                ...state,
                addScore: action.addScore
            }
        case "threeInLine_SET_DESK_STATE":
            return {
                ...state,
                deskState: action.deskState
            }
        case "threeInLine_SET_IS_DEV_MODE":
            return {
                ...state,
                isDevMode: action.devMode
            }
        case "threeInLine_SET_MAP":
            return {
                ...state,
                map: [...action.map]
            }
        case "threeInLine_SET_PREV_MAP":
            return {
                ...state,
                prevMap: action.map
            }
        case "threeInline_SET_SCORE":
            return {
                ...state,
                score: action.score
            }
        case "threeInLine_SET_SELECT_SECTOR":
            return {
                ...state,
                selectSector: action.sector
            }
        case "threeInLine_SET_IS_END_TURN":
            return {
                ...state,
                isEndTurn: action.IsEndTurn
            }
        case "threeInLine_SET_IS_BUM":
            return {
                ...state,
                isBoom: action.value
            }
        case "threeInLine_SET_ANIMATION_COUNT":
            return {
                ...state,
                animationCount: action.count
            }
        case "threeInLine_DECREASE_ANIMATION_COUNT":
            return {
                ...state,
                animationCount: state.animationCount - 1
            }
        case "threeInLine_INCREASE_ANIMATION_COUNT_END":
            return {
                ...state,
                animationCountEnd: {
                    ...state.animationCountEnd,
                    count: state.animationCountEnd.count + 1,
                    sectors: [...state.animationCountEnd.sectors, action.sector]
                }
            }
        case "threeInLine_DELETE_ANIMATION_COUNT_END":
            return {
                ...state,
                animationCountEnd: {
                    /*...state.animationCountEnd,*/
                    count: 0,
                    sectors: []
                }
            }
        case "threeInLine_DELETE_ANIMATION_IN_SECTOR":
            if (state.map) {
                /*console.log("DELETE_ANIMATION_IN_SECTOR")*/
                let copyState = {...state}
                copyState.map = [...state.map]
                copyState.map[action.i] = [...state.map[action.i]]
                copyState.map[action.i][action.j] = {...state.map[action.i][action.j]}
                copyState.map[action.i][action.j].sectorState = {...state.map[action.i][action.j].sectorState}
                copyState.map[action.i][action.j].sectorState.animateMove = null
                return copyState
            } else return state
        case "threeInLine_SET_GEMS_COUNT":
            if (action.count > 3 && action.count < 9) {
                return {
                    ...state,
                    gemsCount: action.count
                }
            } else return state;
        default:
            return state;
    }
}

type DispatchType = Dispatch<ActionType>
type ActionType = InferActionsTypes<typeof threeInLineAction>
export const threeInLineAction = {
    setIsDevMode: (devMode: boolean,) => {
        return ({type: "threeInLine_SET_IS_DEV_MODE", devMode,} as const)
    },
    setMap: (map: MapsGameType) => {
        return ({type: "threeInLine_SET_MAP", map,} as const)
    },
    setPrevMap: (map: MapsGameType) => {
        return ({type: "threeInLine_SET_PREV_MAP", map,} as const)
    },
    setScore: (score: number) => {
        return ({type: "threeInline_SET_SCORE", score,} as const)
    },
    setAddScore: (addScore: number) => {
        return ({type: "threeInLine_SET_ADD_SCORE", addScore,} as const)
    },
    setDeskState: (deskState: deskStateType) => {
        return ({type: "threeInLine_SET_DESK_STATE", deskState,} as const)
    },
    setSelectSector: (sector: SectorGameType | null) => {
        return ({type: "threeInLine_SET_SELECT_SECTOR", sector,} as const)
    },
    setIsEndTurn: (IsEndTurn: boolean) => {
        return ({type: "threeInLine_SET_IS_END_TURN", IsEndTurn,} as const)
    },
    setGemsCount: (count: number) => {
        return ({type: "threeInLine_SET_GEMS_COUNT", count,} as const)
    },
    setIsBoom: (value: boolean) => {
        return ({type: "threeInLine_SET_IS_BUM", value,} as const)
    },
    deleteAnimationInSector: (i: number, j: number) => {
        return ({type: "threeInLine_DELETE_ANIMATION_IN_SECTOR", i, j} as const)
    },
    setAnimationCount: (count: number) => {
        return ({type: "threeInLine_SET_ANIMATION_COUNT", count} as const)
    },
    decreaseAnimationCount: () => {
        return ({type: "threeInLine_DECREASE_ANIMATION_COUNT"} as const)
    },
    increaseAnimationCountEnd: (sector: { i: number, j: number }) => {
        return ({type: "threeInLine_INCREASE_ANIMATION_COUNT_END", sector} as const)
    },
    deleteAnimationCountEnd: () => {
        return ({type: "threeInLine_DELETE_ANIMATION_COUNT_END"} as const)
    },
}

export const selectNewSectorThink = (map: MapsGameType, sector: SectorGameType): AnyBaseActionType =>
    async (dispatch) => {
        dispatch(threeInLineAction.setMap(selectSectorFunc(map, sector)))
        dispatch(threeInLineAction.setSelectSector(sector))
    }

export const unselectNewSectorThink = (map: MapsGameType, sector: SectorGameType): AnyBaseActionType =>
    async (dispatch) => {
        dispatch(threeInLineAction.setMap(deleteSectorSelection(map, sector)))
        dispatch(threeInLineAction.setSelectSector(null))
    }

export const replacementSectorsThink = (Map: MapsGameType, sector: SectorGameType, selectSector: SectorGameType): AnyBaseActionType =>
    async (dispatch) => {
        let map = selectSectorFunc(Map, sector)
        dispatch(threeInLineAction.setMap(deleteSectorSelection(map, selectSector)))
        dispatch(threeInLineAction.setSelectSector(sector))
        dispatch(threeInLineAction.setSelectSector(null))
    }

export const boomEffectThink = (map: MapsGameType, gemsCount: number, score: number,): AnyBaseActionType => {
    return async (dispatch) => {
        /* console.log("boomFunc ==> is bum")*/
        let boomFuncState = boomFunc1(map, gemsCount)
        dispatch(threeInLineAction.setMap(boomFuncState.map))
        dispatch(threeInLineAction.setAnimationCount(boomFuncState.animationsCount))
        dispatch(threeInLineAction.setAddScore(boomFuncState.score))
        dispatch(threeInLineAction.setScore(score + boomFuncState.score))
        dispatch(threeInLineAction.setIsBoom(true))
    }
}

export const checkMapThink = (map: MapsGameType): AnyBaseActionType => {
    return async (dispatch) => {
        /* console.log("checkMapThink")*/
        dispatch(threeInLineAction.setMap(findBonusBumFunc(map)))
        dispatch(threeInLineAction.setIsBoom(false))
    }
}
export const endTurnThink = (): AnyBaseActionType => {
    return async (dispatch) => {
        dispatch(threeInLineAction.setIsEndTurn(false))
        dispatch(threeInLineAction.setIsBoom(false))
    }
}

export const deleteAnimationsThink = (Map: MapsGameType,
                                      animationCountEnd: {
                                          count: number,
                                          sectors: Array<{ i: number, j: number }>
                                      },
): AnyBaseActionType => {
    return async (dispatch) => {
        dispatch(threeInLineAction.setAnimationCount(0))
        dispatch(threeInLineAction.setMap(deleteAnimationNameInMap(Map, animationCountEnd.sectors)))
        dispatch(threeInLineAction.deleteAnimationCountEnd())
    }
}


const setHandleAnimation = (Map: MapsGameType, sector1: SectorGameType, sector2: SectorGameType,
                            isLine: boolean) => {
    let map = [...Map]
    for (let i = 0; i < map.length; i++) {
        map[i] = [...Map[i]]
    }
    map[sector1.sectorState.y][sector1.sectorState.x] = {...Map[sector1.sectorState.y][sector1.sectorState.x]}
    map[sector1.sectorState.y][sector1.sectorState.x].sectorState.animateMove = {
        animateObject:setAnimationCSS1(sector1.sectorState.y, sector1.sectorState.x,
            sector2.sectorState.y - sector1.sectorState.y,
            sector2.sectorState.x - sector1.sectorState.x,
            isLine, isLine)
    }
    map[sector2.sectorState.y][sector2.sectorState.x] = {...Map[sector2.sectorState.y][sector2.sectorState.x]}
    map[sector2.sectorState.y][sector2.sectorState.x].sectorState.animateMove = {
        animateObject:setAnimationCSS1(sector2.sectorState.y, sector2.sectorState.x,
            sector1.sectorState.y - sector2.sectorState.y,
            sector1.sectorState.x - sector2.sectorState.x,
            isLine, isLine)
    }
    return map
}


export const checkOnLineInSelectSectorsThink = (Map: MapsGameType,
                                                selectSector: SectorGameType, sector: SectorGameType,
                                                isDevMode = false): AnyBaseActionType =>
    async (dispatch) => {
        // клик рядом с выделеным сектором

        let map = [...Map]

        for (let i = 0; i < map.length; i++) {
            map[i] = [...Map[i]]
        }

        dispatch(threeInLineAction.setSelectSector(null))
        if (selectSector.date.state === 8) {
            // выделен алмаз
            if (sector.date.state === 8) {
                // выделены два алмаза
                map = blowUpAllMap(map)
                !isDevMode && dispatch(threeInLineAction.setIsEndTurn(true))
            } else {
                map = blowUpSelectedSectors(map, selectSector, sector)
                !isDevMode && dispatch(threeInLineAction.setIsEndTurn(true))
            }
        } else if (sector.date.state === 8) {
            // рядом алмаз
            map = blowUpSelectedSectors(map, sector, selectSector)
            !isDevMode && dispatch(threeInLineAction.setIsEndTurn(true))
        } else if ((sector.date.bonusSector === 1 || sector.date.bonusSector === 2)
            && (selectSector.date.bonusSector === 1 || selectSector.date.bonusSector === 2)) {
            // рядом два бонусных сектора по вертикали и или по горизонтали
            map = blowUpCrosshair(map, sector)
            !isDevMode && dispatch(threeInLineAction.setIsEndTurn(true))
        } else if (sector.date.bonusSector === 3 && selectSector.date.bonusSector === 3) {
            //рядом два бонусных сектора в+г
            map = blowUpBigCrosshair(map, sector)
            !isDevMode && dispatch(threeInLineAction.setIsEndTurn(true))
        } else if ((sector.date.bonusSector === 3 && (selectSector.date.bonusSector === 1 || selectSector.date.bonusSector === 2))
            || (selectSector.date.bonusSector === 3 && (sector.date.bonusSector === 1 || sector.date.bonusSector === 2))) {
            //рядом бонусный сектор в+г и бонусный сектор верт или гориз
            map = blowUpCrosshair(blowUpCrosshair(map, sector), selectSector)
            !isDevMode && dispatch(threeInLineAction.setIsEndTurn(true))
        } else {
            //нет двух бонусных секторов или алмаза/ов  в секторах для замены
            //создание копий и перестановка секторов в новой карте
            let sectorInMemory = JSON.parse(JSON.stringify(sector)) as SectorGameType
            let selectSectorInMemory = JSON.parse(JSON.stringify(selectSector)) as SectorGameType
            let newMap = replaceSectors(map, selectSectorInMemory, sectorInMemory)
            const isLineInMap = isSectorInLine(newMap, sectorInMemory, selectSectorInMemory)
            // есть комбинация из трех и более
            if (isLineInMap) {
                /*console.log("onMouseDown isLineInMap")*/
                //проверяем на бонусные сектора в секторах для взрыва
                map = findBonusBumFunc(isLineInMap)
                map = setHandleAnimation(map, sectorInMemory, selectSectorInMemory, true)
                dispatch(threeInLineAction.setAnimationCount(2))
                //установка конца хода
                !isDevMode && dispatch(threeInLineAction.setIsEndTurn(true))
            } else {
                // нет комбинаций из трех и более, снятие выделения
                if (isDevMode) {
                    map = newMap
                } else {
                    /*console.log("deleteSectorSelection")*/
                    map = deleteSectorSelection(map, selectSector)
                    map = setHandleAnimation(map, sectorInMemory, selectSectorInMemory, false)
                    dispatch(threeInLineAction.setAnimationCount(2))
                }
            }
        }
        dispatch(threeInLineAction.setMap(map))
    }


export default threeInLineReducer;


