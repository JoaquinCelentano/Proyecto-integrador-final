import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Image } from "react-native";
import { auth } from "../firebase/Config";

function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loginError, setLoginError] = useState("");

  function login(email, pass) {
    setLoginError("");

    if (email === "" || pass === "") {
      setLoginError("Completá todos los campos.");
      return;
    }

    auth.signInWithEmailAndPassword(email, pass)
      .then((response) => {
        console.log("Usuario logueado:", response.user.email);
        navigation.navigate("TabsNavigation");
      })
      .catch((error) => {
        console.log(error);
        setLoginError("Credenciales inválidas.");
      });
  }

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/DHboxd.png')} style={styles.logo} />
      <Text style={styles.title}>Iniciar sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry={true}
        onChangeText={(text) => setPass(text)}
        value={pass}
      />

      {loginError !== "" ? <Text style={styles.error}>{loginError}</Text> : null}

      <Pressable style={styles.button} onPress={() => login(email, pass)}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>¿No tenés cuenta? Registrate</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
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
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  link: {
    marginTop: 20,
    textAlign: "center",
    color: "blue",
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});

export default Login;