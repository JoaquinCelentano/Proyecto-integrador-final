import { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { auth, db } from "../firebase/Config";

function Home({ navigation }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("createdAt", "desc")
      .onSnapshot((docs) => {
        let posteos = [];

        docs.forEach((doc) => {
          posteos.push({
            id: doc.id,
            data: doc.data()
          });
        });

        setPosts(posteos);
      });
  }, []);

  function likePost(post) {
    let emailUsuario = auth.currentUser.email;
    let likes = post.data.likes;

    if (likes.includes(emailUsuario)) {
      db.collection("posts")
        .doc(post.id)
        .update({
          likes: likes.filter((email) => email !== emailUsuario)
        });
    } else {
      db.collection("posts")
        .doc(post.id)
        .update({
          likes: likes.concat(emailUsuario)
        });
    }
  }

  function renderPost({ item }) {
    let emailUsuario = auth.currentUser.email;
    let estaLikeado = item.data.likes.includes(emailUsuario);

    return (
      <View style={styles.post}>
        <Text style={styles.owner}>{item.data.owner}</Text>

        <Text style={styles.description}>{item.data.description}</Text>

        <Text style={styles.likes}>
          Likes: {item.data.likes.length}
        </Text>

        <Pressable onPress={() => likePost(item)} style={styles.button}>
          <Text style={styles.buttonText}>
            {estaLikeado ? "Quitar like" : "Dar like"}
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>

      {posts.length === 0 ? (
        <Text>No hay posteos todavía.</Text>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderPost}
        />
      )}
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
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20
  },
  post: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15
  },
  owner: {
    fontWeight: "bold",
    marginBottom: 10
  },
  description: {
    fontSize: 16,
    marginBottom: 10
  },
  likes: {
    marginBottom: 10
  },
  button: {
    backgroundColor: "#222",
    padding: 10,
    borderRadius: 8,
    marginTop: 5
  },
  buttonText: {
    color: "#fff",
    textAlign: "center"
  }
});

export default Home;