import * as React from "react";
import {FC, useState} from "react";
import Sector, {SectorGameType} from "./Sector/Sector";
import {GestureResponderEvent, LayoutChangeEvent, LayoutRectangle, StyleSheet, Text, View,} from "react-native";
import {deskStateType} from "./ThreeInLine";

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
    const [layout, setLayout] = useState<LayoutRectangle>()
    const countOfX = userMap[0].length
    const countOfY = userMap.length
    const onLayout = (event: LayoutChangeEvent) => {
        setLayout(event.nativeEvent.layout)
    }
    const handlerMouseDown = (event: GestureResponderEvent) => {
        if (!isEndTurn && layout
            && event.nativeEvent.pageY > layout.y
            && event.nativeEvent.pageY < layout.height + layout.y
            && event.nativeEvent.pageX > layout.x
            && event.nativeEvent.pageX < layout.width + layout.x) {
            const i = Math.trunc((event.nativeEvent.pageY - layout.y) / (layout.height / countOfY))
            const j = Math.trunc((event.nativeEvent.pageX - layout.x) / (layout.width / countOfX))
            returnMouseDown(i, j)
        }
    }
    const handlerMouseUp = (event: GestureResponderEvent) => {
        if (!isEndTurn && layout
            && event.nativeEvent.pageY > layout.y
            && event.nativeEvent.pageY < layout.height + layout.y
            && event.nativeEvent.pageX > layout.x
            && event.nativeEvent.pageX < layout.width + layout.x) {
            const i = Math.trunc((event.nativeEvent.pageY - layout.y) / (layout.height / countOfY))
            const j = Math.trunc((event.nativeEvent.pageX - layout.x) / (layout.width / countOfX))
            returnMouseUp(i, j)
        }
    }
    const handlerMouseOver = (event: GestureResponderEvent) => {
        if (!isEndTurn && layout
            && event.nativeEvent.pageY > layout.y
            && event.nativeEvent.pageY < layout.height + layout.y
            && event.nativeEvent.pageX > layout.x
            && event.nativeEvent.pageX < layout.width + layout.x) {
            const i = Math.trunc((event.nativeEvent.pageY - layout.y) / (layout.height / countOfY))
            const j = Math.trunc((event.nativeEvent.pageX - layout.x) / (layout.width / countOfX))
            if(!userMap[i][j].sectorState.isSelected){
                returnMouseOver(i, j)
            }
        }

    }

    return (<>
            <View><Text> 111</Text></View>
            <View style={[styles.main, {aspectRatio: userMap[0].length / userMap.length,}]}
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
                                        deskState={deskState}
                                />
                            </View>
                        )}
                    </View>
                )}
            </View>
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
