import {FC} from "react";
import {initMapGame3inLine} from "../gameLogic/initMapGame3inLine";
import {checkMap} from "../gameLogic/checkMap";
import {findBonusBumFunc} from "../gameLogic/findBonusBumFunc";
import {checkMapOnMove} from "../gameLogic/checkMapOnMove";
import {initMapGame3inLineFalseGame} from "../gameLogic/initMapGame3inLineFalseGame";
import {useDispatch, useSelector} from "react-redux";
import {getAddScore, getDeskState, getIsDevMode, getIsEndTurn, getScore} from "../../redux/threeInLine-selectors";
import {threeInLineAction} from "../../redux/threeInLine-reduser";
import {MapsGameType} from "../Desk/DeskThreeInLine";
import {boomFunc1} from "../gameLogic/boomFunc1";
import * as React from "react";
import {View, Text, Button, StyleSheet} from "react-native";
import FieldChangeButtons from "./FieldChangeButtons";
import GemsChangeButtons from "./GemsChangeButtons";


type PropsType = {
    map: MapsGameType
    gemsCount: number
    score:number
    isDevMode:boolean
    isEndTurn:boolean
    setEndMove: React.Dispatch<React.SetStateAction<boolean>>
}

const Header3inLine: FC<PropsType> = ({map, setEndMove, gemsCount,score
,isDevMode,isEndTurn}) => {
    const dispatch = useDispatch()
    const addScore = useSelector(getAddScore)
    const deskState = useSelector(getDeskState)

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
    const changeCountGems = (add: boolean) => {
        if (add) {
            dispatch(threeInLineAction.setGemsCount(gemsCount + 1))
        } else if (deskState.length > 10) {
            dispatch(threeInLineAction.setGemsCount(gemsCount - 1))
        }
    }

    return (
        <View style={[styles.main, {flexDirection: "column"}]}>
            <View style={{flexDirection: "row", width: "100%", alignContent: "space-around", padding: 10}}>
                <FieldChangeButtons label={`верт: ${map.length} `} nameValue={"x"} addLine={addLine}
                                    takeAwayLine={takeAwayLine} value={deskState.x}/>
                <FieldChangeButtons label={`гор: ${map[0].length}`} nameValue={"y"} addLine={addLine}
                                    takeAwayLine={takeAwayLine} value={deskState.y}/>
                <GemsChangeButtons gemsCount={gemsCount} changeCountGems={changeCountGems}/>
            </View>
            <View style={{flexDirection: "row", padding: 10, alignContent: "stretch"}}>
                <View style={{flex: 1}}>
                    <View><Text>очки:{score}</Text></View>
                    <View><Text>+{addScore}</Text></View>
                </View>
                <View style={{flex: 1}}>
                    <View>
                        {isDevMode ? <Text>РАЗРАБОТЧИК</Text> : <Text>ИГРА</Text>}
                    </View>
                    <View>
                        {isEndTurn ? <Text>ждите</Text> : <Text>ваш ход</Text>}
                    </View>
                </View>
                <View style={{flex: 1}}>
                    <View>
                        <Button title="режим" onPress={() => dispatch(threeInLineAction.setIsDevMode(!isDevMode))}/>
                    </View>
                </View>
            </View>
            {isDevMode && <View style={{flexDirection: "row", padding: 10, alignContent: "stretch"}}>
                <View style={{flex: 1}}>
                    <Button title="check" onPress={onClickCheckIsBum}/>
                </View>
                <View style={{flex: 1}}>
                    <Button title="bonus" onPress={onClickFindBonus}/>
                </View>
                <View style={{flex: 1}}>
                    <Button title="bum" onPress={onClickBum}/>
                </View>
                <View style={{flex: 1}}>
                    <Button color={"#059"} title="new map" onPress={newMap}/>
                </View>
                <View style={{flex: 1}}>
                    <Button color={"#059"} title="set map" onPress={setMapOnClick}/>
                </View>
            </View>
            }

        </View>
    )
}

const styles = StyleSheet.create({
    main: {}
});

export default React.memo(Header3inLine)
