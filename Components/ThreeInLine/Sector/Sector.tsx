import {FC, MouseEvent, useEffect, useRef,} from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    GestureResponderEvent,
    LayoutChangeEvent,
    Animated,
    PanResponder
} from "react-native";

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
import * as React from "react";


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
    returnMouseDown: (sector: SectorGameType) => void
    returnMouseUp: (sector: SectorGameType) => void
    returnMouseOver: (sector: SectorGameType) => void
}
export const Sector: FC<PropsType> = React.memo(({
                                                     sector, returnMouseDown, returnMouseUp, returnMouseOver,
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
        /* console.log(`pageX:${event.nativeEvent.pageX}`)
         console.log(`pageY:${event.nativeEvent.pageY}`)
         console.log(`locationX:${event.nativeEvent.locationX}`)
         console.log(`locationY:${event.nativeEvent.locationY}`)*/


        if (!sector.sectorState.animateStart && !sector.sectorState.isSelected) {
            returnMouseOver(sector)
        }
    }
    const handlerMouseOver111 = (event: any) => {
        if (!sector.sectorState.isSelected) {
            debugger
        }


    }


    return <View style={{height: "100%", backgroundColor: index ? "#11221122" : ""}}
                 onStartShouldSetResponder={() => true}
                 onMoveShouldSetResponder={() => true}
                 onResponderTerminationRequest={() => true}
                 onResponderTerminate={handlerMouseOver}
                 onResponderStart={handlerMouseDown}
                 onResponderRelease={handlerMouseUp}
        /*onResponderMove={handlerMouseOver}*/
        /*onMouseDown={handlerMouseDown}
        onMouseUp={handlerMouseUp}
        onMouseOver={handlerMouseOver}*/
    >
        <SectorMemo sector={sector}/>
    </View>
})


type SectorImageType = {
    sector: SectorGameType
}
const SectorMemo: FC<SectorImageType> = React.memo(({sector}) => {
    const imgMass = [sw0, sw1, sw2, sw3, sw4, sw5, sw6, sw7, bw8]
    const bonusImgMass = [m1, m2, m3,]
    const shadowStyle = {
        shadowColor: "#f30404",
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,

        elevation: 24,
    }
    let boxShadow = sector.sectorState.isSelected && {...shadowStyle}
    const dispatch = useDispatch()
    let spedAnimation = 0
    let valueIn={
        x:0,
        y:-200
    }
    let valueOut={
        x:0,
        y:0
    }
    let fall: boolean = true

    const shiftAnimationValue = sector.sectorState.animateMove?.name.split("S")
    if (shiftAnimationValue) {
        spedAnimation = Math.abs(+shiftAnimationValue[3]) + Math.abs(+shiftAnimationValue[4])
        fall = shiftAnimationValue[5] !== "true"
        valueIn={
            x: +shiftAnimationValue[4]*80,
            y: +shiftAnimationValue[3]*80,

        }
    }

    let anim = useRef(new Animated.ValueXY(fall? valueOut : valueIn)).current
    const fadeIn = () => {
        // Will change fadeAnim value to 1 in 5 seconds
        // @ts-ignore
        Animated.timing(anim, {
            toValue: fall? valueIn  : valueOut,
            duration: 400,
        }).start(({finished}) => {
            if(finished){
                dispatch(threeInLineAction.increaseAnimationCountEnd(
                    {
                        i: sector.sectorState.y,
                        j: sector.sectorState.x
                    }))
            }

        });
    };
  /*  if(spedAnimation){
        fadeIn()
    }*/

    useEffect(() => {
        if(spedAnimation){
            anim.setValue(fall? valueOut :valueIn )
            fadeIn()
        }
    }, [spedAnimation])

    return (
        <View style={{
            height: `100%`,
            width: `100%`,
            borderRadius: 5,
            ...boxShadow,
        }}>
            <Animated.View
                style={[{
                    height: `100%`,
                    width: `100%`,
                },shiftAnimationValue && anim.getLayout()]}
            >
                <Image style={sector.date.isBum ? s.isBum : s.img} source={imgMass[sector.date.state]}/>
                {sector.date.bonusSector > 0 &&
                <Image style={s.img} source={bonusImgMass[sector.date.bonusSector - 1]}/>}
                {sector.date.score > 0 ? <View style={s.score}>{sector.date.score}</View> : <View></View>}
            </Animated.View>
        </View>
    )
})
const s = StyleSheet.create({
    fadingContainer: {},
    img: {
        position: "absolute",
        top: 0,
        left: 0,
        borderRadius: 5,
        height: `95%`,
        width: `95%`,
    },
    isBum: {
        position: "absolute",
        top: 0,
        left: 0,
        borderRadius: 5,
        backgroundColor: `#10ac05`,
        height: `95%`,
        width: `95%`,
    },
    score: {
        position: `absolute`,
        left: 0,
        top: 0,
        bottom: 50,
    }
});
