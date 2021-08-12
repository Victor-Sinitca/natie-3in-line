import * as React from "react";
import {FC, useEffect, useRef} from "react";
import {ExpoWebGLRenderingContext, GLView} from "expo-gl";
import {View} from "react-native";
import {Renderer, TextureLoader,} from 'expo-three';
import {
    AmbientLight,
    BoxBufferGeometry, BoxGeometry, DirectionalLight, DodecahedronGeometry, ExtrudeGeometry, HemisphereLight,
    Mesh, MeshPhongMaterial,
    MeshStandardMaterial, Object3D,
    OrthographicCamera, PerspectiveCamera,
    Scene, Shape,
    SphereGeometry, TetrahedronGeometry, TorusGeometry, TorusKnotGeometry,
    Vector3,
} from "three";
import {LayoutStateType} from "../Desk/DeskThreeInLine";
import {MapsGameType, SectorGameType, threeInLineAction} from "../../redux/threeInLine-reduser";
import {deskStateType} from "../ThreeInLine";
import {useDispatch} from "react-redux";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const sw0 = new TextureLoader().load(require('../../../assets/img/G1.png'));
const sw1 = new TextureLoader().load(require('../../../assets/img/G2.png'));
const sw2 = new TextureLoader().load(require('../../../assets/img/G3.png'));
const sw3 = new TextureLoader().load(require('../../../assets/img/G4.png'));
const sw4 = new TextureLoader().load(require('../../../assets/img/G5.png'));
const sw5 = new TextureLoader().load(require('../../../assets/img/G6.png'));
const sw6 = new TextureLoader().load(require('../../../assets/img/G7.png'));
const sw7 = new TextureLoader().load(require('../../../assets/img/G8.png'));
const bw8 = new TextureLoader().load(require('../../../assets/img/G9.png'));
const radius = 20

const shape = new Shape();
const x = -2.5;
const y = -5;
const V = 1
shape.moveTo(x + 2.5 * V, y + 2.5 * V);
shape.bezierCurveTo(x + 2.5 * V, y + 2.5 * V, x + 2 * V, y * V, x * V, y * V);
shape.bezierCurveTo(x - 3 * V, y * V, x - 3 * V, y + 3.5 * V, x - 3 * V, y + 3.5 * V);
shape.bezierCurveTo(x - 3 * V, y + 5.5 * V, x - 1.5 * V, y + 7.7 * V, x + 2.5 * V, y + 9.5 * V);
shape.bezierCurveTo(x + 6 * V, y + 7.7 * V, x + 8 * V, y + 4.5 * V, x + 8 * V, y + 3.5 * V);
shape.bezierCurveTo(x + 8 * V, y + 3.5 * V, x + 8 * V, y * V, x + 5 * V, y * V);
shape.bezierCurveTo(x + 3.5 * V, y * V, x + 2.5 * V, y + 2.5 * V, x + 2.5 * V, y + 2.5 * V);
const extrudeSettings = {
    steps: 4,
    depth: 1.6,
    bevelEnabled: true,
    bevelThickness: 1,
    bevelSize: 1,
    bevelSegments: 2,
};

const shapeMass = [
    {
        material: new MeshPhongMaterial({
            color: `#bfec5f`,
            flatShading: true,
            /* transparent: true,*/
        }),
        geometry: new DodecahedronGeometry(radius, 20)
    },

    {
        material: new MeshPhongMaterial({
            color: `#01a512`,
            flatShading: true,
            /*transparent: true,*/
        }),
        geometry: new SphereGeometry(radius, 16, 5)
    },
    {
        material: new MeshPhongMaterial({
            color: `#0335b6`,
            flatShading: true,
            /*transparent: true,*/
        }),
        geometry: new TetrahedronGeometry(radius, 2)
    },
    {
        material: new MeshPhongMaterial({
            color: `#5b039a`,
            flatShading: true,
            /*transparent: true,*/
        }),
        geometry: new TorusGeometry(
            radius, 5,
            20, 40)
    },
    {
        material: new MeshPhongMaterial({
            color: `#ffa900`,
            flatShading: true,
            /*transparent: true,*/
        }),
        geometry: new TorusKnotGeometry(
            radius / 2, radius / 2, 20, 80, 2, 3)
    },
    {
        material: new MeshPhongMaterial({
            color: `#00a6ff`,
            flatShading: true,
            /*transparent: true,*/
        }),
        geometry: new BoxGeometry(
            radius * 1.2, radius * 1.2, radius * 1.2,
            10, 10, 10)
    },
    {
        material: new MeshPhongMaterial({
            color: `#e20a98`,
            flatShading: true,
            /*transparent: true,*/
        }),
        geometry: new DodecahedronGeometry(radius, 20)
    },
    {
        material: new MeshPhongMaterial({
            color: `#ff0133`,
            flatShading: true,
            /*transparent: true,*/
        }),
        geometry: new ExtrudeGeometry(shape, extrudeSettings).scale(3.5, 3.5, 3.5)
    },
    {
        material: new MeshPhongMaterial({
            color: `#fffb00`,
            flatShading: true,
            shininess: 150,
            /*transparent: true,*/
        }),
        geometry: new SphereGeometry(radius, 16, 2)
    },
]

type FreeJs2DDeskType = {
    map: MapsGameType
    deskState: deskStateType
    layoutState: LayoutStateType
}

type CubesType = Array<Array<{
    sector: SectorGameType,
    cube: {
        cell: CellMesh; material: MeshPhongMaterial; geometry: BoxGeometry, headerPoint: Object3D,
        rotateSystemHoriz: Object3D | null, horizBonus: BonusMesh | null,
        rotateSystemVert: Object3D | null, vertBonus: BonusMesh | null,
    }
}>>
const FreeJs2DDesk: FC<FreeJs2DDeskType> = ({map, deskState, layoutState}) => {
    let timeout: number;
    const dispatch = useDispatch()
    const widthGL = layoutState.layout.width
    const heightGL = layoutState.layout.height


    let mapIsChanged = useRef(false)
    const Map = useRef<MapsGameType>(map)
    Map.current = map
    mapIsChanged.current = true

    const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
        const renderer = new Renderer({gl});
        const {drawingBufferWidth: width, drawingBufferHeight: height} = gl;
        const camera2D = new OrthographicCamera(
            widthGL / -2, widthGL / 2,
            heightGL / 2, heightGL / -2, 1, 1000);
        /*const camera2D = new PerspectiveCamera(45,width/height, 0.1, 5000)*/
        /*const controls = new OrbitControls(camera2D, renderer.domElement);
        controls.target.set(0, 5, 0);*/

        /* controls.update();*/


        /*console.log(`gLViewEl.clientHeight: ${gLViewEl.clientHeight} gLViewEl.clientWidth ${gLViewEl.clientWidth}`)
        console.log(`gLViewEl.height: ${gLViewEl.height} gLViewEl.width ${gLViewEl.width}`)*/

        /* console.log(`drawingBufferWidth: ${width} drawingBufferHeight ${height}`)
         console.log(`widthGL: ${widthGL} heightGL ${heightGL}`)*/

        renderer.setSize(width, height);
        renderer.setClearColor("#6498ce");
        const scene = new Scene();

        /*const ambientLight = new AmbientLight(0xf0f0f0);*/

        const ambientLight = new HemisphereLight(0xB1E1FF, 0xB97A20, 0.5);
        scene.add(ambientLight);

        const light = new DirectionalLight(0xFFFFFF, 0.8);
        light.position.set(50, 0, 100);
        light.target.position.set(0, 0, 0);

        scene.add(light);
        scene.add(light.target);


        let cubes = Array.from(Array(deskState.x),
            () => new Array(deskState.y)
        ) as CubesType
        const sizeCell = widthGL / deskState.y


        function changeCubes(map: MapsGameType) {
            /*console.log(`changeCubes`)*/
            /* const map = [...Map]*/
            const scaleSelect = new Vector3(1.2, 1.2, 1.2)
            const imgMass = [sw0, sw1, sw2, sw3, sw4, sw5, sw6, sw7, bw8]

            const defVector = new Vector3()

            for (let i = 0; i < map.length; i++) {
                for (let j = 0; j < map[0].length; j++) {

                    if (cubes[i][j].cube.material.color !== shapeMass[map[i][j].date.state].material.color) {
                        cubes[i][j].cube.material.color = shapeMass[map[i][j].date.state].material.color
                        cubes[i][j].cube.geometry.copy(shapeMass[map[i][j].date.state].geometry)
                        cubes[i][j].cube.material.needsUpdate = true;
                        cubes[i][j].cube.cell.rotation.set( -10, -10, 0 );

                    }

                    if (map[i][j].date.bonusSector) {
                        if (map[i][j].date.bonusSector == 1) {
                            if (!cubes[i][j].cube.rotateSystemHoriz) {
                                const rotateSystemHor = new Object3D();
                                const bonusHor = new BonusMesh(5)
                                bonusHor.position.x = 30
                                rotateSystemHor.add(bonusHor)
                                cubes[i][j].cube.headerPoint.add(rotateSystemHor)
                                cubes[i][j].cube.rotateSystemHoriz = rotateSystemHor
                                cubes[i][j].cube.horizBonus = bonusHor
                            }
                            if (cubes[i][j].cube.rotateSystemVert) {
                                cubes[i][j].cube.vertBonus?.removeFromParent()
                                cubes[i][j].cube.rotateSystemVert?.removeFromParent()
                                cubes[i][j].cube.vertBonus = null
                                cubes[i][j].cube.rotateSystemVert = null
                            }


                        }
                        if (map[i][j].date.bonusSector == 2) {
                            if (!cubes[i][j].cube.rotateSystemVert) {
                                const rotateSystemVert = new Object3D();
                                const bonusVert = new BonusMesh(5)
                                bonusVert.position.y = 30
                                rotateSystemVert.add(bonusVert)
                                cubes[i][j].cube.headerPoint.add(rotateSystemVert)
                                cubes[i][j].cube.rotateSystemVert = rotateSystemVert
                                cubes[i][j].cube.vertBonus = bonusVert
                            }
                            if (cubes[i][j].cube.rotateSystemHoriz) {
                                cubes[i][j].cube.horizBonus?.removeFromParent()
                                cubes[i][j].cube.rotateSystemHoriz?.removeFromParent()
                                cubes[i][j].cube.horizBonus = null
                                cubes[i][j].cube.rotateSystemHoriz = null
                            }
                        }
                        if (map[i][j].date.bonusSector == 3) {
                            if (!cubes[i][j].cube.rotateSystemHoriz) {
                                const rotateSystemHor = new Object3D();
                                const bonusHor = new BonusMesh(5)
                                bonusHor.position.x = 30
                                rotateSystemHor.add(bonusHor)
                                cubes[i][j].cube.headerPoint.add(rotateSystemHor)
                                cubes[i][j].cube.rotateSystemHoriz = rotateSystemHor
                                cubes[i][j].cube.horizBonus = bonusHor
                            }
                            if (!cubes[i][j].cube.rotateSystemVert) {
                                const rotateSystemVert = new Object3D();
                                const bonusVert = new BonusMesh(5)
                                bonusVert.position.y = 30
                                rotateSystemVert.add(bonusVert)
                                cubes[i][j].cube.headerPoint.add(rotateSystemVert)
                                cubes[i][j].cube.rotateSystemVert = rotateSystemVert
                                cubes[i][j].cube.vertBonus = bonusVert
                            }
                        }
                    } else {
                        if (cubes[i][j].cube.rotateSystemVert) {
                            cubes[i][j].cube.vertBonus?.removeFromParent()
                            cubes[i][j].cube.rotateSystemVert?.removeFromParent()
                            cubes[i][j].cube.vertBonus = null
                            cubes[i][j].cube.rotateSystemVert = null
                        }
                        if (cubes[i][j].cube.rotateSystemHoriz) {
                            cubes[i][j].cube.horizBonus?.removeFromParent()
                            cubes[i][j].cube.rotateSystemHoriz?.removeFromParent()
                            cubes[i][j].cube.horizBonus = null
                            cubes[i][j].cube.rotateSystemHoriz = null
                        }
                    }


                    if (map[i][j].sectorState.isSelected) {
                        /*console.log(`isSelected`)*/
                        cubes[i][j].cube.cell.scale.set(1.2, 1.2, 1.2)
                    } else if (cubes[i][j].cube.cell.scale.equals(scaleSelect)) {
                        /*console.log(`isNotSelected`)*/
                        cubes[i][j].cube.cell.scale.set(1, 1, 1)
                    }
                    const animateMove = map[i][j].sectorState.animateMove
                    if (animateMove !== null) {
                        if (animateMove.animateObject.shift) {
                            const x = animateMove.animateObject.shiftJ * sizeCell
                            const y = -animateMove.animateObject.shiftI * sizeCell
                            const addVector = new Vector3(x, y, 0)
                            /*cubes[i][j].cube.cell.position.add(addVector)*/
                            cubes[i][j].cube.headerPoint.position.add(addVector)
                        }
                    }
                    cubes[i][j].sector = JSON.parse(JSON.stringify(map[i][j]))
                }
            }
        }

        function animateShift() {
            for (let i = 0; i < cubes.length; i++) {
                for (let j = 0; j < cubes[0].length; j++) {
                    if (cubes[i][j].cube.rotateSystemHoriz) {
                        cubes[i][j].cube.rotateSystemHoriz?.rotateY(0.1)
                    }
                    if (cubes[i][j].cube.rotateSystemVert) {
                        cubes[i][j].cube.rotateSystemVert?.rotateX(0.1)
                    }

                    if(cubes[i][j].sector.date.state === 8){
                        cubes[i][j].cube.cell.rotateX(0.1)
                    }



                    /*if (Map.current[i][j].sectorState.animateMove) {*/
                    if (cubes[i][j].sector.sectorState.animateMove) {
                        const cell = cubes[i][j].cube.headerPoint
                        const sector = cubes[i][j].sector
                        const distance = 0.2
                        /* const sector = Map.current[i][j]*/


                        /* const position = new Vector3()
                         cell.getWorldPosition(position)*/
                        const position = cell.position
                        const {x, y, z} = getDefaultPosition(sector, widthGL, heightGL, sizeCell)
                        const positionToShiftDefault = new Vector3(x, y, z)

                        /*if (position !== positionToShift) {*/
                        if (sector.sectorState.animateMove?.animateObject.shift) {
                            if (position.distanceTo(positionToShiftDefault) >= 1.5) {
                                /*console.log(`i:${sector.sectorState.y}, j:${sector.sectorState.x}`)
                                console.log(`X:${x}, Y:${y}`)   */
                                /*cubes[i][j].cube.cell.translateOnAxis(positionToShift,0.05)*/
                                cell.translateOnAxis(cell.worldToLocal(positionToShiftDefault), distance)
                            } else if (position.distanceTo(positionToShiftDefault) < 1.5) {
                                console.log(`position == positionToShift`)
                                cell.position.set(x, y, z)
                                dispatch(threeInLineAction.increaseAnimationCountEnd(
                                    {
                                        i: sector.sectorState.y,
                                        j: sector.sectorState.x
                                    }))
                                sector.sectorState.animateMove = null
                            }
                        } else if (sector.sectorState.animateMove) {
                            const animateMove = sector.sectorState.animateMove
                            const X = animateMove.animateObject.shiftJ * sizeCell + x
                            const Y = -animateMove.animateObject.shiftI * sizeCell + y

                            const positionToUnShift = new Vector3(X, Y, 0)

                            if (position.distanceTo(positionToUnShift) >= 1.5) {
                                /*console.log(`i:${sector.sectorState.y}, j:${sector.sectorState.x}`)
                                console.log(`X:${x}, Y:${y}`)   */
                                /*cubes[i][j].cube.cell.translateOnAxis(positionToShift,0.05)*/
                                cell.translateOnAxis(cell.worldToLocal(positionToUnShift), distance)
                            } else if (position.distanceTo(positionToUnShift) < 1.5) {
                                /*console.log(`position == positionToShift`)*/
                                cell.position.set(X, Y, 0)
                                animateMove.animateObject.shift = true
                            }
                        }
                    }
                }
            }
        }


        addOnScene(sizeCell, widthGL, heightGL, scene, map, cubes)
        camera2D.position.set(0, 0, 700);
        camera2D.lookAt(scene.position);

        const render = () => {
            timeout = requestAnimationFrame(render);
            if (!mapIsChanged.current) {
                animateShift()
            }

            if (mapIsChanged.current) {
                changeCubes(Map.current)
                mapIsChanged.current = false
            }

            /*controls.update();*/

            /* cubes[2][2].cube.cell.rotation.x += 0.01*/
            renderer.render(scene, camera2D);
            gl.endFrameEXP();
        };
        render();
    }


    useEffect(() => {
        // Clear the animation loop when the component unmounts
        return () => clearTimeout(timeout);
    }, []);


    return (
        <View style={{height: heightGL, width: widthGL}}>
            <GLView style={{flex: 1}} onContextCreate={onContextCreate}>
            </GLView>
        </View>

    )
}


function getDefaultPosition(sector: SectorGameType, widthGL: number, heightGL: number, sizeCell: number) {
    const x = widthGL / -2 + sizeCell / 2 + (sector.sectorState.x * sizeCell)
    const y = heightGL / 2 - sizeCell / 2 - (sector.sectorState.y * sizeCell)
    const z = 0
    return {x, y, z}
}

function addOnScene(sizeCell: number, widthGL: number, heightGL: number, scene: Scene,
                    map: MapsGameType, cubes: CubesType) {
    function createShape(sector: SectorGameType) {
        const material = new MeshPhongMaterial().copy(shapeMass[sector.date.state].material)
        const geometry = new BoxGeometry().copy(shapeMass[sector.date.state].geometry)
        const headerPoint = new Object3D();
        const {x, y, z} = getDefaultPosition(sector, widthGL, heightGL, sizeCell)
        headerPoint.position.set(x, y, z)

        const cell = new CellMesh1(material, geometry)
        /* cell.position.set(x, y, z)*/
        cell.rotateX(-10)
        cell.rotateY(-10)

        /* const rotateSystem = new Object3D();
         const bonus = new BonusMesh(5)
         bonus.position.x=30*/
        /*rotateSystem.position.set(x, y, z)*/
        /*rotateSystem.rotateX(-10)
        rotateSystem.rotateY(-10)*/


        /* headerPoint.add(rotateSystem)
         rotateSystem.add(bonus)*/

        headerPoint.add(cell)

        scene.add(headerPoint)

        return {
            headerPoint: headerPoint,
            cell: cell,
            material: material,
            geometry: geometry,
            rotateSystemHoriz: null,
            horizBonus: null,
            rotateSystemVert: null,
            vertBonus: null,
        }
    }

    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            cubes[i][j] = {
                cube: createShape(map[i][j]),
                sector: map[i][j]
            }
        }
    }
}


class CellMesh extends Mesh {
    constructor(
        cellWidth: number,
        cellHeight: number,
        material: any
    ) {
        super(
            new BoxBufferGeometry(cellWidth, cellHeight, 0),
            material
        );

    }
}

class CellMesh1 extends Mesh {
    constructor(
        material: any,
        geometry: any
    ) {
        super(
            geometry,
            material
        );
    }
}

class BonusMesh extends Mesh {
    constructor(
        radius: number,
    ) {
        super(
            new SphereGeometry(radius, 10, 10),
            new MeshPhongMaterial({color: `#ec0a0a`})
        );
    }
}


export default FreeJs2DDesk






