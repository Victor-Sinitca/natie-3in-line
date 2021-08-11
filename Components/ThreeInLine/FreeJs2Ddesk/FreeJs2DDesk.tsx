import * as React from "react";
import {ExpoWebGLRenderingContext, GLView} from "expo-gl";
import {
    Animated,
    Button,
    LayoutChangeEvent,
    LayoutRectangle,
    Text,
    TouchableHighlight,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {Renderer, TextureLoader,} from 'expo-three';
import {TweenMax} from 'gsap';
import {FC, useEffect, useRef, useState} from "react";
import {
    AmbientLight,
    SphereGeometry,
    Fog,
    GridHelper,
    Mesh,
    MeshStandardMaterial,
    PerspectiveCamera,
    PointLight,
    Scene,
    SpotLight,
    OrthographicCamera,
    BoxGeometry,
    MeshBasicMaterial,
    PlaneGeometry,
    Color,
    BoxBufferGeometry, Texture, Vector3,
} from "three";
import {LayoutStateType} from "../Desk/DeskThreeInLine";
import {MapsGameType, SectorGameType, threeInLineAction} from "../../redux/threeInLine-reduser";
import {deskStateType} from "../ThreeInLine";
import {getRandomInt} from "../gameLogic/getRandom";
import {Asset} from 'expo-asset';
import {useDispatch} from "react-redux";

const sw0 = new TextureLoader().load(require('../../../assets/img/G1.png'));
const sw1 = new TextureLoader().load(require('../../../assets/img/G2.png'));
const sw2 = new TextureLoader().load(require('../../../assets/img/G3.png'));
const sw3 = new TextureLoader().load(require('../../../assets/img/G4.png'));
const sw4 = new TextureLoader().load(require('../../../assets/img/G5.png'));
const sw5 = new TextureLoader().load(require('../../../assets/img/G6.png'));
const sw6 = new TextureLoader().load(require('../../../assets/img/G7.png'));
const sw7 = new TextureLoader().load(require('../../../assets/img/G8.png'));
const bw8 = new TextureLoader().load(require('../../../assets/img/G9.png'));


type FreeJs2DDeskType = {
    map: MapsGameType
    deskState: deskStateType
    layoutState: LayoutStateType
}
const FreeJs2DDesk: FC<FreeJs2DDeskType> = ({map, deskState, layoutState}) => {
    let timeout: number;
    const dispatch = useDispatch()
    const widthGL = layoutState.layout.width
    const heightGL = layoutState.layout.height
    const camera2D = new OrthographicCamera(
        widthGL / -2, widthGL / 2,
        heightGL / 2, heightGL / -2, 1, 1000);

    let mapIsChanged = useRef(false)
    const Map = useRef<MapsGameType>(map)
    Map.current=map

    const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
        const renderer = new Renderer({gl});
        const gLViewEl = renderer.domElement
        /*console.log(`gLViewEl.clientHeight: ${gLViewEl.clientHeight} gLViewEl.clientWidth ${gLViewEl.clientWidth}`)
        console.log(`gLViewEl.height: ${gLViewEl.height} gLViewEl.width ${gLViewEl.width}`)*/
        const {drawingBufferWidth: width, drawingBufferHeight: height} = gl;
        console.log(`drawingBufferWidth: ${width} drawingBufferHeight ${height}`)
        console.log(`widthGL: ${widthGL} heightGL ${heightGL}`)


        renderer.setSize(width, height);
        renderer.setClearColor("#6498ce");
        const scene = new Scene();
        /*scene.background = new Color(0x660000);*/
        const ambientLight = new AmbientLight(0xf0f0f0);
        scene.add(ambientLight);


        let cubes = Array.from(Array(deskState.x),
            () => new Array(deskState.y)
        ) as Array<Array<{
            sector: SectorGameType,
            cube: { cell: CellMesh; material: MeshStandardMaterial; }
        }>>
        const sizeCell = widthGL / deskState.y


        function getDefaultPosition(sector: SectorGameType) {
            const x = widthGL / -2 + sizeCell / 2 + (sector.sectorState.x * sizeCell)
            const y = heightGL / 2 - sizeCell / 2 - (sector.sectorState.y * sizeCell)
            const z = 0
            return {x, y, z}
        }

        function addOnScene() {
            function getPosition(sector: SectorGameType) {
                const imgMass = [sw0, sw1, sw2, sw3, sw4, sw5, sw6, sw7, bw8]
                const material = new MeshStandardMaterial({
                    map: imgMass[sector.date.state],
                    /*map: new TextureLoader().load(require('./assets/icon.png')),*/
                    // color: 0xff0000
                    transparent: true,
                })
                const cell = new CellMesh(sizeCell, sizeCell, material)
                const {x, y, z} = getDefaultPosition(sector)
                cell.position.set(x, y, z)
                scene.add(cell)
                return {
                    cell: cell,
                    material: material,
                }
            }

            for (let i = 0; i < map.length; i++) {
                for (let j = 0; j < map[0].length; j++) {
                    cubes[i][j] = {
                        cube: getPosition(map[i][j]),
                        sector: map[i][j]
                    }
                }
            }
        }


        function changeCubes(map: MapsGameType) {
            /*console.log(`changeCubes`)*/
           /* const map = [...Map]*/
            const scaleSelect = new Vector3(1.2, 1.2, 1.2)
            const imgMass = [sw0, sw1, sw2, sw3, sw4, sw5, sw6, sw7, bw8]
            for (let i = 0; i < map.length; i++) {
                for (let j = 0; j < map[0].length; j++) {
                    /*cubes[i][j].sector = map[i][j]*/
                    /* console.log(`i:${i}--l:${j}`)*/
                    if (cubes[i][j].cube.material.map !== imgMass[map[i][j].date.state]) {
                        /*console.log(`cube.material.map`)*/
                        cubes[i][j].cube.material.map = imgMass[map[i][j].date.state]
                        cubes[i][j].cube.material.needsUpdate = true;
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
                            const x = animateMove.animateObject.shiftJ
                            const y = -animateMove.animateObject.shiftI
                            const addVector = new Vector3(sizeCell * x, sizeCell * y, 0)
                            cubes[i][j].cube.cell.position.add(addVector)
                        } else {
                            /*const x = animateMove.animateObject.shiftJ
                            const y = -animateMove.animateObject.shiftI
                            const addVector = new Vector3(sizeCell * x, sizeCell * y, 0)
                            cubes[i][j].cube.cell.position.add(addVector)*/
                        }
                    }

                    /*cubes[i][j].sector = {...map[i][j]}*/
                    cubes[i][j].sector = JSON.parse(JSON.stringify(map[i][j]))

                }
            }
        }

        function animateShift() {
            for (let i = 0; i < cubes.length; i++) {
                for (let j = 0; j < cubes[0].length; j++) {

                    /*if (Map.current[i][j].sectorState.animateMove) {*/
                    if (cubes[i][j].sector.sectorState.animateMove) {
                        const cell = cubes[i][j].cube.cell
                        const sector = cubes[i][j].sector
                       /* const sector = Map.current[i][j]*/


                        /* const position = new Vector3()
                         cell.getWorldPosition(position)*/
                        const position = cell.position
                        const {x, y, z} = getDefaultPosition(sector)
                        const positionToShiftDefault = new Vector3(x, y, z)

                        /*if (position !== positionToShift) {*/
                        if(sector.sectorState.animateMove?.animateObject.shift){
                            if (position.distanceTo(positionToShiftDefault) >=1.5 ) {
                                /*console.log(`i:${sector.sectorState.y}, j:${sector.sectorState.x}`)
                                console.log(`X:${x}, Y:${y}`)   */
                                /*cubes[i][j].cube.cell.translateOnAxis(positionToShift,0.05)*/
                                cell.translateOnAxis(cell.worldToLocal(positionToShiftDefault), 0.2)
                            } else if(position.distanceTo(positionToShiftDefault) < 1.5) {
                                console.log(`position == positionToShift`)
                                cell.position.set(x, y, z)
                                dispatch(threeInLineAction.increaseAnimationCountEnd(
                                    {
                                        i: sector.sectorState.y,
                                        j: sector.sectorState.x
                                    }))
                                sector.sectorState.animateMove = null
                            }
                        }else if (sector.sectorState.animateMove) {
                            const animateMove = sector.sectorState.animateMove
                            const X = animateMove.animateObject.shiftJ * sizeCell +x
                            const Y = -animateMove.animateObject.shiftI * sizeCell +y

                            const positionToUnShift = new Vector3(X, Y, 0)

                            if (position.distanceTo(positionToUnShift) >=1.5 ) {
                                /*console.log(`i:${sector.sectorState.y}, j:${sector.sectorState.x}`)
                                console.log(`X:${x}, Y:${y}`)   */
                                /*cubes[i][j].cube.cell.translateOnAxis(positionToShift,0.05)*/
                                cell.translateOnAxis(cell.worldToLocal(positionToUnShift), 0.2)
                            } else if(position.distanceTo(positionToUnShift) < 1.5) {
                                /*console.log(`position == positionToShift`)*/
                                cell.position.set(X, Y, 0)
                                /*dispatch(threeInLineAction.increaseAnimationCountEnd(
                                    {
                                        i: sector.sectorState.y,
                                        j: sector.sectorState.x
                                    }))*/
                                animateMove.animateObject.shift = true
                            }
                        }







                    }
                }
            }
        }


        addOnScene()
        camera2D.position.set(0, 0, 100);
        camera2D.lookAt(scene.position);

        // Render function
        const render = () => {
            timeout = requestAnimationFrame(render);
            if(!mapIsChanged.current){
                animateShift()
            }

            if (mapIsChanged.current) {
                changeCubes(Map.current)
                mapIsChanged.current = false
            }

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


    useEffect(() => {
        if (map) {
           /* Map.current = map*/
            mapIsChanged.current = true
            console.log(`setMapIsChanged`)
        }
    }, [map]);

    return (
        <View style={{height: heightGL, width: widthGL}}>
            <GLView style={{flex: 1}} onContextCreate={onContextCreate}>
            </GLView>
        </View>

    )
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


export default FreeJs2DDesk






