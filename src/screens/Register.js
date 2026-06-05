import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Image } from "react-native";
import { db, auth } from "../firebase/Config";

function Register(props){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userName, setUserName] = useState("");
    const [loginError, setLoginError] = useState("");

    function onSubmit(){
        setLoginError("");
        auth.createUserWithEmailAndPassword(email, password)
        .then((response)=>{
            db.collection('users').add({
                userName: userName,
                email: email,
                createdAt: Date.now(),
            })
            .then(() => props.navigation.navigate('Login'))
        })
        .catch(error => {
            setLoginError('Credenciales invalidas');
        });
    }

    return(
        <View style={styles.container}>
            <Image source={require('../../assets/DHboxd.png')} style={styles.logo} />
            <Text style={styles.title}>Register</Text>
            <TextInput
            style={styles.input}
            keyboardType='email-address'
            placeholder='Email'
            onChangeText={ text => setEmail(text)}
            value={email}/>
            <TextInput
            style={styles.input}
            placeholder='User name'
            onChangeText={ text => setUserName(text)}
            value={userName}/>
            <TextInput
            style={styles.input}
            placeholder='Password'
            secureTextEntry={true}
            onChangeText={ text => setPassword(text)}
            value={password}/>
            {loginError !== "" ? <Text style={styles.error}>{loginError}</Text> : null}
            <Pressable style={styles.button} onPress={()=> onSubmit()}>
                <Text style={styles.buttonText}>Register</Text>
            </Pressable>
            <Pressable onPress={()=> props.navigation.navigate("Login")}>
                <Text style={styles.link}>Volver a Login</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        padding: 24,
    },
    logo: {
        width: 180,
        height: 55,
        resizeMode: 'contain',
        marginBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#111',
        marginBottom: 32,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 10,
        paddingHorizontal: 16,
        marginBottom: 14,
        fontSize: 15,
        color: '#111',
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#111',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    link: {
        marginTop: 20,
        textAlign: "center",
        color: "blue",
    },
    error: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
});

export default Register;
