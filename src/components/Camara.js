import { useRef, useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { FontAwesome } from '@expo/vector-icons';
import { manipulateAsync } from 'expo-image-manipulator';

function Camara({ setPhotoUri }) {
    const [permisos, setPermisos] = useState(false);
    const [uri, setUri] = useState(null);

    let metodosCamara = useRef(null);

    useEffect(() => {
        Camera.requestCameraPermissionsAsync()
            .then((respuesta) => setPermisos(respuesta.granted))
            .catch(() => setPermisos(false));
    }, []);

    function savePhoto() {
        setPhotoUri(uri);
    }

    function clearPhoto() {
        setUri(null);
    }

    function takePicture() {
        metodosCamara.current.takePictureAsync()
            .then((imgTemp) => {
                return manipulateAsync(imgTemp.uri, [{ resize: { width: 200 } }], { compress: 0.7, base64: true });
            })
            .then((imgManipulated) => {
                setUri(imgManipulated.base64);
            })
            .catch(() => {});
    }

    return (
        <View>
            {!permisos ? (
                <View style={styles.permisos}>
                    <FontAwesome name="camera" size={28} color="#bbb" />
                    <Text style={styles.permisosText}>Necesitás dar permisos para usar la cámara</Text>
                </View>
            ) : uri ? (
                <View>
                    <Image source={{ uri: `data:image/jpeg;base64,${uri}` }} style={styles.preview} />

                    <View style={styles.buttonRow}>
                        <Pressable style={styles.buttonFilled} onPress={() => savePhoto()}>
                            <Text style={styles.buttonTextFilled}>Aceptar</Text>
                        </Pressable>
                        <Pressable style={styles.buttonOutline} onPress={() => clearPhoto()}>
                            <Text style={styles.buttonTextOutline}>Rechazar</Text>
                        </Pressable>
                    </View>
                </View>
            ) : (
                <View>
                    <View style={styles.cameraWrapper}>
                        <CameraView style={styles.camera} ref={metodosCamara} facing={'back'} />
                    </View>

                    <Pressable style={styles.shootButton} onPress={() => takePicture()}>
                        <FontAwesome name="camera" size={22} color="#fff" />
                    </Pressable>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    cameraWrapper: {
        width: '100%',
        height: 280,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 14,
        backgroundColor: '#000',
    },
    camera: {
        flex: 1,
    },
    shootButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#111',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    preview: {
        width: '100%',
        height: 280,
        borderRadius: 12,
        marginBottom: 14,
        resizeMode: 'cover',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 8,
    },
    buttonFilled: {
        flex: 1,
        backgroundColor: '#111',
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
    },
    buttonOutline: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
    },
    buttonTextFilled: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 15,
    },
    buttonTextOutline: {
        color: '#111',
        fontWeight: '600',
        fontSize: 15,
    },
    permisos: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    permisosText: {
        color: '#888',
        fontSize: 14,
        marginTop: 10,
        textAlign: 'center',
    },
});

export default Camara;
