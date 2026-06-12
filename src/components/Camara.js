import {useRef} from 'react';
import {View, Text, Pressable, StyleSheet, Image} from 'react-native'; 
import {Camera, CameraView} from 'expo-camera';
import { useState, useEffect } from 'react';
import {manipulateAsync} from 'expo-image-manipulator';

function Camara({setPhotoUri}) {
    const [permisos, setPermisos] = useState(false);
      const [uri, setUri] = useState(null);

    let metodosCamara = useRef(null);

    useEffect(() => {
        Camera.requestCameraPermissionsAsync()
            .then(() => setPermisos(true))
            .catch(() => setPermisos(false));
    }, []);

    function takePicture() {
        metodosCamara.current.takePictureAsync()
        .then((imgTemp) => {
            return manipulateAsync(imgTemp.uri,[{resize: {width:200} }], {compress: 0.7, base64:true})
        })
        .then((imgManipulated) => {
            setUri(imgManipulated.base64);   
        })
        .catch((error) => {
            console.log(error);
        });
    }

    return (
        <View style={styles.container}>
            {
            !permisos ? 
            <View>
                <Text>Necsitas dar permisos para usar la camara</Text>
                </View>

                :
                uri ?
                <>
                <Image source={{uri: `data:image/jpeg;base64,${uri}`}} style={styles.camara}/>
                
                <View style = {styles.buttonarea}>
                    <Pressable onPress={()=> savePhoto()}> <Text>Aceptar</Text></Pressable>
                    <Pressable onPress={()=> clearPhoto()}> <Text>Rechazar</Text></Pressable>
                </View>
             </>
    
                :
                <>

                <CameraView style={styles.camera} ref={metodosCamara} facing={'back'}/>
                
                    <Pressable style={styles.shootButton} onPress={() => {
                        takePicture()}}>
                        <Text>Tomar Foto</Text>
                    </Pressable>
                </>
            }
        </View>
    )
}
const styles = StyleSheet.create({
    container:{
        flex:1
    },
    camara: {
        width:400,
        height:400
    }
})

export default Camara;



