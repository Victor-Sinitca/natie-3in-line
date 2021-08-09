import * as React from "react";
import {ExpoWebGLRenderingContext, GLView} from "expo-gl";
import {
    Button,
    LayoutChangeEvent,
    LayoutRectangle,
    Text,
    TouchableHighlight,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {Renderer} from 'expo-three';
import {TweenMax} from 'gsap';
import {FC, useEffect, useState} from "react";
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
    SpotLight, OrthographicCamera, BoxGeometry, MeshBasicMaterial, TextureLoader, PlaneGeometry, Color,
} from "three";
import sw0 from "../../../assets/img/G1.png";
import {LayoutStateType} from "../Desk/DeskThreeInLine";
import {MapsGameType, SectorGameType} from "../../redux/threeInLine-reduser";
import {deskStateType} from "../ThreeInLine";
import {getRandomInt} from "../gameLogic/getRandom";


type FreeJs2DDeskType = {
    map: MapsGameType
    deskState: deskStateType
    layoutState: LayoutStateType
}
const FreeJs2DDesk: FC<FreeJs2DDeskType> = ({map, deskState, layoutState}) => {
    const width1 = layoutState.layout.width
    const height1 = layoutState.layout.height
    const camera2D = new OrthographicCamera(
        width1 / -2, width1 / 2,
        height1 / 2, height1 / -2, 1, 1000);


    const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
        const {drawingBufferWidth: width, drawingBufferHeight: height} = gl;
        console.log(`drawingBufferWidth: ${width} drawingBufferHeight ${height}`)
        const renderer = new Renderer({gl});
        renderer.setSize(width, height);
        renderer.setClearColor("#6498ce");

        const scene = new Scene();
        scene.background = new Color(0x660000);

        const ambientLight = new AmbientLight(0x101010);
        scene.add(ambientLight);
        const geometry = new BoxGeometry(320, 50, 50);
        const material = new MeshBasicMaterial({color: 0x005500});
        const cube = new Mesh(geometry, material);
        cube.position.set(0, 0, 0)

        function getPosition(H: number, W: number, sector: SectorGameType, deskState: deskStateType) {
            const colorMass = [0xff0000, 0x00ff00, 0x0000ff,
                0xffff00, 0xff00ff, 0xffffff,
                0x000000, 0x00ffff, 0x22ff22]
            const h = H / 2
            const w = W / 2
            const sizeCell = W / deskState.y
            const geometry = new BoxGeometry(sizeCell, sizeCell, sizeCell / 4);
            const material = new MeshBasicMaterial({
                color: colorMass[sector.date.state],
                name: `${sector.sectorState.y}${sector.sectorState.x}`
            });
            const cube = new Mesh(geometry, material);
            const x = -w + sizeCell / 2 + (sector.sectorState.x * sizeCell)
            const y = h - sizeCell / 2 - (sector.sectorState.y * sizeCell)
            cube.position.set(x, y, 0)
            scene.add(cube)
            return cube
        }

        let cubes = Array.from(Array(deskState.x),
            () => new Array(deskState.y)
        ) as any

        function addOnScene() {
            for (let i = 0; i < map.length; i++) {
                for (let j = 0; j < map[0].length; j++) {
                    cubes[i][j]=getPosition(height1, width1, map[i][j], deskState)
                }
            }
        }

        addOnScene()
        camera2D.position.set(0, 0, 100);

        camera2D.lookAt(scene.position);

        // Render function
        const render = () => {
            requestAnimationFrame(render);
            cubes[2][2].rotation.x += 0.01
            /*cubes[0][0].rotation.y += 0.01*/

            /* cubes.forEach((cube, ndx) => {

                     cube.rotation.x += 0.01;
                     cube.rotation.y += 0.01;

             });*/
            renderer.render(scene, camera2D);

            gl.endFrameEXP();
        };
        render();
    }
    useEffect(() => {
    }, [map])


    return (
        <View style={{height: height1, width: width1}}>
            <GLView style={{flex: 1}} onContextCreate={onContextCreate}>
            </GLView>
        </View>

    )
}
export default FreeJs2DDesk






