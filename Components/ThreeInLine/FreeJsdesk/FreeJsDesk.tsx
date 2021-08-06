import * as React from "react";
import {ExpoWebGLRenderingContext, GLView} from "expo-gl";
import {Button, Text, TouchableHighlight, TouchableWithoutFeedback, View} from "react-native";
import {Renderer} from 'expo-three';
import {TweenMax} from 'gsap';
import {FC, useState} from "react";
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
} from "three";


const FreeJsDesk: FC<{}> = ({}) => {
    const sphere = new SphereMesh();
    const camera = new PerspectiveCamera(100, 0.4, 0.01, 1000);
    const [cameraInitialPositionX, setCameraInitialPositionX] = useState(0)
    const [cameraInitialPositionY, setCameraInitialPositionY] = useState(100)
    const [cameraInitialPositionZ, setCameraInitialPositionZ] = useState(45)

    function moveZ(distance: any) {
        TweenMax.to(sphere.position, 0.2, {
            z: sphere.position.z + distance,
        });

        TweenMax.to(camera.position, 0.2, {
            z: camera.position.z + distance,
        });
    }

    function moveX(distance: any) {
        TweenMax.to(sphere.position, 0.2, {
            x: sphere.position.x + distance,
        });

        TweenMax.to(camera.position, 0.2, {
            x: camera.position.x + distance,
        });
    }

    function moveY(distance: any) {
        TweenMax.to(sphere.position, 0.2, {
            y: sphere.position.y + distance,
        });

        TweenMax.to(camera.position, 0.2, {
            y: camera.position.y + distance,
        });
    }


    function cameraSetPositionX(distance: any) {
        camera.rotateX(distance)
    }
    function cameraSetPositionY(distance: any) {
        camera.rotateY(distance)
    }
    function cameraSetPositionZ(distance: any) {
        camera.rotateZ(distance)
    }
    function cameraSetTranslateY(distance: any) {
        camera.translateY(distance)
    }

    return (
        <View style={{flex: 1}}>
            <GLView style={{flex: 4}}
                    onContextCreate={async (gl) => {
                        // GL Parameter disruption
                        const {drawingBufferWidth: width, drawingBufferHeight: height} = gl;

                        // Renderer declaration and set properties
                        const renderer = new Renderer({gl});
                        renderer.setSize(width, height);
                        renderer.setClearColor("#ac5b5b");

                        // Scene declaration, add a fog, and a grid helper to see axes dimensions
                        const scene = new Scene();
                        scene.fog = new Fog("#07405c", 1, 10000);
                        scene.add(new GridHelper(width, width / 10));

                        // Add all necessary lights
                        const ambientLight = new AmbientLight(0x101010);
                        scene.add(ambientLight);


                        // Add sphere object instance to our scene
                        scene.add(sphere);

                        // Set camera position and look to sphere
                        camera.position.set(
                            cameraInitialPositionX,
                            cameraInitialPositionY,
                            cameraInitialPositionZ
                        );

                        camera.lookAt(sphere.position);

                        // Render function
                        const render = () => {
                            requestAnimationFrame(render);
                            renderer.render(scene, camera);
                            gl.endFrameEXP();
                        };
                        render();
                    }}
            >

            </GLView>
            <View style={{flex: 2}}>
                <View style={{flex: 1, flexDirection: "row"}}>
                    <View style={{flex: 1}}>
                        <Button title={`- PositionX`} onPress={() => cameraSetPositionX(0.1)}/>
                    </View>
                    <View style={{flex: 1}}>
                        <Button title={`camera Up`} onPress={() => cameraSetTranslateY(5)}/>
                    </View>
                    <View style={{flex: 1}}>
                        <Button title={`+ PositionX`} onPress={() => cameraSetPositionX(-0.1)}/>
                    </View>
                </View>
                <View style={{flex: 1, flexDirection: "row"}}>
                    <View style={{flex: 1}}>
                        <Button title={`- PositionY`} onPress={() => cameraSetPositionY(0.1)}/>
                    </View>
                    <View style={{flex: 1}}>
                        <Button title={`+ PositionY`} onPress={() => cameraSetPositionY(-0.1)}/>
                    </View>
                </View>
                <View style={{flex: 1, flexDirection: "row"}}>
                    <View style={{flex: 1}}>
                        <Button title={`- PositionZ`} onPress={() => cameraSetPositionZ(0.1)}/>
                    </View>
                    <View style={{flex: 1}}>
                        <Button title={`camera Back`} onPress={() => cameraSetTranslateY(-5)}/>
                    </View>
                    <View style={{flex: 1}}>
                        <Button title={`+ PositionZ`} onPress={() => cameraSetPositionZ(-0.1)}/>
                    </View>
                </View>
                <View style={{flex: 1, flexDirection: "row"}}>
                    <View style={{flex: 1}}>

                    </View>
                    <View style={{flex: 1}}>
                        <Button title={`UP`} onPress={() => moveZ(-0.8)}/>
                    </View>
                    <View style={{flex: 1}}>

                    </View>
                </View>
                <View style={{flex: 1, flexDirection: "row"}}>
                    <View style={{flex: 1}}>
                        <Button title={`left`} onPress={() => moveX(-0.8)}/>
                    </View>
                    <View style={{flex: 1}}>

                    </View>
                    <View style={{flex: 1}}>
                        <Button title={`right`} onPress={() => moveX(0.8)}/>
                    </View>
                </View>
                <View style={{flex: 1, flexDirection: "row"}}>
                    <View style={{flex: 1}}>
                        <View style={{flex: 1}}>
                            <Button title={`111`} onPress={() => moveY(-0.8)}/>
                        </View>
                    </View>
                    <View style={{flex: 1}}>
                        <Button title={`DOWN`} onPress={() => moveZ(0.8)}/>
                    </View>
                    <View style={{flex: 1}}>
                        <View style={{flex: 1}}>
                            <Button title={`2222`} onPress={() => moveY(0.8)}/>
                        </View>
                    </View>
                </View>
            </View>
        </View>

    )
}
export default FreeJsDesk


class SphereMesh extends Mesh {
    constructor() {
        super(
            new SphereGeometry(2, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2),
            new MeshStandardMaterial({
                color: `#00ff00`,
                name: `111`,

            })
        );
    }
}

