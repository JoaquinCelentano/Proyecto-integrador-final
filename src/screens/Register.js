import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Image } from "react-native";
import { db, auth } from "../firebase/Config";

function Register(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userName, setUserName] = useState("");
    const [loginError, setLoginError] = useState("");

    function onSubmit() {
    setLoginError("");
    auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
            db.collection('users').add({
                userName: userName,
                email: email,
                createdAt: Date.now(),
            })
            .then(() => props.navigation.navigate('Login'))
        })
        .catch((error) => {
            if (error.code === 'auth/invalid-email') {
                setLoginError('El email no tiene un formato válido.');
            } else if (error.code === 'auth/weak-password') {
                setLoginError('La contraseña debe tener al menos 6 caracteres.');
            } else if (error.code === 'auth/email-already-in-use') {
                setLoginError('Ese email ya está registrado.');
            } else {
                setLoginError('Error al crear la cuenta. Intentá de nuevo.');
            }
        });
}

    return (
        <View style={styles.container}>
            <View style={styles.logoWrapper}>
                <Image source={require('../../assets/DHboxd.png')} style={styles.logo} />
            </View>

            <TextInput
                style={styles.input}
                keyboardType='email-address'
                placeholder='Email'
                placeholderTextColor="#aaa"
                onChangeText={text => setEmail(text)}
                value={email}
            />
            <TextInput
                style={styles.input}
                placeholder='Nombre de usuario'
                placeholderTextColor="#aaa"
                onChangeText={text => setUserName(text)}
                value={userName}
            />
            <TextInput
                style={styles.input}
                placeholder='Contraseña'
                placeholderTextColor="#aaa"
                secureTextEntry={true}
                onChangeText={text => setPassword(text)}
                value={password}
            />

            {loginError !== "" ? <Text style={styles.error}>{loginError}</Text> : null}

            <Pressable style={styles.button} onPress={() => onSubmit()}>
                <Text style={styles.buttonText}>Crear cuenta</Text>
            </Pressable>

            <Pressable onPress={() => props.navigation.navigate("Login")}>
                <Text style={styles.link}>¿Ya tenés cuenta? <Text style={styles.linkBold}>Iniciá sesión</Text></Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 28,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    logoWrapper: {
        alignItems: 'center',
        marginBottom: 48,
    },
    logo: {
        width: 280,
        height: 90,
        resizeMode: 'contain',
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
        paddingVertical: 14,
        fontSize: 16,
        color: '#111',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#111',
        paddingVertical: 16,
        borderRadius: 8,
        marginTop: 12,
        marginBottom: 24,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: '700',
        fontSize: 15,
        letterSpacing: 0.5,
    },
    link: {
        textAlign: 'center',
        color: '#999',
        fontSize: 14,
    },
    linkBold: {
        color: '#111',
        fontWeight: '600',
    },
    error: {
        color: '#e00',
        marginBottom: 12,
        fontSize: 13,
        textAlign: 'center',
    },
});

export default Register;
