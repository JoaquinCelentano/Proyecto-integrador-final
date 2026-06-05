import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { auth, db } from "../firebase/Config";

function CreatePost({ navigation }) {
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  function publicarPost() {
    setError("");

    if (description === "") {
      setError("Escribi algo antes de publicar");
      return;
    }

    db.collection("posts")
      .add({
        description: description,
        owner: auth.currentUser.email,
        createdAt: new Date(),
        likes: [],
        comments: []
      })
      .then(() => {
        setDescription("");
        navigation.navigate("HomeTabs");
      })
      .catch((error) => {
        console.log(error);
        setError("No se pudo publicar el posteo.");
      });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear posteo</Text>

      <TextInput
        style={styles.input}
        placeholder="Que estás pensando?"
        value={description}
        onChangeText={(text) => setDescription(text)}
        multiline={true}
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
    padding: 20,
    backgroundColor: "#fff"
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    marginBottom: 15,
    textAlignVertical: "top"
  },
  button: {
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 8
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold"
  },
  error: {
    color: "red",
    marginBottom: 10
  }
});

export default CreatePost;