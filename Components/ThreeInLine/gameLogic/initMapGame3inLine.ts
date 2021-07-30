import {MapsGameType} from "../../redux/threeInLine-reduser";
import {getRandomInt} from "./getRandom";


export const initMapGame3inLine = (x: number = 10, y: number = 10 , gemsCount = 4 as number) => {
    let map = Array.from(Array(x),
        () => new Array(y)

    ) as MapsGameType

    for (let i = 0; i < x; i++) {
        for (let j = 0; j < y; j++) {
            let randomMassState = []
            for (let s = 0; s < gemsCount; s++) { //4 - 8
                if ((map[i - 1]?.[j].date.state === s && map[i - 2]?.[j].date.state === s) ||
                    (map[i][j - 1]?.date.state === s && map[i][j - 2]?.date.state === s)) {

                }else{
                    randomMassState.push(s)
                }
            }
            map[i][j] = {
                sectorState: {
                    x: j,
                    y: i,
                    isSelected: false,
                    isFirstClick: false,
                    animateMove:  null,
                    animateStart:false,
                },
                date: {
                    color: "red",
                    state: randomMassState[getRandomInt(randomMassState.length)],
                    isBum: false,
                    score:0,
                    addBonusSector:0,
                    bonusSector: 0,
                }
            }
        }
    }
    return map
}


