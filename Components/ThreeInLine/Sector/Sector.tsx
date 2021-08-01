import * as React from "react";
import {FC, useEffect, useRef,} from "react";
import {Animated, GestureResponderEvent, Image, StyleSheet, Text, View} from "react-native";

import sw0 from "../../../assets/img/G1.png"
import sw1 from "../../../assets/img/G2.png"
import sw2 from "../../../assets/img/G3.png"
import sw3 from "../../../assets/img/G4.png"
import sw4 from "../../../assets/img/G5.png"
import sw5 from "../../../assets/img/G6.png"
import sw6 from "../../../assets/img/G7.png"
import sw7 from "../../../assets/img/G8.png"
import bw8 from "../../../assets/img/G9.png"
import m1 from "../../../assets/img/молния гор.png"
import m2 from "../../../assets/img/молния верт.png"
import m3 from "../../../assets/img/молния в+г.png"
import {threeInLineAction} from "../../redux/threeInLine-reduser";
import {useDispatch} from "react-redux";
import {deskStateType} from "../ThreeInLine";


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
export const Sector: FC<PropsType> = ({
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
        /*console.log(`pageX:${event.nativeEvent.pageX}`)
        console.log(`pageY:${event.nativeEvent.pageY}`)
        console.log(`locationX:${event.nativeEvent.locationX}`)
        console.log(`locationY:${event.nativeEvent.locationY}`)*/
        if (!sector.sectorState.animateStart) {
            if (e.nativeEvent.locationX < 0) {
                //j=-1
                if (e.nativeEvent.locationY < 0) {
                    // i = -1
                    returnMouseOver(returnNewSector(sector, -1, -1))
                } else if (e.nativeEvent.locationY > deskState.length) {
                    // i = +1
                    returnMouseOver(returnNewSector(sector, -1, +1))
                } else {
                    // i = 0
                    returnMouseOver(returnNewSector(sector, -1, 0))
                }
            } else if (e.nativeEvent.locationX > deskState.length) {
                //j=+1
                if (e.nativeEvent.locationY < 0) {
                    // i = -1
                    returnMouseOver(returnNewSector(sector, +1, -1))
                } else if (e.nativeEvent.locationY > deskState.length) {
                    // i = +1
                    returnMouseOver(returnNewSector(sector, +1, +1))
                } else {
                    // i = 0
                    returnMouseOver(returnNewSector(sector, +1, 0))
                }
            }
            if (e.nativeEvent.locationY < 0) {
                // i = -1
                if (e.nativeEvent.locationX < 0) {
                    // i = -1
                    returnMouseOver(returnNewSector(sector, -1, -1))
                } else if (e.nativeEvent.locationX > deskState.length) {
                    // i = +1
                    returnMouseOver(returnNewSector(sector, +1, -1))
                } else {
                    // i = 0
                    returnMouseOver(returnNewSector(sector, 0, -1))
                }
            } else if (e.nativeEvent.locationY > deskState.length) {
                // i = +1
                if (e.nativeEvent.locationX < 0) {
                    // i = -1
                    returnMouseOver(returnNewSector(sector, -1, +1))
                } else if (e.nativeEvent.locationX > deskState.length) {
                    // i = +1
                    returnMouseOver(returnNewSector(sector, +1, +1))
                } else {
                    // i = 0
                    returnMouseOver(returnNewSector(sector, 0, +1))
                }
            }
        }
    }


    return <View style={{flex: 1, height: "100%", backgroundColor: index ? "#11221122" : "#0000"}}
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


type SectorImageType = {
    sector: SectorGameType
    deskState: deskStateType
}
type value = {
    x: number
    y: number
}
const SectorMemo: FC<SectorImageType> = ({sector, deskState}) => {
    const imgMass = [sw0, sw1, sw2, sw3, sw4, sw5, sw6, sw7, bw8]
    const bonusImgMass = [m1, m2, m3,]

    const dispatch = useDispatch()
    let speedAnimation = 0
    let shiftValueIn = 0
    let shiftValueOut = 0
    let valueIn = {
        x: 0,
        y: 0
    } as value
    let valueOut = {
        x: 0,
        y: 0
    } as value
    let fall: boolean = true

    const shiftAnimationValue = sector.sectorState.animateMove?.name.split("S")
    if (shiftAnimationValue) {
        speedAnimation = (Math.abs(+shiftAnimationValue[3]) + Math.abs(+shiftAnimationValue[4])) / 0.0025
        fall = shiftAnimationValue[5] !== "true"
        shiftValueIn = (+shiftAnimationValue[4] * deskState.length + +shiftAnimationValue[3] * deskState.length)
        valueIn = {
            x: +shiftAnimationValue[4] * deskState.length,
            y: +shiftAnimationValue[3] * deskState.length,
        }
    }
    let anim = useRef(new Animated.ValueXY({...valueIn})).current
    let anim2 = useRef(new Animated.Value(shiftValueIn)).current
    const fadeIn = () => {
        // Will change fadeAnim value to 1 in 5 seconds
        Animated.timing(anim, {
            toValue: valueOut,
            duration: 600,
            useNativeDriver: true
        }).start((finished) => {
            /* if (finished.finished) {  */
            dispatch(threeInLineAction.increaseAnimationCountEnd(
                {
                    i: sector.sectorState.y,
                    j: sector.sectorState.x
                }))
            /* }*/
        });
    };

    const fadeInOut = () => {
        Animated.timing(anim, {
            toValue: valueIn,
            duration: 200,
            useNativeDriver: true
        }).start(({finished}) => {
            if (finished) {
                Animated.timing(anim, {
                    toValue: valueOut,
                    duration: 200,
                    useNativeDriver: true
                }).start(({finished}) => {
                    dispatch(threeInLineAction.increaseAnimationCountEnd(
                        {
                            i: sector.sectorState.y,
                            j: sector.sectorState.x
                        }))
                })
            }
        });
    };

    const shiftIn = () => {
        Animated.timing(anim2, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true
        }).start((finished) => {
             if (finished.finished) {
            dispatch(threeInLineAction.increaseAnimationCountEnd(
                {
                    i: sector.sectorState.y,
                    j: sector.sectorState.x
                }))
             }
        });
    };


    useEffect(() => {
        if (speedAnimation) {
            if (!fall) {
                /*anim.setValue(valueIn)
                fadeIn()*/
                anim2.setValue(shiftValueIn)
                shiftIn()
            } else {
               /* anim.setValue(valueOut)
                fadeInOut()*/

                anim2.setValue(shiftValueIn)
                shiftIn()


            }
        }
    }, [speedAnimation, fall])

    return (
        <View style={[s.main,
            {backgroundColor: sector.sectorState.isSelected ? "red" : "#0000",}]}>
            <Animated.View style={[{
                transform: shiftAnimationValue && [
                    {translateX: valueIn.x ? anim2 : 0},
                    {translateY: valueIn.y ? anim2 : 0},
                ] ,
            }, {height: deskState.length, width: deskState.length}]}>
                <Image style={sector.date.isBum ? s.isBum : s.img} source={imgMass[sector.date.state]}/>
                {sector.date.bonusSector > 0 &&
                <Image style={s.img} source={bonusImgMass[sector.date.bonusSector - 1]}/>}
                {sector.date.score > 0 && <View style={s.score}><Text>{sector.date.score}</Text></View>}
            </Animated.View>
        </View>
    )
}
const s = StyleSheet.create({
    main: {
        width: "100%",
        height: "100%",
        borderRadius: 5,
    },
    fadingContainer: {},
    img: {
         position: "absolute",
         start:0,
        borderRadius: 5,
        height: `95%`,
        width: `95%`,
    },
    isBum: {
         position: "absolute",
         start:0,
        borderRadius: 5,
        backgroundColor: `#10ac05`,
        height: `95%`,
        width: `95%`,
    },
    score: {
         position: `absolute`,
          start:0,
          bottom: 50,
    }
});
