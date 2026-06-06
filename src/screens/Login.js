import { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Image } from "react-native";
import { auth } from "../firebase/Config";

function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (user) {
        navigation.navigate('TabsNavigation');
      }
    });
  }, []);

  function login(email, pass) {
    setLoginError("");
    if (email === "" || pass === "") {
      setLoginError("Completá todos los campos.");
      return;
    }
    auth.signInWithEmailAndPassword(email, pass)
      .then(() => { navigation.navigate("TabsNavigation"); })
      .catch(() => { setLoginError("Credenciales inválidas."); });
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoWrapper}>
        <Image source={require('../../assets/DHboxd.png')} style={styles.logo} />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#aaa"
        secureTextEntry={true}
        onChangeText={(text) => setPass(text)}
        value={pass}
      />

      {loginError !== "" ? <Text style={styles.error}>{loginError}</Text> : null}

      <Pressable style={styles.button} onPress={() => login(email, pass)}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>¿No tenés cuenta? <Text style={styles.linkBold}>Registrate</Text></Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  logoWrapper: {
    alignItems: "center",
    marginBottom: 48,
  },
  logo: {
    width: 280,
    height: 90,
    resizeMode: "contain",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    paddingVertical: 14,
    fontSize: 16,
    color: "#111",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#111",
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 12,
    marginBottom: 24,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.5,
  },
  link: {
    textAlign: "center",
    color: "#999",
    fontSize: 14,
  },
  linkBold: {
    color: "#111",
    fontWeight: "600",
  },
  error: {
    color: "#e00",
    marginBottom: 12,
    fontSize: 13,
    textAlign: "center",
  },
});

export default Login;
