import {MapsGameType} from "../../redux/threeInLine-reduser";


export const checkMapOnMove = (map: MapsGameType) => {
    let isMove = false
    for (let i = 0; i < map.length; i++) {
        if (isMove) break
        for (let j = 0; j < map[i].length; j++) {
            if (map[i][j].date.state === 8) {
                //есть алмаз
                isMove = true
                break
            }
            if (
                (map[i][j].date.bonusSector === 1
                    || map[i][j].date.bonusSector === 2
                    || map[i][j].date.bonusSector === 3)
                && (
                    ((map[i - 1]?.[j].date.bonusSector) &&
                        (map[i - 1][j].date.bonusSector === 1 || map[i - 1][j].date.bonusSector === 2
                            || map[i - 1][j].date.bonusSector === 2))
                    || ((map[i + 1]?.[j].date.bonusSector) &&
                        (map[i + 1][j].date.bonusSector === 1 || map[i + 1][j].date.bonusSector === 2
                            || map[i - 1][j].date.bonusSector === 2))
                    || ((map[i][j + 1]?.date.bonusSector) &&
                        (map[i][j + 1].date.bonusSector === 1 || map[i][j + 1].date.bonusSector === 2
                            || map[i - 1][j].date.bonusSector === 2))
                    || ((map[i][j - 1]?.date.bonusSector) &&
                        (map[i][j - 1].date.bonusSector === 1 || map[i][j - 1].date.bonusSector === 2
                            || map[i][j - 1].date.bonusSector === 2))
                )
            ) {
                isMove = true
                break
            }


            if (map[i][j].date.state === map[i][j + 1]?.date.state) {
                if (map[i][j].date.state === map[i][j + 3]?.date.state) {
                    //поиск по оси х  Ххох
                    isMove = true
                    break
                }
            } else if (map[i][j].date.state === map[i][j + 2]?.date.state &&
                map[i][j].date.state === map[i][j + 3]?.date.state) {
                //поиск по оси х  Хохх
                isMove = true
                break
            }
            if (map[i][j].date.state === map[i + 1]?.[j].date.state) {
                if (map[i][j].date.state === map[i + 3]?.[j].date.state) {
                    //поиск по оси y  Ххох
                    isMove = true
                    break
                }
            } else if (map[i][j].date.state === map[i + 2]?.[j].date.state &&
                map[i][j].date.state === map[i + 3]?.[j].date.state) {
                //поиск по оси y  Хохх
                isMove = true
                break
            }

            //поиск по
            //-X-X-
            //X1-2X
            //--K--
            //X3-4X
            //-X-X-
            if (map[i][j].date.state === map[i - 1]?.[j + 1]?.date.state) {
                //1
                if ((map[i][j].date.state === map[i - 2]?.[j + 1]?.date.state)
                    || (map[i][j].date.state === map[i - 1]?.[j + 2]?.date.state)
                    || (map[i][j].date.state === map[i - 1]?.[j - 1]?.date.state)
                    || (map[i][j].date.state === map[i + 1]?.[j + 1]?.date.state)) {
                    //поиск
                    //--X-
                    //X-1X
                    //-K--
                    //--X-
                    isMove = true
                    break
                }
            }
            if (map[i][j].date.state === map[i - 1]?.[j - 1]?.date.state) {
                //2
                if ((map[i][j].date.state === map[i - 2]?.[j - 1]?.date.state)
                    || (map[i][j].date.state === map[i - 1]?.[j - 2]?.date.state)
                    || (map[i][j].date.state === map[i - 1]?.[j + 1]?.date.state)
                    || (map[i][j].date.state === map[i + 1]?.[j - 1]?.date.state)) {
                    isMove = true
                    break
                }
            }
            if (map[i][j].date.state === map[i + 1]?.[j - 1]?.date.state) {
                //3
                if ((map[i][j].date.state === map[i + 2]?.[j - 1]?.date.state)
                    || (map[i][j].date.state === map[i + 1]?.[j - 2]?.date.state)
                    || (map[i][j].date.state === map[i - 1]?.[j - 1]?.date.state)
                    || (map[i][j].date.state === map[i + 1]?.[j + 1]?.date.state)) {
                    isMove = true
                    break
                }
            }
            if (map[i][j].date.state === map[i + 1]?.[j + 1]?.date.state) {
                //4
                if ((map[i][j].date.state === map[i + 2]?.[j + 1]?.date.state)
                    || (map[i][j].date.state === map[i + 1]?.[j + 2]?.date.state)
                    || (map[i][j].date.state === map[i + 1]?.[j - 1]?.date.state)
                    || (map[i][j].date.state === map[i - 1]?.[j + 1]?.date.state)) {
                    isMove = true
                    break
                }
            }
        }
    }
    return isMove
}
