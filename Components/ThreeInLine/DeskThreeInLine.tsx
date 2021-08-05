import * as React from "react";
import {FC, useState} from "react";
import {GestureResponderEvent, LayoutChangeEvent, LayoutRectangle, StyleSheet, Text, View,} from "react-native";
import {deskStateType} from "./ThreeInLine";
import {SectorGameType} from "../redux/threeInLine-reduser";
import SectorMemo from "./Sector/Sector";

export type MapsGameType = Array<Array<SectorGameType>>
type PropsType = {
    deskState: deskStateType
    isEndTurn: boolean
    userMap: MapsGameType
    returnMouseDown: (i: number, j: number) => void
    returnMouseUp: (i: number, j: number) => void
    returnMouseOver: (i: number, j: number) => void
    selectSector: SectorGameType | null
}
type LayoutStateType = {
    layout: LayoutRectangle,
    heightSector: number,
    widthSector: number
}
const DeskThreeInLine: FC<PropsType> = ({
                                            userMap, deskState, returnMouseDown, selectSector,
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
    return (<View style={[styles.main, {aspectRatio: userMap[0].length / userMap.length,}]}
                  onLayout={onLayout}

                  onStartShouldSetResponder={() => true}
                  onMoveShouldSetResponder={() => true}
                  onResponderTerminationRequest={() => true}

                  onResponderStart={handlerMouseDown}
                  onResponderRelease={handlerMouseUp}
                  onResponderMove={handlerMouseOver}
            >
            {mapPrint}
            </View>
    )
}
const styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: "row",
    },
    cell: {
        flex: 1,
        height: "100%",
        width: "100%",
    },
    main: {
        /*height:"100%",*/
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

type RowDeskType = {
    a: Array<SectorGameType>,
    layoutState: LayoutStateType | undefined
}
const RowDesk: FC<RowDeskType> = ({a, layoutState}) => {
    const cellDeskPrint= a.map((b) => <CellDesk key={b.sectorState.x} b={b} layoutState={layoutState}/>)
    return (
        <View style={styles.row}>
            {cellDeskPrint}
        </View>
    )
}
type CellDeskType = {
    b: SectorGameType,
    layoutState: LayoutStateType |undefined
}
const CellDesk: FC<CellDeskType> = ({b, layoutState}) => {
    return (
        <View style={styles.cell}>
            {layoutState && <SectorMemo key={b.sectorState.x * 10 + b.sectorState.y}
                                    sector={b}
                                    heightSector={layoutState.heightSector}
            />}
        </View>
    )
}
