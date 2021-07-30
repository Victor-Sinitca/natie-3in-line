import {AppStateType} from "./redux-store";

export const getIsDevMode = (state: AppStateType) => {
    return state.threeInLine.isDevMode
}
export const getMap = (state: AppStateType) => {
    return state.threeInLine.map
}
export const getPrevMap = (state: AppStateType) => {
    return state.threeInLine.prevMap
}
export const getScore = (state: AppStateType) => {
    return state.threeInLine.score
}
export const getAddScore = (state: AppStateType) => {
    return state.threeInLine.addScore
}
export const getDeskState = (state: AppStateType) => {
    return state.threeInLine.deskState
}
export const getSelectSector = (state: AppStateType) => {
    return state.threeInLine.selectSector
}
export const getIsEndTurn = (state: AppStateType) => {
    return state.threeInLine.isEndTurn
}
export const getGemsCount = (state: AppStateType) => {
    return state.threeInLine.gemsCount
}
export const getIsBoom = (state: AppStateType) => {
    return state.threeInLine.isBoom
}
export const getAnimationCount = (state: AppStateType) => {
    return state.threeInLine.animationCount
}
export const getAnimationCountEnd = (state: AppStateType) => {
    return state.threeInLine.animationCountEnd
}
