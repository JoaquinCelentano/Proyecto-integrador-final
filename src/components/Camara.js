import {use, useRef} from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native'; 
import {Camera, CameraView} from 'expo-camera';
import { useState, useEffect } from 'react';
import {cameraView} from 'expo-camera';
import {manipulateAsync} from 'expo-image-manipulator';

function Camara({setPhotoUri}) {
    const [permisos, setPermisos] = useState(false);
    let metodosCamara = useRef(null);
    useEffect(() => {
        Camera.requestCameraPermissionsAsync()
            .then(() => setPermisos(true))
            .catch(() => setPermisos(false));
    }, [])};

function takePicture() {
metodosCamara.current.takePictureAsync()
    .then((imgTemp) => {
    return manipulateAsync(imgTemp.uri,[{resize: {width:200} }], {compress: 0.7, base64:true})
    
    })
    .then((imgManipulated) => {
    
            setPhotoUri(imgManipulated.base64);
        
    })
        .catch((error) => {
            console.log(error);
        });


return (
    <View style={styles.container}>
        {
        !permisos ? 
        <View>
            <text>Necsitas dar permisos para usar la camara</text>
            </View>

            :
            <View>

            <CameraView style={styles.camera} ref={metodosCamara} facing='back'/>
            
                <Pressable style={styles.shootButton} onPress={() => {
                    takePicture()}}>
                    <Text>Tomar Foto</Text>
                </Pressable>
            </View>
        }
    </View>
)
}