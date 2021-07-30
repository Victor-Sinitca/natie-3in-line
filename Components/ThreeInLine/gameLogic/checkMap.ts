
import {checkOnBonusScore} from "./isSectorInLine";
import {MapsGameType} from "../../redux/threeInLine-reduser";

// проверка карты на линии взрыва
export const checkMap = (Map: MapsGameType) => {
    let map = [...Map]

    for(let i=0; i<map.length; i++){
        map[i]=[...Map[i]]
    }
// была ли комбинция из трех и более
    let isBum = false
// есть линия по вертикали
    const isLineOnVertical = (i: number, j: number) => {
        return ((map[i][j].date.state === map[i + 1]?.[j].date.state && map[i][j].date.state === map[i + 2]?.[j].date.state)
            || (map[i][j].date.state === map[i + 1]?.[j].date.state && map[i][j].date.state === map[i - 1]?.[j].date.state)
            || (map[i][j].date.state === map[i - 1]?.[j].date.state && map[i][j].date.state === map[i - 2]?.[j].date.state))
    }
// нахождение горизонтальных лини для взрыва и поиск в них пересечений с вертикальными линиями
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (!map[i][j].date.isBum) {
                let isLine = false
                // была ли линия по вертикали
                /*let bonusScore = 0*/
                // бонусные очки
                if (map[i][j].date.state === map[i][j + 1]?.date.state
                    && map[i][j].date.state === map[i][j + 2]?.date.state) {
                    // три сектора по горизонту

                    map[i][j]={...Map[i][j]}
                    map[i][j +1]={...Map[i][j+1]}
                    map[i][j +2]={...Map[i][j+2]}


                    map[i][j].date.isBum = true
                    map[i][j + 1].date.isBum = true
                    map[i][j + 2].date.isBum = true
                    map[i][j].date.score = checkOnBonusScore(map[i][j], 0)
                    map[i][j + 1].date.score = checkOnBonusScore(map[i][j + 1], 0)
                    map[i][j + 2].date.score = checkOnBonusScore(map[i][j + 2], 0)
                    isBum = true
                    if (isLineOnVertical(i, j)) { //
                        isLine = true
                        map[i][j].date.addBonusSector = 3
                        map[i][j].date.score = 100 + map[i][j].date.score
                    }
                    if (isLineOnVertical(i, j + 1)) {
                        isLine = true
                        map[i][j + 1].date.addBonusSector = 3
                        map[i][j + 1].date.score = 100 + map[i][j + 1].date.score
                    }
                    if (isLineOnVertical(i, j + 2)) {
                        isLine = true
                        map[i][j + 2].date.addBonusSector = 3
                        map[i][j + 2].date.score = 100 + map[i][j + 2].date.score
                    }
                    if (map[i][j].date.state === map[i][j + 3]?.date.state) {
                        // четыре сектора по горизонту
                        map[i][j + 3].date.isBum = true
                        map[i][j + 3].date.score = checkOnBonusScore(map[i][j + 3], 0)
                        if (isLineOnVertical(i, j + 3)) {
                            isLine = true

                            map[i][j+3]={...Map[i][j+3]}

                            map[i][j + 3].date.addBonusSector = 3
                            map[i][j + 3].date.score = 100 + map[i][j + 3].date.score
                        }
                        if (map[i][j].date.state === map[i][j + 4]?.date.state) {
                            // пять секторов по горизонту

                            map[i][j+4]={...Map[i][j+4]}

                            map[i][j + 4].date.isBum = true
                            map[i][j + 4].date.score = checkOnBonusScore(map[i][j + 4], 0)
                            if (isLineOnVertical(i, j + 4)) {
                                isLine = true
                                map[i][j + 4].date.addBonusSector = 3
                                map[i][j + 4].date.score = 100 + map[i][j + 4].date.score
                            }
                            if (!isLine) {
                                map[i][j + 2].date.addBonusSector = 4
                                map[i][j + 2].date.score = 200 + map[i][j + 2].date.score
                            } else {
                                if (!map[i][j + 2].date.addBonusSector) {
                                    map[i][j + 2].date.addBonusSector = 4
                                    map[i][j + 2].date.score = map[i][j + 2].date.score + 200
                                } else if (!map[i][j + 1].date.addBonusSector) {
                                    map[i][j + 1].date.addBonusSector = 4
                                    map[i][j + 1].date.score = map[i][j + 1].date.score + 200
                                } else if (!map[i][j + 3].date.addBonusSector) {
                                    map[i][j + 3].date.addBonusSector = 4
                                    map[i][j + 3].date.score = map[i][j + 3].date.score + 200
                                } else {
                                    //шиш с маком!
                                }
                            }
                        } else {
                            if (!isLine) {
                                map[i][j + 2].date.addBonusSector = 2
                                map[i][j + 2].date.score = 100 + map[i][j + 2].date.score
                            }
                        }
                    } else {
                        if (!isLine) {
                            map[i][j + 1].date.score = 50 + map[i][j + 1].date.score
                        }
                    }
                }//пропускаем
            }//пропускаем
        }
    }

    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (!map[i][j].date.isBum
                || (map[i][j].date.isBum && (!map[i - 1]?.[j] || !map[i - 1]?.[j].date.isBum))) {
                // ищем не взорваную клетку или взорваную, но только первую

                if (map[i][j].date.state === map[i + 1]?.[j].date.state
                    && map[i][j].date.state === map[i + 2]?.[j].date.state) {
                    map[i][j]={...Map[i][j]}
                    map[i+1][j]={...Map[i+1][j]}
                    map[i+2][j]={...Map[i+2][j]}
                    if(!map[i][j].date.isBum){
                        map[i][j].date.score = checkOnBonusScore(map[i][j], 0)
                    }
                    if(!map[i + 1][j].date.isBum){
                        map[i + 1][j].date.score = checkOnBonusScore(map[i + 1][j], 0)
                    }
                    if(!map[i + 2][j].date.isBum){
                        map[i + 2][j].date.score = checkOnBonusScore(map[i + 2][j], 0)
                    }
                    map[i][j].date.isBum = true
                    map[i + 1][j].date.isBum = true
                    map[i + 2][j].date.isBum = true
                    isBum = true
                    if (map[i][j].date.state === map[i + 3]?.[j].date.state) {
                        map[i +3][j]={...Map[i+3][j]}
                        if(!map[i + 3][j].date.isBum){
                            map[i + 3][j].date.score = checkOnBonusScore(map[i + 3][j], 0)
                        }
                        map[i + 3][j].date.isBum = true
                        if (map[i][j].date.state === map[i + 4]?.[j].date.state) {
                            map[i+4][j]={...Map[i+4][j]}
                            if(!map[i + 4][j].date.isBum){
                                map[i + 4][j].date.score = checkOnBonusScore(map[i + 4][j], 0)
                            }
                            map[i + 4][j].date.isBum = true
                            if (!map[i][j].date.addBonusSector && !map[i + 1][j].date.addBonusSector
                                && !map[i + 2][j].date.addBonusSector && !map[i + 3][j].date.addBonusSector
                                && !map[i + 4][j].date.addBonusSector) {

                                map[i + 2][j].date.score = 200 + map[i + 2][j].date.score
                                map[i + 2][j].date.addBonusSector = 4
                            } else {
                                if (!map[i + 2][j].date.addBonusSector) {
                                    map[i + 2][j].date.addBonusSector = 4
                                    map[i + 2][j].date.score = 200 + map[i + 2][j].date.score
                                } else if (!map[i][j + 1].date.addBonusSector) {
                                    map[i + 1][j].date.addBonusSector = 4
                                    map[i + 1][j].date.score = 200 +  map[i + 1][j].date.score
                                } else if (!map[i + 3][j].date.addBonusSector) {
                                    map[i + 3][j].date.addBonusSector = 4
                                    map[i + 3][j].date.score = 200 + map[i + 3][j].date.score
                                } else {
                                    //шиш с маком!
                                }

                            }

                        } else if (!map[i][j].date.addBonusSector && !map[i + 1][j].date.addBonusSector
                            && !map[i + 2][j].date.addBonusSector && !map[i + 3][j].date.addBonusSector) {
                            map[i + 2][j].date.score = 100 + map[i + 2][j].date.score
                            map[i + 2][j].date.addBonusSector = 1
                        }
                    } else if (!map[i][j].date.addBonusSector && !map[i + 1][j].date.addBonusSector && !map[i + 2][j].date.addBonusSector) {
                        map[i + 1][j].date.score = 50 + map[i + 1][j].date.score
                    }

                }

            }
        }

    }


    return {
        map,
        isBum,
    }
}
