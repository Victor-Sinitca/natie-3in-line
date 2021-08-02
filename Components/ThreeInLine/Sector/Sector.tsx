import * as React from "react";
import {FC} from "react";
import {GestureResponderEvent, View} from "react-native";
import {deskStateType} from "../ThreeInLine";
import SectorMemo from "./imgSector";


const returnNewSector = (sector: SectorGameType, x: number, y: number) => {
    return {
        ...sector, sectorState: {
            ...sector.sectorState,
            x: sector.sectorState.x + x,
            y: sector.sectorState.y + y
        }
    }
}

export  type SectorGameType = {
    sectorState: {
        x: number,
        y: number,
        isSelected: boolean,
        isFirstClick: boolean,
        animateMove: {
            name: string,
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
type PropsType = {
    sector: SectorGameType
    deskState: deskStateType
    returnMouseDown: (sector: SectorGameType) => void
    returnMouseUp: (sector: SectorGameType) => void
    returnMouseOver: (sector: SectorGameType) => void
}
const Sector: FC<PropsType> = ({
                                          sector, deskState,
                                          returnMouseDown, returnMouseUp, returnMouseOver,
                                      }) => {
    const index = (sector.sectorState.x + sector.sectorState.y) % 2
    const handlerMouseDown = () => {
        if (!sector.sectorState.animateStart) {
            returnMouseDown(sector)
        }
    }
    const handlerMouseUp = () => {
        if (!sector.sectorState.animateStart) {
            returnMouseUp(sector)
        }
    }
    const handlerMouseOver = (event: GestureResponderEvent) => {
        const e = event
        console.log(`pageX:${event.nativeEvent.pageX}`)
        console.log(`pageY:${event.nativeEvent.pageY}`)
        console.log(`locationX:${event.nativeEvent.locationX}`)
        console.log(`locationY:${event.nativeEvent.locationY}`)
        if(!sector.sectorState.animateStart && !sector.sectorState.isSelected){
            returnMouseOver(sector)
        }

        /*if (!sector.sectorState.animateStart) {
            if (e.nativeEvent.locationX < 0) {
                //j=-1
                if(e.nativeEvent.locationY > 0 && e.nativeEvent.locationY < deskState.length){
                    console.log(`0-1  - locationX:${e.nativeEvent.locationX} locationY: ${e.nativeEvent.locationY}`)
                    returnMouseOver(returnNewSector(sector, -1, 0))
                }
                /!*if (e.nativeEvent.locationY < 0) {
                    // i = -1
                    returnMouseOver(returnNewSector(sector, -1, -1))
                } else if (e.nativeEvent.locationY > deskState.length) {
                    // i = +1
                    returnMouseOver(returnNewSector(sector, -1, +1))
                } else {
                    // i = 0
                    returnMouseOver(returnNewSector(sector, -1, 0))
                }*!/
            } else if (e.nativeEvent.locationX > deskState.length) {
                //j=+1
                if(e.nativeEvent.locationY > 0 && e.nativeEvent.locationY < deskState.length){
                    console.log(`01 - locationX:${e.nativeEvent.locationX} locationY: ${e.nativeEvent.locationY}`)
                    returnMouseOver(returnNewSector(sector, 1, 0))
                }


                /!* if (e.nativeEvent.locationY < 0) {
                     // i = -1
                     returnMouseOver(returnNewSector(sector, +1, -1))
                 } else if (e.nativeEvent.locationY > deskState.length) {
                     // i = +1
                     returnMouseOver(returnNewSector(sector, +1, +1))
                 } else {
                     // i = 0
                     returnMouseOver(returnNewSector(sector, +1, 0))
                 }*!/
            }
            if (e.nativeEvent.locationY < 0) {
                // i = -1
                if(e.nativeEvent.locationX > 0 && e.nativeEvent.locationX < deskState.length){
                    console.log(`-10 - locationX:${e.nativeEvent.locationX} locationY: ${e.nativeEvent.locationY}`)
                    returnMouseOver(returnNewSector(sector, 0, -1))
                }



               /!* if (e.nativeEvent.locationX < 0) {
                    // j = -1
                    returnMouseOver(returnNewSector(sector, -1, -1))
                } else if (e.nativeEvent.locationX > deskState.length) {
                    // j = +1
                    returnMouseOver(returnNewSector(sector, +1, -1))
                } else {
                    // j = 0
                    returnMouseOver(returnNewSector(sector, 0, -1))
                }*!/
            } else if (e.nativeEvent.locationY > deskState.length) {
                // i = +1
                if(e.nativeEvent.locationX > 0 && e.nativeEvent.locationX < deskState.length){
                    console.log(`10 - locationX:${e.nativeEvent.locationX} locationY: ${e.nativeEvent.locationY}`)
                    returnMouseOver(returnNewSector(sector, 0, 1))
                }
                /!*if (e.nativeEvent.locationX < 0) {
                    // j = -1
                    returnMouseOver(returnNewSector(sector, -1, +1))
                } else if (e.nativeEvent.locationX > deskState.length) {
                    // j = +1
                    returnMouseOver(returnNewSector(sector, +1, +1))
                } else {
                    // j = 0
                    returnMouseOver(returnNewSector(sector, 0, +1))
                }*!/
            }
        }*/
    }
    return <View style={{height: "100%", width:`100%`, backgroundColor: index ? "#11221122" : "#0000"}}
                 onStartShouldSetResponder={() => true}
                 onMoveShouldSetResponder={() => true}
                 onResponderTerminationRequest={() => true}
                 onResponderStart={handlerMouseDown}
                 onResponderRelease={handlerMouseUp}
                 onResponderMove={handlerMouseOver}
    >
        <SectorMemo sector={sector} deskState={deskState}/>
    </View>
}

export default React.memo(Sector)
