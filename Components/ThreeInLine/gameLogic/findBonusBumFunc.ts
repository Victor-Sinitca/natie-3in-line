import {MapsGameType} from "../../redux/threeInLine-reduser";


export const findBonusBumFunc = (Map: MapsGameType,) => {
    let map = [...Map]
    for(let i=0; i<map.length; i++){
        map[i]=[...Map[i]]
    }

    function onHor(i: number) {
        for (let J = map[i].length - 1; J >= 0; J--) { // пройти по горизонту
            if (!map[i][J].date.isBum) { // взорвать сектора без взрыва
                map[i][J]={...Map[i][J]}
                map[i][J].date.isBum = true
                /*map[i][J].date.score = 20*/


                if (map[i][J].date.bonusSector === 1) { // в секторе был гор бонус
                    map[i][J].date.score = 100
                } else if (map[i][J].date.bonusSector === 2) {   // в секторе был верт бонус
                    map[i][J].date.score = 100
                } else if (map[i][J].date.bonusSector === 3) {   // в секторе был двойной бонус
                    map[i][J].date.score = 150
                } else { // без бонусов
                    map[i][J].date.score = 20
                }
            }
        }
    }

    function onVert(j: number) {
        for (let I = map.length - 1; I >= 0; I--) { // пройти по верт
            if (!map[I][j].date.isBum) { // взорвать сектора без взрыва
                map[I][j]={...Map[I][j]}
                map[I][j].date.isBum = true

             /*   map[I][j].date.score = 20*/



                if (map[I][j].date.bonusSector === 1) { // в секторе был гор бонус
                    map[I][j].date.score = 100
                } else if (map[I][j].date.bonusSector === 2) {   // в секторе был верт бонус
                    map[I][j].date.score = 100
                } else if (map[I][j].date.bonusSector === 3) {   // в секторе был двойной бонус
                    map[I][j].date.score = 150
                } else { // без бонусов
                    map[I][j].date.score = 20
                }
            }
        }
    }

// поиск бонусных секторов  и отрисовка их взрыва
    let bonusCount = 0
    let counter = 0
    do {
        /* console.log("bonusCount")*/
        for (let i = map.length - 1; i >= 0; i--) {
            for (let j = map[i].length - 1; j >= 0; j--) {
                if (map[i][j].date.isBum) { // сектор взорван
                    if (map[i][j].date.bonusSector === 1) {
                        // в секторе гор. бонус

                       /* map[i][j].date.score = 100*/

                        counter++// счетчик добавить
                        onHor(i)
                    } else if (map[i][j].date.bonusSector === 2) {
                        // в секторе верт. бонус
                       /* map[i][j].date.score = 100*/

                        counter++// счетчик добавить
                        onVert(j)
                    } else if (map[i][j].date.bonusSector === 3) {
                        // в секторе дойной бонус
                        /*map[i][j].date.score = 150*/

                        counter++// счетчик добавить
                        onHor(i)
                        onVert(j)
                    }
                }
            }
        }
        /*if (counter) console.log("set count")*/
        if (bonusCount !== counter) {
            bonusCount = counter
            counter = 0
        }

    } while (bonusCount !== counter)
    return map

}


