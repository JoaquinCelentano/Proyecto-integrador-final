import { View, Text } from "react-native-web"
import { db, auth } from "../firebase/Config";
import { Pressable } from "react-native";

function Register(email, password){
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
            <TextInput style={}
            keyboardType='email.adress'
            placeholder='Email'
            onChangeText={ text => setEmail(text)}
            value={email}/>
            <TextInput style={}
            placeholder='User name'
            onChangeText={ text => setUserName(text)}
            value={userName}/>
            <TextInput style={}
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