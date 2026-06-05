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
            .then((response) => {
                db.collection('users').add({
                    userName: userName,
                    email: email,
                })
                .then(() => props.navigation.navigate('Login'))
            })
            .catch(error => {
                setLoginError(error.message);
            });
    }

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/DHboxd.png')} style={styles.logo} />
            <Text style={styles.title}>Crear cuenta</Text>

            <TextInput
                style={styles.input}
                keyboardType='email-address'
                placeholder='Email'
                onChangeText={text => setEmail(text)}
                value={email}
            />
            <TextInput
                style={styles.input}
                placeholder='Nombre de usuario'
                onChangeText={text => setUserName(text)}
                value={userName}
            />
            <TextInput
                style={styles.input}
                placeholder='Contraseña'
                secureTextEntry={true}
                onChangeText={text => setPassword(text)}
                value={password}
            />

            {loginError !== "" ? <Text style={styles.error}>{loginError}</Text> : null}

            <Pressable style={styles.button} onPress={() => onSubmit()}>
                <Text style={styles.buttonText}>Registrarse</Text>
            </Pressable>

            <Pressable onPress={() => props.navigation.navigate('Login')}>
                <Text style={styles.link}>¿Ya tenés cuenta? Iniciá sesión</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    logo: {
        width: 180,
        height: 55,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: '#444',
    },
    input: {
        borderWidth: 1,
        borderColor: '#999',
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#222',
        padding: 15,
        borderRadius: 8,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    link: {
        marginTop: 20,
        textAlign: 'center',
        color: 'blue',
    },
    error: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
});

export default Register;
