import * as React from "react";
import {FC, useState} from "react";
import Sector from "./Sector/Sector";
import {GestureResponderEvent, LayoutChangeEvent, LayoutRectangle, StyleSheet, Text, View,} from "react-native";
import {deskStateType} from "./ThreeInLine";
import {SectorGameType} from "../redux/threeInLine-reduser";

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
const DeskThreeInLine: FC<PropsType> = ({
                                            userMap, deskState, returnMouseDown, selectSector,
                                            returnMouseUp, returnMouseOver, isEndTurn,
                                        }) => {
    const [layoutState, setLayoutState] = useState<{
        layout: LayoutRectangle,
        heightSector: number,
        widthSector: number
    }>()
    const countOfX = userMap[0].length
    const countOfY = userMap.length
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

    return (<>
            {layoutState && <View style={[styles.main, {aspectRatio: userMap[0].length / userMap.length,}]}
                                  onLayout={onLayout}

                                  onStartShouldSetResponder={() => true}
                                  onMoveShouldSetResponder={() => true}
                                  onResponderTerminationRequest={() => true}

                                  onResponderStart={handlerMouseDown}
                                  onResponderRelease={handlerMouseUp}
                                  onResponderMove={handlerMouseOver}
            >
                {userMap.map((a: Array<SectorGameType>) =>
                    <View key={a[0].sectorState.y} style={styles.row}>
                        {a.map((b) =>
                            <View key={b.sectorState.x} style={styles.cell}>
                                <Sector key={b.sectorState.x * 10 + b.sectorState.y}
                                        sector={b}
                                        heightSector={layoutState.heightSector}
                                />
                            </View>
                        )}
                    </View>
                )}
            </View>
            }
        </>
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


