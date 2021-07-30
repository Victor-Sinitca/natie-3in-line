import {MapsGameType, SectorGameType} from "../../redux/threeInLine-reduser";


export const checkOnBonusScore = (sector: SectorGameType, score: number) => {
    // проверяем есть ли бонусная клетка и определяем количество бонусных очков
    let bonusScore = 0
    if (sector.date.bonusSector === 1
        || sector.date.bonusSector === 2) {
        bonusScore = score + 100
    }
    if (sector.date.bonusSector === 3) {
        bonusScore = score + 150
    }
    if (bonusScore) {
        return bonusScore
    } else return score
}


export const checkOnSectorInLine = (Map: MapsGameType, IsLine: boolean, i: number, j: number) => {
    let map = [...Map]
    for (let i = 0; i < map.length; i++) {
        map[i] = [...Map[i]]
    }
    let bonusScore = 0
    let isLine = IsLine
    if (map[i][j].date.state === map[i - 1]?.[j].date.state) {
        if (map[i][j].date.state === map[i - 2]?.[j].date.state) {
            //00X v
            isLine = true
            map[i][j] = {...Map[i][j]}
            map[i - 1][j] = {...Map[i - 1][j]}
            map[i - 2][j] = {...Map[i - 2][j]}
            map[i][j].date.isBum = true
            map[i - 1][j].date.isBum = true
            map[i - 2][j].date.isBum = true
            bonusScore = checkOnBonusScore(map[i - 1][j], bonusScore)
            bonusScore = checkOnBonusScore(map[i - 2][j], bonusScore)
            /* if (map[i][j].date.state === map[i - 3]?.[j].date.state) {
                 //000X
                 map[i - 3][j].date.isBum = true
                 map[i][j].date.score = 100
                 map[i][j].date.addBonusSector=1
             } else*/
            if (map[i][j].date.state === map[i + 1]?.[j].date.state) {
                //00X0 v
                map[i + 1][j] = {...Map[i + 1][j]}
                map[i + 1][j].date.isBum = true
                bonusScore = checkOnBonusScore(map[i + 1][j], bonusScore)
                if (map[i][j].date.state === map[i + 2]?.[j].date.state) {
                    //00X00 v
                    map[i + 2][j] = {...Map[i + 2][j]}
                    map[i + 2][j].date.isBum = true
                    bonusScore = checkOnBonusScore(map[i + 2][j], bonusScore)
                    map[i][j].date.score = 200
                    map[i][j].date.addBonusSector = 4
                } else {
                    //00X0 v
                    map[i][j].date.score = 100
                    map[i][j].date.addBonusSector = 1
                }
            } else {
                //00X v
                map[i][j].date.score = 50
            }
        } else if (map[i][j].date.state === map[i + 1]?.[j].date.state) {
            //0X0 v
            isLine = true
            map[i][j] = {...Map[i][j]}
            map[i - 1][j] = {...Map[i - 1][j]}
            map[i + 1][j] = {...Map[i + 1][j]}
            map[i][j].date.isBum = true
            map[i - 1][j].date.isBum = true
            map[i + 1][j].date.isBum = true
            bonusScore = checkOnBonusScore(map[i - 1][j], bonusScore)
            bonusScore = checkOnBonusScore(map[i + 1][j], bonusScore)
            if (map[i][j].date.state === map[i + 2]?.[j].date.state) {
                //0X00 v
                map[i + 2][j] = {...Map[i + 2][j]}
                map[i + 2][j].date.isBum = true
                bonusScore = checkOnBonusScore(map[i + 2][j], bonusScore)
                map[i][j].date.score = 100
                map[i][j].date.addBonusSector = 1
            } else {
                //0X0 v
                map[i][j].date.score = 50
            }
        }
    } else if (map[i][j].date.state === map[i + 1]?.[j].date.state) {
        if (map[i][j].date.state === map[i + 2]?.[j].date.state) {
            //X00 v
            isLine = true
            map[i][j] = {...Map[i][j]}
            map[i + 1][j] = {...Map[i + 1][j]}
            map[i + 2][j] = {...Map[i + 2][j]}
            map[i][j].date.isBum = true
            map[i + 1][j].date.isBum = true
            map[i + 2][j].date.isBum = true
            bonusScore = checkOnBonusScore(map[i + 1][j], bonusScore)
            bonusScore = checkOnBonusScore(map[i + 2][j], bonusScore)
            map[i][j].date.score = 50
        }
    }


    if (map[i][j].date.state === map[i][j - 1]?.date.state) {
        if (map[i][j].date.state === map[i][j - 2]?.date.state) {
            //00X g
            isLine = true
            map[i][j] = {...Map[i][j]}
            map[i][j - 1] = {...Map[i][j - 1]}
            map[i][j - 2] = {...Map[i][j - 2]}
            map[i][j].date.isBum = true
            map[i][j - 1].date.isBum = true
            map[i][j - 2].date.isBum = true
            bonusScore = checkOnBonusScore(map[i][j - 1], bonusScore)
            bonusScore = checkOnBonusScore(map[i][j - 2], bonusScore)
            /*if (map[i][j].date.state === map[i][j - 3]?.date.state) {
                map[i][j - 3].date.isBum = true
                map[i][j].date.score = 100
                map[i][j].date.addBonusSector = 2
            } else*/
            if (map[i][j].date.state === map[i][j + 1]?.date.state) {
                //00X0 g
                map[i][j + 1] = {...Map[i][j + 1]}
                map[i][j + 1].date.isBum = true
                bonusScore = checkOnBonusScore(map[i][j + 1], bonusScore)
                if (map[i][j].date.state === map[i][j + 2]?.date.state) {
                    //00X00 g
                    map[i][j + 2] = {...Map[i][j + 2]}
                    map[i][j + 2].date.isBum = true
                    bonusScore = checkOnBonusScore(map[i][j + 2], bonusScore)
                    map[i][j].date.addBonusSector = 4
                    map[i][j].date.score = 200
                    if (map[i][j].date.isBum) {
                        if (map[i][j].date.score === 50) {
                            map[i][j].date.score = 300
                            if (map[i - 1]?.[j].date.isBum) {
                                map[i - 1][j].date.addBonusSector = 3
                            }
                            if (map[i + 1]?.[j].date.isBum) {
                                map[i + 1][j].date.addBonusSector = 3
                            }
                        }
                    }
                } else {
                    //00X0 g
                    if (map[i][j].date.score === 50) {
                        map[i][j].date.score = 150
                        map[i][j].date.addBonusSector = 3
                    } else {
                        map[i][j].date.score = 100
                        map[i][j].date.addBonusSector = 2
                    }
                }
            } else {
                //00X g
                if (map[i][j].date.score === 50) {
                    map[i][j].date.score = 100
                    map[i][j].date.addBonusSector = 3
                } else if (map[i][j].date.score === 100) {
                    map[i][j].date.score = 200
                    map[i][j].date.addBonusSector = 3
                } else if (map[i][j].date.score) {
                    map[i][j].date.score = 300
                    map[i][j - 1].date.addBonusSector = 3
                } else {
                    map[i][j].date.score = 50
                }

            }
        } else if (map[i][j].date.state === map[i][j + 1]?.date.state) {
            //0X0 g
            isLine = true
            map[i][j] = {...Map[i][j]}
            map[i][j - 1] = {...Map[i][j - 1]}
            map[i][j + 1] = {...Map[i][j + 1]}
            map[i][j].date.isBum = true
            map[i][j - 1].date.isBum = true
            map[i][j + 1].date.isBum = true
            bonusScore = checkOnBonusScore(map[i][j - 1], bonusScore)
            bonusScore = checkOnBonusScore(map[i][j + 1], bonusScore)
            if (map[i][j].date.state === map[i][j + 2]?.date.state) {
                //0X00 g
                map[i][j + 2] = {...Map[i][j + 2]}
                map[i][j + 2].date.isBum = true
                bonusScore = checkOnBonusScore(map[i][j + 2], bonusScore)
                if (map[i][j].date.score === 50) {
                    map[i][j].date.score = 200
                    map[i][j].date.addBonusSector = 3
                } else {
                    map[i][j].date.score = 100
                    map[i][j].date.addBonusSector = 2
                }

            } else {
                //0X0 g
                if (map[i][j].date.score === 50) {
                    map[i][j].date.score = 100
                    map[i][j].date.addBonusSector = 3
                } else {
                    map[i][j].date.score = 50
                }
            }
        }
    } else if (map[i][j].date.state === map[i][j + 1]?.date.state) {
        if (map[i][j].date.state === map[i][j + 2]?.date.state) {
            //X00 g
            isLine = true
            map[i][j] = {...Map[i][j]}
            map[i][j + 1] = {...Map[i][j + 1]}
            map[i][j + 2] = {...Map[i][j + 2]}
            map[i][j].date.isBum = true
            map[i][j + 1].date.isBum = true
            map[i][j + 2].date.isBum = true
            bonusScore = checkOnBonusScore(map[i][j + 1], bonusScore)
            bonusScore = checkOnBonusScore(map[i][j + 2], bonusScore)
            if (map[i][j].date.score === 50) {
                map[i][j].date.score = 100
                map[i][j].date.addBonusSector = 3
            } else if (map[i][j].date.score === 100) {
                map[i][j].date.score = 200
                map[i][j].date.addBonusSector = 3
            } else if (map[i][j].date.score) {
                map[i][j].date.score = 300
                map[i][j + 1].date.addBonusSector = 3
            } else {
                map[i][j].date.score = 50
            }
        }
    }
    if (isLine) {
        // была линия, проверяем на бонус центральную клетку и !!проверяем была ли она взорвана!!
        if (map[i][j].date.isBum) {
            bonusScore = checkOnBonusScore(map[i][j], bonusScore)
        }
    }
    if (bonusScore) {
        //добавляем полученные бонусные очки
        map[i][j].date.score = map[i][j].date.score + bonusScore
    }

    return {
        isLine,
        map
    }
}


export const isSectorInLine = (Map: MapsGameType, selectSector: SectorGameType, sector: SectorGameType) => {
    let isLine = false
    let map = Map
    let buffer = checkOnSectorInLine(map, isLine, selectSector.sectorState.y, selectSector.sectorState.x)
    isLine = buffer.isLine
    map = buffer.map
    buffer = checkOnSectorInLine(map, isLine, sector.sectorState.y, sector.sectorState.x)
    if (buffer.isLine) {
        return buffer.map
    } else return null
}
