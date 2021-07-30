import {FC} from "react";
import {initMapGame3inLine} from "../gameLogic/initMapGame3inLine";
import {checkMap} from "../gameLogic/checkMap";
import {findBonusBumFunc} from "../gameLogic/findBonusBumFunc";
import {checkMapOnMove} from "../gameLogic/checkMapOnMove";
import {initMapGame3inLineFalseGame} from "../gameLogic/initMapGame3inLineFalseGame";
import {useDispatch, useSelector} from "react-redux";
import {getAddScore, getDeskState, getIsDevMode, getIsEndTurn, getScore} from "../../redux/threeInLine-selectors";
import {threeInLineAction} from "../../redux/threeInLine-reduser";
import {MapsGameType} from "../DeskThreeInLine";
import {boomFunc1} from "../gameLogic/boomFunc1";
import * as React from "react";
import {View, Text, Button} from "react-native";


type PropsType = {
    map: MapsGameType
    gemsCount: number
    setEndMove: React.Dispatch<React.SetStateAction<boolean>>
}

export const Header3inLine: FC<PropsType> = React.memo(({map, setEndMove, gemsCount}) => {
    const dispatch = useDispatch()
    const score = useSelector(getScore)
    const addScore = useSelector(getAddScore)
    const deskState = useSelector(getDeskState)
    const isDevMode = useSelector(getIsDevMode)
    const isEndTurn = useSelector(getIsEndTurn)

    const onClickBum = () => {
        dispatch(threeInLineAction.setPrevMap(JSON.parse(JSON.stringify(map))))
        let boomFuncState = boomFunc1(map, gemsCount)
        dispatch(threeInLineAction.setMap(boomFuncState.map))
        dispatch(threeInLineAction.setAddScore(boomFuncState.score))
        dispatch(threeInLineAction.setScore(score + boomFuncState.score))
        dispatch(threeInLineAction.setIsEndTurn(false))
    }
    const onClickFindBonus = () => {
        dispatch(threeInLineAction.setPrevMap(JSON.parse(JSON.stringify(map))))
        dispatch(threeInLineAction.setMap(findBonusBumFunc(map)))
    }
    const onClickCheckIsBum = () => {
        dispatch(threeInLineAction.setPrevMap(JSON.parse(JSON.stringify(map))))
        const newMap = checkMap(map)
        if (newMap.isBum) {
            dispatch(threeInLineAction.setMap(newMap.map))
        }
    }

    const newMap = () => {
        if (!checkMapOnMove(map)) {
            dispatch(threeInLineAction.setMap(initMapGame3inLine(deskState.x, deskState.y, gemsCount)))
            setEndMove(false)
        }
    }
    const setMapOnClick = () => {
        dispatch(threeInLineAction.setMap(initMapGame3inLineFalseGame(deskState.x, deskState.y)))
    }


    const takeAwayLine = (value: "x" | "y") => {
        if (deskState[value] > 5) {
            let x = deskState[value] as number
            dispatch(threeInLineAction.setDeskState({
                ...deskState, [value]: x - 1
            }))
            dispatch(threeInLineAction.setMap(initMapGame3inLine(
                value === "x" ? deskState.x - 1 : deskState.x,
                value === "y" ? deskState.y - 1 : deskState.y,
                gemsCount
            )))
        }
    }

    const addLine = (value: "x" | "y") => {
        let x = deskState[value] as number
        dispatch(threeInLineAction.setDeskState({
            ...deskState, [value]: x + 1
        }))
        dispatch(threeInLineAction.setMap(initMapGame3inLine(
            value === "x" ? deskState.x + 1 : deskState.x,
            value === "y" ? deskState.y + 1 : deskState.y,
            gemsCount
        )))
    }
    const changeSizeSector = (add: boolean) => {
        if (add) {
            dispatch(threeInLineAction.setDeskState({
                ...deskState, length: deskState.length + 1
            }))
        } else if (deskState.length > 10) {
            dispatch(threeInLineAction.setDeskState({
                ...deskState, length: deskState.length - 1
            }))
        }

    }
    const changeCountGems = (add: boolean) => {
        if (add) {
            dispatch(threeInLineAction.setGemsCount(gemsCount + 1))
        } else if (deskState.length > 10) {
            dispatch(threeInLineAction.setGemsCount(gemsCount - 1))
        }
    }

    return (
        <View style={{flexDirection: "column"}}>
            <View style={{flexDirection: "row"}}>
                <FieldChangeButtons label={`вертикаль: ${map.length} `} value={"x"} addLine={addLine}
                                    takeAwayLine={takeAwayLine}/>
                <FieldChangeButtons label={`горизонталь: ${map[0].length}`} value={"y"} addLine={addLine}
                                    takeAwayLine={takeAwayLine}/>
                <View>
                    <Text>масштаб:</Text>
                    <View style={{flexDirection: "row"}}>
                        <Button title="+" onPress={() => {
                            changeSizeSector(true)
                        }}/>
                        <Button title="-" onPress={() => {
                            changeSizeSector(false)
                        }}/>
                    </View>
                </View>
                <View>
                    <Text>количество камней: {gemsCount}</Text>
                    <View style={{flexDirection: "row"}}>
                        <Button title="+" disabled={gemsCount > 7}
                                onPress={() => {
                                    changeCountGems(true)
                                }}/>
                        <Button title="-" disabled={gemsCount < 5}
                                onPress={() => {
                                    changeCountGems(false)
                                }}/>
                    </View>
                </View>
            </View>
            <View style={{flexDirection: "row"}}>
                <View>
                    <View><Text>очки:{score}</Text></View>
                    <View><Text>+{addScore}</Text></View>
                </View>
                <View>
                    <View>
                        {isDevMode ? <Text>РАЗРАБОТЧИК</Text> : <Text>ИГРА</Text>}
                    </View>
                    <View>
                        {isEndTurn ? <Text>ждите</Text> : <Text>ваш ход</Text>}
                    </View>
                </View>
                <View>
                    <View>
                        <Button title="режим" onPress={() => dispatch(threeInLineAction.setIsDevMode(!isDevMode))}/>
                    </View>
                    {isDevMode && <>
                        <View style={{flexDirection: "row"}}>
                            <Button title="check" onPress={onClickCheckIsBum}/>
                            <Button title="bonus" onPress={onClickFindBonus}/>
                            <Button title="bum" onPress={onClickBum}/>
                        </View>
                        <View style={{flexDirection: "row"}}>
                            <Button title="new map" onPress={newMap}/>
                            <Button title="set map" onPress={setMapOnClick}/>
                        </View>
                    </>
                    }
                </View>
            </View>
        </View>
    )
})

type FieldChangeButtonsType = {
    label: string,
    addLine: (value: "x" | "y") => void,
    takeAwayLine: (value: "x" | "y") => void,
    value: "x" | "y"
}
const FieldChangeButtons: FC<FieldChangeButtonsType> = React.memo(({label, addLine, takeAwayLine, value}) => {
    return (
        <View>
            <Text> {label} </Text>
            <View style={{flexDirection: "row"}}>
                <Button title="+" onPress={() => {
                    addLine(value)
                }}/>
                <Button title="-" onPress={() => {
                    takeAwayLine(value)
                }}/>
            </View>
        </View>
    )
})