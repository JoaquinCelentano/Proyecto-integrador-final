import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { db, auth } from "../firebase/Config";

function Register(props){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userName, setUserName] = useState("");

    function onSubmit(){
        auth.createUserWithEmailAndPassword(email, password)
        .then((response)=>{
            db.collection('users').add({
                userName:userName ,
                password: password,
                email: email,
            })
            .then(props.navigation.navigate('Login'))
        })
        .catch(error => {
            setLoginError('Credenciales invalidas')
        })
    }

    return(
        <View>
            <Text>Register</Text>
            <TextInput
            keyboardType='email-address'
            placeholder='Email'
            onChangeText={ text => setEmail(text)}
            value={email}/>
            <TextInput
            placeholder='User name'
            onChangeText={ text => setUserName(text)}
            value={userName}/>
            <TextInput
            placeholder='Password'
            secureTextEntry={true}
            onChangeText={ text => setPassword(text)}
            value={password}/>
            <Pressable onPress={()=> onSubmit()}>
                <Text>Register</Text>
            </Pressable>
        </View>
    );
}

export default Register
