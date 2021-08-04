import * as React from "react";
import {FC, useEffect, useState} from "react";
import {isNearbyWithSector} from "./gameLogic/isNearbyWithSector";
import {SetIsFirstClickSector} from "./gameLogic/setIsFirstClickSector";
import {checkMap} from "./gameLogic/checkMap";
import {useDispatch, useSelector} from "react-redux";
import {
    boomEffectThink,
    checkMapThink,
    checkOnLineInSelectSectorsThink,
    endTurnThink,
    MapsGameType,
    replacementSectorsThink,
    selectNewSectorThink,
    threeInLineAction,
    unselectNewSectorThink
} from "../redux/threeInLine-reduser";
import {getIsBoom, getIsDevMode, getIsEndTurn, getScore, getSelectSector} from "../redux/threeInLine-selectors";
import DeskThreeInLine from "./DeskThreeInLine";
import {StyleSheet, Text, View} from "react-native";
import Header3inLine from "./Header3inLine/Header3inLine";


export type deskStateType = {
    x: number, y: number, length: number
}
type PropsType = {
    map: MapsGameType
    gemsCount: number
    animationCount: number
    deskState: deskStateType
}
const ThreeInLine: FC<PropsType> = ({map, gemsCount, animationCount, deskState}) => {
    const dispatch = useDispatch()
    const [endMove, setEndMove] = useState<boolean>(false)
    const score = useSelector(getScore)
    const isDevMode = useSelector(getIsDevMode)
    const selectSector = useSelector(getSelectSector)
    const isEndTurn = useSelector(getIsEndTurn)
    const isBoom = useSelector(getIsBoom)


    const onMouseDown = (i: number, j: number) => {
        if (!isEndTurn && !animationCount) {
            if (selectSector) {
                // есть выделенный сектор
                if (map[i][j].sectorState.isSelected) {
                    /* console.log("onMouseDown - old sector selected ")*/
                    // если сектор был выделен  установка флага на снятие выделения
                    dispatch(threeInLineAction.setMap(SetIsFirstClickSector(map, map[i][j])))
                    /* } else if (isNearbyWithSector(selectSector, sector)) {*/
                } else if (isNearbyWithSector(selectSector, map[i][j])) {
                    /* console.log("onMouseDown -isNearbyWithSector")*/
                    dispatch(checkOnLineInSelectSectorsThink(map, selectSector, map[i][j], false))
                } else {
                    /* console.log("onMouseDown - new sector selected")*/
                    // выбран сектор не рядом выделение сектора
                    // удаление старого выдления, установка нового выделения
                    // запись карты
                    dispatch(replacementSectorsThink(map, map[i][j], selectSector))
                    dispatch(threeInLineAction.setSelectSector(map[i][j]))
                }
            } else {
                /*console.log("onMouseDown -selectNewSectorThink")*/
                // выделение и сохранение выделенного сектора как  выделенный
                dispatch(selectNewSectorThink(map, map[i][j]))
            }
        }
    }
    const onMouseDownDev = (i: number, j: number) => {
        if (selectSector) {
            if (map[i][j].sectorState.isSelected) {
                dispatch(threeInLineAction.setMap(SetIsFirstClickSector(map, map[i][j])))
            } else {
                dispatch(checkOnLineInSelectSectorsThink(map, selectSector, map[i][j], true))
            }
        } else if (map) {
            dispatch(selectNewSectorThink(map, map[i][j]))
        }

    }
    const onMouseUp = (i: number, j: number) => {
        if (map[i][j].sectorState.isFirstClick
            && map[i][j].sectorState.isSelected
            && !isEndTurn && !animationCount) {
            dispatch(unselectNewSectorThink(map, map[i][j]))
        }
    }
    const onMouseOver = (i: number, j: number) => {
        if (selectSector && !isEndTurn && !animationCount) {
            if (map[i]?.[j] && isNearbyWithSector(selectSector, map[i][j])) {
                dispatch(checkOnLineInSelectSectorsThink(map, selectSector, map[i][j], false))
            } else {
                dispatch(unselectNewSectorThink(map, selectSector))
            }
        }
    }


// уничтожение секторов
    useEffect(() => {
        if (!isDevMode && isEndTurn && !isBoom && !animationCount) {
            /*console.log("boomEffectThink")*/
            dispatch(boomEffectThink(map, gemsCount, score))
        }
    }, [isEndTurn, isBoom, animationCount,])
// нахождение секторов для уничтожения
    useEffect(() => {
        if (isBoom && !isDevMode) {
            const newMap = checkMap(map)
            if (newMap.isBum) {
                /*console.log("checkMapThink")*/
                dispatch(checkMapThink(newMap.map))
            } else {
                /*console.log("endTurnThink")*/
                dispatch(endTurnThink())
            }
        }
    }, [isBoom, isDevMode,])

    return <View style={styles.main}>
        <Header3inLine map={map} setEndMove={setEndMove} gemsCount={gemsCount}/>
        <DeskThreeInLine userMap={map} selectSector={selectSector}
                         returnMouseDown={isDevMode ? onMouseDownDev : onMouseDown}
                         returnMouseUp={onMouseUp}
                         returnMouseOver={onMouseOver}
                         isEndTurn={isEndTurn}
                         deskState={deskState}
        />
        {endMove && <View> <Text> нет ходов</Text> </View>}
    </View>
}
const styles = StyleSheet.create({
    main: {
        width: "100%",
        height: "100%"
    }
});

export default React.memo(ThreeInLine)
