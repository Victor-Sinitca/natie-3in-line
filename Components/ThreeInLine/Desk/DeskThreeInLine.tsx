import * as React from "react";
import {FC, useState} from "react";
import {GestureResponderEvent, LayoutChangeEvent, LayoutRectangle, StyleSheet, Text, View,} from "react-native";
import {deskStateType} from "../ThreeInLine";
import {SectorGameType} from "../../redux/threeInLine-reduser";
import RowDesk from "./RowDesk";
import FreeJsDesk from "../FreeJsdesk/FreeJsDesk";


export type MapsGameType = Array<Array<SectorGameType>>
type PropsType = {
    isEndTurn: boolean
    userMap: MapsGameType
    returnMouseDown: (i: number, j: number) => void
    returnMouseUp: (i: number, j: number) => void
    returnMouseOver: (i: number, j: number) => void
}
export type LayoutStateType = {
    layout: LayoutRectangle,
    heightSector: number,
    widthSector: number
}
const DeskThreeInLine: FC<PropsType> = ({
                                            userMap,  returnMouseDown,
                                            returnMouseUp, returnMouseOver, isEndTurn,
                                        }) => {
    const [layoutState, setLayoutState] = useState<LayoutStateType>()
    const countOfX = userMap[0].length
    const countOfY = userMap.length
    const mapPrint= userMap.map((a) =><RowDesk key={a[0].sectorState.y} a={a} layoutState={layoutState}/>)

    const onLayout = (event: LayoutChangeEvent) => {
        setLayoutState({
            layout: event.nativeEvent.layout,
            heightSector: event.nativeEvent.layout.height / countOfY,
            widthSector: event.nativeEvent.layout.width / countOfX
        })
    }
    const handlerMouseDown = (event: GestureResponderEvent) => {
        if (layoutState && isResponder(isEndTurn, layoutState, event)) {
            const i = Math.trunc((event.nativeEvent.pageY - layoutState.layout.y - 20) / layoutState.heightSector)
            const j = Math.trunc((event.nativeEvent.pageX - layoutState.layout.x) / layoutState.widthSector)
            returnMouseDown(i, j)
        }
    }
    const handlerMouseUp = (event: GestureResponderEvent) => {
        if (layoutState && isResponder(isEndTurn, layoutState, event)) {
            const i = Math.trunc((event.nativeEvent.pageY - layoutState.layout.y - 20) / layoutState.heightSector)
            const j = Math.trunc((event.nativeEvent.pageX - layoutState.layout.x) / layoutState.widthSector)
            if (userMap[i][j].sectorState.isSelected) {
                returnMouseUp(i, j)
            }
        }
    }
    const handlerMouseOver = (event: GestureResponderEvent) => {
        if (layoutState && isResponder(isEndTurn, layoutState, event)) {
            const i = Math.trunc((event.nativeEvent.pageY - layoutState.layout.y - 20) / layoutState.heightSector)
            const j = Math.trunc((event.nativeEvent.pageX - layoutState.layout.x) / layoutState.widthSector)
            if (!userMap[i][j].sectorState.isSelected) {
                returnMouseOver(i, j)
            }
        }
    }
    return (<View  style={[styles.main, {aspectRatio: userMap[0].length / userMap.length, backgroundColor:`#228877`}]}
                  onLayout={onLayout}

                  onStartShouldSetResponder={() => true}
                  onMoveShouldSetResponder={() => true}
                  onResponderTerminationRequest={() => true}

                  onResponderStart={handlerMouseDown}
                  onResponderRelease={handlerMouseUp}
                  onResponderMove={handlerMouseOver}
            >
            {/*<FreeJsDesk/>*/}
            {/*{mapPrint}*/}

            </View>
    )
}
const styles = StyleSheet.create({
    main: {
        flexDirection: "column",
        backgroundColor: `#9eeaea`
    }
});
export default React.memo(DeskThreeInLine)


function isResponder(isEndTurn: boolean, layoutState: {
    layout: LayoutRectangle,
    heightSector: number,
    widthSector: number
} | undefined, event: GestureResponderEvent) {
    return (!isEndTurn && layoutState
        && event.nativeEvent.pageY > layoutState.layout.y
        && event.nativeEvent.pageY < layoutState.layout.height + layoutState.layout.y
        && event.nativeEvent.pageX > layoutState.layout.x
        && event.nativeEvent.pageX < layoutState.layout.width + layoutState.layout.x)
}


