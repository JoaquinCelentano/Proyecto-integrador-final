import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { auth, db } from "../firebase/Config";
import Camara from "../components/camara";

function CreatePost({ navigation }) {
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  function publicarPost() {
    setError("");
    if (description === "") {
      setError("Escribí algo antes de publicar.");
      return;
    }
    db.collection("posts")
      .add({
        description: description,
        imageUrl: imageUrl,
        owner: auth.currentUser.email,
        createdAt: new Date(),
        likes: [],
        comments: []
      })
      .then(() => {
        setDescription("");
        setImageUrl("");
        navigation.navigate("HomeTabs");
      })
      .catch((error) => {
        console.log(error);
        setError("No se pudo publicar el posteo.");
      });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nuevo posteo</Text>

      <TextInput
        style={styles.inputMultiline}
        placeholder="¿Qué estás pensando?"
        value={description}
        onChangeText={(text) => setDescription(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="URL de la imagen (opcional)"
        value={imageUrl}
        onChangeText={(text) => setImageUrl(text)}
      />

      {error !== "" ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable style={styles.button} onPress={() => publicarPost()}>
        <Text style={styles.buttonText}>Publicar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 28,
  },
  inputMultiline: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    padding: 14,
    minHeight: 120,
    marginBottom: 12,
    fontSize: 15,
    color: "#111",
    backgroundColor: "#fafafa",
    textAlignVertical: "top",
  },
  input: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    fontSize: 15,
    color: "#111",
    backgroundColor: "#fafafa",
  },
  button: {
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 10,
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 15,
  },
  error: {
    color: "red",
    marginBottom: 10,
    fontSize: 13,
  },
});

export default CreatePost;
