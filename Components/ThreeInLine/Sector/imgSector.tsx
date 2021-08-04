import {FC, useEffect, useRef} from "react";
import sw0 from "../../../assets/img/G1.png";
import sw1 from "../../../assets/img/G2.png";
import sw2 from "../../../assets/img/G3.png";
import sw3 from "../../../assets/img/G4.png";
import sw4 from "../../../assets/img/G5.png";
import sw5 from "../../../assets/img/G6.png";
import sw6 from "../../../assets/img/G7.png";
import sw7 from "../../../assets/img/G8.png";
import bw8 from "../../../assets/img/G9.png";
import m1 from "../../../assets/img/lightningH.png";
import m2 from "../../../assets/img/lightningV.png";
import m3 from "../../../assets/img/lightningVH.png";
import {useDispatch} from "react-redux";
import {Animated, Image, StyleSheet, Text, View} from "react-native";
import {SectorGameType, threeInLineAction} from "../../redux/threeInLine-reduser";
import * as React from "react";


type SectorImageType = {
    sector: SectorGameType
    heightSector:number
}
type value = {
    x: number
    y: number
}
const SectorMemo: FC<SectorImageType> = ({sector,heightSector}) => {
    const imgMass = [sw0, sw1, sw2, sw3, sw4, sw5, sw6, sw7, bw8]
    const bonusImgMass = [m1, m2, m3,]
    const dispatch = useDispatch()

    let shiftValueIn = 0
    let valueIn = { x: 0, y: 0 } as value
    let fall: boolean = true

    const shiftAnimationValue = sector.sectorState.animateMove?.animateObject
    if (shiftAnimationValue) {
        fall = shiftAnimationValue.fall
        shiftValueIn = (shiftAnimationValue.shiftI * heightSector + shiftAnimationValue.shiftJ * heightSector)
        valueIn = {
            x: shiftAnimationValue.shiftJ * heightSector,
            y: shiftAnimationValue.shiftI * heightSector,
        }
    }
    let anim = useRef(new Animated.Value(shiftValueIn)).current

    const shiftIn = () => {
        Animated.timing(anim, {
            toValue: 0,
            duration: 200,
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
    const shiftOut = () => {
        Animated.timing(anim, {
            toValue: shiftValueIn,
            duration: 200,
            useNativeDriver: true
        }).start((finished) => {
            if (finished.finished) {
                Animated.timing(anim, {
                    toValue: 0,
                    duration: 200,
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
            }
        });
    };

    useEffect(() => {
        if (shiftAnimationValue) {
            if (fall) {
                anim.setValue(shiftValueIn)
                shiftIn()
            } else {
                anim.setValue(0)
                shiftOut()
            }
        }
    }, [fall,shiftAnimationValue])

    return (
        <View style={[s.main,
            {backgroundColor: sector.sectorState.isSelected ? "red" : "#0000",}]}>
            <Animated.View style={[{
                transform:  [
                    {translateX: valueIn.x ? anim : 0},
                    {translateY: valueIn.y ? anim : 0},
                ],
            }, {height: `100%`, width:`100%`}]}>
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
        start: 0,
        borderRadius: 5,
        height: `95%`,
        width: `95%`,
    },
    isBum: {
        position: "absolute",
        start: 0,
        borderRadius: 5,
        backgroundColor: `#10ac05`,
        height: `95%`,
        width: `95%`,
    },
    score: {
        position: `absolute`,
        start: 0,
    }
});
export default React.memo(SectorMemo)
