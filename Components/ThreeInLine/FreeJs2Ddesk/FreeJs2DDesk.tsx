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
    const width1 = layoutState.layout.width
    const height1 = layoutState.layout.height
    const camera2D = new OrthographicCamera(
        width1 / -2, width1 / 2,
        height1 / 2, height1 / -2, 1, 1000);

    let mapIsChanged = useRef(false)
    const Map = useRef<MapsGameType>(map)


    const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
        const {drawingBufferWidth: width, drawingBufferHeight: height} = gl;
        console.log(`drawingBufferWidth: ${width} drawingBufferHeight ${height}`)
        const renderer = new Renderer({gl});
        renderer.setSize(width, height);
        renderer.setClearColor("#6498ce");
        const scene = new Scene();
        scene.background = new Color(0x660000);
        const ambientLight = new AmbientLight(0xf0f0f0);
        scene.add(ambientLight);


        let cubes = Array.from(Array(deskState.x),
            () => new Array(deskState.y)
        ) as Array<Array<{
            sector: SectorGameType,
            cube: { cell: CellMesh; material: MeshStandardMaterial; }
        }>>

        function addOnScene() {
            function getPosition(H: number, W: number, sector: SectorGameType, deskState: deskStateType) {
                const imgMass = [sw0, sw1, sw2, sw3, sw4, sw5, sw6, sw7, bw8]
                const h = H / 2
                const w = W / 2
                const sizeCell = W / deskState.y
                const material = new MeshStandardMaterial({
                    map: imgMass[sector.date.state],
                    /*map: new TextureLoader().load(require('./assets/icon.png')),*/
                    // color: 0xff0000
                    transparent: true,
                })
                const cell = new CellMesh(sizeCell, sizeCell, material)
                const x = -w + sizeCell / 2 + (sector.sectorState.x * sizeCell)
                const y = h - sizeCell / 2 - (sector.sectorState.y * sizeCell)
                cell.position.set(x, y, 0)
                scene.add(cell)
                return {
                    cell:cell,
                    material:material,
                }
            }

            for (let i = 0; i < map.length; i++) {
                for (let j = 0; j < map[0].length; j++) {
                    cubes[i][j] = {
                        cube: getPosition(height1, width1, map[i][j], deskState),
                        sector: map[i][j]
                    }
                }
            }
        }


        function changeCubes(Map:MapsGameType) {
            console.log(`changeCubes`)
            const map = [...Map]
            const scaleEquals = new Vector3( 1.2, 1.2, 1.2 )
            const imgMass = [sw0, sw1, sw2, sw3, sw4, sw5, sw6, sw7, bw8]
            for (let i = 0; i < map.length; i++) {
                for (let j = 0; j < map[0].length; j++) {
                   /* console.log(`i:${i}--l:${j}`)*/
                    if(cubes[i][j].cube.material.map !== imgMass[map[i][j].date.state]){
                        console.log(`cube.material.map`)
                        cubes[i][j].cube.material.map = imgMass[map[i][j].date.state]
                        cubes[i][j].cube.material.needsUpdate = true;
                    }


                    cubes[i][j].sector = map[i][j]
                    if(map[i][j].sectorState.isSelected){
                        /*console.log(`isSelected`)*/
                        cubes[i][j].cube.cell.scale.set(1.2,1.2,1.2)
                    }else if (cubes[i][j].cube.cell.scale.equals(scaleEquals)){
                        /*console.log(`isNotSelected`)*/
                        cubes[i][j].cube.cell.scale.set(1,1,1)
                    }

                    if(map[i][j].sectorState.animateMove){
                        /* if(Map.current[i][j].sectorState.animateMove?.animateObject.fall){

                        }else{

                        }


                        const x = Map.current[i][j].sectorState.animateMove.animateObject.
                        const addVector = new Vector3( 0, 1, 0 )
                        cubes[i][j].cube.cell.position.add(addVector)*/

                        dispatch(threeInLineAction.increaseAnimationCountEnd(
                            {
                                i: map[i][j].sectorState.y,
                                j: map[i][j].sectorState.x
                            }))
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
            if (mapIsChanged.current) {
                changeCubes(Map.current)
                mapIsChanged.current=false
            }

            cubes[2][2].cube.cell.rotation.x += 0.01
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
            Map.current=map
            mapIsChanged.current = true
            console.log(`setMapIsChanged`)
        }
    }, [map]);

    return (
        <View style={{height: height1, width: width1}}>
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






