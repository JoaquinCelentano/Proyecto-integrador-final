import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Image } from "react-native";
import { auth, db } from "../firebase/Config";
import Camara from "../components/Camara";

function CreatePost({ navigation }) {
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [photoUri, setPhotoUri] = useState(null);

  function publicarPost() {
    setError("");

    if (description === "") {
      setError("Escribi algo antes de publicar.");
      return;
    }

    const imagenFinal = photoUri !== null ? photoUri : imageUrl;

    db.collection("posts")
      .add({
        description: description,
        imageUrl: imagenFinal,
        owner: auth.currentUser.email,
        createdAt: new Date(),
        likes: [],
        comments: []
      })
      .then(() => {
        setDescription("");
        setImageUrl("");
        setPhotoUri(null);
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

      {photoUri === null ? (
        <Camara setPhotoUri={(uri) => setPhotoUri(uri)} />
      ) : (
        <View>
          <Image source={{ uri: photoUri }} style={styles.preview} />
          

          <TextInput
            style={styles.inputMultiline}
            placeholder="Que estas pensando?"
            value={description}
            onChangeText={(text) => setDescription(text)}
          />

          <TextInput
            style={styles.input}
            placeholder="URL de la imagen (opcional)"
            value={imageUrl}
            onChangeText={(text) => setImageUrl(text)}
          />

          <Pressable style={styles.buttonSecondary} onPress={() => setPhotoUri(null)}>
            <Text style={styles.buttonSecondaryText}>Sacar otra foto</Text>
          </Pressable>

          {error !== "" ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable style={styles.button} onPress={() => publicarPost()}>
            <Text style={styles.buttonText}>Publicar</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
    paddingTop: 50
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 28
  },
  preview: {
    width: "100%",
    height: 260,
    borderRadius: 10,
    marginBottom: 16,
    resizeMode: "cover"
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
    textAlignVertical: "top"
  },
  input: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    fontSize: 15,
    color: "#111",
    backgroundColor: "#fafafa"
  },
  button: {
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 10,
    marginTop: 8
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 15
  },
  buttonSecondary: {
    borderWidth: 1,
    borderColor: "#111",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12
  },
  buttonSecondaryText: {
    color: "#111",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 15
  },
  error: {
    color: "red",
    marginBottom: 10,
    fontSize: 13
  }
});

export default CreatePost;
