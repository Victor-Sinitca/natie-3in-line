import {useEffect} from "react";
import {initMapGame3inLine} from "./gameLogic/initMapGame3inLine";
import {useDispatch, useSelector} from "react-redux";
import {
    getAnimationCount,
    getAnimationCountEnd,
    getDeskState,
    getGemsCount,
    getMap
} from "../redux/threeInLine-selectors";
import {deleteAnimationsThink, threeInLineAction} from "../redux/threeInLine-reduser";

import * as React from "react";
import {View, Text, StyleSheet} from "react-native";
import ThreeInLine from "./ThreeInLine";

const ThreeInLineContainer = () => {
    const dispatch = useDispatch()
    const map = useSelector(getMap)
    const deskState = useSelector(getDeskState)
    const gemsCount = useSelector(getGemsCount)
    const animationCount = useSelector(getAnimationCount)
    const animationCountEnd = useSelector(getAnimationCountEnd)


    useEffect(() => {
        // выполняем удаление анимаций из секторов и обнуляем счетчик анимаций для выполнения
        if (map && !(animationCount === 0 && animationCountEnd.count === 0) &&
            (animationCount === animationCountEnd.count)) {
            dispatch(deleteAnimationsThink(map, animationCountEnd))
        }
    }, [animationCount, animationCountEnd, map])


    useEffect(() => {
        dispatch(threeInLineAction.setMap(initMapGame3inLine(deskState.x, deskState.y, gemsCount)))
    }, [gemsCount, deskState])


    return <View style={styles.main}>
        {map && <ThreeInLine map={map} gemsCount={gemsCount} animationCount={animationCount} deskState={deskState}/>}
    </View>

}
const styles = StyleSheet.create({
    main: {
        width: "100%",
        height: "100%"
    }
});
export default ThreeInLineContainer
